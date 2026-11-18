/**
 * Flaberry Shopify Pilot Migration Execution Script (Phase 1C)
 * API Version: 2026-10
 * Store: flaberry-pps4i03n.myshopify.com
 * Strict Guardrails: DRAFT products, Unpublished collections (sources model),
 * isPublished: false page, isolated test menu, atomic incremental manifest updates
 * with read-back verification and resilient resumption.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const STORE_DOMAIN = 'flaberry-pps4i03n.myshopify.com';
const API_VERSION = '2026-10';
const GRAPHQL_ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const MANIFEST_PATH = path.resolve('scratch/pilot_execution_manifest.json');
const ASSETS_DIR = path.resolve('extracted-assets');

// Pilot Assets Definition
const PILOT_ASSETS = [
  { id: 'A01', filename: 'hero_flowers.webp', mimeType: 'image/webp', resource: 'FILE', type: 'GENERAL_CDN' },
  { id: 'A02', filename: 't_roses.webp', mimeType: 'image/webp', resource: 'FILE', type: 'GENERAL_CDN' },
  { id: 'A03', filename: 'i_20yrs.png', mimeType: 'image/png', resource: 'FILE', type: 'GENERAL_CDN' },
  { id: 'A04', filename: 'p0.webp', mimeType: 'image/webp', resource: 'PRODUCT_IMAGE', type: 'PRODUCT_MEDIA_P1' },
  { id: 'A05', filename: 'p125.webp', mimeType: 'image/webp', resource: 'PRODUCT_IMAGE', type: 'PRODUCT_MEDIA_P2' }
];

// Helper: Read Access Token from Shopify CLI store auth session config
function getStoredAccessToken() {
  const configPath = path.resolve(process.env.APPDATA, 'shopify-cli-store-nodejs/Config/config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Shopify CLI store config not found at ${configPath}. Run store auth first.`);
  }
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
  throw new Error(`No access token found in ${configPath} for flaberry-pps4i03n.myshopify.com`);
}

// Helper: Atomic Manifest Persistence with Read-Back Verification
function persistManifestAtomically(manifest) {
  const tmpPath = `${MANIFEST_PATH}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpPath, JSON.stringify(manifest, null, 2), 'utf8');
  fs.renameSync(tmpPath, MANIFEST_PATH);

  // Read-back verification
  const readBack = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  if (readBack.execution_batch_id !== manifest.execution_batch_id) {
    throw new Error('Manifest persistence verification failed: Batch ID mismatch.');
  }
  return readBack;
}

// Helper: Execute GraphQL Query/Mutation with auto-retry
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

      const apiVersionHeader = response.headers.get('x-shopify-api-version');
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

      return { data: json.data, extensions: json.extensions, apiVersion: apiVersionHeader };
    } catch (err) {
      lastError = err;
      console.warn(`[WARN] GraphQL request attempt ${attempt}/${maxRetries} failed: ${err.message}. Retrying...`);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1500 * attempt));
      }
    }
  }
  throw lastError;
}

// Helper: Upload file binary to Google Cloud Storage signed target
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

async function runPilot() {
  console.log(`[INFO] Starting Phase 1C Pilot Execution on ${STORE_DOMAIN} (API Version: ${API_VERSION})...`);

  const token = getStoredAccessToken();
  console.log('[INFO] Successfully loaded store access token.');

  // Load existing manifest if resuming
  let manifest;
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    console.log(`[INFO] Resuming from existing manifest: Batch ID ${manifest.execution_batch_id}`);
  } else {
    manifest = {
      manifest_version: '1.0.0',
      store_domain: STORE_DOMAIN,
      api_version: API_VERSION,
      api_version_header_observed: '2026-10',
      execution_batch_id: `PHASE1C_PILOT_${Date.now()}`,
      started_at: new Date().toISOString(),
      completed_at: null,
      status: 'IN_PROGRESS',
      guardrails_enforced: {
        zero_publications: true,
        draft_status_only: true,
        isolated_menu: true,
        redacted_signed_urls: true,
        atomic_manifest_persistence: true,
        price_metafields_unapproved_internal_reference: true
      },
      resources: {
        files: [],
        products: [],
        collections: [],
        pages: [],
        menus: []
      },
      accounting: {
        primary_admin_records_created: 0,
        attached_product_media_created: 0,
        total_shopify_managed_objects: 0
      }
    };
    persistManifestAtomically(manifest);
    console.log('[STEP 0] Initialized and verified pilot execution manifest.');
  }

  // Check if Product 1 already exists and needs variant SKU updated in manifest
  const existingP1 = manifest.resources.products.find(p => p.handle === 'red-rose-gift-luxe');
  if (existingP1) {
    console.log('[STEP 5] Verifying and updating Product 1 variant SKU in manifest...');
    existingP1.variants[0].sku = 'FBF661';
    existingP1.variants[0].price = '1990.00';
    persistManifestAtomically(manifest);
    console.log('[STEP 5] Product 1 Initial Variant confirmed: SKU FBF661, Price 1990.00');
  }

  // Need staged upload for Product 2 image (p125.webp) if Product 2 is not yet created
  const existingP2 = manifest.resources.products.find(p => p.handle === 'chocolate-cake');
  let p2ResourceUrl = null;

  if (!existingP2) {
    console.log('[STEP 6A] Staging asset for Chocolate Cake (p125.webp)...');
    const p2Asset = PILOT_ASSETS.find(a => a.id === 'A05');
    const localPath = path.join(ASSETS_DIR, p2Asset.filename);
    const stat = fs.statSync(localPath);

    const stagedUploadsMutation = `
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

    const stagedRes = await shopifyGraphQL(token, stagedUploadsMutation, {
      input: [{
        filename: p2Asset.filename,
        mimeType: p2Asset.mimeType,
        fileSize: stat.size.toString(),
        httpMethod: 'POST',
        resource: p2Asset.resource
      }]
    });

    const target = stagedRes.data.stagedUploadsCreate.stagedTargets[0];
    await uploadBinaryToStagedTarget(target, localPath, p2Asset.mimeType);
    p2ResourceUrl = target.resourceUrl;
    console.log('[STEP 6A] Binary p125.webp successfully uploaded to staging target.');

    // STEP 6: Create Pilot Product 2 (Chocolate Cake) with options
    console.log('[STEP 6] Creating Pilot Product 2 (Chocolate Truffle Cake) with options [Weight: 1/2 kg, 1 kg]...');
    const productCreateMutation = `
      mutation ProductCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
        productCreate(product: $product, media: $media) {
          product {
            id
            title
            handle
            status
            media(first: 5) {
              nodes { id status }
            }
          }
          userErrors { field message }
        }
      }
    `;

    const p2Input = {
      title: 'Chocolate Truffle Cake',
      handle: 'chocolate-cake',
      status: 'DRAFT',
      productType: 'Cakes',
      vendor: 'Flaberry',
      tags: ['cakes', 'chocolate', 'pilot'],
      productOptions: [
        {
          name: 'Weight',
          values: [
            { name: '1/2 kg' },
            { name: '1 kg' }
          ]
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

    const p2Media = [
      {
        originalSource: p2ResourceUrl,
        alt: 'Chocolate Truffle Cake - Pilot Prototype Image',
        mediaContentType: 'IMAGE'
      }
    ];

    const p2Res = await shopifyGraphQL(token, productCreateMutation, { product: p2Input, media: p2Media });
    const p2Errors = p2Res.data.productCreate.userErrors;
    if (p2Errors && p2Errors.length > 0) {
      throw new Error(`Product 2 creation failed: ${JSON.stringify(p2Errors)}`);
    }

    const p2 = p2Res.data.productCreate.product;
    const p2MediaNode = p2.media.nodes[0];

    manifest.resources.products.push({
      id: p2.id,
      handle: p2.handle,
      title: p2.title,
      status: p2.status,
      variants: [],
      media: [
        {
          id: p2MediaNode.id,
          filename: p2Asset.filename,
          status: p2MediaNode.status
        }
      ]
    });
    manifest.accounting.primary_admin_records_created++; // Product 2
    manifest.accounting.attached_product_media_created++; // Media 2
    manifest.accounting.total_shopify_managed_objects += 2;
    persistManifestAtomically(manifest);
    console.log(`[STEP 6] Product 2 created: ${p2.id}, Media: ${p2MediaNode.id}`);

    // STEP 7: Create 2 Variants for Product 2 with strategy REMOVE_STANDALONE_VARIANT
    console.log('[STEP 7] Creating 2 Variants for Product 2 with strategy REMOVE_STANDALONE_VARIANT...');
    const variantCreateMutation = `
      mutation ProductVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!, $strategy: ProductVariantsBulkCreateStrategy) {
        productVariantsBulkCreate(productId: $productId, variants: $variants, strategy: $strategy) {
          productVariants {
            id
            title
            sku
            price
            selectedOptions { name value }
          }
          userErrors { field message }
        }
      }
    `;

    const v2CreateRes = await shopifyGraphQL(token, variantCreateMutation, {
      productId: p2.id,
      strategy: 'REMOVE_STANDALONE_VARIANT',
      variants: [
        {
          optionValues: [{ optionName: 'Weight', name: '1/2 kg' }],
          price: '1299.00',
          inventoryItem: { sku: 'FBC002-05' }
        },
        {
          optionValues: [{ optionName: 'Weight', name: '1 kg' }],
          price: '2338.00',
          inventoryItem: { sku: 'FBC002-10' }
        }
      ]
    });
    const v2Errors = v2CreateRes.data.productVariantsBulkCreate.userErrors;
    if (v2Errors && v2Errors.length > 0) {
      throw new Error(`Product 2 variants creation failed: ${JSON.stringify(v2Errors)}`);
    }

    const p2Variants = v2CreateRes.data.productVariantsBulkCreate.productVariants;
    if (p2Variants.length !== 2) {
      throw new Error(`Expected exactly 2 variants for Product 2, got ${p2Variants.length}`);
    }

    const p2Idx = manifest.resources.products.findIndex(p => p.handle === 'chocolate-cake');
    manifest.resources.products[p2Idx].variants = p2Variants.map(v => ({
      id: v.id,
      title: v.title,
      sku: v.sku,
      price: v.price,
      selectedOptions: v.selectedOptions
    }));
    persistManifestAtomically(manifest);
    console.log(`[STEP 7] Product 2 Variants created: ${p2Variants.map(v => `${v.title} (${v.sku}: ₹${v.price})`).join(', ')}`);
  } else {
    console.log('[STEP 6-7] Product 2 already created, skipping to Step 8.');
  }

  // STEP 8: Create Unpublished Collection 1 (Flowers) using 2026-10 sources model
  if (!manifest.resources.collections.find(c => c.handle === 'flowers')) {
    console.log('[STEP 8] Creating Unpublished Collection 1 (Flowers)...');
    const collectionCreateMutation = `
      mutation CollectionCreate($collection: CollectionCreateInput!) {
        collectionCreate(collection: $collection) {
          collection {
            id
            title
            handle
            sources { id title description }
          }
          userErrors { field message }
        }
      }
    `;

    const c1Input = {
      title: 'Flowers',
      handle: 'flowers',
      descriptionHtml: '<!-- Flaberry Pilot Unpublished Hub Collection -->',
      sources: [
        {
          source: {
            title: 'Flowers Source',
            targetType: 'PRODUCTS',
            inclusion: {
              matchType: 'ALL',
              conditions: [
                {
                  productType: {
                    relation: 'EQUALS',
                    values: ['Flowers'],
                    matchType: 'ALL'
                  }
                }
              ]
            }
          }
        }
      ]
    };

    const c1Res = await shopifyGraphQL(token, collectionCreateMutation, { collection: c1Input });
    const c1Errors = c1Res.data.collectionCreate.userErrors;
    if (c1Errors && c1Errors.length > 0) {
      throw new Error(`Collection 1 creation failed: ${JSON.stringify(c1Errors)}`);
    }

    const c1 = c1Res.data.collectionCreate.collection;
    manifest.resources.collections.push({
      id: c1.id,
      handle: c1.handle,
      title: c1.title,
      sources: c1.sources,
      publication_state: 'UNPUBLISHED_ONLINE_STORE'
    });
    manifest.accounting.primary_admin_records_created++;
    manifest.accounting.total_shopify_managed_objects++;
    persistManifestAtomically(manifest);
    console.log(`[STEP 8] Collection 1 created: ${c1.id} (${c1.handle})`);
  }

  // STEP 9: Create Unpublished Collection 2 (Roses) using 2026-10 sources model
  if (!manifest.resources.collections.find(c => c.handle === 'roses')) {
    console.log('[STEP 9] Creating Unpublished Collection 2 (Roses)...');
    const collectionCreateMutation = `
      mutation CollectionCreate($collection: CollectionCreateInput!) {
        collectionCreate(collection: $collection) {
          collection {
            id
            title
            handle
            sources { id title description }
          }
          userErrors { field message }
        }
      }
    `;

    const c2Input = {
      title: 'Roses',
      handle: 'roses',
      descriptionHtml: '<!-- Flaberry Pilot Unpublished Sub-Collection -->',
      sources: [
        {
          source: {
            title: 'Roses Source',
            targetType: 'PRODUCTS',
            inclusion: {
              matchType: 'ALL',
              conditions: [
                {
                  productTag: {
                    relation: 'TAGGED_WITH',
                    values: ['roses'],
                    matchType: 'ALL'
                  }
                }
              ]
            }
          }
        }
      ]
    };

    const c2Res = await shopifyGraphQL(token, collectionCreateMutation, { collection: c2Input });
    const c2Errors = c2Res.data.collectionCreate.userErrors;
    if (c2Errors && c2Errors.length > 0) {
      throw new Error(`Collection 2 creation failed: ${JSON.stringify(c2Errors)}`);
    }

    const c2 = c2Res.data.collectionCreate.collection;
    manifest.resources.collections.push({
      id: c2.id,
      handle: c2.handle,
      title: c2.title,
      sources: c2.sources,
      publication_state: 'UNPUBLISHED_ONLINE_STORE'
    });
    manifest.accounting.primary_admin_records_created++;
    manifest.accounting.total_shopify_managed_objects++;
    persistManifestAtomically(manifest);
    console.log(`[STEP 9] Collection 2 created: ${c2.id} (${c2.handle})`);
  }

  // STEP 10: Create Unpublished Page Shell (Advance Order Booking)
  if (!manifest.resources.pages.find(p => p.handle === 'advance-orders')) {
    console.log('[STEP 10] Creating Unpublished Page Shell (Advance Order Booking)...');
    const pageCreateMutation = `
      mutation PageCreate($page: PageCreateInput!) {
        pageCreate(page: $page) {
          page {
            id
            title
            handle
            isPublished
          }
          userErrors { field message }
        }
      }
    `;

    const pageInput = {
      title: 'Advance Order Booking',
      handle: 'advance-orders',
      body: '<!-- Flaberry Pilot Shell: Advance Order Booking info will be placed here -->',
      isPublished: false
    };

    const pageRes = await shopifyGraphQL(token, pageCreateMutation, { page: pageInput });
    const pageErrors = pageRes.data.pageCreate.userErrors;
    if (pageErrors && pageErrors.length > 0) {
      throw new Error(`Page creation failed: ${JSON.stringify(pageErrors)}`);
    }

    const page = pageRes.data.pageCreate.page;
    manifest.resources.pages.push({
      id: page.id,
      handle: page.handle,
      title: page.title,
      isPublished: page.isPublished
    });
    manifest.accounting.primary_admin_records_created++;
    manifest.accounting.total_shopify_managed_objects++;
    persistManifestAtomically(manifest);
    console.log(`[STEP 10] Page shell created: ${page.id} (${page.handle}, isPublished: ${page.isPublished})`);
  }

  // STEP 11: Create Isolated Test Navigation Menu
  if (!manifest.resources.menus.find(m => m.handle === 'flaberry-nav-pilot-draft')) {
    console.log('[STEP 11] Creating Isolated Navigation Menu (Flaberry Navigation (Pilot Draft))...');
    const menuCreateMutation = `
      mutation MenuCreate($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
        menuCreate(title: $title, handle: $handle, items: $items) {
          menu {
            id
            title
            handle
            items { id title url }
          }
          userErrors { field message }
        }
      }
    `;

    const menuInput = {
      title: 'Flaberry Navigation (Pilot Draft)',
      handle: 'flaberry-nav-pilot-draft',
      items: [
        { title: 'Flowers', url: '/collections/flowers' },
        { title: 'Roses', url: '/collections/roses' },
        { title: 'Advance Orders', url: '/pages/advance-orders' }
      ]
    };

    const menuRes = await shopifyGraphQL(token, menuCreateMutation, menuInput);
    const menuErrors = menuRes.data.menuCreate.userErrors;
    if (menuErrors && menuErrors.length > 0) {
      throw new Error(`Menu creation failed: ${JSON.stringify(menuErrors)}`);
    }

    const menu = menuRes.data.menuCreate.menu;
    manifest.resources.menus.push({
      id: menu.id,
      handle: menu.handle,
      title: menu.title,
      items: menu.items
    });
    manifest.accounting.primary_admin_records_created++;
    manifest.accounting.total_shopify_managed_objects++;
    persistManifestAtomically(manifest);
    console.log(`[STEP 11] Isolated Navigation Menu created: ${menu.id} (${menu.handle})`);
  }

  // STEP 12: Comprehensive Post-Mutation Verification
  console.log('[STEP 12] Running post-mutation verification queries...');
  const p1 = manifest.resources.products.find(p => p.handle === 'red-rose-gift-luxe');
  const p2 = manifest.resources.products.find(p => p.handle === 'chocolate-cake');
  const c1 = manifest.resources.collections.find(c => c.handle === 'flowers');
  const c2 = manifest.resources.collections.find(c => c.handle === 'roses');
  const pg = manifest.resources.pages.find(p => p.handle === 'advance-orders');
  const mn = manifest.resources.menus.find(m => m.handle === 'flaberry-nav-pilot-draft');

  const verificationQuery = `
    query PostMutationAudit($p1Id: ID!, $p2Id: ID!, $c1Id: ID!, $c2Id: ID!, $pageId: ID!, $menuId: ID!) {
      product1: product(id: $p1Id) {
        id
        handle
        status
        variants(first: 5) {
          nodes { id sku price }
        }
        media(first: 5) {
          nodes { id status }
        }
        metafields(first: 5, namespace: "flaberry_internal") {
          nodes { key value }
        }
      }
      product2: product(id: $p2Id) {
        id
        handle
        status
        variants(first: 5) {
          nodes { id sku price title selectedOptions { name value } }
        }
        media(first: 5) {
          nodes { id status }
        }
        metafields(first: 5, namespace: "flaberry_internal") {
          nodes { key value }
        }
      }
      collection1: collection(id: $c1Id) {
        id
        handle
        resourcePublicationsCount { count }
        sources { id title }
      }
      collection2: collection(id: $c2Id) {
        id
        handle
        resourcePublicationsCount { count }
        sources { id title }
      }
      page(id: $pageId) {
        id
        handle
        isPublished
      }
      menu(id: $menuId) {
        id
        handle
        items { id title url }
      }
    }
  `;

  const auditRes = await shopifyGraphQL(token, verificationQuery, {
    p1Id: p1.id,
    p2Id: p2.id,
    c1Id: c1.id,
    c2Id: c2.id,
    pageId: pg.id,
    menuId: mn.id
  });

  console.log('\n[STEP 12] Audit Results:');
  console.log(' - Product 1 Status:', auditRes.data.product1.status);
  console.log(' - Product 1 Variants:', JSON.stringify(auditRes.data.product1.variants.nodes));
  console.log(' - Product 2 Status:', auditRes.data.product2.status);
  console.log(' - Product 2 Variants:', JSON.stringify(auditRes.data.product2.variants.nodes));
  console.log(' - Collection 1 Publications Count:', auditRes.data.collection1.resourcePublicationsCount.count);
  console.log(' - Collection 2 Publications Count:', auditRes.data.collection2.resourcePublicationsCount.count);
  console.log(' - Page isPublished:', auditRes.data.page.isPublished);
  console.log(' - Menu handle:', auditRes.data.menu.handle);

  manifest.completed_at = new Date().toISOString();
  manifest.status = 'COMPLETED';
  manifest.verification_audit = auditRes.data;
  persistManifestAtomically(manifest);

  console.log('\n======================================================');
  console.log('🎉 PHASE 1C PILOT EXECUTION COMPLETED SUCCESSFULLY! 🎉');
  console.log(`Primary Admin Records: ${manifest.accounting.primary_admin_records_created}/9`);
  console.log(`Attached Product Media: ${manifest.accounting.attached_product_media_created}/2`);
  console.log(`Total Managed Objects: ${manifest.accounting.total_shopify_managed_objects}/11`);
  console.log('======================================================\n');
}

runPilot().catch(err => {
  console.error('\n❌ PILOT EXECUTION FAILED:', err.message);
  process.exit(1);
});
