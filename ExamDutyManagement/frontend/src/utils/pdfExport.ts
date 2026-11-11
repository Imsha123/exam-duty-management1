import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DutyItem } from '../services/duty.service';
import { EmployeeItem, Center, Exam, Role, Shift } from '../services/master.service';
import { ExportFilters, matchesWorkPlace, normalizeDateToYMD } from './excelExport';

export interface PDFExportResult {
  count: number;
  filename: string;
}

export interface PDFFilters extends ExportFilters {
  examType?: string;
  centerName?: string;
  examName?: string;
}

export interface PDFExportOptions {
  filters?: PDFFilters;
  teamLeadName?: string;
  centers?: Center[];
  exams?: Exam[];
  roles?: Role[];
  shifts?: Shift[];
}

/**
 * Formats a date string (YYYY-MM-DD or raw) to standard DD/MM/YYYY
 */
const formatDateToDMY = (dateStr?: string | null): string => {
  if (!dateStr || !dateStr.trim()) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  const ymd = normalizeDateToYMD(dateStr);
  if (ymd) {
    const parts = ymd.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return dateStr;
};

/**
 * Extracts month name and year from a date string, e.g. "October 2026"
 */
const getMonthAndYearFromDate = (dateStr?: string | null): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  if (dateStr) {
    const ymd = normalizeDateToYMD(dateStr);
    if (ymd) {
      const parts = ymd.split('-');
      const y = parts[0];
      const mIdx = parseInt(parts[1], 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${monthNames[mIdx]} ${y}`;
      }
    }
  }
  const today = new Date();
  return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
};

/**
 * Exports workforce duties to the official Awign Attendance Sheet PDF format
 * strictly populated with the real task details and employee information entered by the user.
 */
export const exportDutiesToAwignPDF = (
  duties: DutyItem[],
  employees: EmployeeItem[] = [],
  options: PDFExportOptions | PDFFilters = {},
  teamLeadParam?: string
): PDFExportResult => {
  // Normalize options parameter
  let filters: PDFFilters = {};
  let teamLeadName = teamLeadParam;
  let centersList: Center[] = [];
  let examsList: Exam[] = [];
  let rolesList: Role[] = [];
  let shiftsList: Shift[] = [];

  if ('filters' in options || 'teamLeadName' in options || 'centers' in options) {
    const opts = options as PDFExportOptions;
    filters = opts.filters || {};
    teamLeadName = opts.teamLeadName || teamLeadParam;
    centersList = opts.centers || [];
    examsList = opts.exams || [];
    rolesList = opts.roles || [];
    shiftsList = opts.shifts || [];
  } else {
    filters = options as PDFFilters;
  }

  // 1. Build lookup dictionaries for robust data resolution
  const empMap = new Map<string, EmployeeItem>();
  if (Array.isArray(employees)) {
    employees.forEach((e) => {
      if (e.resourceId) empMap.set(e.resourceId.toLowerCase().trim(), e);
      if (e.id) empMap.set(e.id.toLowerCase().trim(), e);
      if (e.name) empMap.set(e.name.toLowerCase().trim(), e);
    });
  }

  const centerMap = new Map<string, Center>();
  if (Array.isArray(centersList)) {
    centersList.forEach((c) => {
      if (c.id) centerMap.set(c.id.toLowerCase().trim(), c);
      if (c.centerName) centerMap.set(c.centerName.toLowerCase().trim(), c);
      if (c.centerCode) centerMap.set(c.centerCode.toLowerCase().trim(), c);
    });
  }

  const examMap = new Map<string, Exam>();
  if (Array.isArray(examsList)) {
    examsList.forEach((x) => {
      if (x.id) examMap.set(x.id.toLowerCase().trim(), x);
      if (x.name) examMap.set(x.name.toLowerCase().trim(), x);
      if (x.code) examMap.set(x.code.toLowerCase().trim(), x);
    });
  }

  const roleMap = new Map<string, Role>();
  if (Array.isArray(rolesList)) {
    rolesList.forEach((r) => {
      if (r.id) roleMap.set(r.id.toLowerCase().trim(), r);
      if (r.name) roleMap.set(r.name.toLowerCase().trim(), r);
      if (r.code) roleMap.set(r.code.toLowerCase().trim(), r);
    });
  }

  const shiftMap = new Map<string, Shift>();
  if (Array.isArray(shiftsList)) {
    shiftsList.forEach((s) => {
      if (s.id) shiftMap.set(s.id.toLowerCase().trim(), s);
      if (s.name) shiftMap.set(s.name.toLowerCase().trim(), s);
    });
  }

  // 2. Filter duties based on selected Date, Work Place, Exam Type, Center Name, Exam Name
  const filteredDuties = (duties || []).filter((d) => {
    // Workplace filter
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

    if (!matchesWorkPlace(dutyCity, filters.workPlace || 'All Places')) {
      return false;
    }

    // Exact Date filter
    const dutyYMD = normalizeDateToYMD(d.dutyDate);
    if (filters.date) {
      const targetYMD = normalizeDateToYMD(filters.date);
      if (targetYMD && dutyYMD !== targetYMD) return false;
    }

    // Exam Type filter (Exam / Mock)
    if (filters.examType && filters.examType !== 'All' && filters.examType !== 'All Types') {
      const dType = (d.dutyType || d.exam?.type || '').toLowerCase();
      if (dType !== filters.examType.toLowerCase()) return false;
    }

    // Center Name filter
    if (filters.centerName && filters.centerName !== 'All' && filters.centerName !== 'All Centers') {
      const centerObj = d.centerId ? centerMap.get(d.centerId.toLowerCase().trim()) : null;
      const dCenter = (d.center?.centerName || centerObj?.centerName || (d as any).centerName || '').toLowerCase().trim();
      const targetCenter = filters.centerName.toLowerCase().trim();
      if (!dCenter.includes(targetCenter) && !targetCenter.includes(dCenter)) return false;
    }

    // Exam Name filter
    if (filters.examName && filters.examName !== 'All' && filters.examName !== 'All Exams') {
      const examObj = d.examId ? examMap.get(d.examId.toLowerCase().trim()) : null;
      const dExam = (d.exam?.name || examObj?.name || (d as any).examName || '').toLowerCase().trim();
      const targetExam = filters.examName.toLowerCase().trim();
      if (!dExam.includes(targetExam) && !targetExam.includes(dExam)) return false;
    }

    return true;
  });

  // Guard: if zero matching records, return count 0 without downloading blank file
  if (filteredDuties.length === 0) {
    return { count: 0, filename: '' };
  }

  // 3. Resolve Header Meta Information from the real duties & filters
  const firstDuty = filteredDuties[0];
  const firstCenterObj = firstDuty.centerId ? centerMap.get(firstDuty.centerId.toLowerCase().trim()) : null;
  const firstExamObj = firstDuty.examId ? examMap.get(firstDuty.examId.toLowerCase().trim()) : null;

  const realDutyDate = firstDuty.dutyDate || filters.date || '';
  const examDateStr = formatDateToDMY(realDutyDate);
  const examMonthStr = getMonthAndYearFromDate(realDutyDate);

  const testCenterName =
    (filters.centerName && filters.centerName !== 'All' && filters.centerName !== 'All Centers')
      ? filters.centerName
      : (firstDuty.center?.centerName ||
         firstCenterObj?.centerName ||
         (firstDuty as any).centerName ||
         (firstDuty.city?.name ? `${firstDuty.city.name} Center` : (filters.workPlace && filters.workPlace !== 'All Places' ? `${filters.workPlace} Center` : 'Examination Center')));

  const testCenterCode =
    firstDuty.center?.centerCode ||
    firstCenterObj?.centerCode ||
    (firstDuty as any).centerCode ||
    '—';

  const realExamName =
    (filters.examName && filters.examName !== 'All' && filters.examName !== 'All Exams')
      ? filters.examName
      : (firstDuty.exam?.name ||
         firstExamObj?.name ||
         (firstDuty as any).examName ||
         firstDuty.dutyType ||
         'Examination');

  // Determine actual exam/mock type
  let hasExam = false;
  let hasMock = false;
  if (filters.examType && filters.examType.toLowerCase() === 'mock') {
    hasMock = true;
  } else if (filters.examType && filters.examType.toLowerCase() === 'exam') {
    hasExam = true;
  } else {
    filteredDuties.forEach((d) => {
      const t = (d.dutyType || d.exam?.type || '').toLowerCase();
      if (t.includes('mock')) hasMock = true;
      else hasExam = true;
    });
  }

  const tickExam = hasExam && !hasMock ? '✓' : '  ';
  const tickMock = hasMock && !hasExam ? '✓' : '  ';
  const tickBoth = hasExam && hasMock ? '✓' : '  ';

  // 4. Initialize Landscape A4 Document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const startX = 10;
  let currentY = 10;
  const pageWidth = 277; // 297mm - 20mm margins

  // Header Title Bar
  doc.setFillColor(30, 41, 59); // dark slate (#1E293B)
  doc.rect(startX, currentY, pageWidth, 7.5, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.25);
  doc.rect(startX, currentY, pageWidth, 7.5, 'S');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(
    'Awign Attendance Sheet for EXAM on the Day For INVIGILATOR (INV) / MT / OE / LS / RM / SS / MTS (Daily Tracker)',
    148.5,
    currentY + 5.1,
    { align: 'center' }
  );
  currentY += 7.5;

  // Header Meta Table
  autoTable(doc, {
    startY: currentY,
    margin: { left: startX, right: 10 },
    tableWidth: pageWidth,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 1.6,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      textColor: [0, 0, 0],
      valign: 'middle',
    },
    head: [
      [
        {
          content: 'Exam Type (Tick Mark)',
          styles: { fontStyle: 'bold', halign: 'center', cellWidth: 50, fillColor: [241, 245, 249] },
        },
        {
          content: `Exam Only [ ${tickExam} ]      Mock Only [ ${tickMock} ]      Exam + Mock [ ${tickBoth} ]      Non-biometric Activity [   ]      Scribe [   ]`,
          colSpan: 4,
          styles: { fontStyle: 'bold', halign: 'center', fillColor: [255, 255, 255] },
        },
      ],
      [
        { content: 'Exam Month', styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
        { content: 'Date', styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
        { content: 'Test Center Name', styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
        { content: 'Test Center Code', styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
        { content: 'Exam Name', styles: { fontStyle: 'bold', halign: 'center', fillColor: [241, 245, 249] } },
      ],
    ],
    body: [
      [
        { content: examMonthStr, styles: { halign: 'center' } },
        { content: examDateStr, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: testCenterName, styles: { halign: 'center' } },
        { content: String(testCenterCode), styles: { halign: 'center', fontStyle: 'bold' } },
        { content: realExamName, styles: { halign: 'center', fontStyle: 'bold' } },
      ],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY;

  // 5. Build Main Duty Table Data using actual employee & duty assignment details
  const rows: (string | number)[][] = [];
  const roleCountMap = new Map<string, number>();

  filteredDuties.forEach((d, idx) => {
    // Resolve employee
    const rawEmp = d.employee;
    const resId = (rawEmp?.resourceId || (d as any).employeeResourceId || (d as any).resourceId || d.employeeId || '').trim();
    const fullEmp =
      empMap.get(resId.toLowerCase()) ||
      (rawEmp?.id ? empMap.get(rawEmp.id.toLowerCase()) : null) ||
      (d.employeeId ? empMap.get(d.employeeId.toLowerCase()) : null) ||
      (rawEmp?.name ? empMap.get(rawEmp.name.toLowerCase().trim()) : null);

    const empName = String(rawEmp?.name || fullEmp?.name || (d as any).empName || 'Staff Member');
    const empPhone = String(fullEmp?.mobile || rawEmp?.mobile || (d as any).empMobile || '—');
    const empEmail = String(fullEmp?.email || rawEmp?.email || (d as any).empEmail || '—');
    const empResId = String(resId || fullEmp?.resourceId || rawEmp?.resourceId || '—');

    // Resolve role
    const rawRole = d.role;
    const roleId = d.roleId || rawRole?.id;
    const resolvedRole = roleId ? roleMap.get(roleId.toLowerCase().trim()) : null;
    const roleName = String(
      rawRole?.name ||
      resolvedRole?.name ||
      rawRole?.code ||
      resolvedRole?.code ||
      (d as any).roleName ||
      'Invigilator'
    );

    // Track actual role counts for summary
    const roleKey = roleName.toUpperCase().trim();
    roleCountMap.set(roleKey, (roleCountMap.get(roleKey) || 0) + 1);

    // Resolve Shift & Times
    const rawShift = d.shift;
    const shiftId = d.shiftId || rawShift?.id;
    const resolvedShift = shiftId ? shiftMap.get(shiftId.toLowerCase().trim()) : null;

    const loginTime = String(
      d.reportingTime ||
      rawShift?.defaultReportingTime ||
      resolvedShift?.defaultReportingTime ||
      '07:30 AM'
    );

    const logoutTime = String(
      d.shiftEndTime ||
      rawShift?.defaultEndTime ||
      resolvedShift?.defaultEndTime ||
      '01:30 PM'
    );

    rows.push([
      idx + 1,
      empName,
      empPhone,
      empEmail,
      roleName,
      empResId,
      loginTime,
      '', // Time In signature space
      logoutTime,
      '', // Time Out signature space
      '1', // Total Shifts
      'YES', // Has The Role
      '—', // Remarks
    ]);
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: startX, right: 10 },
    tableWidth: pageWidth,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.2,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      textColor: [0, 0, 0],
      valign: 'middle',
    },
    headStyles: {
      fontStyle: 'bold',
      fillColor: [248, 250, 252],
      halign: 'center',
      textColor: [15, 23, 42],
    },
    head: [[
      'Sr. No.',
      'Name',
      'Phone',
      'Email ID',
      'Role',
      'Resource ID',
      'Login Time',
      'Time In',
      'Logout Time',
      'Time Out',
      'Total Shifts',
      'Has The Role',
      'Remarks /',
    ]],
    body: rows,
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' }, // Sr. No.
      1: { cellWidth: 32, fontStyle: 'bold' }, // Name
      2: { cellWidth: 23, halign: 'center' }, // Phone
      3: { cellWidth: 42 },                   // Email ID
      4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' }, // Role
      5: { cellWidth: 20, halign: 'center' }, // Resource ID
      6: { cellWidth: 16, halign: 'center' }, // Login Time
      7: { cellWidth: 22, halign: 'center' }, // Time In signature
      8: { cellWidth: 18, halign: 'center' }, // Logout Time
      9: { cellWidth: 22, halign: 'center' }, // Time Out signature
      10: { cellWidth: 16, halign: 'center' }, // Total Shifts
      11: { cellWidth: 18, halign: 'center' }, // Has The Role
      12: { cellWidth: 16, halign: 'center' }, // Remarks
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 1;

  // Add new page if remaining vertical height cannot fit summary blocks
  const requiredBottomHeight = 36;
  if (currentY + requiredBottomHeight > 200) {
    doc.addPage();
    currentY = 12;
  }

  // 6. Bottom Section: Left Summary Table, Center TCS Details, Right Awign Details
  const botCol1Width = 74;
  const botCol2Width = 100;
  const botCol3Width = 103;

  // Build Summary Table dynamically from real data
  const totalCount = filteredDuties.length;
  const summaryBody: (string | { content: string; styles: any })[][] = [
    ['Total Requirement Count', { content: String(totalCount), styles: { halign: 'center', fontStyle: 'bold' } }],
    ['Total Present Count', { content: String(totalCount), styles: { halign: 'center', fontStyle: 'bold' } }],
  ];

  // List each actual role assigned with its real count
  roleCountMap.forEach((count, rName) => {
    summaryBody.push([
      rName,
      { content: String(count), styles: { halign: 'center', fontStyle: 'bold' } },
    ]);
  });

  summaryBody.push(['NO OF ABSENTIES', { content: '0', styles: { halign: 'center' } }]);
  summaryBody.push(['Backup Count', { content: '0', styles: { halign: 'center' } }]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: startX },
    tableWidth: botCol1Width,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 1.3,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      textColor: [0, 0, 0],
      valign: 'middle',
    },
    head: [[
      { content: 'Category', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], halign: 'center' } },
      { content: 'Count', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], halign: 'center' } },
    ]],
    body: summaryBody,
  });

  const summaryFinalY = (doc as any).lastAutoTable.finalY;
  const bottomHeight = Math.max(summaryFinalY - currentY, 32);

  // Center: TCS Details Box
  const centerStartX = startX + botCol1Width;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(centerStartX, currentY, botCol2Width, bottomHeight);

  // TCS Header
  doc.setFillColor(241, 245, 249);
  doc.rect(centerStartX, currentY, botCol2Width, 5.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('TCS Details', centerStartX + botCol2Width / 2, currentY + 3.8, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('TCS Center In-Charge Name:', centerStartX + 3, currentY + 9.5);
  doc.line(centerStartX + 45, currentY + 10, centerStartX + botCol2Width - 3, currentY + 10);

  doc.text('TCS Center In-Charge:', centerStartX + 3, currentY + 14.5);
  doc.line(centerStartX + 38, currentY + 15, centerStartX + botCol2Width - 3, currentY + 15);

  doc.text('Date of Signature:', centerStartX + 3, currentY + 19.5);
  doc.line(centerStartX + 30, currentY + 20, centerStartX + botCol2Width - 3, currentY + 20);

  // TCS Test Center Stamp Area
  doc.rect(centerStartX + 4, currentY + 22, botCol2Width - 8, bottomHeight - 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TCS Test Center Stamp', centerStartX + botCol2Width / 2, currentY + 22 + (bottomHeight - 24) / 2 + 1, {
    align: 'center',
  });

  // Right: Awign Details Box
  const rightStartX = centerStartX + botCol2Width;
  doc.setDrawColor(0, 0, 0);
  doc.rect(rightStartX, currentY, botCol3Width, bottomHeight);

  // Awign Header
  doc.setFillColor(241, 245, 249);
  doc.rect(rightStartX, currentY, botCol3Width, 5.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Awign Details', rightStartX + botCol3Width / 2, currentY + 3.8, { align: 'center' });

  // Use the real logged-in user / admin name
  const leadNameDisplay = (teamLeadName && teamLeadName.trim())
    ? teamLeadName.trim().toUpperCase()
    : 'ADMINISTRATOR';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Awign Team Lead Name:', rightStartX + 3, currentY + 9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138); // blue
  doc.text(leadNameDisplay, rightStartX + 42, currentY + 9.5);
  doc.line(rightStartX + 40, currentY + 10, rightStartX + botCol3Width - 3, currentY + 10);

  doc.setTextColor(0, 0, 0);
  doc.text('Awign Team Lead Signature:', rightStartX + 3, currentY + 14.5);
  doc.line(rightStartX + 46, currentY + 15, rightStartX + botCol3Width - 3, currentY + 15);

  doc.text('Date of Signature:', rightStartX + 3, currentY + 19.5);
  doc.line(rightStartX + 30, currentY + 20, rightStartX + botCol3Width - 3, currentY + 20);

  // Remarks / Role-Wise Absentees Box
  doc.rect(rightStartX + 4, currentY + 22, botCol3Width - 8, bottomHeight - 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('Remarks / Role-Wise Absentees:', rightStartX + 6, currentY + 26);
  doc.setFont('helvetica', 'normal');
  doc.text('NIL', rightStartX + botCol3Width / 2, currentY + 22 + (bottomHeight - 24) / 2 + 2, {
    align: 'center',
  });

  // Generate clean filename with actual date and place
  const dateFormatted = filters.date ? filters.date.replace(/[/\\:]/g, '-') : new Date().toISOString().slice(0, 10);
  const placeFormatted = filters.workPlace && filters.workPlace !== 'All Places' ? filters.workPlace.replace(/[^a-zA-Z0-9]/g, '_') : 'All';
  const filename = `Awign_Attendance_Sheet_${placeFormatted}_${dateFormatted}.pdf`;

  // Output blob and open in new tab for instant view + trigger download
  try {
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
  } catch (e) {
    console.warn('Could not open PDF in new tab automatically', e);
  }

  // Trigger file download
  doc.save(filename);

  return { count: filteredDuties.length, filename };
};
