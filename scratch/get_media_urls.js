import fs from 'node:fs';
import path from 'node:path';

const p = path.resolve(process.env.APPDATA, 'shopify-cli-store-nodejs/Config/config.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
const key = Object.keys(data)[0];
const uId = data[key].currentUserId;
const token = data[key].sessionsByUserId[uId].accessToken;

async function getMediaUrls() {
  const query = `query {
    m1: node(id: "gid://shopify/MediaImage/46817383776447") {
      ... on MediaImage {
        id
        status
        image { url width height }
      }
    }
    m2: node(id: "gid://shopify/MediaImage/46817394294975") {
      ... on MediaImage {
        id
        status
        image { url width height }
      }
    }
  }`;
  const res = await fetch('https://flaberry-pps4i03n.myshopify.com/admin/api/2026-10/graphql.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query })
  });
  const json = await res.json();
  console.log('Product 1 Media (p0.webp):', json.data.m1);
  console.log('Product 2 Media (p125.webp):', json.data.m2);
}
getMediaUrls();
