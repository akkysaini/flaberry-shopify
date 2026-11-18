const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const pbIdx = proto.indexOf('function pageBase(');
if (pbIdx !== -1) {
  console.log(proto.slice(pbIdx, pbIdx + 2000));
}
