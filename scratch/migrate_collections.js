/**
 * Flaberry Full Collections Migration Script (57 Collections)
 * API Version: 2026-10
 * Creates all 57 collections in Shopify Admin using modern sources model.
 * Preserves unpublished status (no Online Store publication).
 * Tracks GIDs incrementally in scratch/collection_migration_manifest.json.
 */

import fs from 'node:fs';
import path from 'node:path';

const STORE_DOMAIN = 'flaberry-pps4i03n.myshopify.com';
const API_VERSION = '2026-10';
const GRAPHQL_ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const MANIFEST_PATH = path.resolve('scratch/collection_migration_manifest.json');
const VALIDATION_PATH = path.resolve('scratch/reconciled_collection_validation.json');
const PILOT_MANIFEST_PATH = path.resolve('scratch/pilot_execution_manifest.json');

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

      // Check throttle status
      if (json.extensions && json.extensions.cost) {
        const cost = json.extensions.cost;
        if (cost.throttleStatus && cost.throttleStatus.currentlyAvailable < 300) {
          console.log(`[THROTTLE] Cost limit nearing, cooling down for 2000ms...`);
          await new Promise(r => setTimeout(r, 2000));
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

async function migrateCollections() {
  console.log('[INFO] Starting 57 Collections Migration...');
  const token = getStoredAccessToken();

  const valData = JSON.parse(fs.readFileSync(VALIDATION_PATH, 'utf8'));
  const pilotManifest = JSON.parse(fs.readFileSync(PILOT_MANIFEST_PATH, 'utf8'));

  // Initialize or load manifest
  let manifest;
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    console.log(`[INFO] Resuming collection manifest with ${manifest.collections.length} collections.`);
  } else {
    manifest = {
      manifest_version: '1.0.0',
      store_domain: STORE_DOMAIN,
      api_version: API_VERSION,
      updated_at: new Date().toISOString(),
      collections: []
    };
    // Include 2 pilot collections
    for (const c of pilotManifest.resources.collections) {
      manifest.collections.push({
        id: c.id,
        handle: c.handle,
        title: c.title,
        rule: c.rule,
        publication_state: c.publication_state
      });
    }
    persistManifestAtomically(manifest);
  }

  const existingHandles = new Set(manifest.collections.map(c => c.handle));

  const collectionCreateMutation = `
    mutation CollectionCreate($collection: CollectionCreateInput!) {
      collectionCreate(collection: $collection) {
        collection {
          id
          title
          handle
          sources { id title }
        }
        userErrors { field message }
      }
    }
  `;

  for (let i = 0; i < valData.results.length; i++) {
    const item = valData.results[i];
    if (existingHandles.has(item.handle)) {
      console.log(`[${i + 1}/${valData.results.length}] ${item.title} (${item.handle}) already created, skipping.`);
      continue;
    }

    console.log(`[${i + 1}/${valData.results.length}] Creating ${item.title} (${item.handle}) [${item.group}]...`);

    const isTypeRule = item.rule.startsWith('productType');
    const ruleVal = isTypeRule
      ? item.rule.replace('productType EQUALS ', '').trim()
      : item.rule.replace('productTag EQUALS ', '').trim();

    const condition = isTypeRule
      ? {
          productType: {
            relation: 'EQUALS',
            values: [ruleVal],
            matchType: 'ANY'
          }
        }
      : {
          productTag: {
            relation: 'TAGGED_WITH',
            values: [ruleVal],
            matchType: 'ANY'
          }
        };

    const cInput = {
      title: item.title,
      handle: item.handle,
      descriptionHtml: `<!-- Flaberry ${item.group} Collection -->`,
      sources: [
        {
          source: {
            title: `${item.title} Source`,
            targetType: 'PRODUCTS',
            inclusion: {
              matchType: 'ALL',
              conditions: [condition]
            }
          }
        }
      ]
    };

    const res = await shopifyGraphQL(token, collectionCreateMutation, { collection: cInput });
    const errors = res.data.collectionCreate.userErrors;
    if (errors && errors.length > 0) {
      console.error(`[ERROR] Failed to create collection ${item.handle}:`, errors);
      throw new Error(`Collection creation failed for ${item.handle}: ${JSON.stringify(errors)}`);
    }

    const created = res.data.collectionCreate.collection;
    manifest.collections.push({
      id: created.id,
      handle: created.handle,
      title: created.title,
      group: item.group,
      rule: item.rule,
      publication_state: 'UNPUBLISHED_ONLINE_STORE',
      sources: created.sources
    });
    manifest.updated_at = new Date().toISOString();
    persistManifestAtomically(manifest);

    console.log(`  -> GID: ${created.id}`);
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n[SUCCESS] All 57 Collections successfully migrated and persisted!');
  console.log(`Total collections in manifest: ${manifest.collections.length}/57`);
}

migrateCollections().catch(err => {
  console.error('[FATAL] Collection migration failed:', err);
  process.exit(1);
});
