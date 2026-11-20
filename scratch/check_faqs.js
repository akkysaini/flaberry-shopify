const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const fIdx = html.indexOf('const FAQS =');
console.log(html.slice(fIdx, fIdx + 2000));
