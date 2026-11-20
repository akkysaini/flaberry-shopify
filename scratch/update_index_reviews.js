const fs = require('fs');
const index = JSON.parse(fs.readFileSync('theme/templates/index.json', 'utf8'));

index.sections.flaberry_reviews = {
  type: 'flaberry-reviews',
  settings: {
    eyebrow: 'CUSTOMER STORIES',
    stars: '★★★★★',
    subtitle: 'Verified reviews from customers across India',
    button_label: 'Read all reviews',
    button_link: 'shopify://pages/reviews',
    trust_1_title: "India's leading brand",
    trust_1_sub: 'for flowers, cakes & gifts',
    trust_2_title: 'No hidden charges',
    trust_2_sub: 'Prices include taxes',
    trust_3_title: 'Customer support',
    trust_3_sub: '8 AM – midnight IST',
    trust_4_title: '100% safe',
    trust_4_sub: '& secure payments'
  },
  blocks: {
    rev_1: {
      type: 'review',
      settings: {
        author: 'Ananya R.',
        avatar_initial: 'A',
        location: 'Houston, USA',
        tagline: 'Anniversary · Pune',
        stars: 5,
        quote: 'Sent roses and a truffle cake to my parents in Pune for their anniversary. Delivered on the exact date, flowers looked just like the photo.'
      }
    },
    rev_2: {
      type: 'review',
      settings: {
        author: 'Rahul M.',
        avatar_initial: 'R',
        location: 'Gurugram',
        tagline: 'Birthday · Delhi',
        stars: 5,
        quote: 'Midnight delivery reached at 11:40 PM sharp. My wife was completely surprised. The message card was printed neatly.'
      }
    },
    rev_3: {
      type: 'review',
      settings: {
        author: 'Priya S.',
        avatar_initial: 'P',
        location: 'London, UK',
        tagline: 'Birthday · Bengaluru',
        stars: 5,
        quote: 'Booked 12 days in advance for my sister\'s birthday and got WhatsApp updates on every step. Smooth from start to finish.'
      }
    },
    rev_4: {
      type: 'review',
      settings: {
        author: 'Vikram K.',
        avatar_initial: 'V',
        location: 'Mumbai',
        tagline: 'Kids · Mumbai',
        stars: 4,
        quote: 'Ordered a photo cake for my son. Good print quality and tasted great. Delivery boy called before arriving.'
      }
    },
    rev_5: {
      type: 'review',
      settings: {
        author: 'Meera J.',
        avatar_initial: 'M',
        location: 'Dubai, UAE',
        tagline: 'Thank you · Chennai',
        stars: 5,
        quote: 'Paying from abroad was easy and the prices were clear. The lilies were fresh and lasted a week.'
      }
    },
    rev_6: {
      type: 'review',
      settings: {
        author: 'Sandeep T.',
        avatar_initial: 'S',
        location: 'Noida',
        tagline: 'Corporate · Noida',
        stars: 5,
        quote: 'Our team uses Flaberry for client gifting. Corporate orders are handled quickly and invoices come on time.'
      }
    }
  },
  block_order: [
    'rev_1',
    'rev_2',
    'rev_3',
    'rev_4',
    'rev_5',
    'rev_6'
  ]
};

index.sections.flaberry_seo_faq = {
  type: 'flaberry-seo-faq',
  settings: {
    seo_heading: 'Send flowers to India with Flaberry',
    faq_heading: 'FAQs about sending flowers to India'
  },
  blocks: {
    faq_1: {
      type: 'faq_item',
      settings: {
        question: 'How do I send flowers to India online?',
        answer: 'Enter the receiver\'s pincode, choose a gift, pick a delivery date and time slot, add your message and pay. You get updates by email and WhatsApp until the gift is delivered.'
      }
    },
    faq_2: {
      type: 'faq_item',
      settings: {
        question: 'Can I get flowers delivered in India the same day?',
        answer: 'Yes. Orders placed before 4 PM IST are delivered the same day in serviceable pincodes. Fixed-time and midnight slots have their own cut-off times shown on the product page.'
      }
    },
    faq_3: {
      type: 'faq_item',
      settings: {
        question: 'Do you deliver flowers at midnight?',
        answer: 'Yes, between 11:00 PM and 12:30 AM in most metro pincodes. Choose the Midnight slot on the product page.'
      }
    },
    faq_4: {
      type: 'faq_item',
      settings: {
        question: 'Can I order today for a future date?',
        answer: 'Yes. Pick any date up to 90 days ahead. Your order stays scheduled and is prepared for that day. Occasion prices follow the delivery date.'
      }
    },
    faq_5: {
      type: 'faq_item',
      settings: {
        question: 'Can I send flowers to India from abroad?',
        answer: 'Yes. You can browse in your own currency and pay with international cards or PayPal. Your card is charged in INR; your bank converts it.'
      }
    },
    faq_6: {
      type: 'faq_item',
      settings: {
        question: 'What can I send along with flowers?',
        answer: 'Add cakes, chocolates, teddy bears, sweets and dry fruits from the product page or the cart.'
      }
    },
    faq_7: {
      type: 'faq_item',
      settings: {
        question: 'Will my flowers look like the picture?',
        answer: 'We match the picture closely. If a flower is out of season, our florist uses one of equal or higher value, as per our substitution policy.'
      }
    }
  },
  block_order: [
    'faq_1',
    'faq_2',
    'faq_3',
    'faq_4',
    'faq_5',
    'faq_6',
    'faq_7'
  ]
};

index.order = [
  'flaberry_hero_slider',
  'flaberry_pincode_band',
  'flaberry_category_rail',
  'flaberry_brand_intro',
  'flaberry_best_sellers',
  'flaberry_features_strip',
  'flaberry_tabbed_cakes',
  'flaberry_split_banner',
  'flaberry_reviews',
  'flaberry_seo_faq'
];

fs.writeFileSync('theme/templates/index.json', JSON.stringify(index, null, 2) + '\n', 'utf8');
console.log('Successfully updated index.json with flaberry_reviews and flaberry_seo_faq');
