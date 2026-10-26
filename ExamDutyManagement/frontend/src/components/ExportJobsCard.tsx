import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { DutyItem } from '../services/duty.service';
import masterService, { EmployeeItem } from '../services/master.service';
import { exportDutiesToExcel, ExportFilters } from '../utils/excelExport';

interface ExportJobsCardProps {
  duties: DutyItem[];
  employees: EmployeeItem[];
  onFilterChange?: (filters: ExportFilters) => void;
  className?: string;
}

export const ExportJobsCard: React.FC<ExportJobsCardProps> = ({
  duties,
  employees,
  onFilterChange,
  className = '',
}) => {
  const [date, setDate] = useState<string>('');
  const [workPlace, setWorkPlace] = useState<string>('All Places');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [citiesList, setCitiesList] = useState<string[]>([
    'Mysore',
    'Bengaluru',
    'Mangalore',
    'Shivamogga',
    'Mandya',
    'Davanagere',
    'Dharwad',
  ]);

  useEffect(() => {
    masterService.getCities().then((cts) => {
      if (Array.isArray(cts) && cts.length > 0) {
        const names = Array.from(new Set(cts.map((c) => c.name).filter(Boolean)));
        setCitiesList(names);
      }
    }).catch(() => {
      // Keep defaults
    });
  }, []);

  const handleDateChange = (val: string) => {
    setDate(val);
    if (onFilterChange) onFilterChange({ date: val, workPlace });
  };

  const handleWorkPlaceChange = (val: string) => {
    setWorkPlace(val);
    if (onFilterChange) onFilterChange({ date, workPlace: val });
  };

  const handleExport = () => {
    const result = exportDutiesToExcel(duties, employees, {
      date,
      workPlace,
    });
    const placeName = (!workPlace || workPlace === 'ALL' || workPlace === 'All Places') 
      ? 'All Places' 
      : workPlace;
    const dateDesc = date ? ` (${date})` : '';
    if (result.count === 0) {
      setExportNotice(
        `No assigned duty record(s) found for ${placeName}${dateDesc}. An empty spreadsheet template was downloaded.`
      );
    } else {
      setExportNotice(
        `Successfully exported ${result.count} assigned duty record(s) for ${placeName}${dateDesc} into ${result.filename}! Opening in Excel...`
      );
    }
    setTimeout(() => {
      setExportNotice(null);
    }, 6000);
  };

  return (
    <div className={`export-jobs-card ${className}`}>
      <div className="export-jobs-title">
        Export the Employee Assigned Jobs Details:
      </div>

      {exportNotice && (
        <div className="export-success-notice">
          <CheckCircle size={16} />
          <span>{exportNotice}</span>
        </div>
      )}

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
              title="Filter duties by workplace city for Excel export"
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

        {/* Export Button */}
        <div className="export-btn-col">
          <button
            type="button"
            className="trackclock-export-btn"
            onClick={handleExport}
            title="Download Excel spreadsheet with full employee and assigned job details"
          >
            <ExternalLink size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportJobsCard;
