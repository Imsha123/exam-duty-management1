const fs = require('fs');
const path = require('path');
const xlsx = require('../frontend/node_modules/xlsx');

const filePath = path.join(__dirname, 'city, center name and center code AWIGNA (1).xlsx');
const wb = xlsx.readFile(filePath);
const sheet = wb.Sheets['Sheet2'];
const data = xlsx.utils.sheet_to_json(sheet);

console.log('Total raw rows:', data.length);

const citySet = new Set();
const centerList = [];

// Helper to clean city names
function formatCityName(raw) {
  let c = (raw || '').trim();
  // Normalize double spaces
  c = c.replace(/\s+/g, ' ');
  return c;
}

data.forEach((row, idx) => {
  const cityRaw = formatCityName(row['Test Center City']);
  const codeRaw = String(row['Test Center Code'] || '').trim();
  const nameRaw = (row['Test Center Name'] || '').trim().replace(/\s+/g, ' ');

  if (cityRaw) {
    citySet.add(cityRaw);
  }
  if (codeRaw && nameRaw) {
    centerList.push({
      city: cityRaw,
      centerCode: codeRaw,
      centerName: nameRaw
    });
  }
});

const sortedCities = Array.from(citySet).sort();
console.log('Unique Cities count:', sortedCities.length);
console.log('Cities:', sortedCities);
console.log('Total centers count:', centerList.length);

// Check if any duplicate center codes
const codeMap = new Map();
centerList.forEach((c, i) => {
  if (codeMap.has(c.centerCode)) {
    console.log(`Duplicate code: ${c.centerCode} - 1: ${codeMap.get(c.centerCode).centerName} | 2: ${c.centerName}`);
  } else {
    codeMap.set(c.centerCode, c);
  }
});

fs.writeFileSync(
  path.join(__dirname, 'extracted_master_data.json'),
  JSON.stringify({ cities: sortedCities, centers: centerList }, null, 2),
  'utf8'
);
console.log('Saved extracted_master_data.json successfully');
