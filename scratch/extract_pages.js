import fs from 'node:fs';

const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const pages = ['about', 'corporate', 'pincodes', 'cities', 'faq', 'contact', 'terms', 'privacy', 'refund', 'advance'];
for (const p of pages) {
  const marker = `case "${p}":`;
  const idx = html.indexOf(marker);
  if (idx !== -1) {
    console.log(`=== Page: ${p} ===`);
    console.log(html.slice(idx, idx + 600));
    console.log('\n----------------------------------------\n');
  }
}
