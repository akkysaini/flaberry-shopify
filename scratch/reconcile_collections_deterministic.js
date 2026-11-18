const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('scratch/product_manifest_48.json', 'utf8'));

console.log('Manifest products count:', manifest.length);

// 57 collections strictly defined:
const collections = [
  // 5 Parent Category Hubs
  { handle: 'flowers', title: 'Flowers', group: 'Parent Hub', ruleType: 'PRODUCT_TYPE', rule: 'productType EQUALS Flowers' },
  { handle: 'cakes', title: 'Cakes', group: 'Parent Hub', ruleType: 'PRODUCT_TYPE', rule: 'productType EQUALS Cakes' },
  { handle: 'combos', title: 'Combos', group: 'Parent Hub', ruleType: 'PRODUCT_TYPE', rule: 'productType EQUALS Combos' },
  { handle: 'gifts', title: 'Gifts', group: 'Parent Hub', ruleType: 'PRODUCT_TYPE', rule: 'productType EQUALS Gifts' },
  { handle: 'occasions', title: 'Occasions', group: 'Parent Hub', ruleType: 'PRODUCT_TYPE', rule: 'productType EQUALS Occasion Gifts' },

  // 13 Flower Sub-collections
  { handle: 'roses', title: 'Roses', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS roses' },
  { handle: 'orchids', title: 'Orchids', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS orchids' },
  { handle: 'lilies', title: 'Lilies', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS lilies' },
  { handle: 'carnations', title: 'Carnations', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS carnations' },
  { handle: 'gerberas', title: 'Gerberas', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS gerberas' },
  { handle: 'sunflowers', title: 'Sunflowers', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS sunflowers' },
  { handle: 'bouquets', title: 'Flower Bouquets', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS bouquets' },
  { handle: 'vase', title: 'Vase Arrangements', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS vase' },
  { handle: 'baskets', title: 'Flower Baskets', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS baskets' },
  { handle: 'box', title: 'Flowers in Box', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS box' },
  { handle: 'heart-shape', title: 'Heart Shaped', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS heart-shape' },
  { handle: 'premium-flowers', title: 'Premium & Exotic', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS premium-flowers' },
  { handle: 'sympathy', title: 'Sympathy & Wreaths', group: 'Flowers Sub', ruleType: 'TAG', rule: 'productTag EQUALS sympathy' },

  // 10 Cake Sub-collections
  { handle: 'chocolate-cakes', title: 'Chocolate Cakes', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS chocolate-cakes' },
  { handle: 'truffle', title: 'Truffle Cakes', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS truffle' },
  { handle: 'black-forest', title: 'Black Forest', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS black-forest' },
  { handle: 'red-velvet', title: 'Red Velvet', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS red-velvet' },
  { handle: 'pineapple', title: 'Pineapple', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS pineapple' },
  { handle: 'butterscotch', title: 'Butterscotch', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS butterscotch' },
  { handle: 'photo-cakes', title: 'Photo Cakes', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS photo-cakes' },
  { handle: 'eggless', title: 'Eggless Cakes', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS eggless' },
  { handle: 'designer-cakes', title: 'Designer & Tier Cakes', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS designer-cakes' },
  { handle: 'kids-cakes', title: 'Kids Cakes', group: 'Cakes Sub', ruleType: 'TAG', rule: 'productTag EQUALS kids-cakes' },

  // 3 Combos Sub-collections
  { handle: 'cake-and-flowers', title: 'Flowers with Cake', group: 'Combos Sub', ruleType: 'TAG', rule: 'productTag EQUALS cake-and-flowers' },
  { handle: 'flowers-and-chocolates', title: 'Flowers with Chocolates', group: 'Combos Sub', ruleType: 'TAG', rule: 'productTag EQUALS flowers-and-chocolates' },
  { handle: 'flowers-and-teddies', title: 'Flowers with Teddy', group: 'Combos Sub', ruleType: 'TAG', rule: 'productTag EQUALS flowers-and-teddies' },

  // 5 Gifts Sub-collections
  { handle: 'sweets', title: 'Sweets & Mithai', group: 'Gifts Sub', ruleType: 'TAG', rule: 'productTag EQUALS sweets' },
  { handle: 'dry-fruits', title: 'Dry Fruits', group: 'Gifts Sub', ruleType: 'TAG', rule: 'productTag EQUALS dry-fruits' },
  { handle: 'hampers', title: 'Gift Hampers', group: 'Gifts Sub', ruleType: 'TAG', rule: 'productTag EQUALS hampers' },
  { handle: 'fruits', title: 'Fresh Fruit Baskets', group: 'Gifts Sub', ruleType: 'TAG', rule: 'productTag EQUALS fruits' },
  { handle: 'plants', title: 'Plants', group: 'Gifts Sub', ruleType: 'TAG', rule: 'productTag EQUALS plants' },

  // 8 Occasions Hubs
  { handle: 'birthday', title: 'Birthday', group: 'Occasions Hub', ruleType: 'TAG', rule: 'productTag EQUALS birthday' },
  { handle: 'anniversary', title: 'Anniversary', group: 'Occasions Hub', ruleType: 'TAG', rule: 'productTag EQUALS anniversary' },
  { handle: 'christmas', title: 'Christmas Gifts', group: 'Occasions Hub', ruleType: 'TAG', rule: 'productTag EQUALS christmas' },
  { handle: 'new-year', title: 'New Year Gifts', group: 'Occasions Hub', ruleType: 'TAG', rule: 'productTag EQUALS new-year' },
  { handle: 'romance', title: 'Love & Romance', group: 'Occasions Hub', ruleType: 'TAG', rule: 'productTag EQUALS romance' },
  { handle: 'congratulations', title: 'Congratulations', group: 'Occasions Hub', ruleType: 'TAG', rule: 'productTag EQUALS congratulations' },
  { handle: 'thank-you', title: 'Thank You', group: 'Occasions Hub', ruleType: 'TAG', rule: 'productTag EQUALS thank-you' },
  { handle: 'get-well-soon', title: 'Get Well Soon', group: 'Occasions Hub', ruleType: 'TAG', rule: 'productTag EQUALS get-well-soon' },

  // 8 Relationship Collections
  { handle: 'for-her', title: 'Gifts for Her', group: 'Relationship', ruleType: 'TAG', rule: 'productTag EQUALS for-her' },
  { handle: 'for-him', title: 'Gifts for Him', group: 'Relationship', ruleType: 'TAG', rule: 'productTag EQUALS for-him' },
  { handle: 'for-mother', title: 'Gifts for Mother', group: 'Relationship', ruleType: 'TAG', rule: 'productTag EQUALS for-mother' },
  { handle: 'for-father', title: 'Gifts for Father', group: 'Relationship', ruleType: 'TAG', rule: 'productTag EQUALS for-father' },
  { handle: 'for-wife', title: 'Gifts for Wife', group: 'Relationship', ruleType: 'TAG', rule: 'productTag EQUALS for-wife' },
  { handle: 'for-husband', title: 'Gifts for Husband', group: 'Relationship', ruleType: 'TAG', rule: 'productTag EQUALS for-husband' },
  { handle: 'for-friends', title: 'Gifts for Friends', group: 'Relationship', ruleType: 'TAG', rule: 'productTag EQUALS for-friends' },
  { handle: 'for-kids', title: 'Gifts for Kids', group: 'Relationship', ruleType: 'TAG', rule: 'productTag EQUALS for-kids' },

  // 5 Colour Collections
  { handle: 'red-flowers', title: 'Red Flowers', group: 'Colour', ruleType: 'TAG', rule: 'productTag EQUALS red-flowers' },
  { handle: 'pink-flowers', title: 'Pink Flowers', group: 'Colour', ruleType: 'TAG', rule: 'productTag EQUALS pink-flowers' },
  { handle: 'yellow-flowers', title: 'Yellow Flowers', group: 'Colour', ruleType: 'TAG', rule: 'productTag EQUALS yellow-flowers' },
  { handle: 'white-flowers', title: 'White Flowers', group: 'Colour', ruleType: 'TAG', rule: 'productTag EQUALS white-flowers' },
  { handle: 'mixed-flowers', title: 'Mixed Colour Flowers', group: 'Colour', ruleType: 'TAG', rule: 'productTag EQUALS mixed-flowers' }
];

console.log('Total verified collection definitions:', collections.length);

const results = [];
let populatedCount = 0;
let emptyCount = 0;

collections.forEach((col, idx) => {
  const matchingSKUs = [];

  manifest.forEach(p => {
    const tagsArr = p.tags.split(',').map(t => t.trim().toLowerCase());
    if (col.ruleType === 'PRODUCT_TYPE') {
      const targetType = col.rule.split('EQUALS ')[1].trim();
      if (p.productType.toLowerCase() === targetType.toLowerCase()) {
        matchingSKUs.push(p.sku);
      }
    } else if (col.ruleType === 'TAG') {
      const targetTag = col.rule.split('EQUALS ')[1].trim().toLowerCase();
      if (tagsArr.includes(targetTag)) {
        matchingSKUs.push(p.sku);
      }
    }
  });

  const count = matchingSKUs.length;
  if (count > 0) populatedCount++;
  else emptyCount++;

  results.push({
    index: idx + 1,
    handle: col.handle,
    title: col.title,
    group: col.group,
    rule: col.rule,
    matchCount: count,
    matchingSKUs: matchingSKUs.join(', ') || 'NONE',
    status: count > 0 ? 'POPULATED' : 'EMPTY (Pending full catalog)'
  });
});

console.log('--- RECONCILIATION SUMMARY ---');
console.log('Total Collections:', collections.length);
console.log('Populated Collections:', populatedCount);
console.log('Empty Collections:', emptyCount);
console.log('Sum Check:', populatedCount + emptyCount, '===', collections.length);

fs.writeFileSync('scratch/reconciled_collection_validation.json', JSON.stringify({
  totalCollections: collections.length,
  populatedCount,
  emptyCount,
  manifestProductsCount: manifest.length,
  results
}, null, 2));

console.log('Saved scratch/reconciled_collection_validation.json');
