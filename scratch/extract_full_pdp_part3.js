const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const pdpIdx = html.indexOf('<div class="pdp">');
if (pdpIdx !== -1) {
  console.log(html.slice(pdpIdx + 3000, pdpIdx + 6000));
}
