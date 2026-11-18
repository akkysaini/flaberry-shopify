const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

// Search for route definitions or hash changes
const routeMatches = proto.match(/#([a-zA-Z0-9_-]+)/g);
const uniqueRoutes = Array.from(new Set(routeMatches)).sort();

console.log('Unique hash links found:', uniqueRoutes.length);
console.log(uniqueRoutes);

// Look for router logic
const routerIdx = proto.indexOf('function route(');
if (routerIdx !== -1) {
  console.log('\n--- ROUTER FUNCTION ---');
  console.log(proto.slice(routerIdx, routerIdx + 1200));
}
