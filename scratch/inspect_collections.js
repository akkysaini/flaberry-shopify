const fs = require('fs');
const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');
const catProds = JSON.parse(fs.readFileSync('scratch/cat_prods_data.json', 'utf8'));

// Extract GROUPS
const groupsMatch = proto.match(/const GROUPS\s*=\s*(\{[\s\S]*?\});/);
let groups = {};
if (groupsMatch) {
  groups = eval('(' + groupsMatch[1] + ')');
  fs.writeFileSync('scratch/groups_data.json', JSON.stringify(groups, null, 2));
}

console.log('--- PARENT GROUPS ---');
Object.keys(groups).forEach(g => {
  console.log(`${g}: title="${groups[g].title}", blurb="${groups[g].blurb || ''}", sub-cats=[${groups[g].sub.join(', ')}]`);
});

console.log('\n--- SUB-CATEGORIES / COLLECTIONS (' + catProds.cats.length + ') ---');
catProds.cats.forEach((c, idx) => {
  console.log(`[${idx+1}] key="${c.key}", title="${c.title}", group="${c.group}", items=${c.items.length}`);
});
