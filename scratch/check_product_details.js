import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import fs from 'node:fs';
import path from 'node:path';

const configPath = path.resolve(process.env.APPDATA, 'shopify-cli-store-nodejs/Config/config.json');
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
let token;
for (const storeKey of Object.keys(configData)) {
  if (storeKey.includes('flaberry-pps4i03n')) {
    const s = configData[storeKey];
    token = s.sessionsByUserId[s.currentUserId || Object.keys(s.sessionsByUserId)[0]].accessToken;
  }
}

// Check product details in detail
const query = `
  query {
    product(id: "gid://shopify/Product/15476147781823") {
      id
      title
      handle
      status
      tracksInventory
      hasOnlyDefaultVariant
      variants(first: 5) {
        nodes {
          id
          title
          price
          availableForSale
          inventoryQuantity
        }
      }
    }
  }
`;

fetch('https://flaberry-pps4i03n.myshopify.com/admin/api/2026-10/graphql.json', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
  body: JSON.stringify({ query })
}).then(r => r.json()).then(res => {
  console.log(JSON.stringify(res, null, 2));
});
