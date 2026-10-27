const path = require('path');
const xlsx = require('../frontend/node_modules/xlsx');

const filePath = path.join(__dirname, 'city, center name and center code AWIGNA (1).xlsx');
const wb = xlsx.readFile(filePath);

console.log('Sheet Names:', wb.SheetNames);
for (const sheetName of wb.SheetNames) {
  const ws = wb.Sheets[sheetName];
  console.log(`Sheet "${sheetName}" range:`, ws['!ref']);
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });
  console.log('First 5 raw rows:');
  console.log(rows.slice(0, 5));
}
