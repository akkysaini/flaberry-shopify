const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const footerIdx = proto.indexOf('footer');
const fIdx = proto.indexOf('id="footer"');
if (fIdx !== -1) {
  console.log(proto.slice(fIdx, fIdx + 2000));
} else {
  // Look for FOOTER or footer rendering
  const matches = proto.match(/<footer[\s\S]*?<\/footer>/);
  if (matches) console.log(matches[0]);
}
