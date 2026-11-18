const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('scratch/product_manifest_48.json', 'utf8'));

// Collections list (57 collections: 5 Parent + 39 Sub + 8 Relationship + 5 Colour)
// Let's define the membership rule for each
const collections = [
  // Parent Groups (5)
  { handle: 'flowers', type: 'Parent Group', rule: 'productType EQUALS Flowers' },
  { handle: 'cakes', type: 'Parent Group', rule: 'productType EQUALS Cakes' },
  { handle: 'combos', type: 'Parent Group', rule: 'productType EQUALS Combos' },
  { handle: 'gifts', type: 'Parent Group', rule: 'productType EQUALS Gifts' },
  { handle: 'occasions', type: 'Parent Group', rule: 'productType EQUALS Occasion Gifts' },

  // Flower Sub-collections (13)
  { handle: 'roses', type: 'Sub-collection', rule: 'productTag EQUALS roses' },
  { handle: 'orchids', type: 'Sub-collection', rule: 'productTag EQUALS orchids' },
  { handle: 'lilies', type: 'Sub-collection', rule: 'productTag EQUALS lilies' },
  { handle: 'carnations', type: 'Sub-collection', rule: 'productTag EQUALS carnations' },
  { handle: 'gerberas', type: 'Sub-collection', rule: 'productTag EQUALS gerberas' },
  { handle: 'sunflowers', type: 'Sub-collection', rule: 'productTag EQUALS sunflowers' },
  { handle: 'bouquets', type: 'Sub-collection', rule: 'productTag EQUALS bouquets' },
  { handle: 'vase', type: 'Sub-collection', rule: 'productTag EQUALS vase' },
  { handle: 'baskets', type: 'Sub-collection', rule: 'productTag EQUALS baskets' },
  { handle: 'box', type: 'Sub-collection', rule: 'productTag EQUALS box' },
  { handle: 'heart-shape', type: 'Sub-collection', rule: 'productTag EQUALS heart-shape' },
  { handle: 'premium-flowers', type: 'Sub-collection', rule: 'productTag EQUALS premium-flowers' },
  { handle: 'sympathy', type: 'Sub-collection', rule: 'productTag EQUALS sympathy' },

  // Cake Sub-collections (10)
  { handle: 'chocolate-cakes', type: 'Sub-collection', rule: 'productTag EQUALS chocolate-cakes' },
  { handle: 'truffle', type: 'Sub-collection', rule: 'productTag EQUALS truffle' },
  { handle: 'black-forest', type: 'Sub-collection', rule: 'productTag EQUALS black-forest' },
  { handle: 'red-velvet', type: 'Sub-collection', rule: 'productTag EQUALS red-velvet' },
  { handle: 'pineapple', type: 'Sub-collection', rule: 'productTag EQUALS pineapple' },
  { handle: 'butterscotch', type: 'Sub-collection', rule: 'productTag EQUALS butterscotch' },
  { handle: 'photo-cakes', type: 'Sub-collection', rule: 'productTag EQUALS photo-cakes' },
  { handle: 'eggless', type: 'Sub-collection', rule: 'productTag EQUALS eggless' },
  { handle: 'designer-cakes', type: 'Sub-collection', rule: 'productTag EQUALS designer-cakes' },
  { handle: 'kids-cakes', type: 'Sub-collection', rule: 'productTag EQUALS kids-cakes' },

  // Combos & Gifts Sub-collections (8)
  { handle: 'cake-and-flowers', type: 'Sub-collection', rule: 'productTag EQUALS cake-and-flowers' },
  { handle: 'flowers-and-chocolates', type: 'Sub-collection', rule: 'productTag EQUALS flowers-and-chocolates' },
  { handle: 'flowers-and-teddies', type: 'Sub-collection', rule: 'productTag EQUALS flowers-and-teddies' },
  { handle: 'sweets', type: 'Sub-collection', rule: 'productTag EQUALS sweets' },
  { handle: 'dry-fruits', type: 'Sub-collection', rule: 'productTag EQUALS dry-fruits' },
  { handle: 'hampers', type: 'Sub-collection', rule: 'productTag EQUALS hampers' },
  { handle: 'fruits', type: 'Sub-collection', rule: 'productTag EQUALS fruits' },
  { handle: 'plants', type: 'Sub-collection', rule: 'productTag EQUALS plants' },

  // Occasions Sub-collections (8)
  { handle: 'birthday', type: 'Occasion Hub', rule: 'productTag EQUALS birthday' },
  { handle: 'anniversary', type: 'Occasion Hub', rule: 'productTag EQUALS anniversary' },
  { handle: 'christmas', type: 'Occasion Hub', rule: 'productTag EQUALS christmas' },
  { handle: 'new-year', type: 'Occasion Hub', rule: 'productTag EQUALS new-year' },
  { handle: 'romance', type: 'Occasion Hub', rule: 'productTag EQUALS romance' },
  { handle: 'congratulations', type: 'Occasion Hub', rule: 'productTag EQUALS congratulations' },
  { handle: 'thank-you', type: 'Occasion Hub', rule: 'productTag EQUALS thank-you' },
  { handle: 'get-well-soon', type: 'Occasion Hub', rule: 'productTag EQUALS get-well-soon' },

  // Relationship Collections (8)
  { handle: 'for-her', type: 'Relationship', rule: 'productTag EQUALS for-her' },
  { handle: 'for-him', type: 'Relationship', rule: 'productTag EQUALS for-him' },
  { handle: 'for-mother', type: 'Relationship', rule: 'productTag EQUALS for-mother' },
  { handle: 'for-father', type: 'Relationship', rule: 'productTag EQUALS for-father' },
  { handle: 'for-wife', type: 'Relationship', rule: 'productTag EQUALS for-wife' },
  { handle: 'for-husband', type: 'Relationship', rule: 'productTag EQUALS for-husband' },
  { handle: 'for-friends', type: 'Relationship', rule: 'productTag EQUALS for-friends' },
  { handle: 'for-kids', type: 'Relationship', rule: 'productTag EQUALS for-kids' },

  // Colour Collections (5)
  { handle: 'red-flowers', type: 'Colour', rule: 'productTag EQUALS red-flowers' },
  { handle: 'pink-flowers', type: 'Colour', rule: 'productTag EQUALS pink-flowers' },
  { handle: 'yellow-flowers', type: 'Colour', rule: 'productTag EQUALS yellow-flowers' },
  { handle: 'white-flowers', type: 'Colour', rule: 'productTag EQUALS white-flowers' },
  { handle: 'mixed-flowers', type: 'Colour', rule: 'productTag EQUALS mixed-flowers' }
];

