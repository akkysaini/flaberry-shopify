/**
 * Flaberry Remaining 20 General Assets Migration Script
 * API Version: 2026-10
 * Uploads remaining 20 assets to Shopify Files so all 54 general assets + 372 product media = 426 total assets are migrated.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const STORE_DOMAIN = 'flaberry-pps4i03n.myshopify.com';
const API_VERSION = '2026-10';
const GRAPHQL_ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const MANIFEST_PATH = path.resolve('scratch/asset_migration_manifest.json');
const ASSETS_DIR = path.resolve('extracted-assets');

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
        throw new Error(`GraphQL HTTP ${response.status} Non-JSON response: ${responseText.slice(0, 500)}`);
      }

      if (json.errors && json.errors.length > 0) {
        throw new Error(`GraphQL Errors: ${JSON.stringify(json.errors)}`);
      }

      if (json.extensions && json.extensions.cost) {
        const cost = json.extensions.cost;
        if (cost.throttleStatus && cost.throttleStatus.currentlyAvailable < 300) {
          const sleepMs = 2000;
          console.log(`[THROTTLE] Cost limit nearing, cooling down for ${sleepMs}ms...`);
          await new Promise(r => setTimeout(r, sleepMs));
        }
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

async function uploadBinaryToStagedTarget(target, localFilePath, mimeType) {
  const fileBuffer = fs.readFileSync(localFilePath);
  const formData = new FormData();

  if (target.parameters && target.parameters.length > 0) {
    for (const param of target.parameters) {
      formData.append(param.name, param.value);
    }
  }

  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append('file', blob, path.basename(localFilePath));

  const uploadRes = await fetch(target.url, {
    method: 'POST',
    body: formData
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Binary upload to staged URL failed with status ${uploadRes.status}: ${errorText.slice(0, 500)}`);
  }
}

async function main() {
  const token = getStoredAccessToken();
  console.log('[INFO] Acquired Shopify Admin token.');

  let manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const existingFiles = new Set(manifest.assets.map(a => a.filename));

  const remainingFiles = [
    'bb_1.webp', 'bb_2.webp', 'bb_3.webp', 'bb_4.webp',
    'bv1_1.webp', 'bv1_2.webp', 'bv1_3.webp', 'bv1_4.webp', 'bv1_5.webp',
    'f_fresh.webp', 'f_handcrafted.webp', 'f_midnight.webp', 'f_sameday.webp', 'f_support.webp',
    'i_pricing.png', 'i_secure.png', 'i_support.png', 'payments.png',
    'sq_bhaidooj.webp', 'sq_mens.webp'
  ];

  console.log(`[INFO] Found ${remainingFiles.length} remaining files to migrate.`);

  for (let i = 0; i < remainingFiles.length; i++) {
    const filename = remainingFiles[i];
    if (existingFiles.has(filename)) {
      console.log(`[${i+1}/${remainingFiles.length}] Skipping ${filename} (already in manifest)`);
      continue;
    }

    const localPath = path.join(ASSETS_DIR, filename);
    if (!fs.existsSync(localPath)) {
      console.warn(`[WARN] File not found on disk: ${localPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const fileSize = fileBuffer.length.toString();
    const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/webp';

    console.log(`[${i+1}/${remainingFiles.length}] Staging ${filename} (${fileSize} bytes)...`);

    const stageMutation = `
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters {
              name
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const stageRes = await shopifyGraphQL(token, stageMutation, {
      input: [{
        filename,
        mimeType,
        resource: 'FILE',
        fileSize,
        httpMethod: 'POST'
      }]
    });

    const target = stageRes.data.stagedUploadsCreate.stagedTargets[0];
    await uploadBinaryToStagedTarget(target, localPath, mimeType);

    const fileCreateMutation = `
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            id
            fileStatus
            alt
            createdAt
            ... on MediaImage {
              image {
                url
                width
                height
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const createRes = await shopifyGraphQL(token, fileCreateMutation, {
      files: [{
        originalSource: target.resourceUrl,
        contentType: 'IMAGE',
        alt: `Flaberry Asset ${filename}`
      }]
    });

    const createdFile = createRes.data.fileCreate.files[0];
    const assetRecord = {
      id: createdFile.id,
      filename,
      sha256,
      category: filename.startsWith('f_') ? 'feature_icons' : filename.startsWith('i_') ? 'trust_icons' : filename.startsWith('bb_') || filename.startsWith('bv') ? 'banner_assets' : 'ui_assets',
      fileStatus: createdFile.fileStatus,
      createdAt: createdFile.createdAt
    };

    manifest.assets.push(assetRecord);
    manifest.updated_at = new Date().toISOString();
    persistManifestAtomically(manifest);
    existingFiles.add(filename);
    console.log(`  -> Successfully registered ${filename} as ${createdFile.id}`);

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`[SUCCESS] Remaining assets migration complete. Total assets in manifest: ${manifest.assets.length}`);
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
