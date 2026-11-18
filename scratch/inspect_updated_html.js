async function probe() {
  try {
    const res = await fetch('http://127.0.0.1:9393');
    const html = await res.text();
    const fs = require('fs');
    fs.writeFileSync('scratch/preview_index_updated.html', html, 'utf8');
    console.log('Saved preview_index_updated.html (' + html.length + ' bytes)');
    const cards = (html.match(/class="flaberry-card"/g) || []).length;
    console.log('Total product cards rendered:', cards);
    const prices = (html.match(/flaberry-price-main/g) || []).length;
    console.log('Total prices rendered:', prices);
    const unapprovedChips = (html.match(/flaberry-unapproved-chip/g) || []).length;
    console.log('Total unapproved ref price chips:', unapprovedChips);
  } catch (err) {
    console.error('Probe error:', err);
  }
}
probe();
