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

const mutation = `
  mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable {
        availablePublicationsCount {
          count
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function publishTest() {
  const res = await fetch('https://flaberry-pps4i03n.myshopify.com/admin/api/2026-10/graphql.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: mutation,
      variables: {
        id: 'gid://shopify/Product/15476147781823',
        input: [{ publicationId: 'gid://shopify/Publication/232005468351' }]
      }
    })
  });
  const json = await res.json();
  console.log('Publish result:', JSON.stringify(json, null, 2));

  // Check product again
  const query = `
    query {
      product(id: "gid://shopify/Product/15476147781823") {
        id
        status
        publishedAt
        onlineStoreUrl
      }
    }
  `;
  const pRes = await fetch('https://flaberry-pps4i03n.myshopify.com/admin/api/2026-10/graphql.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query })
  });
  const pJson = await pRes.json();
  console.log('Product status after publish:', JSON.stringify(pJson, null, 2));

  // probe dev server
  const probe = await fetch('http://127.0.0.1:9393/products/red-rose-gift-luxe');
  console.log('[PROBE] HTTP Status:', probe.status);
  const text = await probe.text();
  console.log('[PROBE] HTML Length:', text.length);
  console.log('[PROBE] Contains "Red Rose Gift Luxe":', text.includes('Red Rose Gift Luxe'));
}

publishTest().catch(console.error);
