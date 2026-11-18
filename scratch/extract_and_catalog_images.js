const fs = require('fs');
const path = require('path');

const proto = fs.readFileSync('reference/Flaberry_Design1_Classic.html', 'utf8');

// Parse window.IMG
const imgTag = '<script>window.IMG=';
const startIdx = proto.indexOf(imgTag);
const jsonStart = startIdx + imgTag.length;
const scriptEnd = proto.indexOf('</script>', jsonStart);
let rawJson = proto.slice(jsonStart, scriptEnd).trim();
if (rawJson.endsWith(';')) rawJson = rawJson.slice(0, -1).trim();

const imgObj = JSON.parse(rawJson);
const keys = Object.keys(imgObj);
console.log('Total images in window.IMG:', keys.length);

// Destination
const outDir = 'extracted-assets';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function getDimensions(buf, format) {
  try {
    if (format === 'png') {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if (format === 'webp') {
      if (buf.toString('ascii', 12, 16) === 'VP8 ') {
        return {
          width: buf.readUInt16LE(26) & 0x3fff,
          height: buf.readUInt16LE(28) & 0x3fff
        };
      } else if (buf.toString('ascii', 12, 16) === 'VP8L') {
        const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
        return {
          width: 1 + (((b1 & 0x3f) << 8) | b0),
          height: 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6))
        };
      } else if (buf.toString('ascii', 12, 16) === 'VP8X') {
        return {
          width: 1 + buf.readUIntLE(24, 3),
          height: 1 + buf.readUIntLE(27, 3)
        };
      }
    }
    if (format === 'jpeg' || format === 'jpg') {
      let offset = 2;
      while (offset < buf.length) {
        if (buf[offset] !== 0xFF) break;
        const marker = buf[offset + 1];
        if (marker === 0xC0 || marker === 0xC2) {
          return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
        }
        const len = buf.readUInt16BE(offset + 2);
        offset += 2 + len;
      }
    }
  } catch(e) {}
  return { width: null, height: null };
}

const inventory = [];
const catCounts = {};

keys.forEach(k => {
  const val = imgObj[k];
  if (!val.startsWith('data:image/')) {
    console.log(`Key ${k} not data URL:`, val.slice(0, 40));
    return;
  }
  const match = val.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!match) return;

  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buf = Buffer.from(match[2], 'base64');
  const filename = `${k}.${ext}`;
  fs.writeFileSync(path.join(outDir, filename), buf);

  const dim = getDimensions(buf, ext);

  let category = 'product_images';
  if (k.startsWith('h_') || k.startsWith('hx_') || k.includes('hero')) {
    category = 'hero_banners';
  } else if (k.startsWith('c_') || k.startsWith('cat_') || k.startsWith('rail_')) {
    category = 'category_images';
  } else if (k.startsWith('promo_') || k.startsWith('t_') || k.includes('banner')) {
    category = 'promotional_banners';
  } else if (k.startsWith('m_') || k.includes('promo')) {
    category = 'mega_menu_promos';
  } else if (k === 'logo' || k.includes('brand') || k.includes('bg_') || k.includes('badge')) {
    category = 'brand_and_decorative';
  } else if (k.startsWith('ic_') || k.startsWith('icon_') || buf.length < 2048) {
    category = 'icons_and_other';
  } else if (k.startsWith('p')) {
    category = 'product_images';
  }

  catCounts[category] = (catCounts[category] || 0) + 1;

  // Determine destination
  let destination = 'Shopify Product Media';
  if (category === 'hero_banners' || category === 'promotional_banners' || category === 'category_images') {
    destination = 'Shopify Files (CDN)';
  } else if (category === 'brand_and_decorative' || category === 'icons_and_other') {
    destination = 'Theme Assets / Shopify Files';
  } else if (category === 'mega_menu_promos') {
    destination = 'Shopify Files (CDN)';
  }

  inventory.push({
    key: k,
    filename,
    format: ext,
    fileSizeKb: (buf.length / 1024).toFixed(1),
    fileSizeBytes: buf.length,
    width: dim.width,
    height: dim.height,
    category,
    destination
  });
});

console.log('Saved all', inventory.length, 'images to', outDir);
console.log('Category Counts:', catCounts);
fs.writeFileSync('scratch/image_inventory.json', JSON.stringify(inventory, null, 2));
console.log('Saved scratch/image_inventory.json');
