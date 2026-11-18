const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const fMatch = proto.match(/const FOOTER\s*=\s*(\[[\s\S]*?\]);/);
if (fMatch) {
  console.log('--- FOOTER ARRAY ---');
  console.log(fMatch[1]);
}
