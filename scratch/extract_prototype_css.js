const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>');

if (styleStart !== -1 && styleEnd !== -1) {
  const css = html.slice(styleStart + 7, styleEnd);
  fs.writeFileSync('scratch/prototype_extracted.css', css, 'utf8');
  console.log('Saved prototype_extracted.css, length:', css.length);
} else {
  console.log('Style tags not found directly');
}
