const fs = require('fs');

const pilotManifest = {
  apiVersion: "2026-10",
  batchId: "flaberry_pilot_batch_20261118_v1",
  dryRun: true,
  createdAt: "2026-11-18T04:26:00Z",
  guardrails: {
    protectExistingMainMenu: true,
    protectExistingProducts: true,
    protectExistingFiles: true,
    publishStatusProducts: "DRAFT",
    publicationStateCollections: "UNPUBLISHED_FROM_ONLINE_STORE",
    publicationStatePages: "UNPUBLISHED",
    themeModificationAttempted: false,
    automaticRollbackDeletion: false,
    zeroPublishMutationsIncluded: true,
    stopImmediatelyOnAnyFailure: true,
    incrementalAtomicManifestPersistence: true
  },
  resourceAccounting: {
    primaryAdminRecordsCount: 9,
    primaryAdminRecordsBreakdown: {
      draftProducts: 2,
      unpublishedCollections: 2,
      unpublishedPages: 1,
      isolatedTestMenus: 1,
      generalFilesCDN: 3
    },
    attachedProductMediaObjectsCount: 2,
    attachedProductMediaBreakdown: {
      productMediaImages: 2
    },
    totalShopifyManagedObjects: 11
  },
  commercialPricingDisclaimer: "All prices are prototype reference values pending explicit merchant commercial approval. Stamped with flaberry_commercial.pricing_status = UNAPPROVED_INTERNAL_REFERENCE. Products strictly kept in DRAFT. Zero live sales enabled.",
  resourcesToCreate: {
    products: [
      {
        slot: "Pilot Product 1",
        title: "Red Rose Gift Luxe",
        sku: "FBF661",
        handle: "red-rose-gift-luxe",
        productType: "Flowers",
        tags: ["flowers", "roses", "flaberry_seed_v1", "pilot_v1"],
        status: "DRAFT",
        variantCount: 1,
        options: [
          {
            name: "Title",
            values: [{ name: "Default Title" }]
          }
        ],
        variants: [
          {
            optionValues: [{ name: "Default Title", optionName: "Title" }],
            sku: "FBF661",
            referencePriceINR: "1990.00",
            pricingApprovalStatus: "UNAPPROVED_INTERNAL_REFERENCE"
          }
        ],
        associatedMedia: {
          filename: "p0.webp",
          sha256: "f2bf61329c3ec2e5572eb0f854898492025d57b286f91d8ba02f37803a088bc8",
          mediaType: "PRODUCT_MEDIA",
          altText: "Red Rose Gift Luxe"
        }
      },
      {
        slot: "Pilot Product 2",
        title: "Chocolate Cake",
        sku: "FBC002",
        handle: "chocolate-cake",
        productType: "Cakes",
        tags: ["cakes", "chocolate-cakes", "flaberry_seed_v1", "pilot_v1"],
        status: "DRAFT",
        variantCount: 2,
        options: [
          {
            name: "Weight",
            values: [{ name: "1/2 kg" }, { name: "1 kg" }]
          }
        ],
        variants: [
          {
            optionValues: [{ name: "1/2 kg", optionName: "Weight" }],
            sku: "FBC002-05",
            referencePriceINR: "1299.00",
            pricingApprovalStatus: "UNAPPROVED_INTERNAL_REFERENCE"
          },
          {
            optionValues: [{ name: "1 kg", optionName: "Weight" }],
            sku: "FBC002-10",
            referencePriceINR: "2338.00",
            pricingApprovalStatus: "UNAPPROVED_INTERNAL_REFERENCE"
          }
        ],
        associatedMedia: {
          filename: "p125.webp",
          sha256: "7635678bb094e99f0868eb2a6132bb8214f44535039324a3501a1db79555c822",
          mediaType: "PRODUCT_MEDIA",
          altText: "Chocolate Cake"
        }
      }
    ],
    collections: [
      {
        slot: "Pilot Collection 1 (Parent Hub)",
        title: "Flowers",
        handle: "flowers",
        type: "Parent Category Hub",
        sources: [
          {
            targetType: "PRODUCTS",
            matchType: "ALL",
            condition: {
              field: "productType",
              relation: "EQUALS",
              value: "Flowers"
            }
          }
        ],
        publicationState: "UNPUBLISHED_FROM_ONLINE_STORE"
      },
      {
        slot: "Pilot Collection 2 (Sub-collection)",
        title: "Roses",
        handle: "roses",
        type: "Sub-collection",
        sources: [
          {
            targetType: "PRODUCTS",
            matchType: "ALL",
            condition: {
              field: "productTag",
              relation: "EQUALS",
              value: "roses"
            }
          }
        ],
        publicationState: "UNPUBLISHED_FROM_ONLINE_STORE"
      }
    ],
    pages: [
      {
        slot: "Pilot Page Shell 1",
        title: "Advance Order Booking",
        handle: "advance-orders",
        isPublished: false,
        templateSuffix: "advance",
        bodyHtml: "<!-- Flaberry Advance Order Booking Shell. Copy Pending Client Approval -->"
      }
    ],
    navigation: [
      {
        slot: "Pilot Test Menu",
        title: "Flaberry Navigation (Pilot Draft)",
        handle: "flaberry-nav-pilot-draft",
        isIsolated: true,
        preservesExistingMainMenu: true,
        items: [
          { title: "Flowers", url: "/collections/flowers" },
          { title: "Roses", url: "/collections/roses" },
          { title: "Advance Booking", url: "/pages/advance-orders" }
        ]
      }
    ],
    filesCDN: [
      {
        slot: "Pilot CDN Asset 1 (Hero)",
        filename: "hero_flowers.webp",
        sha256: "0c7e2ad68051752b1b369527ec5ec57218684fc80a6b5797f14b62db5a31518f",
        destination: "Shopify Files CDN",
        altText: "Send flowers across India"
      },
      {
        slot: "Pilot CDN Asset 2 (Category Tile)",
        filename: "t_roses.webp",
        sha256: "2e9b0d2d3e3ba463996f01c8901eb47b0a790cebda0d0f1a603b5f9037217594",
        destination: "Shopify Files CDN",
        altText: "Roses Category Tile"
      },
      {
        slot: "Pilot CDN Asset 3 (Trust Badge)",
        filename: "i_20yrs.png",
        sha256: "86cb9510e19a6d47b59cf8f9e616c6ba8a1cfd4850faad83ffb5879a953fe5e9",
        destination: "Shopify Files CDN",
        altText: "India's leading brand trust badge"
      }
    ]
  }
};

fs.writeFileSync('scratch/pilot_manifest_v2.json', JSON.stringify(pilotManifest, null, 2));
console.log('Saved scratch/pilot_manifest_v2.json with 11-object accounting and incremental persistence!');
