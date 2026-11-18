const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const prodIdx = proto.indexOf('function product(');
if (prodIdx !== -1) {
  console.log(proto.slice(prodIdx + 4500, prodIdx + 7000));
}
