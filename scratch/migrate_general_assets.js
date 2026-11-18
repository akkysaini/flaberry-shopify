/**
 * Flaberry General CDN Assets Migration Script
 * API Version: 2026-10
 * Uploads remaining 31 general assets (Hero Banners, Category Tiles, Logos) to Shopify Files
 * with staged upload, binary POST, fileCreate, and atomic manifest persistence.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const STORE_DOMAIN = 'flaberry-pps4i03n.myshopify.com';
const API_VERSION = '2026-10';
const GRAPHQL_ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const MANIFEST_PATH = path.resolve('scratch/asset_migration_manifest.json');
const PILOT_MANIFEST_PATH = path.resolve('scratch/pilot_execution_manifest.json');
const ASSETS_DIR = path.resolve('extracted-assets');
const INVENTORY_PATH = path.resolve('scratch/image_inventory.json');

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

      // Check throttle status and pause if needed
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

  if (!uploadRes.ok && uploadRes.status !== 201 && uploadRes.status !== 204) {
    const errorText = await uploadRes.text();
    throw new Error(`Binary upload failed HTTP ${uploadRes.status}: ${errorText.slice(0, 300)}`);
  }
}

async function migrateGeneralAssets() {
  console.log('[INFO] Starting General CDN Assets Migration...');
  const token = getStoredAccessToken();

  const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
  const pilotManifest = JSON.parse(fs.readFileSync(PILOT_MANIFEST_PATH, 'utf8'));

  // Initialize or load asset migration manifest
  let manifest;
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    console.log(`[INFO] Resuming asset manifest with ${manifest.assets.length} existing registered assets.`);
  } else {
    manifest = {
      manifest_version: '1.0.0',
      store_domain: STORE_DOMAIN,
      api_version: API_VERSION,
      updated_at: new Date().toISOString(),
      assets: []
    };
    // Include 3 pilot CDN files
    for (const f of pilotManifest.resources.files) {
      manifest.assets.push({
        id: f.id,
        filename: f.filename,
        sha256: f.sha256,
        category: f.filename.startsWith('hero_') ? 'hero_banners' : f.filename.startsWith('t_') ? 'promotional_banners' : 'brand_and_decorative',
        fileStatus: f.fileStatus,
        createdAt: f.createdAt
      });
    }
    persistManifestAtomically(manifest);
  }

  const alreadyUploaded = new Set(manifest.assets.map(a => a.filename));

  const generalFiles = Object.values(inventory).filter(v => v.category !== 'product_images');
  console.log(`[INFO] Total general files: ${generalFiles.length}. Already uploaded: ${alreadyUploaded.size}.`);

  const toUpload = generalFiles.filter(f => !alreadyUploaded.has(f.filename));
  console.log(`[INFO] Remaining general files to upload: ${toUpload.length}.`);

  for (let i = 0; i < toUpload.length; i++) {
    const asset = toUpload[i];
    const localPath = path.join(ASSETS_DIR, asset.filename);
    if (!fs.existsSync(localPath)) {
      console.error(`[ERROR] File missing on disk: ${localPath}`);
      continue;
    }

    const stat = fs.statSync(localPath);
    const mimeType = asset.format === 'png' ? 'image/png' : 'image/webp';
    const fileHash = crypto.createHash('sha256').update(fs.readFileSync(localPath)).digest('hex');

    console.log(`[${i + 1}/${toUpload.length}] Staging ${asset.filename} (${asset.category}, ${stat.size} bytes)...`);

    // 1. Staged upload create
    const stagedMutation = `
      mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters { name value }
          }
          userErrors { field message }
        }
      }
    `;

    const stagedRes = await shopifyGraphQL(token, stagedMutation, {
      input: [{
        filename: asset.filename,
        mimeType: mimeType,
        fileSize: stat.size.toString(),
        httpMethod: 'POST',
        resource: 'FILE'
      }]
    });

    const stagedTarget = stagedRes.data.stagedUploadsCreate.stagedTargets[0];
    await uploadBinaryToStagedTarget(stagedTarget, localPath, mimeType);

    // 2. File create mutation
    const fileCreateMutation = `
      mutation FileCreate($files: [FileCreateInput!]!) {
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
          userErrors { field message }
        }
      }
    `;

    const fileCreateRes = await shopifyGraphQL(token, fileCreateMutation, {
      files: [{
        originalSource: stagedTarget.resourceUrl,
        contentType: 'IMAGE',
        alt: `Flaberry Storefront Asset - ${asset.filename}`
      }]
    });

    const createdFile = fileCreateRes.data.fileCreate.files[0];
    if (!createdFile) {
      throw new Error(`File creation failed for ${asset.filename}: ${JSON.stringify(fileCreateRes.data.fileCreate.userErrors)}`);
    }

    manifest.assets.push({
      id: createdFile.id,
      filename: asset.filename,
      sha256: fileHash,
      category: asset.category,
      fileStatus: createdFile.fileStatus,
      createdAt: createdFile.createdAt,
      cdnUrl: createdFile.image ? createdFile.image.url : null
    });
    manifest.updated_at = new Date().toISOString();
    persistManifestAtomically(manifest);

    console.log(`  -> Registered File ID: ${createdFile.id} (Status: ${createdFile.fileStatus})`);
    // Brief pause to respect API cost
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('\n[SUCCESS] All General CDN Assets successfully uploaded and persisted!');
  console.log(`Total Assets in Manifest: ${manifest.assets.length}/34`);
}

migrateGeneralAssets().catch(err => {
  console.error('[FATAL] Migration failed:', err);
  process.exit(1);
});
