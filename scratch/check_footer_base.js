const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const idx = html.indexOf('© 2026 Flaberry. All rights');
console.log(html.slice(idx - 100, idx + 1500));
