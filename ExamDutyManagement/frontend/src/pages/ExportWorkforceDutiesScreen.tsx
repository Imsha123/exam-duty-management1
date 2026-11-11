import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Building,
  Grid,
  MapPin,
  Edit2,
  ArrowDown,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { DesktopTopNav } from '../components/DesktopTopNav';
import { DesktopSidebar } from '../components/DesktopSidebar';
import { MobileHeader } from '../components/MobileHeader';
import { SweetAlertToast } from '../components/SweetAlertToast';
import dutyService, { DutyItem } from '../services/duty.service';
import masterService, {
  City,
  Center,
  Exam,
  Role,
  Shift,
  EmployeeItem,
} from '../services/master.service';
import authService, { isUserAdmin } from '../services/auth.service';
import { exportDutiesToExcel } from '../utils/excelExport';
import { exportDutiesToAwignPDF } from '../utils/pdfExport';

export const ExportWorkforceDutiesScreen: React.FC = () => {
  const user = authService.getStoredUser();
  const isAdmin = isUserAdmin(user);

  // Tabs: 'excel' (Export Excel) vs 'pdf' (Export PDF)
  const [activeTab, setActiveTab] = useState<'excel' | 'pdf'>('excel');

  // Form Filters State
  const [date, setDate] = useState<string>('');
  const [workPlace, setWorkPlace] = useState<string>('All Places');
  const [examType, setExamType] = useState<string>('All Types');
  const [centerName, setCenterName] = useState<string>('All Centers');
  const [examName, setExamName] = useState<string>('All Exams');

  // Master Data Collections
  const [duties, setDuties] = useState<DutyItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load all duties and master lookups
  const loadData = async () => {
    setLoading(true);
    try {
      const [dutiesRes, empsRes, ctsRes, cntsRes, exsRes, rlsRes, shfsRes] =
        await Promise.allSettled([
          dutyService.getMyDuties(undefined, undefined, 'ALL', undefined),
          masterService.getEmployees(),
          masterService.getCities(),
          masterService.getCenters(),
          masterService.getExams(),
          masterService.getRoles(),
          masterService.getShifts(),
        ]);

      let loadedDuties: DutyItem[] = [];
      if (dutiesRes.status === 'fulfilled' && Array.isArray(dutiesRes.value)) {
        loadedDuties = dutiesRes.value;
        setDuties(loadedDuties);
      }
      if (empsRes.status === 'fulfilled' && Array.isArray(empsRes.value)) {
        setEmployees(empsRes.value);
      }
      if (ctsRes.status === 'fulfilled' && Array.isArray(ctsRes.value)) {
        setCities(ctsRes.value);
      }

      // Exact centers from masterService matching "Add Exam Center Name" (122 centers)
      if (cntsRes.status === 'fulfilled' && Array.isArray(cntsRes.value)) {
        const uniqueCentersMap = new Map<string, Center>();
        cntsRes.value.forEach((c) => {
          const key = (c.id || c.centerCode || c.centerName).toLowerCase().trim();
          if (!uniqueCentersMap.has(key)) {
            uniqueCentersMap.set(key, c);
          }
        });
        setCenters(Array.from(uniqueCentersMap.values()));
      }

      // Exact exams from masterService matching "Add Exam Name"
      if (exsRes.status === 'fulfilled' && Array.isArray(exsRes.value)) {
        const uniqueExamsMap = new Map<string, Exam>();
        exsRes.value.forEach((x) => {
          const key = (x.id || x.name).toLowerCase().trim();
          if (!uniqueExamsMap.has(key)) {
            uniqueExamsMap.set(key, x);
          }
        });
        setExams(Array.from(uniqueExamsMap.values()));
      }

      if (rlsRes.status === 'fulfilled' && Array.isArray(rlsRes.value)) {
        setRoles(rlsRes.value);
      }
      if (shfsRes.status === 'fulfilled' && Array.isArray(shfsRes.value)) {
        setShifts(shfsRes.value);
      }
    } catch (err) {
      console.warn('Error loading export data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const contentPanel = document.querySelector('.desktop-content-panel');
    if (contentPanel) {
      contentPanel.scrollTop = 0;
    }
    loadData();

    // Listen to real-time additions of employees or master records
    const handleMasterUpdate = () => loadData();
    window.addEventListener('exam_duty_master_updated', handleMasterUpdate);
    return () => {
      window.removeEventListener('exam_duty_master_updated', handleMasterUpdate);
    };
  }, []);

  // Show ALL centers in Karnataka (113+ centers).
  // If a workplace is selected, prioritize matching centers at the top,
  // but KEEP ALL OTHER CENTERS right below so user can select any center!
  const availableCenters = useMemo(() => {
    const list = [...centers].sort((a, b) =>
      (a.centerName || '').localeCompare(b.centerName || '')
    );
    if (!workPlace || workPlace === 'All Places' || workPlace === 'ALL') {
      return list;
    }
    const targetCity = cities.find(
      (c) => c.name.toLowerCase().trim() === workPlace.toLowerCase().trim()
    );
    const matching: Center[] = [];
    const others: Center[] = [];
    list.forEach((cnt) => {
      const matchCity = targetCity && cnt.cityId === targetCity.id;
      const matchAddr = (cnt.address || '')
        .toLowerCase()
        .includes(workPlace.toLowerCase().trim());
      if (matchCity || matchAddr) {
        matching.push(cnt);
      } else {
        others.push(cnt);
      }
    });
    return [...matching, ...others];
  }, [centers, cities, workPlace]);

  // Show ALL exams (NEET, JEE, TCS, AIIMS Mock, etc.).
  // If examType is selected, prioritize matching type at top,
  // but KEEP ALL OTHER EXAMS right below so user can select any exam!
  const availableExams = useMemo(() => {
    const list = [...exams].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    );
    if (!examType || examType === 'All Types' || examType === 'All') {
      return list;
    }
    const matching: Exam[] = [];
    const others: Exam[] = [];
    list.forEach((ex) => {
      const isMatch = (ex.type || 'Exam').toLowerCase() === examType.toLowerCase();
      if (isMatch) {
        matching.push(ex);
      } else {
        others.push(ex);
      }
    });
    return [...matching, ...others];
  }, [exams, examType]);

  // Helper: Merges duties with local cached duties to guarantee newly added duties appear instantly
  const getMergedDuties = (): DutyItem[] => {
    let dutiesToExport = [...(duties || [])];
    try {
      const raw = localStorage.getItem('cached_assigned_duties');
      if (raw) {
        const cached = JSON.parse(raw);
        if (Array.isArray(cached)) {
          for (const c of cached) {
            const exists = dutiesToExport.some(
              (x) =>
                x.id === c.id ||
                (x.dutyDate === c.dutyDate &&
                  (x.centerId === c.centerId || x.center?.centerName === c.center?.centerName) &&
                  (x.shiftId === c.shiftId || x.shift?.name === c.shift?.name) &&
                  (x.employee?.resourceId === c.employee?.resourceId || x.employeeId === c.employeeId))
            );
            if (!exists) {
              dutiesToExport.unshift(c);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Failed to merge cached duties for export', e);
    }
    return dutiesToExport;
  };

  // Helper: Merges employees
  const getMergedEmployees = (): EmployeeItem[] => {
    const map = new Map<string, EmployeeItem>();
    employees.forEach((e) => {
      if (e.resourceId) map.set(e.resourceId.toLowerCase().trim(), e);
      if (e.id) map.set(e.id.toLowerCase().trim(), e);
    });
    return Array.from(map.values());
  };

  // 1. Download .xlsx file (Excel Export)
  const handleDownloadExcel = () => {
    setExporting(true);
    try {
      const mergedDuties = getMergedDuties();
      const mergedEmployees = getMergedEmployees();
      const result = exportDutiesToExcel(mergedDuties, mergedEmployees, {
        date,
        workPlace,
      });

      const placeName =
        !workPlace || workPlace === 'ALL' || workPlace === 'All Places'
          ? 'All Places'
          : workPlace;
      const dateDesc = date ? ` (${date})` : '';

      if (result.count === 0) {
        setToastMessage(
          `No assigned duty record(s) found for ${placeName}${dateDesc}. Please select a date/place with assigned duties, or select "All Places".`
        );
      } else {
        setToastMessage(
          `Successfully exported ${result.count} assigned duty record(s) for ${placeName}${dateDesc} into ${result.filename}! Opening in Excel...`
        );
      }
    } catch (err) {
      console.error('Error generating Excel', err);
      setToastMessage('Failed to generate Excel file. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // 2. Download .pdf file (Awign Attendance Sheet PDF Export)
  const handleDownloadPDF = () => {
    setExporting(true);
    try {
      const mergedDuties = getMergedDuties();
      const mergedEmployees = getMergedEmployees();
      const currentUser = authService.getStoredUser();

      const result = exportDutiesToAwignPDF(
        mergedDuties,
        mergedEmployees,
        {
          filters: {
            date,
            workPlace,
            examType,
            centerName,
            examName,
          },
          teamLeadName: currentUser?.name || (isAdmin ? 'Mohan' : 'Administrator'),
          centers,
          exams,
          roles,
          shifts,
        }
      );

      const placeName =
        !workPlace || workPlace === 'ALL' || workPlace === 'All Places'
          ? 'All Places'
          : workPlace;
      const dateDesc = date ? ` (${date})` : '';

      if (result.count === 0) {
        setToastMessage(
          `No assigned duty record(s) found matching the selected Date, Place, Center, and Exam. Please select a valid date/center or choose "All".`
        );
      } else {
        setToastMessage(
          `Successfully generated Awign Attendance Sheet PDF with ${result.count} record(s) into ${result.filename}! Opening PDF...`
        );
      }
    } catch (err) {
      console.error('Error generating PDF', err);
      setToastMessage('Failed to generate PDF document. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="unified-dashboard-root animate-fade-in">
      {/* 1. DESKTOP VIEW */}
      <div className="desktop-layout-wrapper">
        <DesktopTopNav />
        <div className="desktop-main-row">
          <DesktopSidebar />

          <main className="desktop-content-panel">
            <div style={{ maxWidth: '640px', width: '100%', margin: '0 auto', paddingBottom: '32px' }}>
              {/* Page Title Row */}
              <div style={{ marginBottom: '22px' }}>
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 6px 0',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Export Workforce Duties
                </h1>
                <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                  Generate and download assigned employee duties in Excel spreadsheet or official Awign PDF Tracker format.
                </p>
              </div>

              {/* Top Navigation Tabs (White themed) */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '18px',
                }}
              >
                {/* Export Excel Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('excel')}
                  style={{
                    flex: 1,
                    height: '48px',
                    borderRadius: '10px',
                    background: activeTab === 'excel' ? '#FFFFFF' : '#F1F5F9',
                    border:
                      activeTab === 'excel'
                        ? '2px solid #2563EB'
                        : '1.5px solid #E2E8F0',
                    color: activeTab === 'excel' ? '#1E293B' : '#64748B',
                    fontSize: '15px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow:
                      activeTab === 'excel'
                        ? '0 4px 12px rgba(37, 99, 235, 0.12)'
                        : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <FileText
                    size={18}
                    color={activeTab === 'excel' ? '#2563EB' : '#94A3B8'}
                  />
                  <span>Export Excel</span>
                </button>

                {/* Export PDF Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('pdf')}
                  style={{
                    flex: 1,
                    height: '48px',
                    borderRadius: '10px',
                    background: activeTab === 'pdf' ? '#FFFFFF' : '#F1F5F9',
                    border:
                      activeTab === 'pdf'
                        ? '2px solid #2563EB'
                        : '1.5px solid #E2E8F0',
                    color: activeTab === 'pdf' ? '#1E293B' : '#64748B',
                    fontSize: '15px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow:
                      activeTab === 'pdf'
                        ? '0 4px 12px rgba(37, 99, 235, 0.12)'
                        : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <FileText
                    size={18}
                    color={activeTab === 'pdf' ? '#2563EB' : '#94A3B8'}
                  />
                  <span>Export PDF</span>
                </button>
              </div>

              {/* Main White Card */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '28px 24px',
                  boxShadow:
                    '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '18px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                  }}
                >
                  Required information
                </div>

                {/* 1. Date Field (Present in both Excel & PDF tabs) */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <Calendar size={18} color="#2563EB" />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1E293B',
                      minWidth: '95px',
                    }}
                  >
                    Date
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#0F172A',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12.5px',
                      color: '#64748B',
                      fontWeight: 500,
                      marginLeft: 'auto',
                    }}
                  >
                    required
                  </span>
                </div>

                {/* 2. Work Place Field (Present in both Excel & PDF tabs) */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <Building size={18} color="#2563EB" />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1E293B',
                      minWidth: '95px',
                    }}
                  >
                    Work place
                  </span>
                  <select
                    value={workPlace}
                    onChange={(e) => {
                      setWorkPlace(e.target.value);
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#0F172A',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="All Places" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                      All Places
                    </option>
                    {cities.map((c) => (
                      <option
                        key={c.id}
                        value={c.name}
                        style={{ background: '#FFFFFF', color: '#0F172A' }}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      fontSize: '12.5px',
                      color: '#64748B',
                      fontWeight: 500,
                      marginLeft: 'auto',
                    }}
                  >
                    required
                  </span>
                </div>

                {/* Additional 3 Fields strictly when PDF tab is selected */}
                {activeTab === 'pdf' && (
                  <>
                    {/* 3. Exam Type Field */}
                    <div
                      style={{
                        background: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '14px',
                      }}
                    >
                      <Grid size={18} color="#2563EB" />
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1E293B',
                          minWidth: '95px',
                        }}
                      >
                        Exam type
                      </span>
                      <select
                        value={examType}
                        onChange={(e) => {
                          setExamType(e.target.value);
                        }}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#0F172A',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <option value="All Types" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                          All Types
                        </option>
                        <option value="Exam" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                          Exam
                        </option>
                        <option value="Mock" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                          Mock
                        </option>
                      </select>
                      <span
                        style={{
                          fontSize: '12.5px',
                          color: '#64748B',
                          fontWeight: 500,
                          marginLeft: 'auto',
                        }}
                      >
                        required
                      </span>
                    </div>

                    {/* 4. Center Name Field (Displays ALL centers; matching workplace prioritized at top) */}
                    <div
                      style={{
                        background: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '14px',
                      }}
                    >
                      <MapPin size={18} color="#2563EB" />
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1E293B',
                          minWidth: '95px',
                        }}
                      >
                        Center name
                      </span>
                      <select
                        value={centerName}
                        onChange={(e) => setCenterName(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#0F172A',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <option value="All Centers" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                          All Centers ({availableCenters.length})
                        </option>
                        {availableCenters.map((c) => (
                          <option
                            key={c.id || c.centerCode || c.centerName}
                            value={c.centerName}
                            style={{ background: '#FFFFFF', color: '#0F172A' }}
                          >
                            {c.centerName} {c.centerCode ? `(${c.centerCode})` : ''}
                          </option>
                        ))}
                      </select>
                      <span
                        style={{
                          fontSize: '12.5px',
                          color: '#64748B',
                          fontWeight: 500,
                          marginLeft: 'auto',
                        }}
                      >
                        required
                      </span>
                    </div>

                    {/* 5. Exam Name Field (Displays ALL exams; matching exam type prioritized at top) */}
                    <div
                      style={{
                        background: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '14px',
                      }}
                    >
                      <Edit2 size={18} color="#2563EB" />
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1E293B',
                          minWidth: '95px',
                        }}
                      >
                        Exam name
                      </span>
                      <select
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#0F172A',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <option value="All Exams" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                          All Exams ({availableExams.length})
                        </option>
                        {availableExams.map((ex) => (
                          <option
                            key={ex.id || ex.name}
                            value={ex.name}
                            style={{ background: '#FFFFFF', color: '#0F172A' }}
                          >
                            {ex.name} {ex.type ? `(${ex.type})` : ''}
                          </option>
                        ))}
                      </select>
                      <span
                        style={{
                          fontSize: '12.5px',
                          color: '#64748B',
                          fontWeight: 500,
                          marginLeft: 'auto',
                        }}
                      >
                        required
                      </span>
                    </div>
                  </>
                )}

                {/* Down Arrow Indicator */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '18px 0',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowDown size={16} />
                  </div>
                </div>

                {/* Download Action Buttons */}
                {activeTab === 'excel' ? (
                  /* Green Download .xlsx Button */
                  <button
                    type="button"
                    onClick={handleDownloadExcel}
                    disabled={exporting || loading}
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '10px',
                      background: '#16A34A',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                      cursor: exporting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {exporting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Download size={18} />
                    )}
                    <span>{exporting ? 'Generating Excel...' : 'Download .xlsx file'}</span>
                  </button>
                ) : (
                  /* Red Download .pdf Button */
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={exporting || loading}
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '10px',
                      background: '#DC2626',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
                      cursor: exporting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {exporting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Download size={18} />
                    )}
                    <span>{exporting ? 'Generating PDF...' : 'Download .pdf file'}</span>
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* 2. MOBILE VIEW (White themed) */}
      <div className="mobile-layout-wrapper">
        <MobileHeader />
        <main
          className="mobile-content-body"
          style={{
            background: '#F8FAFC',
            minHeight: 'calc(100vh - 60px)',
            padding: '20px 16px',
          }}
        >
          <div className="mobile-page-title-row" style={{ marginBottom: '16px' }}>
            <h2 className="mobile-page-heading" style={{ color: '#0F172A', fontSize: '20px' }}>
              Export Workforce Duties
            </h2>
          </div>

          {/* Top Navigation Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('excel')}
              style={{
                flex: 1,
                height: '44px',
                borderRadius: '8px',
                background: activeTab === 'excel' ? '#FFFFFF' : '#F1F5F9',
                border:
                  activeTab === 'excel'
                    ? '2px solid #2563EB'
                    : '1.5px solid #E2E8F0',
                color: activeTab === 'excel' ? '#1E293B' : '#64748B',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow:
                  activeTab === 'excel'
                    ? '0 2px 8px rgba(37, 99, 235, 0.12)'
                    : 'none',
              }}
            >
              <FileText size={16} color={activeTab === 'excel' ? '#2563EB' : '#94A3B8'} />
              <span>Export Excel</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              style={{
                flex: 1,
                height: '44px',
                borderRadius: '8px',
                background: activeTab === 'pdf' ? '#FFFFFF' : '#F1F5F9',
                border:
                  activeTab === 'pdf'
                    ? '2px solid #2563EB'
                    : '1.5px solid #E2E8F0',
                color: activeTab === 'pdf' ? '#1E293B' : '#64748B',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow:
                  activeTab === 'pdf'
                    ? '0 2px 8px rgba(37, 99, 235, 0.12)'
                    : 'none',
              }}
            >
              <FileText size={16} color={activeTab === 'pdf' ? '#2563EB' : '#94A3B8'} />
              <span>Export PDF</span>
            </button>
          </div>

          {/* White Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '20px 16px',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#475569',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              Required information
            </div>

            {/* Date */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <Calendar size={17} color="#2563EB" />
              <span
                style={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#1E293B',
                  minWidth: '75px',
                }}
              >
                Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#0F172A',
                  fontSize: '13.5px',
                  fontWeight: 600,
                }}
              />
              <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>
                required
              </span>
            </div>

            {/* Workplace */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <Building size={17} color="#2563EB" />
              <span
                style={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#1E293B',
                  minWidth: '75px',
                }}
              >
                Work place
              </span>
              <select
                value={workPlace}
                onChange={(e) => {
                  setWorkPlace(e.target.value);
                }}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#0F172A',
                  fontSize: '13.5px',
                  fontWeight: 600,
                }}
              >
                <option value="All Places" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                  All Places
                </option>
                {cities.map((c) => (
                  <option
                    key={c.id}
                    value={c.name}
                    style={{ background: '#FFFFFF', color: '#0F172A' }}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>
                required
              </span>
            </div>

            {/* PDF extra fields */}
            {activeTab === 'pdf' && (
              <>
                {/* Exam type */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <Grid size={17} color="#2563EB" />
                  <span
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#1E293B',
                      minWidth: '75px',
                    }}
                  >
                    Exam type
                  </span>
                  <select
                    value={examType}
                    onChange={(e) => {
                      setExamType(e.target.value);
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#0F172A',
                      fontSize: '13.5px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="All Types" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                      All Types
                    </option>
                    <option value="Exam" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                      Exam
                    </option>
                    <option value="Mock" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                      Mock
                    </option>
                  </select>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>
                    required
                  </span>
                </div>

                {/* Center name */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <MapPin size={17} color="#2563EB" />
                  <span
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#1E293B',
                      minWidth: '75px',
                    }}
                  >
                    Center name
                  </span>
                  <select
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#0F172A',
                      fontSize: '13.5px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="All Centers" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                      All Centers ({availableCenters.length})
                    </option>
                    {availableCenters.map((c) => (
                      <option
                        key={c.id || c.centerCode || c.centerName}
                        value={c.centerName}
                        style={{ background: '#FFFFFF', color: '#0F172A' }}
                      >
                        {c.centerName} {c.centerCode ? `(${c.centerCode})` : ''}
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>
                    required
                  </span>
                </div>

                {/* Exam name */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <Edit2 size={17} color="#2563EB" />
                  <span
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#1E293B',
                      minWidth: '75px',
                    }}
                  >
                    Exam name
                  </span>
                  <select
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#0F172A',
                      fontSize: '13.5px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="All Exams" style={{ background: '#FFFFFF', color: '#0F172A' }}>
                      All Exams ({availableExams.length})
                    </option>
                    {availableExams.map((ex) => (
                      <option
                        key={ex.id || ex.name}
                        value={ex.name}
                        style={{ background: '#FFFFFF', color: '#0F172A' }}
                      >
                        {ex.name} {ex.type ? `(${ex.type})` : ''}
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>
                    required
                  </span>
                </div>
              </>
            )}

            {/* Down arrow */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '14px 0',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowDown size={15} />
              </div>
            </div>

            {/* Button */}
            {activeTab === 'excel' ? (
              <button
                type="button"
                onClick={handleDownloadExcel}
                disabled={exporting}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '8px',
                  background: '#16A34A',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                }}
              >
                <Download size={17} />
                <span>{exporting ? 'Generating Excel...' : 'Download .xlsx file'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={exporting}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '8px',
                  background: '#DC2626',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                }}
              >
                <Download size={17} />
                <span>{exporting ? 'Generating PDF...' : 'Download .pdf file'}</span>
              </button>
            )}
          </div>
        </main>
      </div>

      {/* SweetAlert Notification */}
      <SweetAlertToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default ExportWorkforceDutiesScreen;
