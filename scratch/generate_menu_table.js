const fs = require('fs');
const menu = JSON.parse(fs.readFileSync('scratch/menu_data.json', 'utf8'));

// Build item map from menu
const destMap = {};

menu.forEach(top => {
  // Check promo
  if (top.promo) {
    const [img, title, dest] = top.promo;
    if (!destMap[dest]) {
      destMap[dest] = {
        labels: [`Promo: ${title} (${top.label})`],
        originalRoute: '#' + dest,
        dest
      };
    } else {
      destMap[dest].labels.push(`Promo: ${title}`);
    }
  }

  // Check columns
  if (top.cols) {
    top.cols.forEach(col => {
      const colTitle = col[0];
      col[1].forEach(item => {
        const [label, dest] = item;
        if (!destMap[dest]) {
          destMap[dest] = {
            labels: [`${top.label} > ${colTitle} > ${label}`],
            originalRoute: '#' + dest,
            dest
          };
        } else {
          destMap[dest].labels.push(`${top.label} > ${colTitle} > ${label}`);
        }
      });
    });
  }
});

const destKeys = Object.keys(destMap).sort();
console.log('Total destinations in destMap:', destKeys.length);

const results = [];

destKeys.forEach(dest => {
  const info = destMap[dest];
  let finalShopifyUrl = '';
  let correspondingResource = '';
  let creationStatus = '';
  let isApproved = 'YES';
  let isValid = 'VALID';
  let notes = '';

  if (dest.startsWith('c-')) {
    const handle = dest.slice(2);
    if (handle === 'all') {
      finalShopifyUrl = '/collections/all';
      correspondingResource = 'Shopify Default Catalog (Native)';
      creationStatus = 'Native Route (No creation needed)';
      isApproved = 'YES';
      isValid = 'VALID';
      notes = 'Shopify native route. Do NOT create custom collection.';
    } else if (handle === 'same-day') {
      finalShopifyUrl = '/collections/same-day';
      correspondingResource = 'Collection: Same Day Delivery';
      creationStatus = 'Pending Client Commercial Rules';
      isApproved = 'PENDING';
      isValid = 'CONDITIONAL';
      notes = 'Same-day delivery cutoff & serviceability pending client confirmation.';
    } else if (handle === 'midnight') {
      finalShopifyUrl = '/collections/midnight';
      correspondingResource = 'Collection: Midnight Delivery';
      creationStatus = 'Pending Client Commercial Rules';
      isApproved = 'PENDING';
      isValid = 'CONDITIONAL';
      notes = 'Midnight delivery availability across global markets pending confirmation.';
    } else {
      finalShopifyUrl = `/collections/${handle}`;
      correspondingResource = `Collection: ${handle}`;
      creationStatus = 'Approved for Creation (Draft Catalog)';
      isApproved = 'YES';
      isValid = 'VALID';
    }
  } else if (dest.startsWith('page-')) {
    const handle = dest.slice(5);
    finalShopifyUrl = `/pages/${handle}`;
    correspondingResource = `Page: ${handle}`;
    if (['advance', 'pincodes'].includes(handle)) {
      creationStatus = 'Approved Shell / Copy Pending';
      isApproved = 'YES (Shell only)';
      isValid = 'VALID';
      notes = 'Functional shell approved; legal/business claims pending.';
    } else if (['corporate'].includes(handle)) {
      creationStatus = 'Approved Shell / Commercial Terms Pending';
      isApproved = 'YES (Shell only)';
      isValid = 'VALID';
    } else if (['cities', 'cake-cities'].includes(handle)) {
      finalShopifyUrl = '/pages/delivery-cities';
      correspondingResource = 'Page: Delivery Cities Directory';
      creationStatus = 'Pending Global Coverage Decision';
      isApproved = 'PENDING';
      isValid = 'CONDITIONAL';
      notes = 'Prototype lists Indian cities only. Consolidated to global directory.';
    } else {
      finalShopifyUrl = `/pages/${handle}`;
      correspondingResource = `Page: ${handle}`;
      creationStatus = 'Pending Legal/Copy Approval';
      isApproved = 'PENDING (Copy)';
      isValid = 'VALID';
    }
  } else if (dest.startsWith('city-')) {
    const city = dest.slice(5);
    // In prototype these were #city-delhi, #city-mumbai etc.
    finalShopifyUrl = `/pages/delivery-cities#${city}`;
    correspondingResource = `Page Anchor: delivery-cities#${city}`;
    creationStatus = 'Mapped to Directory (No separate collection)';
    isApproved = 'PENDING (Global Market Scope)';
    isValid = 'RECONCILED';
    notes = 'In Shopify, city routes cannot be broken collections. Mapped to /pages/delivery-cities.';
  } else {
    finalShopifyUrl = `/${dest}`;
    correspondingResource = `Route: ${dest}`;
    creationStatus = 'To be determined';
    isApproved = 'NO';
    isValid = 'INVALID';
  }

  results.push({
    dest,
    labels: info.labels.join(' | '),
    originalRoute: info.originalRoute,
    finalShopifyUrl,
    correspondingResource,
    creationStatus,
    isApproved,
    isValid,
    notes
  });
});

fs.writeFileSync('scratch/menu_destination_table.json', JSON.stringify(results, null, 2));
console.log('Saved scratch/menu_destination_table.json with', results.length, 'records.');
