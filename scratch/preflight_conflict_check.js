const fs = require('fs');

console.log('--- PRE-FLIGHT PILOT DRY-RUN VALIDATION ---');

const pilot = JSON.parse(fs.readFileSync('scratch/pilot_manifest_v2.json', 'utf8'));

// Check pilot scope limits
const checks = [
  { name: 'API Version', expected: '2026-10', actual: pilot.apiVersion, pass: pilot.apiVersion === '2026-10' },
  { name: 'Draft Products Count', expected: 2, actual: pilot.resourcesToCreate.products.length, pass: pilot.resourcesToCreate.products.length === 2 },
  { name: 'Unpublished Collections Count', expected: 2, actual: pilot.resourcesToCreate.collections.length, pass: pilot.resourcesToCreate.collections.length === 2 },
  { name: 'Unpublished Pages Count', expected: 1, actual: pilot.resourcesToCreate.pages.length, pass: pilot.resourcesToCreate.pages.length === 1 },
  { name: 'Isolated Navigation Menus Count', expected: 1, actual: pilot.resourcesToCreate.navigation.length, pass: pilot.resourcesToCreate.navigation.length === 1 },
  { name: 'Files CDN Uploads Count', expected: 3, actual: pilot.resourcesToCreate.filesCDN.length, pass: pilot.resourcesToCreate.filesCDN.length === 3 },
  { name: 'Product Media Uploads Count', expected: 2, actual: pilot.resourcesToCreate.products.filter(p => p.associatedMedia).length, pass: pilot.resourcesToCreate.products.filter(p => p.associatedMedia).length === 2 },
  { name: 'Total Pilot Assets', expected: 5, actual: pilot.resourcesToCreate.filesCDN.length + 2, pass: (pilot.resourcesToCreate.filesCDN.length + 2) === 5 },
  { name: 'Isolated Menu Handle Check', expected: 'flaberry-nav-pilot-draft', actual: pilot.resourcesToCreate.navigation[0].handle, pass: pilot.resourcesToCreate.navigation[0].handle === 'flaberry-nav-pilot-draft' },
  { name: 'Existing Main-Menu Protected', expected: true, actual: pilot.guardrails.protectExistingMainMenu, pass: pilot.guardrails.protectExistingMainMenu === true },
  { name: 'Products Status is DRAFT', expected: true, actual: pilot.resourcesToCreate.products.every(p => p.status === 'DRAFT'), pass: pilot.resourcesToCreate.products.every(p => p.status === 'DRAFT') },
  { name: 'Collections Unpublished', expected: true, actual: pilot.resourcesToCreate.collections.every(c => c.publicationState === 'UNPUBLISHED_FROM_ONLINE_STORE'), pass: pilot.resourcesToCreate.collections.every(c => c.publicationState === 'UNPUBLISHED_FROM_ONLINE_STORE') },
  { name: 'Pages Unpublished', expected: true, actual: pilot.resourcesToCreate.pages.every(p => p.isPublished === false), pass: pilot.resourcesToCreate.pages.every(p => p.isPublished === false) }
];

// Check asset existence on disk
const assetsToCheck = [
  { name: 'hero_flowers.webp', path: 'extracted-assets/hero_flowers.webp' },
  { name: 't_roses.webp', path: 'extracted-assets/t_roses.webp' },
  { name: 'i_20yrs.png', path: 'extracted-assets/i_20yrs.png' },
  { name: 'p0.webp', path: 'extracted-assets/p0.webp' },
  { name: 'p125.webp', path: 'extracted-assets/p125.webp' }
];

assetsToCheck.forEach(a => {
  const exists = fs.existsSync(a.path);
  const size = exists ? fs.statSync(a.path).size : 0;
  checks.push({
    name: `Asset on disk: ${a.name}`,
    expected: 'Exists (>0 bytes)',
    actual: exists ? `${size} bytes` : 'MISSING',
    pass: exists && size > 0
  });
});

console.log('Total pre-flight checks:', checks.length);
const failures = checks.filter(c => !c.pass);
console.log('Passed checks:', checks.length - failures.length);
console.log('Failed checks:', failures.length);

fs.writeFileSync('scratch/dry_run_preflight_report.json', JSON.stringify({
  timestamp: new Date().toISOString(),
  allPassed: failures.length === 0,
  totalChecks: checks.length,
  checks,
  failures
}, null, 2));

console.log('Saved scratch/dry_run_preflight_report.json');
