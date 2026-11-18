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

const updateMutation = `
  mutation productUpdate($product: ProductUpdateInput!) {
    productUpdate(product: $product) {
      product {
        id
        handle
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function run() {
  const res = await fetch('https://flaberry-pps4i03n.myshopify.com/admin/api/2026-10/graphql.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: updateMutation,
      variables: { product: { id: 'gid://shopify/Product/15476147781823', status: 'ACTIVE' } }
    })
  });
  const json = await res.json();
  console.log('Update status result:', JSON.stringify(json, null, 2));

  // probe dev server
  const r = await fetch('http://127.0.0.1:9393/products/red-rose-gift-luxe');
  console.log('PDP HTTP status:', r.status);
  const text = await r.text();
  console.log('PDP HTML Length:', text.length);
  console.log('PDP Contains "Red Rose Gift Luxe":', text.includes('Red Rose Gift Luxe'));
}

run().catch(console.error);
