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

const query = `
  query {
    publication(id: "gid://shopify/Publication/232005468351") {
      id
      autoPublish
      supportsFuturePublishing
    }
  }
`;

fetch('https://flaberry-pps4i03n.myshopify.com/admin/api/2026-10/graphql.json', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
  body: JSON.stringify({ query })
}).then(r => r.json()).then(res => {
  console.log('Publication query for 232005468351:', JSON.stringify(res, null, 2));
});
