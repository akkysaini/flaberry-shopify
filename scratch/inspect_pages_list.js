const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const pIdx = proto.indexOf('function page(');
if (pIdx !== -1) {
  console.log(proto.slice(pIdx, pIdx + 1200));
}

// Also check for PAGES constant or list of pages
const pagesMatch = proto.match(/const PAGES\s*=\s*(\{[\s\S]*?\});/);
if (pagesMatch) {
  console.log('Found PAGES constant!');
  console.log(pagesMatch[1].slice(0, 500));
} else {
  console.log('No const PAGES found, searching for page slugs');
  const slugMatches = proto.match(/page-([a-z0-9-]+)/g);
  console.log('Unique page slugs:', Array.from(new Set(slugMatches)));
}
