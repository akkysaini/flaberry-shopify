/**
 * Flaberry Full Development Navigation Menu Migration Script
 * API Version: 2026-10
 * Creates a comprehensive isolated development menu "Flaberry Navigation (Full Dev)"
 * with nested sub-menus for Flowers, Cakes, Combos, Gifts, Occasions, and Recipients.
 * Preserves the live main-menu untouched.
 */

import fs from 'node:fs';
import path from 'node:path';

const STORE_DOMAIN = 'flaberry-pps4i03n.myshopify.com';
const API_VERSION = '2026-10';
const GRAPHQL_ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const MANIFEST_PATH = path.resolve('scratch/menu_migration_manifest.json');

function getStoredAccessToken() {
  const configPath = path.resolve(process.env.APPDATA, 'shopify-cli-store-nodejs/Config/config.json');
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  for (const storeKey of Object.keys(configData)) {
    if (storeKey.includes('flaberry-pps4i03n')) {
      const storeEntry = configData[storeKey];
      if (storeEntry.sessionsByUserId) {
        const uId = storeEntry.currentUserId || Object.keys(storeEntry.sessionsByUserId)[0];
        if (storeEntry.sessionsByUserId[uId] && storeEntry.sessionsByUserId[uId].accessToken) {
          return storeEntry.sessionsByUserId[uId].accessToken;
        }
      }
      if (storeEntry.accessToken) return storeEntry.accessToken;
    }
  }
  throw new Error(`No access token found in ${configPath}`);
}

