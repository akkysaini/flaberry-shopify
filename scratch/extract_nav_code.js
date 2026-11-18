const fs = require('fs');
const html = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

const navIdx = html.indexOf('function renderNav(');
if (navIdx !== -1) {
  console.log('=== RENDER NAV FUNCTION ===');
  console.log(html.slice(navIdx, navIdx + 3000));
} else {
  const navBuild = html.indexOf('id="nav"');
  console.log(html.slice(navBuild - 200, navBuild + 1500));
}
