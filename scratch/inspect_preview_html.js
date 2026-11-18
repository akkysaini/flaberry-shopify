const fs = require('fs');
const html = fs.readFileSync('scratch/preview_index.html', 'utf8');
const regex = /id="shopify-section-([^"]+)"/g;
let m;
const sections = [];
while ((m = regex.exec(html)) !== null) {
  sections.push(m[1]);
}
console.log('Unique shopify sections in rendered HTML:');
console.log(Array.from(new Set(sections)));