function persistManifestAtomically(manifest) {
  const tmpPath = `${MANIFEST_PATH}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpPath, JSON.stringify(manifest, null, 2), 'utf8');
  fs.renameSync(tmpPath, MANIFEST_PATH);
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

async function shopifyGraphQL(token, query, variables = {}, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({ query, variables })
      });

      const responseText = await response.text();
      let json;
      try {
        json = JSON.parse(responseText);
      } catch (err) {
        throw new Error(`GraphQL HTTP ${response.status} Non-JSON: ${responseText.slice(0, 400)}`);
      }

      if (json.errors && json.errors.length > 0) {
        throw new Error(`GraphQL Errors: ${JSON.stringify(json.errors)}`);
      }

      return { data: json.data, extensions: json.extensions };
    } catch (err) {
      lastError = err;
      console.warn(`[WARN] GraphQL attempt ${attempt}/${maxRetries} failed: ${err.message}. Retrying...`);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
  }
  throw lastError;
}

async function createFullDevMenu() {
  console.log('[INFO] Starting Full Development Menu Creation...');
  const token = getStoredAccessToken();

  const menuTitle = 'Flaberry Navigation (Full Dev)';
  const menuHandle = 'flaberry-nav-full-dev';

  const menuItems = [
    {
      title: 'Flowers',
      type: 'HTTP',
      url: '/collections/flowers',
      items: [
        { title: 'All Flowers', type: 'HTTP', url: '/collections/flowers' },
        { title: 'Roses', type: 'HTTP', url: '/collections/roses' },
        { title: 'Orchids', type: 'HTTP', url: '/collections/orchids' },
        { title: 'Lilies', type: 'HTTP', url: '/collections/lilies' },
        { title: 'Carnations', type: 'HTTP', url: '/collections/carnations' },
        { title: 'Gerberas', type: 'HTTP', url: '/collections/gerberas' },
        { title: 'Sunflowers', type: 'HTTP', url: '/collections/sunflowers' },
        { title: 'Flower Bouquets', type: 'HTTP', url: '/collections/bouquets' },
        { title: 'Vase Arrangements', type: 'HTTP', url: '/collections/vase' },
        { title: 'Flower Baskets', type: 'HTTP', url: '/collections/baskets' },
        { title: 'Flowers in Box', type: 'HTTP', url: '/collections/box' },
        { title: 'Heart Shaped', type: 'HTTP', url: '/collections/heart-shape' },
        { title: 'Premium & Exotic', type: 'HTTP', url: '/collections/premium-flowers' },
        { title: 'Red Flowers', type: 'HTTP', url: '/collections/red-flowers' },
        { title: 'Pink Flowers', type: 'HTTP', url: '/collections/pink-flowers' },
        { title: 'Yellow Flowers', type: 'HTTP', url: '/collections/yellow-flowers' },
        { title: 'White Flowers', type: 'HTTP', url: '/collections/white-flowers' },
        { title: 'Mixed Colour Flowers', type: 'HTTP', url: '/collections/mixed-flowers' }
      ]
    },
    {
      title: 'Cakes',
      type: 'HTTP',
      url: '/collections/cakes',
      items: [
        { title: 'All Cakes', type: 'HTTP', url: '/collections/cakes' },
        { title: 'Chocolate Cakes', type: 'HTTP', url: '/collections/chocolate-cakes' },
        { title: 'Truffle Cakes', type: 'HTTP', url: '/collections/truffle' },
        { title: 'Black Forest', type: 'HTTP', url: '/collections/black-forest' },
        { title: 'Red Velvet', type: 'HTTP', url: '/collections/red-velvet' },
        { title: 'Pineapple Cakes', type: 'HTTP', url: '/collections/pineapple' },
        { title: 'Butterscotch Cakes', type: 'HTTP', url: '/collections/butterscotch' },
        { title: 'Photo Cakes', type: 'HTTP', url: '/collections/photo-cakes' },
        { title: 'Eggless Cakes', type: 'HTTP', url: '/collections/eggless' },
        { title: 'Designer & Tier Cakes', type: 'HTTP', url: '/collections/designer-cakes' },
        { title: 'Kids Cakes', type: 'HTTP', url: '/collections/kids-cakes' }
      ]
    },
    {
      title: 'Combos',
      type: 'HTTP',
      url: '/collections/combos',
      items: [
        { title: 'All Combos', type: 'HTTP', url: '/collections/combos' },
        { title: 'Flowers with Cake', type: 'HTTP', url: '/collections/cake-and-flowers' },
        { title: 'Flowers with Chocolates', type: 'HTTP', url: '/collections/flowers-and-chocolates' },
        { title: 'Flowers with Teddy', type: 'HTTP', url: '/collections/flowers-and-teddies' }
      ]
    },
    {
      title: 'Gifts',
      type: 'HTTP',
      url: '/collections/gifts',
      items: [
        { title: 'All Gifts', type: 'HTTP', url: '/collections/gifts' },
        { title: 'Sweets & Mithai', type: 'HTTP', url: '/collections/sweets' },
        { title: 'Dry Fruits', type: 'HTTP', url: '/collections/dry-fruits' },
        { title: 'Gift Hampers', type: 'HTTP', url: '/collections/hampers' },
        { title: 'Fresh Fruit Baskets', type: 'HTTP', url: '/collections/fruits' },
        { title: 'Plants', type: 'HTTP', url: '/collections/plants' }
      ]
    },
    {
      title: 'Occasions',
      type: 'HTTP',
      url: '/collections/occasions',
      items: [
        { title: 'Birthday', type: 'HTTP', url: '/collections/birthday' },
        { title: 'Anniversary', type: 'HTTP', url: '/collections/anniversary' },
        { title: 'Love & Romance', type: 'HTTP', url: '/collections/romance' },
        { title: 'Congratulations', type: 'HTTP', url: '/collections/congratulations' },
        { title: 'Thank You', type: 'HTTP', url: '/collections/thank-you' },
        { title: 'Get Well Soon', type: 'HTTP', url: '/collections/get-well-soon' },
        { title: 'Christmas Gifts', type: 'HTTP', url: '/collections/christmas' },
        { title: 'New Year Gifts', type: 'HTTP', url: '/collections/new-year' }
      ]
    },
    {
      title: 'Recipient',
      type: 'HTTP',
      url: '/collections/for-her',
      items: [
        { title: 'Gifts for Her', type: 'HTTP', url: '/collections/for-her' },
        { title: 'Gifts for Him', type: 'HTTP', url: '/collections/for-him' },
        { title: 'Gifts for Mother', type: 'HTTP', url: '/collections/for-mother' },
        { title: 'Gifts for Father', type: 'HTTP', url: '/collections/for-father' },
        { title: 'Gifts for Wife', type: 'HTTP', url: '/collections/for-wife' },
        { title: 'Gifts for Husband', type: 'HTTP', url: '/collections/for-husband' },
        { title: 'Gifts for Friends', type: 'HTTP', url: '/collections/for-friends' },
        { title: 'Gifts for Kids', type: 'HTTP', url: '/collections/for-kids' }
      ]
    },
    {
      title: 'Advance Orders',
      type: 'HTTP',
      url: '/pages/advance-orders'
    },
    {
      title: 'Corporate',
      type: 'HTTP',
      url: '/pages/corporate-gifting'
    }
  ];

  const menuCreateMutation = `
    mutation MenuCreate($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
      menuCreate(title: $title, handle: $handle, items: $items) {
        menu {
          id
          title
          handle
          items {
            id
            title
            url
            items { id title url }
          }
        }
        userErrors { field message }
      }
    }
  `;

  console.log(`[INFO] Creating menu "${menuTitle}" (${menuHandle}) with 8 top-level sections...`);
  const res = await shopifyGraphQL(token, menuCreateMutation, {
    title: menuTitle,
    handle: menuHandle,
    items: menuItems
  });

  const errors = res.data.menuCreate.userErrors;
  if (errors && errors.length > 0) {
    console.error('[ERROR] Menu creation failed:', errors);
    throw new Error(`Menu creation failed: ${JSON.stringify(errors)}`);
  }

  const menu = res.data.menuCreate.menu;
  console.log(`[SUCCESS] Full Dev Menu created successfully! GID: ${menu.id}`);

  const manifest = {
    manifest_version: '1.0.0',
    store_domain: STORE_DOMAIN,
    api_version: API_VERSION,
    updated_at: new Date().toISOString(),
    menu: {
      id: menu.id,
      handle: menu.handle,
      title: menu.title,
      itemsCount: menu.items.length,
      items: menu.items
    }
  };

  persistManifestAtomically(manifest);
  console.log(`[SUCCESS] Menu manifest persisted to ${MANIFEST_PATH}`);
}

createFullDevMenu().catch(err => {
  console.error('[FATAL] Menu creation failed:', err);
  process.exit(1);
});
