const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const marker = '"logo":"data:image/';
const start = html.indexOf(marker);
if (start !== -1) {
  const end = html.indexOf('"', start + marker.length);
  const dataUri = html.slice(start + 8, end);
  const comma = dataUri.indexOf(',');
  const b64 = dataUri.slice(comma + 1);
  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync('theme/assets/flaberry-logo-prototype.png', buf);
  console.log(`Saved theme/assets/flaberry-logo-prototype.png (${buf.length} bytes)`);
} else {
  console.log('Marker not found');
}
