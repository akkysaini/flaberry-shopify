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
  throw new Error('No token found');
}

async function uploadBinary(target, localPath, mimeType) {
  const fileBuffer = fs.readFileSync(localPath);
  const formData = new FormData();
  if (target.parameters) {
    for (const p of target.parameters) {
      formData.append(p.name, p.value);
    }
  }
  formData.append('file', new Blob([fileBuffer], { type: mimeType }), path.basename(localPath));
  const res = await fetch(target.url, { method: 'POST', body: formData });
  if (!res.ok && res.status !== 201 && res.status !== 204) {
    throw new Error(`Upload failed: ${res.status}`);
  }
}

async function test() {
  const token = getStoredAccessToken();
  const localFile = path.resolve('extracted-assets/p1.webp');
  const stat = fs.statSync(localFile);

  // 1. Staged upload
  const stagedRes = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `
        mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets { url resourceUrl parameters { name value } }
            userErrors { field message }
          }
        }
      `,
      variables: {
        input: [{
          filename: 'p1.webp',
          mimeType: 'image/webp',
          fileSize: stat.size.toString(),
          httpMethod: 'POST',
          resource: 'PRODUCT_IMAGE'
        }]
      }
    })
  });
  const stagedData = await stagedRes.json();
  const target = stagedData.data.stagedUploadsCreate.stagedTargets[0];
  await uploadBinary(target, localFile, 'image/webp');
  console.log('Staged upload done, resourceUrl:', target.resourceUrl);

  // 2. ProductSet
  const pSetMutation = `
    mutation ProductSet($input: ProductSetInput!) {
      productSet(input: $input) {
        product {
          id
          title
          handle
          status
          variants(first: 5) {
            nodes { id sku price compareAtPrice }
          }
          media(first: 5) {
            nodes { id status }
          }
        }
        userErrors { field message }
      }
    }
  `;

  const input = {
    title: 'Midnight Rose Desire',
    handle: 'midnight-rose-desire',
    status: 'DRAFT',
    productType: 'Flowers',
    vendor: 'Flaberry',
    tags: ['roses', 'flowers', 'flaberry'],
    files: [
      {
        originalSource: target.resourceUrl,
        alt: 'Midnight Rose Desire',
        contentType: 'IMAGE'
      }
    ],
    productOptions: [
      {
        name: 'Title',
        values: [{ name: 'Default Title' }]
      }
    ],
    variants: [
      {
        optionValues: [{ optionName: 'Title', name: 'Default Title' }],
        sku: 'FBF667',
        price: '1290.00',
        compareAtPrice: '1590.00'
      }
    ],
    metafields: [
      {
        namespace: 'flaberry_internal',
        key: 'price_approval_status',
        value: 'UNAPPROVED_INTERNAL_REFERENCE',
        type: 'single_line_text_field'
      }
    ]
  };

  const pRes = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: pSetMutation, variables: { input } })
  });
  const pData = await pRes.json();
  console.log('ProductSet result:', JSON.stringify(pData, null, 2));
}

test().catch(console.error);
