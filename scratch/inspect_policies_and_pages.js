const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const polMatch = proto.match(/const POLICIES\s*=\s*(\{[\s\S]*?\});/);
if (polMatch) {
  console.log('--- POLICIES ---');
  console.log(polMatch[1]);
}

const pbIdx = proto.indexOf('function pageBase(');
if (pbIdx !== -1) {
  console.log('--- REST OF PAGEBASE ---');
  console.log(proto.slice(pbIdx + 1200, pbIdx + 3000));
}
