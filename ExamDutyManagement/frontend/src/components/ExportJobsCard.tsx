import React, { useState, useEffect } from 'react';
import { ExternalLink, Download } from 'lucide-react';
import { DutyItem } from '../services/duty.service';
import masterService, { EmployeeItem, Center, Exam, Role, Shift } from '../services/master.service';
import authService from '../services/auth.service';
import { exportDutiesToExcel, ExportFilters } from '../utils/excelExport';
import { exportDutiesToAwignPDF } from '../utils/pdfExport';
import { SweetAlertToast } from './SweetAlertToast';

interface ExportJobsCardProps {
  duties: DutyItem[];
  employees?: EmployeeItem[];
  onFilterChange?: (filters: ExportFilters) => void;
  className?: string;
}

export const ExportJobsCard: React.FC<ExportJobsCardProps> = ({
  duties,
  employees = [],
  onFilterChange,
  className = '',
}) => {
  const [date, setDate] = useState<string>('');
  const [workPlace, setWorkPlace] = useState<string>('All Places');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Master Data collections for accurate name and details resolution
  const [citiesList, setCitiesList] = useState<string[]>([
    'Mysore',
    'Bengaluru',
    'Mangalore',
    'Shivamogga',
    'Mandya',
    'Davanagere',
    'Dharwad',
  ]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [masterEmployees, setMasterEmployees] = useState<EmployeeItem[]>([]);

  const loadMasterData = () => {
    Promise.allSettled([
      masterService.getCities(),
      masterService.getCenters(),
      masterService.getExams(),
      masterService.getRoles(),
      masterService.getShifts(),
      masterService.getEmployees(),
    ]).then(([ctsRes, cntsRes, exsRes, rlsRes, shfsRes, empsRes]) => {
      if (ctsRes.status === 'fulfilled' && Array.isArray(ctsRes.value) && ctsRes.value.length > 0) {
        const names = Array.from(new Set(ctsRes.value.map((c) => c.name).filter(Boolean)));
        setCitiesList(names);
      }
      if (cntsRes.status === 'fulfilled' && Array.isArray(cntsRes.value)) {
        setCenters(cntsRes.value);
      }
      if (exsRes.status === 'fulfilled' && Array.isArray(exsRes.value)) {
        setExams(exsRes.value);
      }
      if (rlsRes.status === 'fulfilled' && Array.isArray(rlsRes.value)) {
        setRoles(rlsRes.value);
      }
      if (shfsRes.status === 'fulfilled' && Array.isArray(shfsRes.value)) {
        setShifts(shfsRes.value);
      }
      if (empsRes.status === 'fulfilled' && Array.isArray(empsRes.value)) {
        setMasterEmployees(empsRes.value);
      }
    }).catch((err) => {
      console.warn('Failed to load master lookup data in ExportJobsCard', err);
    });
  };

  useEffect(() => {
    loadMasterData();

    // Listen to real-time additions (e.g. newly added employee or center)
    const handleMasterUpdate = () => {
      loadMasterData();
    };

    window.addEventListener('exam_duty_master_updated', handleMasterUpdate);
    return () => {
      window.removeEventListener('exam_duty_master_updated', handleMasterUpdate);
    };
  }, []);

  const handleDateChange = (val: string) => {
    setDate(val);
    if (onFilterChange) onFilterChange({ date: val, workPlace });
  };

  const handleWorkPlaceChange = (val: string) => {
    setWorkPlace(val);
    if (onFilterChange) onFilterChange({ date, workPlace: val });
  };

  // Helper: Merges duties prop with local cached duties to guarantee newly submitted duties appear instantly
  const getMergedDutiesToExport = (): DutyItem[] => {
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

  // Helper: Merges prop employees with master employees for complete demographic data
  const getMergedEmployees = (): EmployeeItem[] => {
    const map = new Map<string, EmployeeItem>();
    masterEmployees.forEach((e) => {
      if (e.resourceId) map.set(e.resourceId.toLowerCase().trim(), e);
      if (e.id) map.set(e.id.toLowerCase().trim(), e);
    });
    (employees || []).forEach((e) => {
      if (e.resourceId) map.set(e.resourceId.toLowerCase().trim(), e);
      if (e.id) map.set(e.id.toLowerCase().trim(), e);
    });
    return Array.from(map.values());
  };

  // 1. Export as Excel (.xlsx)
  const handleExport = () => {
    const dutiesToExport = getMergedDutiesToExport();
    const mergedEmployees = getMergedEmployees();

    const result = exportDutiesToExcel(dutiesToExport, mergedEmployees, {
      date,
      workPlace,
    });
    const placeName = (!workPlace || workPlace === 'ALL' || workPlace === 'All Places') 
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
  };

  // 2. Download as Awign Attendance Sheet PDF (.pdf) populated with actual task details
  const handleDownloadPDF = () => {
    const dutiesToExport = getMergedDutiesToExport();
    const mergedEmployees = getMergedEmployees();
    const currentUser = authService.getStoredUser();

    const result = exportDutiesToAwignPDF(
      dutiesToExport,
      mergedEmployees,
      {
        filters: {
          date,
          workPlace,
        },
        teamLeadName: currentUser?.name || 'Administrator',
        centers,
        exams,
        roles,
        shifts,
      }
    );

    const placeName = (!workPlace || workPlace === 'ALL' || workPlace === 'All Places') 
      ? 'All Places' 
      : workPlace;
    const dateDesc = date ? ` (${date})` : '';
    if (result.count === 0) {
      setToastMessage(
        `No assigned duty record(s) found for ${placeName}${dateDesc}. Please select a date/place with assigned duties, or select "All Places".`
      );
    } else {
      setToastMessage(
        `Successfully generated Awign Attendance Sheet PDF with ${result.count} record(s) into ${result.filename}! Opening PDF...`
      );
    }
  };

  return (
    <div className={`export-jobs-card ${className}`}>
      <div className="export-jobs-title">
        Export the Employee Assigned Jobs Details:
      </div>

      <div className="export-jobs-controls-row">
        {/* Date */}
        <div className="export-input-col">
          <label className="export-input-label">Date</label>
          <div className="export-input-wrapper">
            <input
              type="date"
              className="export-native-input"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              placeholder="dd-mm-yyyy"
            />
          </div>
        </div>

        {/* Work Place */}
        <div className="export-input-col">
          <label className="export-input-label">Work Place</label>
          <div className="export-input-wrapper">
            <select
              className="export-native-select"
              value={workPlace}
              onChange={(e) => handleWorkPlaceChange(e.target.value)}
              title="Filter duties by workplace city for Excel or PDF export"
            >
              <option value="All Places">All Places</option>
              {citiesList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons: Export (Excel) & Download (PDF) */}
        <div className="export-btn-col">
          <button
            type="button"
            className="trackclock-export-btn"
            onClick={handleExport}
            title="Download Excel spreadsheet with 10 column workforce job details"
          >
            <ExternalLink size={18} />
            <span>Export</span>
          </button>

          <button
            type="button"
            className="trackclock-download-btn"
            onClick={handleDownloadPDF}
            title="Download official Awign Attendance Sheet PDF Daily Tracker format"
          >
            <Download size={18} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* SweetAlert Toast Notification */}
      <SweetAlertToast
        show={Boolean(toastMessage)}
        message={toastMessage || ''}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default ExportJobsCard;
