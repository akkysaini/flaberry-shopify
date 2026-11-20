const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');
['i_20yrs', 'i_pricing', 'i_support', 'i_secure'].forEach(k => {
  const idx = html.indexOf(k);
  console.log(k, html.slice(idx - 10, idx + 150));
});
