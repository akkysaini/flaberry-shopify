const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const fIdx = html.indexOf('function buildFooter');
if (fIdx !== -1) {
  console.log(html.slice(fIdx, fIdx + 2000));
} else {
  const fIdx2 = html.indexOf('footer');
  console.log('Searching #footer...');
  let pos = 0;
  while((pos = html.indexOf('#footer', pos)) !== -1) {
    console.log(html.slice(pos - 50, pos + 400));
    console.log('---');
    pos += 7;
  }
}
