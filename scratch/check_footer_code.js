const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const fIdx = html.indexOf('$("#footer").innerHTML');
console.log(html.slice(fIdx - 200, fIdx + 2500));
