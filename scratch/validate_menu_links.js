const fs = require('fs');
const menu = JSON.parse(fs.readFileSync('scratch/menu_data.json', 'utf8'));

// Extract all links from menu
const menuDestinations = [];
menu.forEach(item => {
  if (item.promo && item.promo[2]) menuDestinations.push(item.promo[2]);
  if (item.cols) {
    item.cols.forEach(col => {
      col[1].forEach(link => {
        menuDestinations.push(link[1]);
      });
    });
  }
});

const uniqueDests = Array.from(new Set(menuDestinations)).sort();
console.log('Total unique menu destinations:', uniqueDests.length);

const collectionDests = uniqueDests.filter(d => d.startsWith('c-')).map(d => d.slice(2));
const pageDests = uniqueDests.filter(d => d.startsWith('page-')).map(d => d.slice(5));
const cityDests = uniqueDests.filter(d => d.startsWith('city-')).map(d => d.slice(5));
const otherDests = uniqueDests.filter(d => !d.startsWith('c-') && !d.startsWith('page-') && !d.startsWith('city-'));

console.log('Collection destinations in MENU (' + collectionDests.length + '):', collectionDests);
console.log('Page destinations in MENU (' + pageDests.length + '):', pageDests);
console.log('City destinations in MENU (' + cityDests.length + '):', cityDests);
console.log('Other destinations in MENU:', otherDests);

// Save to scratch
fs.writeFileSync('scratch/menu_validation.json', JSON.stringify({
  uniqueDests,
  collectionDests,
  pageDests,
  cityDests,
  otherDests
}, null, 2));
