const path = require('path');
const xlsx = require('../frontend/node_modules/xlsx');

const filePath = path.join(__dirname, 'city, center name and center code AWIGNA (1).xlsx');
const wb = xlsx.readFile(filePath);

console.log('Sheet Names:', wb.SheetNames);

wb.SheetNames.forEach((sheetName) => {
  const sheet = wb.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  console.log(`\n=== SHEET: ${sheetName} (Rows: ${data.length}) ===`);
  if (data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
    console.log('Sample rows:');
    console.log(JSON.stringify(data.slice(0, 10), null, 2));
  }
});
