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
    __schema {
      mutationType {
        fields {
          name
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
  const fields = res.data.__schema.mutationType.fields.map(f => f.name);
  const pubMutations = fields.filter(f => f.toLowerCase().includes('publish'));
  console.log('Publish-related mutations in 2026-10:', pubMutations);
});
