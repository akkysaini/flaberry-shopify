const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

// Keys to inspect
const specialKeys = [
  'bv1_1', 'bv1_2', 'bv1_3', 'bv1_4', 'bv1_5',
  'bb_1', 'bb_2', 'bb_3', 'bb_4',
  'i_secure', 'i_support', 'i_pricing', 'i_20yrs',
  'f_midnight', 'f_sameday', 'f_support', 'f_fresh', 'f_handcrafted',
  'sq_mens', 'sq_bhaidooj',
  'hero_flowers', 'hero_bday', 'hero_cake', 'hero_anniv', 'hero_fruits', 'hero_him'
];

specialKeys.forEach(k => {
  let count = 0;
  let pos = 0;
  const snippets = [];
  while ((pos = proto.indexOf(k, pos)) !== -1) {
    // Only capture if not inside window.IMG
    if (pos > 10240000) {
      count++;
      const start = Math.max(0, pos - 60);
      const end = Math.min(proto.length, pos + 80);
      snippets.push(proto.slice(start, end).replace(/\r?\n/g, ' '));
    }
    pos += k.length;
  }
  console.log(`=== ${k} (${count} occurrences) ===`);
  snippets.slice(0, 2).forEach(s => console.log('  ...', s, '...'));
});
