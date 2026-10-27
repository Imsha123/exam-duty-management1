const fs = require('fs');
const path = require('path');
const data = require('./extracted_master_data.json');

const cities = data.cities;
const centers = data.centers;

console.log(`Processing ${cities.length} cities and ${centers.length} centers...`);

// 1. Generate Backend TS file: backend/src/modules/seed/master-dataset.ts
const backendCenters = centers.map((c) => ({
  city: c.city,
  centerCode: c.centerCode,
  centerName: c.centerName,
  address: c.centerName + ', ' + c.city,
}));

const backendContent = `/**
 * Master dataset seeded from:
 * "city, center name and center code AWIGNA (1).xlsx"
 * 25 Cities, 113 Exam Centers
 */

export interface SeedCity {
  name: string;
  state: string;
}

export interface SeedCenter {
  city: string;
  centerCode: string;
  centerName: string;
  address?: string;
}

export const MASTER_CITIES: SeedCity[] = ${JSON.stringify(
  cities.map((c) => ({ name: c, state: 'Karnataka' })),
  null,
  2
)};

export const MASTER_CENTERS: SeedCenter[] = ${JSON.stringify(
  backendCenters,
  null,
  2
)};
`;

fs.writeFileSync(
  path.join(__dirname, '../backend/src/modules/seed/master-dataset.ts'),
  backendContent,
  'utf8'
);
console.log('Generated backend/src/modules/seed/master-dataset.ts');

// 2. Generate Frontend TS file: frontend/src/data/masterData.ts
const frontendCenters = centers.map((c) => {
  const citySlug = 'city-' + c.city.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return {
    id: 'center-' + c.centerCode.toLowerCase(),
    centerCode: c.centerCode,
    centerName: c.centerName,
    cityId: citySlug,
    address: c.centerName + ', ' + c.city,
  };
});

const frontendContent = `/**
 * Master dataset extracted from:
 * "city, center name and center code AWIGNA (1).xlsx"
 * 25 Cities, 113 Centers
 */

export interface MasterCityData {
  id: string;
  name: string;
  state?: string;
}

export interface MasterCenterData {
  id: string;
  centerCode: string;
  centerName: string;
  cityId: string;
  address?: string;
}

export interface MasterExamData {
  id: string;
  name: string;
  code?: string;
  type?: 'Exam' | 'Mock';
}

export const INITIAL_CITIES: MasterCityData[] = ${JSON.stringify(
  cities.map((c) => ({
    id: 'city-' + c.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: c,
    state: 'Karnataka',
  })),
  null,
  2
)};

export const INITIAL_CENTERS: MasterCenterData[] = ${JSON.stringify(
  frontendCenters,
  null,
  2
)};

export const INITIAL_EXAMS: MasterExamData[] = [
  { id: 'exam-neet', name: 'NEET', code: 'NEET', type: 'Exam' },
  { id: 'exam-jee-main', name: 'JEE Main', code: 'JEE', type: 'Exam' },
  { id: 'exam-jee-session-2', name: 'JEE Main 2026 Session 2', code: 'JEE-M-S2', type: 'Exam' },
  { id: 'exam-ugc-net', name: 'UGC NET', code: 'NET', type: 'Exam' },
  { id: 'exam-tcs', name: 'TCS', code: 'TCS', type: 'Exam' },
  { id: 'exam-ibps-po-mains', name: 'IBPS PO Mains 2026', code: 'IBPS-PO-M', type: 'Exam' },
  { id: 'exam-ssc-cgl', name: 'SSC CGL Tier 1 2026', code: 'SSC-CGL-26', type: 'Exam' },
  { id: 'exam-rrb-ntpc', name: 'RRB NTPC Phase 1', code: 'RRB-NTPC-01', type: 'Exam' },
  { id: 'exam-upsc-nda', name: 'UPSC NDA 2026', code: 'UPSC-NDA', type: 'Exam' },
  { id: 'exam-aiims-mock', name: 'AIIMS Mock', code: 'AIIMS', type: 'Mock' },
  { id: 'exam-gate-mock', name: 'GATE Mock', code: 'GATE', type: 'Mock' },
  { id: 'exam-mock-drill-2026', name: 'Mock Drill 2026', code: 'MOCK-DR-26', type: 'Mock' },
  { id: 'exam-national-mock-2026', name: 'National Mock Exam 2026', code: 'NAT-MOCK', type: 'Mock' },
];
`;

const frontendDataDir = path.join(__dirname, '../frontend/src/data');
if (!fs.existsSync(frontendDataDir)) {
  fs.mkdirSync(frontendDataDir, { recursive: true });
}
fs.writeFileSync(
  path.join(frontendDataDir, 'masterData.ts'),
  frontendContent,
  'utf8'
);
console.log('Generated frontend/src/data/masterData.ts');

// 3. Generate SQL statements
let sql = `-- =================================================================================\n`;
sql += `-- Master data for 25 Cities and 113 Centers from Excel\n`;
sql += `-- =================================================================================\n\n`;
sql += `-- 1. Seed 25 Cities\n`;
cities.forEach((c) => {
  const safeName = c.replace(/'/g, "''");
  sql += `IF NOT EXISTS (SELECT 1 FROM dbo.cities WHERE name = '${safeName}')\n`;
  sql += `    INSERT INTO dbo.cities (id, name, state) VALUES (NEWID(), '${safeName}', 'Karnataka');\n`;
});

sql += `\nPRINT '>>> 25 Master Cities seeded.';\nGO\n\n`;

sql += `-- 2. Seed 113 Centers\n`;
centers.forEach((c, idx) => {
  const safeCity = c.city.replace(/'/g, "''");
  const safeCode = c.centerCode.replace(/'/g, "''");
  const safeName = c.centerName.replace(/'/g, "''");
  const safeAddr = (c.centerName + ', ' + c.city).replace(/'/g, "''");
  const varSuffix = c.centerCode.replace(/[^a-zA-Z0-9]/g, '_') + '_' + idx;
  sql += `IF NOT EXISTS (SELECT 1 FROM dbo.centers WHERE centerCode = '${safeCode}')\n`;
  sql += `BEGIN\n`;
  sql += `    DECLARE @cId_${varSuffix} UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM dbo.cities WHERE name = '${safeCity}');\n`;
  sql += `    IF @cId_${varSuffix} IS NULL\n`;
  sql += `        SET @cId_${varSuffix} = (SELECT TOP 1 id FROM dbo.cities);\n`;
  sql += `    INSERT INTO dbo.centers (id, centerCode, centerName, cityId, address)\n`;
  sql += `    VALUES (NEWID(), '${safeCode}', '${safeName}', @cId_${varSuffix}, '${safeAddr}');\n`;
  sql += `END;\n`;
});

sql += `\nPRINT '>>> 113 Master Centers seeded.';\nGO\n`;

fs.writeFileSync(
  path.join(__dirname, 'master_cities_and_centers_insert.sql'),
  sql,
  'utf8'
);
console.log('Generated database_queries/master_cities_and_centers_insert.sql');
