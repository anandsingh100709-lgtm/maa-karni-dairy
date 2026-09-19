/**
 * Maa Karni Dhari - Dairy Business Configuration
 * Malpura, Rajasthan, India
 * 
 * Update these values to customize the website's business details,
 * product prices, payment links, and location map.
 */

const CONFIG = {
  // Business Information
  BUSINESS_NAME: "माँ करणी दूध डेयरी",
  BUSINESS_NAME_EN: "Maa Karni Dairy",
  TAGLINE: "शुद्धता और स्वाद का भरोसा",
  TAGLINE_EN: "Purity & Taste You Can Trust",
  LOCATION: "Malpura, Rajasthan, India",
  LOCATION_SHORT: "Malpura, Rajasthan",

  // Contact Details
  // WhatsApp international format without '+' or spaces: 918209931769
  WHATSAPP_NUMBER: "8209931769",
  PHONE_NUMBER: "8209931769",
  PHONE_DIAL_PREFIX: "+91",

  // Product Prices (Neutral display format without invented units)
  PRODUCTS: {
    milk: {
      id: "milk",
      name_hi: "दूध",
      name_en: "Fresh Milk",
      sub_hi: "गाय और भैंस का ताज़ा दूध",
      sub_en: "Pure Cow & Buffalo Milk",
      price: 70,
      hasMilkTypes: true,
      types: [
        { id: "cow", name_hi: "गाय का दूध (Cow Milk)", name_en: "Cow Milk" },
        { id: "buffalo", name_hi: "भैंस का दूध (Buffalo Milk)", name_en: "Buffalo Milk" }
      ],
      variants: [
        { id: "1kg", label_hi: "1 kg", label_en: "1 kg", price: 70, default: true },
        { id: "500gm", label_hi: "500 gm", label_en: "500 gm", price: 35 },
        { id: "250gm", label_hi: "250 gm", label_en: "250 gm", price: 18 }
      ]
    },
    curd: {
      id: "curd",
      name_hi: "दही",
      name_en: "Fresh Curd (Dahi)",
      sub_hi: "गाढ़ा और स्वादिष्ट ताज़ा दही",
      sub_en: "Thick, creamy & fresh curd",
      price: 50,
      hasMilkTypes: false,
      variants: [
        { id: "1kg", label_hi: "1 kg", label_en: "1 kg", price: 50, default: true },
        { id: "500gm", label_hi: "500 gm", label_en: "500 gm", price: 25 },
        { id: "250gm", label_hi: "250 gm", label_en: "250 gm", price: 15 }
      ]
    },
    ghee: {
      id: "ghee",
      name_hi: "शुद्ध घी",
      name_en: "Pure Desi Ghee",
      sub_hi: "पारंपरिक विधि से बना शुद्ध घी",
      sub_en: "Aromatic & traditional pure ghee",
      price: 1200,
      hasMilkTypes: false,
      variants: [
        { id: "1kg", label_hi: "1 kg", label_en: "1 kg", price: 1200, default: true },
        { id: "500gm", label_hi: "500 gm", label_en: "500 gm", price: 600 },
        { id: "250gm", label_hi: "250 gm", label_en: "250 gm", price: 300 }
      ]
    },
    paneer: {
      id: "paneer",
      name_hi: "पनीर",
      name_en: "Fresh Paneer",
      sub_hi: "मुलायम, शुद्ध और ताज़ा पनीर",
      sub_en: "Soft, rich & hygienic fresh paneer",
      price: 400,
      hasMilkTypes: false,
      variants: [
        { id: "1kg", label_hi: "1 kg", label_en: "1 kg", price: 400, default: true },
        { id: "500gm", label_hi: "500 gm", label_en: "500 gm", price: 200 },
        { id: "250gm", label_hi: "250 gm", label_en: "250 gm", price: 100 },
        { id: "100gm", label_hi: "100 gm", label_en: "100 gm", price: 40 }
      ]
    },
    buttermilk: {
      id: "buttermilk",
      name_hi: "छाछ (बटरमिल्क)",
      name_en: "Fresh Buttermilk (Chhachh)",
      sub_hi: "ठंडी, ताज़ा और पाचक छाछ",
      sub_en: "Refreshing, light & digestive buttermilk",
      price: 30,
      hasMilkTypes: false,
      variants: [
        { id: "1kg", label_hi: "1 kg", label_en: "1 kg", price: 30, default: true },
        { id: "500gm", label_hi: "500 gm", label_en: "500 gm", price: 15 }
      ]
    }
  },

  // Google Maps Configuration (Placeholders)
  // Replace YOUR_GOOGLE_MAPS_URL with the actual Google Maps share link
  // Replace YOUR_GOOGLE_MAPS_EMBED_URL with the actual iframe embed src
  GOOGLE_MAPS_URL: "YOUR_GOOGLE_MAPS_URL",
  GOOGLE_MAPS_EMBED_URL: "YOUR_GOOGLE_MAPS_EMBED_URL",
  
  // Online Payment Configuration (Demo active - replace with live merchant ID when ready)
  UPI_ID: "8209931769@upi",
  PAYMENT_LINK: "upi://pay?pa=8209931769@upi&pn=Maa%20Karni%20Dairy&cu=INR",
  QR_IMAGE_PATH: "assets/images/payment-qr.svg",

  // Business Timings
  TIMINGS_HI: "सुबह 6:00 से 9:00 & शाम 6:00 से 8:00 तक",
  TIMINGS_EN: "Morning 6:00 AM - 9:00 AM & Evening 6:00 PM - 8:00 PM",

  // Delivery Notice
  DELIVERY_AREA_HI: "मालपुरा और आसपास के क्षेत्र",
  DELIVERY_AREA_EN: "Malpura & nearby areas"
};

// Export to window object for global script access
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
