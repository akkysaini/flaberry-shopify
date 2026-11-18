const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const pdpIdx = html.indexOf('<div class="pdp">');
if (pdpIdx !== -1) {
  console.log('=== PDP TEMPLATE ===');
  console.log(html.slice(pdpIdx - 200, pdpIdx + 4500));
}
