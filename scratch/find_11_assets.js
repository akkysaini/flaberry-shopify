const fs = require('fs');
const inv = JSON.parse(fs.readFileSync('scratch/image_inventory.json', 'utf8'));

// The 415 accounted for earlier:
// Products: p0 to p371 (372 items) + 1 (?)
// Let's list all keys in inv and inspect them
console.log('Total inventory length:', inv.length);

const heroCarousel = ['hero_flowers', 'hero_bday', 'hero_cake', 'hero_anniv', 'hero_fruits', 'hero_him'];
const heroSecondary = ['hx_roses', 'hx_orchids', 'hx_velvet', 'hx_ferrero', 'hx_xmascake', 'hx_dryfruit', 'hx_heartbox', 'hx_truffle', 'hx_lily', 'hx_mixbox'];
const categoryTiles = ['t_roses', 't_bouquets', 't_orchids', 't_vase', 't_heart', 't_cakeflowers', 't_premiumcake', 't_photocake', 't_eggless', 't_heartcake', 't_kidscake', 't_birthday', 't_anniv', 't_congrats', 't_thankyou', 't_cakeflower2'];
const featureBadges = ['f_sameday', 'f_fresh', 'f_handcrafted', 'f_midnight', 'f_support'];
const trustBadges = ['i_20yrs', 'i_pricing', 'i_support', 'i_secure'];
const brandLogo = ['logo'];

// Products: p0 to p371
const productKeys = [];
for (let i = 0; i <= 371; i++) {
  productKeys.push('p' + i);
}

const accounted = new Set([
  ...heroCarousel,
  ...heroSecondary,
  ...categoryTiles,
  ...featureBadges,
  ...trustBadges,
  ...brandLogo,
  ...productKeys
]);

console.log('Accounted keys count:', accounted.size);

const remaining = inv.filter(item => !accounted.has(item.key));
console.log('Remaining unclassified keys count:', remaining.length);
console.log('Remaining unclassified keys:');
remaining.forEach(item => {
  console.log(`- ${item.key}: ${item.filename} (${item.width}x${item.height}, ${item.fileSizeKb} KB, ${item.format})`);
});
