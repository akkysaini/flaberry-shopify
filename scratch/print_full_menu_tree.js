const fs = require('fs');
const menu = JSON.parse(fs.readFileSync('scratch/menu_data.json', 'utf8'));

menu.forEach((top, idx) => {
  console.log(`\n========================================`);
  console.log(`LEVEL 1: ${top.label} ${top.hot ? '(HOT/BADGE)' : ''}`);
  console.log(`Promo Card: ${top.promo ? top.promo.join(' | ') : 'none'}`);
  if (top.cols) {
    top.cols.forEach((col, cIdx) => {
      console.log(`  LEVEL 2 Column: ${col[0]}`);
      col[1].forEach(item => {
        console.log(`    LEVEL 3 Link: ${item[0]} -> ${item[1]}`);
      });
    });
  }
});
