const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const keys = ['i_20yrs', 'i_pricing', 'i_support', 'i_secure'];
keys.forEach(k => {
  const marker = `"${k}":"data:image/png;base64,`;
  const start = html.indexOf(marker);
  if (start !== -1) {
    const end = html.indexOf('"', start + marker.length);
    const b64 = html.slice(start + marker.length, end);
    const buf = Buffer.from(b64, 'base64');
    fs.writeFileSync(`theme/assets/${k}.png`, buf);
    console.log(`Saved ${k}.png (${buf.length} bytes)`);
  } else {
    console.log(`Marker not found for ${k}`);
  }
});
