const path = require('path');
const xlsx = require('../frontend/node_modules/xlsx');

const filePath = path.join(__dirname, 'city, center name and center code AWIGNA (1).xlsx');
const wb = xlsx.readFile(filePath);

const sheet = wb.Sheets['Sheet2'];
const data = xlsx.utils.sheet_to_json(sheet);

console.log('Total rows:', data.length);

const cities = new Set();
const centers = [];

data.forEach((row, i) => {
  const city = (row['Test Center City'] || '').trim();
  const code = String(row['Test Center Code'] || '').trim();
  const name = (row['Test Center Name'] || '').trim();
  if (city) cities.add(city);
  if (code && name) centers.push({ city, code, name });
});

console.log('Unique Cities (' + cities.size + '):', Array.from(cities).sort());
console.log('Total Centers with code and name:', centers.length);

// Also check raw cell values in the sheet to see if there is any other column or text
console.log('Sheet !ref:', sheet['!ref']);
