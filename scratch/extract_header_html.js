const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const hdrIdx = html.indexOf('<header class="hdr"');
if (hdrIdx !== -1) {
  console.log('=== HEADER MARKUP ===');
  console.log(html.slice(hdrIdx - 300, hdrIdx + 3000));
} else {
  const ubarIdx = html.indexOf('class="ubar"');
  if (ubarIdx !== -1) {
    console.log('=== UBAR MARKUP ===');
    console.log(html.slice(ubarIdx - 50, ubarIdx + 3500));
  }
}
