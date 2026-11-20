const fs = require('fs');
let raw = fs.readFileSync('theme/sections/footer-group.json', 'utf8');
const commentMatch = raw.match(/\/\*[\s\S]*?\*\/\s*/);
const comment = commentMatch ? commentMatch[0] : '';
const jsonStr = raw.replace(/\/\*[\s\S]*?\*\/\s*/, '');
const fg = JSON.parse(jsonStr);

fg.sections.flaberry_footer = {
  type: 'flaberry-footer',
  settings: {
    bg_color: '#1e1b4b',
    brand_text: "India's leading brand for flowers, cakes, plants and gifts. Same-day, midnight and advance-date delivery to 500+ cities.",
    show_newsletter: true,
    newsletter_placeholder: 'Email for offers',
    newsletter_btn_text: 'Subscribe',
    support_hours: 'Help 8 AM – midnight IST',
    support_phone: '+91 76685 23752',
    support_email: 'customerservice@flaberry.com',
    facebook_url: 'https://www.facebook.com/flaberry',
    twitter_url: 'https://twitter.com/iamflaberry',
    instagram_url: 'https://www.instagram.com/flaberryofficial',
    col1_heading: 'INFORMATION',
    col2_heading: 'HELP SERVICES',
    col3_heading: 'SUPPORT',
    col4_heading: 'POLICIES',
    show_payment_badge: true,
    payment_methods_text: 'UPI · RuPay · Net banking · Wallets',
    copyright_text: '© 2026 Flaberry. All rights reserved.',
    credit_text: 'Website by',
    credit_name: 'Probey Services',
    credit_url: 'https://www.probeyservices.com'
  }
};

fg.order = ['flaberry_footer'];

fs.writeFileSync('theme/sections/footer-group.json', comment + JSON.stringify(fg, null, 2) + '\n', 'utf8');
console.log('Successfully updated footer-group.json');
