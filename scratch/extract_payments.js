const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const marker = '"payments":"data:image/';
const start = html.indexOf(marker);
if (start !== -1) {
  const end = html.indexOf('"', start + marker.length);
  const dataUri = html.slice(start + 12, end);
  console.log('payments dataUri prefix:', dataUri.slice(0, 50));
  const comma = dataUri.indexOf(',');
  const b64 = dataUri.slice(comma + 1);
  const ext = dataUri.includes('image/webp') ? 'webp' : 'png';
  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync(`theme/assets/flaberry-payments.${ext}`, buf);
  console.log(`Saved theme/assets/flaberry-payments.${ext} (${buf.length} bytes)`);
} else {
  console.log('Marker not found');
}
