const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const plpIdx = html.indexOf('class="filters"');
if (plpIdx !== -1) {
  console.log('=== COLLECTION VIEW TEMPLATE ===');
  console.log(html.slice(plpIdx - 500, plpIdx + 3000));
}
