const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const pdpIdx = html.indexOf('function openPDP(');
if (pdpIdx !== -1) {
  console.log('=== openPDP function ===');
  console.log(html.slice(pdpIdx, pdpIdx + 2500));
} else {
  console.log('openPDP not found directly, searching for "class=\\"pdp\\""');
  const pdpClassIdx = html.indexOf('class="pdp"');
  if (pdpClassIdx !== -1) {
    console.log(html.slice(pdpClassIdx - 200, pdpClassIdx + 2000));
  } else {
    // search regex
    const m = html.match(/class=['"][^'"]*pdp[^'"]*['"]/g);
    console.log('PDP classes:', m);
  }
}
