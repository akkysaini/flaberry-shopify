const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const idx = html.indexOf('<div class="fm">');
if (idx !== -1) {
  console.log(html.slice(idx, idx + 1500));
} else {
  console.log('Searching fm in html...');
  let pos = 0;
  while((pos = html.indexOf('fm', pos)) !== -1) {
    if (html.slice(pos-5, pos+10).includes('"fm"')) {
      console.log(html.slice(pos - 50, pos + 500));
      break;
    }
    pos += 3;
  }
}
