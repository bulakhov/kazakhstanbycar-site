// Pulls tours, cars, availability and drivers from the Apps Script API and writes the site JSON files (run by GitHub Actions).
const fs = require('fs');
const API = process.env.API;
fetch(API + '?data=all', { redirect: 'follow' }).then(r => r.json()).then(j => {
  if (!j || !j.tours || !j.cars || !j.busy) { console.error('bad payload'); process.exit(1); }
  fs.writeFileSync('tours.json', JSON.stringify({ updated: j.updated, tours: j.tours }) + '\n');
  fs.writeFileSync('cars.json', JSON.stringify({ updated: j.updated, cars: j.cars }) + '\n');
  fs.writeFileSync('busy.json', JSON.stringify(j.busy) + '\n');
  fs.writeFileSync('drivers.json', JSON.stringify({ updated: j.updated, drivers: j.drivers || [] }) + '\n');
  console.log('synced', j.tours.length, 'tours,', j.cars.length, 'cars,', (j.busy.busy || []).length, 'busy days');
}).catch(e => { console.error(e); process.exit(1); });
