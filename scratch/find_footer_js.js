const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

let pos = 0;
while ((pos = proto.indexOf('$("#footer")', pos)) !== -1) {
  console.log('--- FOUND at', pos, '---');
  console.log(proto.slice(pos - 50, pos + 500));
  pos += 10;
}
