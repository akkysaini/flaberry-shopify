/**
 * Flaberry Content Pages Migration Script
 * API Version: 2026-10
 * Creates all required page shells and populates content from approved prototype sources.
 * Preserves isPublished: false (unpublished status).
 */

import fs from 'node:fs';
import path from 'node:path';

const STORE_DOMAIN = 'flaberry-pps4i03n.myshopify.com';
const API_VERSION = '2026-10';
const GRAPHQL_ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const MANIFEST_PATH = path.resolve('scratch/page_migration_manifest.json');
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
        throw new Error(`GraphQL HTTP ${response.status} Non-JSON: ${responseText.slice(0, 400)}`);
      }

      if (json.errors && json.errors.length > 0) {
        throw new Error(`GraphQL Errors: ${JSON.stringify(json.errors)}`);
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

const PAGES_DATA = [
  {
    title: 'About Us',
    handle: 'about-us',
    body: `
      <div class="flaberry-page-content flaberry-about-page">
        <p class="lead">Flaberry is India's leading brand for flowers, cakes, plants and gifts, delivering to 500+ cities with same-day and midnight options.</p>
        <h2>Fresher by Design</h2>
        <p>Our flowers reach you within two to three days of being hand-picked, so they last longer than flowers from the open market. We run our own warehouses in major cities across India.</p>
        <h2>How We Work</h2>
        <ul>
          <li>Own fulfillment warehouses in major metropolitan areas</li>
          <li>2,500+ vetted partner merchants across India</li>
          <li>Every greeting message is printed and placed with the gift</li>
          <li>Dedicated customer support 8 AM – midnight IST, 365 days a year</li>
        </ul>
        <div class="stats-grid" style="display:flex;gap:24px;margin:30px 0;flex-wrap:wrap">
          <div class="stat-card" style="background:#f5f2f0;padding:20px;border-radius:12px;text-align:center;min-width:140px">
            <b style="font-size:28px;color:#c94a29;display:block">500+</b>
            <span>Cities Covered</span>
          </div>
          <div class="stat-card" style="background:#f5f2f0;padding:20px;border-radius:12px;text-align:center;min-width:140px">
            <b style="font-size:28px;color:#c94a29;display:block">2,500+</b>
            <span>Partner Merchants</span>
          </div>
          <div class="stat-card" style="background:#f5f2f0;padding:20px;border-radius:12px;text-align:center;min-width:140px">
            <b style="font-size:28px;color:#c94a29;display:block">2-3 Days</b>
            <span>From Hand-Picking</span>
          </div>
        </div>
      </div>
    `
  },
  {
    title: 'Corporate Gifting',
    handle: 'corporate-gifting',
    body: `
      <div class="flaberry-page-content flaberry-corporate-page">
        <p class="lead">Festive hampers, client appreciation gifts, office celebrations, and event floral décor — delivered to multiple addresses on the dates you choose.</p>
        <h2>Why Corporate Gifting with Flaberry?</h2>
        <ul>
          <li>Bulk orders to hundreds of cities in one single CSV upload</li>
          <li>Custom branding on greeting cards, ribbon wraps, and gift boxes</li>
          <li>Monthly consolidated GST invoices with input tax credit eligibility</li>
          <li>Dedicated corporate account manager for tailored gifting solutions</li>
        </ul>
        <div class="corporate-contact-card" style="background:#f5f2f0;padding:24px;border-radius:16px;margin:28px 0;max-width:480px">
          <h3 style="margin-top:0">Bulk & Corporate Enquiries</h3>
          <p>Contact our dedicated corporate gifting desk:</p>
          <p><strong>Krishna, Manager</strong></p>
          <p>Phone: <a href="tel:+917668523752">+91 76685 23752</a></p>
          <p>Email: <a href="mailto:customerservice@flaberry.com">customerservice@flaberry.com</a></p>
        </div>
      </div>
    `
  },
  {
    title: 'Serviceable Pincodes',
    handle: 'serviceable-pincodes',
    body: `
      <div class="flaberry-page-content flaberry-pincodes-page">
        <p class="lead">Flaberry delivers across 500+ cities and over 12,000 pincodes in India with Same-Day, Fixed-Time, and Midnight delivery options.</p>
        <p>Check delivery availability for your specific pincode directly on any product page using our live pincode checker tool, or contact our support team if your delivery area is not listed.</p>
      </div>
    `
  },
  {
    title: 'Delivery Cities',
    handle: 'delivery-cities',
    body: `
      <div class="flaberry-page-content flaberry-cities-page">
        <p class="lead">Flaberry provides express flower, cake, and gift delivery in over 500 Indian cities through our specialized delivery network.</p>
        <h2>Key Delivery Hubs</h2>
        <p>Delhi NCR (Delhi, Noida, Gurgaon, Faridabad, Ghaziabad), Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Chandigarh, Lucknow, Kochi, Indore, Bhopal, Surat, Vadodara, Patna, and more.</p>
      </div>
    `
  },
  {
    title: 'Contact Us',
    handle: 'contact-us',
    body: `
      <div class="flaberry-page-content flaberry-contact-page">
        <h2>Customer Support</h2>
        <p>We are here to assist you from 8:00 AM to midnight IST, every day of the week.</p>
        <div style="background:#f5f2f0;padding:24px;border-radius:16px;margin:24px 0;max-width:500px">
          <p><strong>Phone:</strong> <a href="tel:+917668523752">+91 76685 23752</a></p>
          <p><strong>Email:</strong> <a href="mailto:customerservice@flaberry.com">customerservice@flaberry.com</a></p>
          <p><strong>WhatsApp:</strong> <a href="https://wa.me/917668523752" target="_blank" rel="noopener" style="color:#25d366;font-weight:600">Chat with us on WhatsApp</a></p>
          <p><strong>Support & Corporate Enquiries:</strong> Krishna, Manager</p>
        </div>
      </div>
    `
  },
  {
    title: 'Frequently Asked Questions',
    handle: 'faq',
    body: `
      <div class="flaberry-page-content flaberry-faq-page">
        <h2>Frequently Asked Questions</h2>
        <h3>How fresh are the flowers delivered?</h3>
        <p>Our flowers are sourced directly from growers and reach our hubs within 2 to 3 days of being hand-picked. They are kept in climate-controlled environments and arranged fresh right before dispatch.</p>
        <h3>Can I schedule delivery for a future date?</h3>
        <p>Yes, you can schedule your delivery up to 90 days in advance on any product page. Choose your preferred delivery date and time slot (Morning, Afternoon, Evening, Fixed Time, or Midnight).</p>
        <h3>What if the recipient is not at home?</h3>
        <p>Our delivery partner attempts contact with both recipient and sender. If unavailable, we coordinate with the sender for safe drop-off with a neighbour or security desk, or reschedule where possible.</p>
        <h3>Can I change the greeting message after placing an order?</h3>
        <p>Yes, you can modify your card message up to 6 hours before the scheduled dispatch time by contacting customer support with your Order ID.</p>
      </div>
    `
  },
  {
    title: 'Terms & Conditions',
    handle: 'terms-and-conditions',
    body: `
      <div class="flaberry-page-content flaberry-terms-page">
        <h2>Terms of Service</h2>
        <p>Welcome to Flaberry. By accessing and using our website and services, you agree to comply with and be bound by the terms and conditions outlined herein.</p>
        <p>Orders placed on Flaberry are subject to product availability and regional serviceability. Perishable items like flowers and fresh bakery cakes are prepared upon order confirmation.</p>
      </div>
    `
  },
  {
    title: 'Privacy Policy',
    handle: 'privacy-policy',
    body: `
      <div class="flaberry-page-content flaberry-privacy-page">
        <h2>Privacy Policy</h2>
        <p>At Flaberry, we respect your privacy and are committed to protecting your personal information. We collect information only necessary to fulfill your orders, provide customer support, and improve your gifting experience.</p>
        <p>We do not sell, rent, or trade your personal data to third parties. All transactions are securely processed through PCI-DSS compliant payment gateways.</p>
      </div>
    `
  },
  {
    title: 'Cancellation & Refund Policy',
    handle: 'refund-policy',
    body: `
      <div class="flaberry-page-content flaberry-refund-page">
        <h2>Cancellation & Refund Policy</h2>
        <p>Because flowers, cakes, and gourmet edibles are fresh and perishable, order cancellation requests must be submitted at least 24 hours prior to the scheduled delivery date.</p>
        <p>In the unlikely event of non-delivery, damaged goods, or fulfillment discrepancy, please notify our customer care team within 24 hours of delivery with photographic evidence for prompt investigation and replacement or refund.</p>
      </div>
    `
  }
];

async function migratePages() {
  console.log('[INFO] Starting Content Pages Migration...');
  const token = getStoredAccessToken();

  let manifest;
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } else {
    manifest = {
      manifest_version: '1.0.0',
      store_domain: STORE_DOMAIN,
      api_version: API_VERSION,
      updated_at: new Date().toISOString(),
      pages: []
    };
    // Include pilot page if present
    if (fs.existsSync(PILOT_MANIFEST_PATH)) {
      const pm = JSON.parse(fs.readFileSync(PILOT_MANIFEST_PATH, 'utf8'));
      if (pm.resources && pm.resources.pages) {
        for (const p of pm.resources.pages) {
          manifest.pages.push(p);
        }
      }
    }
    persistManifestAtomically(manifest);
  }

  const existingHandles = new Set(manifest.pages.map(p => p.handle));

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

  for (let i = 0; i < PAGES_DATA.length; i++) {
    const pData = PAGES_DATA[i];
    if (existingHandles.has(pData.handle)) {
      console.log(`[${i + 1}/${PAGES_DATA.length}] Page "${pData.title}" (${pData.handle}) already created, skipping.`);
      continue;
    }

    console.log(`[${i + 1}/${PAGES_DATA.length}] Creating Page "${pData.title}" (${pData.handle})...`);

    const pageInput = {
      title: pData.title,
      handle: pData.handle,
      body: pData.body,
      isPublished: false // Unpublished per strict guardrails
    };

    const res = await shopifyGraphQL(token, pageCreateMutation, { page: pageInput });
    const errors = res.data.pageCreate.userErrors;
    if (errors && errors.length > 0) {
      console.error(`[ERROR] Page creation failed for ${pData.handle}:`, errors);
      throw new Error(`Page creation failed for ${pData.handle}: ${JSON.stringify(errors)}`);
    }

    const created = res.data.pageCreate.page;
    manifest.pages.push({
      id: created.id,
      handle: created.handle,
      title: created.title,
      isPublished: created.isPublished
    });
    manifest.updated_at = new Date().toISOString();
    persistManifestAtomically(manifest);

    console.log(`  -> GID: ${created.id}`);
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\n[SUCCESS] Content Pages Migration Completed!');
  console.log(`Total Pages in Manifest: ${manifest.pages.length}`);
}

migratePages().catch(err => {
  console.error('[FATAL] Pages migration failed:', err);
  process.exit(1);
});
