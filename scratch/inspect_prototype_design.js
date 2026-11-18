const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');
console.log('Prototype length:', html.length);

// Look for pages/views
const pageMatches = html.match(/id="([^"]*page[^"]*|[^"]*view[^"]*)"/gi);
console.log('Page/View IDs:', pageMatches ? pageMatches.slice(0, 30) : 'none');

// Look for product detail page markup
const pdpIndex = html.indexOf('pdp');
console.log('Index of "pdp":', pdpIndex);

// Look for product card markup
const cardIndex = html.indexOf('product-card');
console.log('Index of "product-card":', cardIndex);

// Look for collection/listing markup
const plpIndex = html.indexOf('listing');
console.log('Index of "listing":', plpIndex);

// Print all section classes
const classRegex = /class="([^"]+)"/g;
let m;
const classes = new Set();
while ((m = classRegex.exec(html)) !== null) {
  m[1].split(/\s+/).forEach(c => classes.add(c));
}
console.log('Total unique classes:', classes.size);
const relevantClasses = Array.from(classes).filter(c => 
  c.includes('header') || c.includes('nav') || c.includes('banner') || 
  c.includes('hero') || c.includes('product') || c.includes('pdp') || 
  c.includes('card') || c.includes('cat') || c.includes('filter') || 
  c.includes('cart') || c.includes('footer')
);
console.log('Relevant classes sample (first 60):', relevantClasses.slice(0, 60));
