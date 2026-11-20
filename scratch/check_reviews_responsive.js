const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

let pos = 0;
while((pos = html.indexOf('.reviews', pos)) !== -1) {
  console.log(html.slice(Math.max(0, pos - 50), pos + 200));
  console.log('---');
  pos += 8;
}
pos = 0;
while((pos = html.indexOf('.trust', pos)) !== -1) {
  console.log(html.slice(Math.max(0, pos - 50), pos + 200));
  console.log('---');
  pos += 6;
}
