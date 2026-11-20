const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const idx = html.indexOf('Help Services');
if (idx !== -1) {
  console.log(html.slice(idx - 400, idx + 1200));
} else {
  const idx2 = html.indexOf('HELP SERVICES');
  console.log('Caps search:', idx2);
  if (idx2 !== -1) {
    console.log(html.slice(idx2 - 400, idx2 + 1200));
  } else {
    console.log('Searching for Serviceable Pincodes...');
    const idx3 = html.indexOf('Serviceable Pincodes');
    if (idx3 !== -1) console.log(html.slice(idx3 - 200, idx3 + 400));
  }
}
