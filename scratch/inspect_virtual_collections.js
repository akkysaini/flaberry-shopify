const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const vMatch = proto.match(/const VIRTUAL\s*=\s*(\{[\s\S]*?\});/);
if (vMatch) {
  console.log('--- VIRTUAL COLLECTIONS ---');
  console.log(vMatch[1]);
}
