const fs = require('fs');
const menu = JSON.parse(fs.readFileSync('scratch/menu_data.json', 'utf8'));

console.log('Top level menu count:', menu.length);

menu.forEach((item, i) => {
  console.log(`\n[${i+1}] ${item.title} (href: ${item.href || ''})`);
  if (item.sub) {
    item.sub.forEach((s, j) => {
      console.log(`   └─ ${s.title} (${s.items ? s.items.length : 0} items)`);
      if (s.items) {
        console.log(`       [${s.items.map(it => typeof it === 'string' ? it : it.title || it.t).join(', ')}]`);
      }
    });
  }
  if (item.promo) {
    console.log(`   [Promo Card]: ${JSON.stringify(item.promo)}`);
  }
});
