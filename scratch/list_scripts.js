const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const scripts = [];
let idx = 0;
while ((idx = proto.indexOf('<script', idx)) !== -1) {
  const closeTag = proto.indexOf('>', idx);
  const endTag = proto.indexOf('</script>', closeTag);
  if (endTag === -1) break;
  const content = proto.slice(closeTag + 1, endTag);
  scripts.push({
    index: scripts.length,
    start: idx,
    length: content.length,
    snippet: content.slice(0, 100).replace(/\r?\n/g, ' ')
  });
  idx = endTag + 9;
}

console.log('Total scripts found:', scripts.length);
scripts.forEach(s => console.log(`[${s.index}] len: ${s.length} | ${s.snippet}`));
