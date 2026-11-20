const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

let pos = 0;
while((pos = html.indexOf('paywrap', pos)) !== -1) {
  console.log(html.slice(pos - 100, pos + 400));
  console.log('---');
  pos += 7;
}
