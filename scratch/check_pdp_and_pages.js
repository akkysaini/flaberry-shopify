async function checkPDP() {
  const urls = [
    'http://127.0.0.1:9393/products/red-rose-gift-luxe',
    'http://127.0.0.1:9393/products/chocolate-cake',
    'http://127.0.0.1:9393/collections/flowers',
    'http://127.0.0.1:9393/pages/about-us',
    'http://127.0.0.1:9393/pages/faq'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      console.log(`[${res.status}] ${url} (length: ${text.length} bytes)`);
      if (url.includes('/products/')) {
        console.log('  -> Contains flaberry-delivery-gifting:', text.includes('flaberry-delivery-gifting'));
        console.log('  -> Contains pincode input:', text.includes('fb-pincode-input'));
        console.log('  -> Contains slot picker:', text.includes('fb-slot-btn'));
        console.log('  -> Contains greeting message:', text.includes('fb-card-message'));
      }
      if (url.includes('/pages/')) {
        console.log('  -> Contains flaberry-page-content:', text.includes('flaberry-page-content'));
      }
    } catch (err) {
      console.error(`Error fetching ${url}: ${err.message}`);
    }
  }
}

checkPDP();
