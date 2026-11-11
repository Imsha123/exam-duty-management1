import * as XLSX from 'xlsx-js-style';
import { DutyItem } from '../services/duty.service';
import { EmployeeItem } from '../services/master.service';

export interface ExportFilters {
  date?: string;
  fromDate?: string;
  toDate?: string;
  workPlace?: string;
}

/**
 * Normalizes city/workplace names to match variations like Mangalore/Mangaluru, Bangalore/Bengaluru,
 * Mysuru(Mysore), Hubballi(Hubli), Belagavi(Belgaum), etc.
 */
export const matchesWorkPlace = (
  itemCity: string | undefined | { name?: string },
  filterPlace: string
): boolean => {
  if (!filterPlace || filterPlace === 'All Places' || filterPlace === 'ALL' || filterPlace.trim() === '') {
    return true;
  }

  const f = filterPlace.toLowerCase().trim();
  const rawCity = typeof itemCity === 'object' && itemCity !== null ? itemCity.name : itemCity;
  const c = (rawCity && rawCity.trim()) ? rawCity.toLowerCase().trim() : '';

  if (!c) {
    // If no city recorded, assume match only if All Places, otherwise fallback to true for Mysore
    return f.includes('myso') || f === 'all places';
  }

  // Exact or direct inclusion check
  if (c === f || c.includes(f) || f.includes(c)) return true;

  // Extract alphanumeric tokens (e.g. "Mysuru(Mysore)" -> ["mysuru", "mysore"])
  const filterTokens = f.split(/[\s,()\/_-]+/).map((t) => t.trim()).filter((t) => t.length >= 3);
  const cityTokens = c.split(/[\s,()\/_-]+/).map((t) => t.trim()).filter((t) => t.length >= 3);

  for (const ft of filterTokens) {
    for (const ct of cityTokens) {
      if (ft === ct || ft.includes(ct) || ct.includes(ft)) return true;
    }
  }

  // Common Karnataka municipal/regional aliases
  const aliases: Record<string, string[]> = {
    myso: ['mysore', 'mysuru'],
    bengal: ['bengaluru', 'bangalore'],
    bangal: ['bengaluru', 'bangalore'],
    mangal: ['mangaluru', 'mangalore'],
    belga: ['belagavi', 'belgaum'],
    hubl: ['hubballi', 'hubli'],
    hubba: ['hubballi', 'hubli'],
    balla: ['ballari', 'bellary'],
    bella: ['ballari', 'bellary'],
    shiva: ['shivamogga', 'shimoga', 'shivmogga'],
    shimo: ['shivamogga', 'shimoga', 'shivmogga'],
    kalab: ['kalaburagi', 'gulbarga'],
    gulba: ['kalaburagi', 'gulbarga'],
    vijay: ['vijayapura', 'bijapur'],
    bija: ['vijayapura', 'bijapur'],
    dharw: ['dharwad'],
    davan: ['davanagere'],
    bagal: ['bagalkot'],
    tumk: ['tumkur', 'tumakuru'],
    udup: ['udupi'],
    kolar: ['kolar'],
    mandya: ['mandya'],
    hassan: ['hassan'],
  };

  for (const [key, aliasList] of Object.entries(aliases)) {
    const filterMatches = aliasList.some((a) => f.includes(a)) || f.includes(key);
    const cityMatches = aliasList.some((a) => c.includes(a)) || c.includes(key);
    if (filterMatches && cityMatches) {
      return true;
    }
  }

  return false;
};

/**
 * Normalizes various date string representations (e.g., 'YYYY-MM-DD', 'DD Mon YYYY', 'DD-MM-YYYY', ISO)
 * into a standard 'YYYY-MM-DD' format for accurate chronological string comparison.
 */
export const normalizeDateToYMD = (dateStr?: string | null): string | null => {
  if (!dateStr || !dateStr.trim()) return null;
  const str = dateStr.trim();

  // 1. YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const y = ymdMatch[1];
    const m = ymdMatch[2].padStart(2, '0');
    const d = ymdMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // 2. DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${y}-${m}-${d}`;
  }

  // 3. Textual month names (e.g. "30 Aug 2026", "18 Sep 2026", "August 30, 2026")
  const monthMap: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };
  const lower = str.toLowerCase();
  for (const [mName, mNum] of Object.entries(monthMap)) {
    if (lower.includes(mName)) {
      const yearMatch = str.match(/\b(20\d\d)\b/);
      if (yearMatch) {
        const y = yearMatch[1];
        const dayMatch = str.replace(yearMatch[1], '').match(/\b([0-2]?[1-9]|[1-3]0|31)\b/);
        const d = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
        return `${y}-${mNum}-${d}`;
      }
    }
  }

  // 4. Standard Date parsing fallback
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return str;
};

