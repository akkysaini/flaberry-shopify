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

fetch('https://flaberry-pps4i03n.myshopify.com/admin/api/2024-01/publications.json', {
  headers: { 'X-Shopify-Access-Token': token }
}).then(r => r.json()).then(console.log).catch(console.error);
