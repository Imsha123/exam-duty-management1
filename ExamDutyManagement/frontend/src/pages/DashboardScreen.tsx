import React, { useEffect, useState, useMemo } from 'react';
import { DesktopTopNav } from '../components/DesktopTopNav';
import { DesktopSidebar } from '../components/DesktopSidebar';
import { MobileHeader } from '../components/MobileHeader';
import { StatCard } from '../components/StatCard';
import { MonthlyChart } from '../components/MonthlyChart';
import { RecentDutiesTable, RecentDutySummary } from '../components/RecentDutiesTable';
import {
  ClipboardCheck,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import dashboardService, { EmployeeDashboardData } from '../services/dashboard.service';
import dutyService, { DutyItem } from '../services/duty.service';
import authService from '../services/auth.service';

export const DashboardScreen: React.FC = () => {
  const user = authService.getStoredUser();
  const isAdmin = Boolean(
    user?.isAdmin ||
    user?.role === 'admin' ||
    user?.resourceId === '17655' ||
    user?.resourceId?.toLowerCase() === 'admin'
  );
  const filterResourceId = isAdmin ? 'ALL' : (user?.resourceId || '');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const [dashboardData, setDashboardData] = useState<EmployeeDashboardData | null>(null);
  const [dutiesList, setDutiesList] = useState<DutyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch fresh dashboard data and duties list whenever filterResourceId or selectedYear changes
  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const resourceParam = isAdmin ? 'ALL' : (user?.resourceId || '');
        const [data, backendDuties] = await Promise.all([
          dashboardService.getEmployeeDashboard(filterResourceId, selectedYear).catch(() => null),
          dutyService.getMyDuties(undefined, undefined, resourceParam).catch(() => []),
        ]);

        // Load cached locally assigned duties to match MyDutiesScreen 100%
        let localItems: DutyItem[] = [];
        try {
          const raw = localStorage.getItem('cached_assigned_duties');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              localItems = isAdmin
                ? parsed
                : parsed.filter(
                    (d: any) =>
                      d.employee?.resourceId === user?.resourceId ||
                      d.employeeResourceId === user?.resourceId ||
                      d.employeeId === user?.id ||
                      d.resourceId === user?.resourceId
                  );
            }
          }
        } catch (e) {
          console.error('Failed to read local cached duties', e);
        }

        // Merge backend items and local items (deduplicating by id or Date+Center+Shift+Employee)
        const combined = [...(backendDuties || [])];
        for (const loc of localItems) {
          const exists = combined.some(
            (b) =>
              b.id === loc.id ||
              (b.dutyDate === loc.dutyDate &&
                (b.centerId === loc.centerId || b.center?.centerName === loc.center?.centerName) &&
                (b.shiftId === loc.shiftId || b.shift?.name === loc.shift?.name) &&
                (b.employee?.resourceId === loc.employee?.resourceId || b.employeeId === loc.employeeId))
          );
          if (!exists) {
            combined.push(loc);
          }
        }

        if (isMounted) {
          if (data) setDashboardData(data);
          setDutiesList(combined);
        }
      } catch (err) {
        console.warn('Dashboard live fetch failed or offline, using fallback state', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [filterResourceId, selectedYear]);

  // Derived statistics unified with MyDutiesScreen
  const isAll = filterResourceId === 'ALL';
  const totalDuties = dutiesList.length > 0
    ? dutiesList.length
    : (isAll
      ? (dashboardData?.stats?.systemTotalDuties ?? dashboardData?.stats?.totalDuties ?? 0)
      : (dashboardData?.stats?.totalDuties ?? 0));

  const mocksCount = dutiesList.length > 0
    ? dutiesList.filter((d) => (d.dutyType || d.exam?.type || '').toLowerCase().includes('mock')).length
    : (dashboardData?.stats?.mocks ?? 0);

  const examsCount = dutiesList.length > 0
    ? (totalDuties - mocksCount)
    : (dashboardData?.stats?.exams ?? 0);

  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonth = dutiesList.length > 0
    ? dutiesList.filter((d) => {
        const str = (d.dutyDate || '').trim();
        const ymd = str.match(/^(\d{4})[-/](\d{1,2})/);
        if (ymd) {
          return parseInt(ymd[1], 10) === currentYear && parseInt(ymd[2], 10) - 1 === currentMonthIndex;
        }
        return true;
      }).length
    : (dashboardData?.stats?.thisMonth ?? 0);

  const displayName = isAdmin
    ? (isAll ? 'Administrator (System Overview)' : (dashboardData?.employee?.name || 'Staff Member'))
    : (user?.name || dashboardData?.employee?.name || 'Employee');
  const displayResourceId = isAdmin
    ? (isAll ? 'ADMIN' : (dashboardData?.employee?.resourceId || filterResourceId))
    : (user?.resourceId || dashboardData?.employee?.resourceId || '');

  // Recent duties derived from unified dutiesList
  const recentDuties: RecentDutySummary[] = dutiesList.length > 0
    ? dutiesList.slice(0, 5).map((d, index) => ({
        num: index + 1,
        id: d.id,
        exam: d.exam?.name || d.dutyType || 'Exam',
        date: d.dutyDate,
        center: d.center?.centerName || 'Assigned Center',
        city: d.city?.name || 'Assigned City',
        role: d.role?.name || 'Invigilator',
        shift: d.shift?.name || 'Shift 1',
        status: d.status || 'Pending',
        reportingTime: d.reportingTime,
        shiftEndTime: d.shiftEndTime,
        employeeName: d.employee?.name || (isAdmin ? 'Assigned Staff' : 'Mohan'),
        resourceId: d.employee?.resourceId || d.employeeId,
      }))
    : (dashboardData?.recentDuties || []);

  const monthlyChartData = useMemo(() => {
    if (dutiesList.length === 0 && dashboardData?.monthlyOverview) {
      return dashboardData.monthlyOverview;
    }
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const cMonthIdx = new Date().getMonth();
    const monthsData = monthNames.map((name, idx) => ({
      month: name,
      exams: 0,
      mocks: 0,
      total: 0,
      isCurrent: idx === cMonthIdx,
    }));

    dutiesList.forEach((d) => {
      const dStr = (d.dutyDate || '').trim();
      let mIdx = cMonthIdx;
      let yr = 2026;
      const ymd = dStr.match(/^(\d{4})[-/](\d{1,2})/);
      if (ymd) {
        yr = parseInt(ymd[1], 10);
        mIdx = parseInt(ymd[2], 10) - 1;
      }
      if (yr === selectedYear && mIdx >= 0 && mIdx < 12) {
        const isM = (d.dutyType || d.exam?.type || '').toLowerCase().includes('mock');
        if (isM) {
          monthsData[mIdx].mocks += 1;
        } else {
          monthsData[mIdx].exams += 1;
        }
        monthsData[mIdx].total += 1;
      }
    });

    return monthsData;
  }, [dutiesList, selectedYear, dashboardData]);

  return (
    <div className="unified-dashboard-root animate-fade-in">
      {/* 1. DESKTOP VIEW (Visible on screens >= 1024px) */}
      <div className="desktop-layout-wrapper">
        {/* Desktop Top Header Bar */}
        <DesktopTopNav />

        {/* Desktop Content Row: Sidebar + Main Area */}
        <div className="desktop-main-row">
          {/* Left Royal Blue Sidebar */}
          <DesktopSidebar />

          {/* Main Dashboard Panel */}
          <main className="desktop-content-panel">
            {/* Blue Welcome Banner Card */}
            <div className="desktop-welcome-banner">
              <div className="welcome-banner-left">
                <div className="banner-title-row">
                  <h1 className="banner-name">Welcome</h1>
                </div>

                <div className="banner-meta-row">
                  <div className="banner-resource-pill">
                    <UserCheck size={14} />
                    <span>ID: {displayResourceId}</span>
                  </div>
                  {isAdmin ? (
                    <span className="mobile-role-badge badge-admin">ADMIN</span>
                  ) : (
                    <span className="mobile-role-badge badge-staff">STAFF</span>
                  )}
                </div>
              </div>
            </div>

            {/* 4 Statistics Cards in ONE ROW */}
            <section className="desktop-stats-row" aria-label="Key Metrics">
              <StatCard
                title="TOTAL DUTIES"
                value={String(totalDuties)}
                subtext="All assigned duties"
                icon={<ClipboardCheck size={22} color="#2563EB" />}
                iconBg="#EFF6FF"
                titleColor="#2563EB"
              />
              <StatCard
                title="THIS MONTH"
                value={String(thisMonth)}
                subtext="Duties in current month"
                icon={<CalendarCheck size={22} color="#059669" />}
                iconBg="#ECFDF5"
                titleColor="#059669"
              />
              <StatCard
                title="EXAMS"
                value={String(examsCount)}
                subtext="Exam duties"
                icon={<GraduationCap size={22} color="#7C3AED" />}
                iconBg="#F5F3FF"
                titleColor="#7C3AED"
              />
              <StatCard
                title="MOCKS"
                value={String(mocksCount)}
                subtext="Mock duties"
                icon={<BookOpen size={22} color="#D97706" />}
                iconBg="#FFFBEB"
                titleColor="#D97706"
              />
            </section>

            {/* Monthly Duty Overview Card */}
            <section className="desktop-chart-section">
              <MonthlyChart
                data={monthlyChartData}
                selectedYear={selectedYear}
                availableYears={dashboardData?.availableYears}
                onYearChange={(yr) => setSelectedYear(yr)}
              />
            </section>

            {/* Recent Duties Table */}
            <section className="desktop-table-section">
              <RecentDutiesTable duties={recentDuties} />
            </section>

            {/* Desktop Footer */}
            <footer className="desktop-portal-footer">
              <span className="footer-copyright">
                &copy; 2026 Exam Duty Management. All rights reserved.
              </span>
              <span className="footer-credits">
                Chandana IT Solutions
              </span>
            </footer>
          </main>
        </div>
      </div>

      {/* 2. MOBILE VIEW (Visible on screens < 1024px) */}
      <div className="mobile-layout-wrapper">
        {/* Mobile Header with Top Bar and Blue Banner */}
        <MobileHeader />

        {/* Mobile Main Body */}
        <main className="mobile-content-body">
          {/* 2x2 Stat Cards Grid */}
          <section className="mobile-stats-grid" aria-label="Duty Statistics">
            <StatCard
              title="TOTAL DUTIES"
              value={String(totalDuties)}
              subtext="All assigned duties"
              icon={<ClipboardCheck size={20} color="#2563EB" />}
              iconBg="#EFF6FF"
              titleColor="#2563EB"
            />
            <StatCard
              title="THIS MONTH"
              value={String(thisMonth)}
              subtext="Duties in current month"
              icon={<CalendarCheck size={20} color="#059669" />}
              iconBg="#ECFDF5"
              titleColor="#059669"
            />
            <StatCard
              title="EXAMS"
              value={String(examsCount)}
              subtext="Exam duties"
              icon={<GraduationCap size={20} color="#7C3AED" />}
              iconBg="#F5F3FF"
              titleColor="#7C3AED"
            />
            <StatCard
              title="MOCKS"
              value={String(mocksCount)}
              subtext="Mock duties"
              icon={<BookOpen size={20} color="#D97706" />}
              iconBg="#FFFBEB"
              titleColor="#D97706"
            />
          </section>

          {/* Monthly Duty Overview */}
          <section className="mobile-chart-section">
            <MonthlyChart
              data={monthlyChartData}
              selectedYear={selectedYear}
              availableYears={dashboardData?.availableYears}
              onYearChange={(yr) => setSelectedYear(yr)}
            />
          </section>

          {/* Recent Duties Cards */}
          <section className="mobile-duties-section">
            <RecentDutiesTable duties={recentDuties} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardScreen;
