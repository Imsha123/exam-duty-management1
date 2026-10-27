const data = require('./extracted_master_data.json');
const byCity = {};
data.centers.forEach(c => {
  byCity[c.city] = (byCity[c.city] || 0) + 1;
});
console.log('Centers per city:');
console.log(byCity);
