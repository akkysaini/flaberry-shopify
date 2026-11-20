const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const idx = html.indexOf('const FOOTER=');
console.log(html.slice(idx, idx + 2500));
