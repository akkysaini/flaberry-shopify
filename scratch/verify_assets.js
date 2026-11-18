const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const inv = JSON.parse(fs.readFileSync('scratch/image_inventory.json', 'utf8'));
const assetDir = 'extracted-assets';

console.log('Total inventory records:', inv.length);

const hashes = {};
const duplicates = [];
const broken = [];

inv.forEach(item => {
  const filePath = path.join(assetDir, item.filename);
  if (!fs.existsSync(filePath)) {
    broken.push({ key: item.key, reason: 'File does not exist' });
    return;
  }
  const buf = fs.readFileSync(filePath);
  if (buf.length === 0) {
    broken.push({ key: item.key, reason: '0 bytes file' });
    return;
  }
  if (!item.width || !item.height) {
    broken.push({ key: item.key, reason: 'Could not parse dimensions' });
  }

  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  item.sha256 = hash;

  if (hashes[hash]) {
    duplicates.push({
      originalKey: hashes[hash].key,
      duplicateKey: item.key,
      filename: item.filename,
      size: item.fileSizeKb,
      hash
    });
  } else {
    hashes[hash] = item;
  }
});

console.log('Broken assets:', broken.length);
console.log('Duplicate image contents:', duplicates.length);
if (duplicates.length > 0) {
  console.log('Sample duplicates:', duplicates.slice(0, 10));
}

fs.writeFileSync('scratch/asset_integrity_report.json', JSON.stringify({
  totalAssets: inv.length,
  uniqueImages: Object.keys(hashes).length,
  duplicateCount: duplicates.length,
  duplicates,
  brokenCount: broken.length,
  broken
}, null, 2));

console.log('Saved scratch/asset_integrity_report.json');
