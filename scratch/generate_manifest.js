const fs = require('fs');
const catProds = JSON.parse(fs.readFileSync('scratch/cat_prods_data.json', 'utf8'));
const inv = JSON.parse(fs.readFileSync('scratch/image_inventory.json', 'utf8'));
const cats = catProds.cats;
const prods = catProds.prods;

// We need 48 representative sample products covering all groups:
// flowers (13 cats) -> ~16 prods
// cakes (10 cats) -> ~14 prods
// combos (3 cats) -> 5 prods
// gifts (5 cats) -> 7 prods
// occasions (8 cats) -> 6 prods
// Total = 48 prods

const selectedKeys = new Set();

// 1. Ensure duplicate keys p136, p141, p163, p192 are included so duplicates are explicitly tracked in manifest!
selectedKeys.add('p136');
selectedKeys.add('p141'); // duplicate of p136
selectedKeys.add('p163');
selectedKeys.add('p192'); // duplicate of p163

// 2. Pick top 1-2 items from each category until we have exactly 48 items
cats.forEach(c => {
  let count = 0;
  for (const k of c.items) {
    if (!selectedKeys.has(k) && selectedKeys.size < 48) {
      selectedKeys.add(k);
      count++;
      if (count >= 1 && selectedKeys.size >= 44) break;
      if (count >= 2) break;
    }
  }
});

// If still less than 48, pick more from roses, bouquets, chocolate-cakes
if (selectedKeys.size < 48) {
  for (const k of Object.keys(prods)) {
    if (!selectedKeys.has(k)) {
      selectedKeys.add(k);
      if (selectedKeys.size === 48) break;
    }
  }
}

console.log('Selected exact count:', selectedKeys.size);

const manifest = [];
Array.from(selectedKeys).sort((a,b) => parseInt(a.slice(1)) - parseInt(b.slice(1))).forEach(k => {
  const p = prods[k];
  const primaryCat = cats.find(c => c.items.includes(k)) || { key: 'general', title: 'General', group: 'gifts' };
  
  // Clean handle
  const handle = p.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let productType = 'Gift';
  if (primaryCat.group === 'flowers') productType = 'Flowers';
  else if (primaryCat.group === 'cakes') productType = 'Cakes';
  else if (primaryCat.group === 'combos') productType = 'Combos';
  else if (primaryCat.group === 'gifts') productType = 'Gifts';
  else if (primaryCat.group === 'occasions') productType = 'Occasion Gifts';

  const tags = [primaryCat.group, primaryCat.key, 'flaberry_seed_v1'];
  if (k === 'p141' || k === 'p188' || k === 'p192' || p.name.toLowerCase().includes('eggless')) {
    tags.push('eggless');
  }
  if (p.name.toLowerCase().includes('heart')) {
    tags.push('heart-shape');
  }

  // Variant mapping
  let variants = [];
  if (productType === 'Cakes') {
    const isEggless = tags.includes('eggless');
    variants = [
      { option1: '1/2 kg', option2: isEggless ? 'Eggless' : 'With Egg', price: p.price.toFixed(2), sku: `${p.sku}-05` },
      { option1: '1 kg', option2: isEggless ? 'Eggless' : 'With Egg', price: (p.price * 1.8).toFixed(2), sku: `${p.sku}-10` }
    ];
  } else {
    variants = [
      { option1: 'Default Title', option2: null, price: p.price.toFixed(2), sku: p.sku }
    ];
  }

  // Duplicate indicator
  let duplicateInfo = 'None (Unique)';
  if (k === 'p141') duplicateInfo = 'Shares image content with p136 (Eggless vs Regular Truffle)';
  if (k === 'p136') duplicateInfo = 'Shares image content with p141';
  if (k === 'p192') duplicateInfo = 'Shares image content with p163 (Eggless vs Regular Pineapple)';
  if (k === 'p163') duplicateInfo = 'Shares image content with p192';

  manifest.push({
    key: k,
    title: p.name,
    sku: p.sku,
    handle,
    productType,
    tags: tags.join(', '),
    primaryCategory: primaryCat.title,
    categoryKey: primaryCat.key,
    imageFilename: `${k}.webp`,
    referencePriceINR: p.price,
    referenceComparePriceINR: p.vprice || null,
    variantCount: variants.length,
    variantSummary: variants.map(v => v.option2 ? `${v.option1} / ${v.option2}` : v.option1).join(' | '),
    duplicateIndicator: duplicateInfo,
    status: 'DRAFT'
  });
});

fs.writeFileSync('scratch/product_manifest_48.json', JSON.stringify(manifest, null, 2));
console.log('Saved scratch/product_manifest_48.json');
