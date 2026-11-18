const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const rbIdx = proto.indexOf('function routeBase(');
if (rbIdx !== -1) {
  console.log(proto.slice(rbIdx, rbIdx + 1500));
}