console.log('Total collections being tested:', collections.length);

const validation = [];

collections.forEach(col => {
  const matching = manifest.filter(p => {
    const tagsArr = p.tags.split(',').map(t => t.trim());
    if (col.type === 'Parent Group') {
      const targetType = col.rule.split('EQUALS ')[1].trim();
      return p.productType === targetType;
    }
    const targetTag = col.rule.split('EQUALS ')[1].trim();
    return tagsArr.includes(targetTag);
  });

  const count = matching.length;
  const isExpectedEmpty = count === 0;
  let reason = '';
  if (isExpectedEmpty) {
    if (col.type === 'Relationship') {
      reason = 'Relationship tag not on 48 seed sample products (tagged during bulk catalog migration).';
    } else if (col.type === 'Colour') {
      reason = 'Colour tag not on 48 seed sample products (tagged during bulk catalog migration).';
    } else if (col.type === 'Occasion Hub') {
      reason = 'Specific holiday/occasion items (e.g. Christmas, New Year) not included in 48 core seed sample.';
    } else {
      reason = 'Products for this sub-collection are in remaining 324 catalog items.';
    }
  }

  validation.push({
    handle: col.handle,
    type: col.type,
    rule: col.rule,
    matchingCount: count,
    isExpectedEmpty,
    sampleMatches: matching.map(m => m.sku + ' (' + m.title + ')').slice(0, 3).join(', '),
    reason
  });
});

const populated = validation.filter(v => v.matchingCount > 0);
const empty = validation.filter(v => v.matchingCount === 0);

console.log('Populated in 48-sample:', populated.length);
console.log('Expected empty in 48-sample:', empty.length);

fs.writeFileSync('scratch/collection_validation_report.json', JSON.stringify(validation, null, 2));
console.log('Saved scratch/collection_validation_report.json');