/**
 * Exports assigned employee duty details to a real, styled .xlsx file
 * with dark colored highlighted main headings, custom column widths, and proper cell types.
 *
 * EXACT 10 COLUMNS REQUIRED:
 * 1. City
 * 2. Date
 * 3. Center name
 * 4. Exam type
 * 5. Exam name
 * 6. Shift
 * 7. Role
 * 8. Resource id
 * 9. Phone number
 * 10. Email id
 */
export const exportDutiesToExcel = (
  duties: DutyItem[],
  employees: EmployeeItem[],
  filters: ExportFilters = {}
): { count: number; filename: string } => {
  // Map of employees for complete demographic data
  const empMap = new Map<string, EmployeeItem>();
  if (Array.isArray(employees)) {
    employees.forEach((e) => {
      if (e.resourceId) empMap.set(e.resourceId.toLowerCase().trim(), e);
      if (e.id) empMap.set(e.id.toLowerCase().trim(), e);
    });
  }

  // Filter duties according to Date, From Date, To Date, and Work Place
  const filteredDuties = duties.filter((d) => {
    // 1. Work place filter
    const resId = d.employee?.resourceId || (d as any).employeeResourceId || (d as any).resourceId || '';
    const fullEmp =
      empMap.get(resId.toLowerCase().trim()) ||
      empMap.get((d.employeeId || '').toLowerCase().trim());

    const dutyCity =
      d.city?.name ||
      (d as any).cityName ||
      fullEmp?.city ||
      d.employee?.city ||
      (d.center?.address ? d.center.address.split(',').pop()?.trim() : '') ||
      '';

    const dutyCenter = d.center?.centerName || (d as any).centerName || '';

    const matchesCity =
      matchesWorkPlace(dutyCity, filters.workPlace || 'All Places') ||
      matchesWorkPlace(dutyCenter, filters.workPlace || 'All Places') ||
      matchesWorkPlace(d.center?.address, filters.workPlace || 'All Places');

    if (!matchesCity) {
      return false;
    }

    // 2. Date filters (normalized to YYYY-MM-DD for accurate comparison)
    const dutyYMD = normalizeDateToYMD(d.dutyDate);

    // Exact Date filter
    if (filters.date && filters.date.trim()) {
      const targetYMD = normalizeDateToYMD(filters.date);
      const isDateEqual =
        (targetYMD && dutyYMD && dutyYMD === targetYMD) ||
        d.dutyDate === filters.date ||
        d.dutyDate.includes(filters.date.trim());

      if (!isDateEqual) {
        return false;
      }
    }

    // From Date filter
    if (filters.fromDate && filters.fromDate.trim()) {
      const fromYMD = normalizeDateToYMD(filters.fromDate);
      if (fromYMD && dutyYMD && dutyYMD < fromYMD) return false;
    }

    // To Date filter
    if (filters.toDate && filters.toDate.trim()) {
      const toYMD = normalizeDateToYMD(filters.toDate);
      if (toYMD && dutyYMD && dutyYMD > toYMD) return false;
    }

    return true;
  });

  // If 0 duties match the specific filter, DO NOT download an empty file with only headings!
  if (filteredDuties.length === 0) {
    return { count: 0, filename: '' };
  }

  // EXACT REQUIRED 10 COLUMNS:
  const headers = [
    'City',
    'Date',
    'Center name',
    'Exam type',
    'Exam name',
    'Shift',
    'Role',
    'Resource id',
    'Phone number',
    'Email id',
  ];

  const rows: (string | number)[][] = [headers];

  filteredDuties.forEach((d) => {
    const resId = d.employee?.resourceId || (d as any).employeeResourceId || (d as any).resourceId || '';
    const fullEmp =
      empMap.get(resId.toLowerCase().trim()) ||
      empMap.get((d.employeeId || '').toLowerCase().trim());

    // 1. City
    const cityStr = String(
      d.city?.name ||
      (d as any).cityName ||
      fullEmp?.city ||
      d.employee?.city ||
      (d.center?.address ? d.center.address.split(',').pop()?.trim() : '') ||
      'Mysore'
    );

    // 2. Date
    const dateStr = String(d.dutyDate || '—');

    // 3. Center name
    const centerStr = String(d.center?.centerName || (d as any).centerName || '—');

    // 4. Exam type
    const typeStr = String(d.dutyType || d.exam?.type || (d as any).examType || 'Exam');

    // 5. Exam name
    const examStr = String(d.exam?.name || (d as any).examName || '—');

    // 6. Shift
    const shiftStr = String(d.shift?.name || (d as any).shiftName || 'Shift 1');

    // 7. Role
    const roleStr = String(d.role?.name || (d as any).roleName || d.role?.code || '—');

    // 8. Resource id
    const resourceIdStr = String(resId || '—');

    // 9. Phone number
    const phoneStr = String(d.employee?.mobile || fullEmp?.mobile || (d as any).employeeMobile || (d as any).empMobile || '—');

    // 10. Email id
    const emailStr = String(
      d.employee?.email ||
      fullEmp?.email ||
      (d as any).employeeEmail ||
      (d as any).empEmail ||
      (resId ? `${resId.toLowerCase()}@examduty.gov.in` : '—')
    );

    rows.push([
      cityStr,
      dateStr,
      centerStr,
      typeStr,
      examStr,
      shiftStr,
      roleStr,
      resourceIdStr,
      phoneStr,
      emailStr,
    ]);
  });

  // Create worksheet from Array of Arrays
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set generous column widths matching the exact 10 columns
  ws['!cols'] = [
    { wch: 22 }, // 1. City
    { wch: 16 }, // 2. Date
    { wch: 38 }, // 3. Center name
    { wch: 14 }, // 4. Exam type
    { wch: 26 }, // 5. Exam name
    { wch: 14 }, // 6. Shift
    { wch: 24 }, // 7. Role
    { wch: 16 }, // 8. Resource id
    { wch: 18 }, // 9. Phone number (prevents scientific notation 8.05E+09)
    { wch: 32 }, // 10. Email id
  ];

  // Set header row height
  ws['!rows'] = [{ hpt: 28 }];

  // DARK COLOR HIGHLIGHT FOR MAIN HEADING
  // Deep Royal Navy Blue (#1E3A8A) with bold white text (#FFFFFF)
  const headerStyle = {
    fill: {
      patternType: 'solid',
      fgColor: { rgb: '1E3A8A' },
    },
    font: {
      name: 'Calibri',
      sz: 11,
      bold: true,
      color: { rgb: 'FFFFFF' },
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center',
      wrapText: false,
    },
    border: {
      top: { style: 'thin', color: { rgb: '0F172A' } },
      bottom: { style: 'medium', color: { rgb: '0F172A' } },
      left: { style: 'thin', color: { rgb: '3B82F6' } },
      right: { style: 'thin', color: { rgb: '3B82F6' } },
    },
  };

  const baseDataStyle = {
    font: {
      name: 'Calibri',
      sz: 10,
      color: { rgb: '1E293B' },
    },
    alignment: {
      vertical: 'center',
      horizontal: 'left',
    },
    border: {
      top: { style: 'thin', color: { rgb: 'E2E8F0' } },
      bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
      left: { style: 'thin', color: { rgb: 'E2E8F0' } },
      right: { style: 'thin', color: { rgb: 'E2E8F0' } },
    },
  };

  const centerDataStyle = {
    ...baseDataStyle,
    alignment: {
      vertical: 'center',
      horizontal: 'center',
    },
  };

  // Apply styles across all cells
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:J1');

  // 1. Style Header Row (Row 0)
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const headerRef = XLSX.utils.encode_cell({ r: 0, c: C });
    if (ws[headerRef]) {
      ws[headerRef].s = headerStyle;
    }
  }

  // 2. Style Data Rows (Row 1 onwards)
  // Center columns: Date (1), Exam Type (3), Shift (5), Resource ID (7)
  const centerCols = [1, 3, 5, 7];
  // Force text string format on Date, Resource ID, Phone Number to prevent scientific notation
  const textCols = [1, 7, 8];

  for (let R = 1; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellRef];
      if (cell && cell.v !== undefined && cell.v !== null) {
        if (textCols.includes(C)) {
          cell.t = 's';
          cell.z = '@';
          cell.v = String(cell.v);
        }

        if (centerCols.includes(C)) {
          cell.s = centerDataStyle;
        } else {
          cell.s = baseDataStyle;
        }
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Assigned Jobs');

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `TrackClock_Employee_Assigned_Jobs_${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);

  return { count: rows.length - 1, filename };
};

/**
 * Exports workforce employee details to a real, styled .xlsx file
 */
export const exportEmployeesToExcel = (
  employees: EmployeeItem[],
  workPlace: string = 'All Places'
): { count: number; filename: string } => {
  const filteredEmployees = employees.filter((emp) => {
    if (!workPlace || workPlace === 'All Places' || workPlace === 'ALL') return true;
    return matchesWorkPlace(emp.city, workPlace);
  });

  if (filteredEmployees.length === 0) {
    return { count: 0, filename: '' };
  }

  const headers = [
    'SL NO',
    'RESOURCE ID',
    'FULL NAME',
    'CONTACT NUMBER',
    'EMAIL ADDRESS',
    'CITY',
    'AADHAAR NUMBER',
    'PAN NUMBER',
    'ROLE',
    'STATUS',
  ];

  const rows: (string | number)[][] = [headers];

  filteredEmployees.forEach((emp, idx) => {
    rows.push([
      idx + 1,
      String(emp.resourceId || '—'),
      String(emp.name || '—'),
      String(emp.mobile || '—'),
      String(emp.email || '—'),
      String(emp.city || 'Mysore'),
      String(emp.aadhaarNumber || '—'),
      String(emp.panNumber || '—'),
      String(emp.role || 'Staff'),
      String(emp.status || 'Active'),
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 8 },  // 1. SL NO
    { wch: 16 }, // 2. RESOURCE ID
    { wch: 24 }, // 3. FULL NAME
    { wch: 18 }, // 4. CONTACT NUMBER
    { wch: 28 }, // 5. EMAIL ADDRESS
    { wch: 18 }, // 6. CITY
    { wch: 20 }, // 7. AADHAAR NUMBER
    { wch: 16 }, // 8. PAN NUMBER
    { wch: 18 }, // 9. ROLE
    { wch: 14 }, // 10. STATUS
  ];

  ws['!rows'] = [{ hpt: 28 }];

  const headerStyle = {
    fill: {
      patternType: 'solid',
      fgColor: { rgb: '1E3A8A' },
    },
    font: {
      name: 'Calibri',
      sz: 11,
      bold: true,
      color: { rgb: 'FFFFFF' },
    },
    alignment: {
      vertical: 'center',
      horizontal: 'center',
    },
    border: {
      top: { style: 'thin', color: { rgb: '0F172A' } },
      bottom: { style: 'medium', color: { rgb: '0F172A' } },
      left: { style: 'thin', color: { rgb: '3B82F6' } },
      right: { style: 'thin', color: { rgb: '3B82F6' } },
    },
  };

  const baseDataStyle = {
    font: {
      name: 'Calibri',
      sz: 10,
      color: { rgb: '1E293B' },
    },
    alignment: {
      vertical: 'center',
      horizontal: 'left',
    },
    border: {
      top: { style: 'thin', color: { rgb: 'E2E8F0' } },
      bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
      left: { style: 'thin', color: { rgb: 'E2E8F0' } },
      right: { style: 'thin', color: { rgb: 'E2E8F0' } },
    },
  };

  const centerDataStyle = {
    ...baseDataStyle,
    alignment: {
      vertical: 'center',
      horizontal: 'center',
    },
  };

  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:J1');

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const headerRef = XLSX.utils.encode_cell({ r: 0, c: C });
    if (ws[headerRef]) {
      ws[headerRef].s = headerStyle;
    }
  }

  const centerCols = [0, 1, 9];
  const textCols = [1, 3, 6, 7];

  for (let R = 1; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellRef];
      if (cell && cell.v !== undefined && cell.v !== null) {
        if (textCols.includes(C)) {
          cell.t = 's';
          cell.z = '@';
          cell.v = String(cell.v);
        }

        if (centerCols.includes(C)) {
          cell.s = centerDataStyle;
        } else {
          cell.s = baseDataStyle;
        }
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Workforce');

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `TrackClock_Workforce_Employees_${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);

  return { count: rows.length - 1, filename };
};
