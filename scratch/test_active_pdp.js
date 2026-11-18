import fs from 'node:fs';
import path from 'node:path';

const STORE_DOMAIN = 'flaberry-pps4i03n.myshopify.com';
const API_VERSION = '2026-10';
const GRAPHQL_ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

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

async function shopifyGraphQL(token, query, variables = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return response.json();
}

async function testActive() {
  const token = getStoredAccessToken();
  console.log('[INFO] Updating red-rose-gift-luxe to ACTIVE...');

  // 1. Get publication ID for Online Store
  const pubQuery = `
    query {
      publications(first: 10) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;
  const pubRes = await shopifyGraphQL(token, pubQuery);
  console.log('Publications:', JSON.stringify(pubRes.data.publications.edges, null, 2));
  const onlineStorePub = pubRes.data.publications.edges.find(e => e.node.name.toLowerCase().includes('online store'));
  const pubId = onlineStorePub ? onlineStorePub.node.id : null;
  console.log('Online Store Publication ID:', pubId);

  // 2. Set product status to ACTIVE
  const updateMutation = `
    mutation productUpdate($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const updateRes = await shopifyGraphQL(token, updateMutation, {
    product: {
      id: 'gid://shopify/Product/15476147781823',
      status: 'ACTIVE'
    }
  });
  console.log('Update result:', JSON.stringify(updateRes, null, 2));

  // 3. Publish to Online Store publication
  if (pubId) {
    const pubMutation = `
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
    const pubResult = await shopifyGraphQL(token, pubMutation, {
      id: 'gid://shopify/Product/15476147781823',
      input: [{ publicationId: pubId }]
    });
    console.log('Publish result:', JSON.stringify(pubResult, null, 2));
  }

  // 4. Test fetch on port 9393
  try {
    const fetchRes = await fetch('http://127.0.0.1:9393/products/red-rose-gift-luxe');
    console.log('[PROBE] HTTP Status:', fetchRes.status);
    const html = await fetchRes.text();
    console.log('[PROBE] HTML Length:', html.length);
    console.log('[PROBE] Contains title "Red Rose Gift Luxe":', html.includes('Red Rose Gift Luxe'));
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}

testActive();
