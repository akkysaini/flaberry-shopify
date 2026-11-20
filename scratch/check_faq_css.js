const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const idx = html.indexOf('.faq{');
console.log(html.slice(idx - 200, idx + 1000));
