const fs = require('fs');
const inv = JSON.parse(fs.readFileSync('scratch/image_inventory.json', 'utf8'));

const heroes = inv.filter(i => i.category === 'hero_banners');
const promos = inv.filter(i => i.category === 'promotional_banners');
const brand = inv.filter(i => i.category === 'brand_and_decorative');
const products = inv.filter(i => i.category === 'product_images');

console.log('--- HEROES (' + heroes.length + ') ---');
heroes.forEach(h => console.log(`${h.key}: ${h.width}x${h.height} (${h.fileSizeKb} KB, ${h.format})`));

console.log('\n--- PROMOS (' + promos.length + ') ---');
promos.forEach(p => console.log(`${p.key}: ${p.width}x${p.height} (${p.fileSizeKb} KB, ${p.format})`));

console.log('\n--- BRAND (' + brand.length + ') ---');
brand.forEach(b => console.log(`${b.key}: ${b.width}x${b.height} (${b.fileSizeKb} KB, ${b.format})`));

// Check any product keys that don't start with 'p'
const nonP = products.filter(p => !p.key.startsWith('p'));
console.log('\n--- NON-P IN PRODUCTS (' + nonP.length + ') ---');
nonP.forEach(p => console.log(`${p.key}: ${p.width}x${p.height}`));
