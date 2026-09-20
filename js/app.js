/**
 * Maa Karni Dhari - Dairy Business Interactive Application Logic
 * Malpura, Rajasthan, India
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentLang: 'hi', // Default language is Hindi
    milkType: 'cow',   // Default milk selection
    selectedVariants: {
      milk: '1kg',
      curd: '1kg',
      ghee: '1kg',
      paneer: '1kg',
      buttermilk: '1kg'
    },
    quantities: {
      milk: 1,
      curd: 1,
      ghee: 1,
      paneer: 1,
      buttermilk: 1
    }
  };

  /**
   * DOM Elements Cache
   */
  const elements = {
    langToggleBtns: document.querySelectorAll('.lang-toggle-btn'),
    i18nElements: document.querySelectorAll('[data-i18n]'),
    placeholderElements: document.querySelectorAll('[data-i18n-placeholder]'),
    ariaElements: document.querySelectorAll('[data-i18n-aria]'),
    hamburgerBtn: document.getElementById('hamburgerBtn'),
    mobileDrawer: document.getElementById('mobileDrawer'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    copyUpiBtn: document.getElementById('copyUpiBtn'),
    upiIdDisplay: document.getElementById('upiIdDisplay'),
    paymentQrImg: document.getElementById('paymentQrImg'),
    toastNotice: document.getElementById('toastNotice'),
    bulkForm: document.getElementById('bulkOrderForm'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section[id]'),
    mapIframe: document.getElementById('gmapIframe'),
    mapFallback: document.getElementById('mapFallback'),
    btnViewRoute: document.getElementById('btnViewRoute')
  };

  /**
   * Initialize Application
   */
  function init() {
    // 1. Check local storage for language preference, fallback to 'hi'
    const savedLang = localStorage.getItem('mkd_language');
    if (savedLang && (savedLang === 'hi' || savedLang === 'en')) {
      state.currentLang = savedLang;
    } else {
      state.currentLang = 'hi';
    }

    // 2. Apply initial translations
    applyTranslations(state.currentLang);

    // 3. Initialize theme and background color switchers
    initThemeSwitcher();
    initBgSwitcher();

    // 4. Setup product pricing and listeners
    setupProducts();

    // 5. Setup Google Maps and Payment configuration
    setupMapAndPayment();

    // 6. Setup Event Listeners
    setupEventListeners();

    // 7. Setup Active Nav highlighting (Multi-Page & Scroll)
    setupActiveNav();
  }

  /**
   * Translate the UI dynamically without page reload
   */
  function applyTranslations(lang) {
    state.currentLang = lang;
    localStorage.setItem('mkd_language', lang);
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.hi;

    // Update document language attribute
    document.documentElement.lang = lang;

    // Translate all standard text nodes
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // Translate HTML contents where formatting is preserved
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Translate input placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Translate ARIA labels
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key] !== undefined) {
        el.setAttribute('aria-label', dict[key]);
      }
    });

    // Update language toggle buttons text
    elements.langToggleBtns.forEach((btn) => {
      const labelSpan = btn.querySelector('.lang-label');
      if (labelSpan) {
        // Toggle shows the ALTERNATE language to switch to
        labelSpan.textContent = lang === 'hi' ? 'English' : 'हिंदी';
      }
    });

    // Update dynamic product buttons and selectors
    updateProductButtons(lang);
  }

  /**
   * Configure Product Cards and Bind Quantities
   */
  function setupProducts() {
    // Populate dynamic prices from CONFIG
    for (const [key, item] of Object.entries(CONFIG.PRODUCTS)) {
      const priceEl = document.getElementById(`price-${key}`);
      if (priceEl) {
        priceEl.textContent = `₹${item.price}`;
      }
    }

    // Milk Type Radio Selection listener
    const milkRadios = document.querySelectorAll('input[name="milkType"]');
    milkRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        state.milkType = e.target.value;
      });
    });

    // Packaging Variant Radio Selection listener (1kg, 500gm, 250gm, 100gm)
    const variantRadios = document.querySelectorAll('.variant-radio');
    variantRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        const prod = e.target.getAttribute('data-product');
        const variantId = e.target.value;
        const price = e.target.getAttribute('data-price');
        if (!prod) return;

        state.selectedVariants[prod] = variantId;

        // Dynamically update the price badge for that product
        const priceEl = document.getElementById(`price-${prod}`);
        if (priceEl && price) {
          priceEl.textContent = `₹${price}`;
        }
      });
    });

    // Stepper Quantity Listeners (+ / -)
    document.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prod = btn.getAttribute('data-product');
        const action = btn.getAttribute('data-action');
        const input = document.getElementById(`qty-${prod}`);
        if (!input) return;

        let val = parseInt(input.value, 10) || 1;
        if (action === 'plus') {
          val = Math.min(val + 1, 99);
        } else if (action === 'minus') {
          val = Math.max(val - 1, 1);
        }
        input.value = val;
        state.quantities[prod] = val;
      });
    });

    // Stepper input change validation
    document.querySelectorAll('.qty-input').forEach((input) => {
      input.addEventListener('change', () => {
        let val = parseInt(input.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 99) val = 99;
        input.value = val;
        const prod = input.id.replace('qty-', '');
        state.quantities[prod] = val;
      });
    });

    // Order Now Click Listeners
    document.querySelectorAll('.btn-order-whatsapp').forEach((btn) => {
      btn.addEventListener('click', () => {
        const prodKey = btn.getAttribute('data-product');
        orderProductOnWhatsApp(prodKey);
      });
    });
  }

  /**
   * Update button texts and attributes when language toggles
   */
  function updateProductButtons(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.hi;
    document.querySelectorAll('.btn-order-whatsapp .btn-text').forEach((span) => {
      span.textContent = dict.product_order_btn;
    });
  }

  /**
   * Generate WhatsApp URL with international formatting
   */
  function createWhatsAppUrl(messageText) {
    const phone = CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
    const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
  }

  /**
   * Trigger individual product order via WhatsApp
   */
  function orderProductOnWhatsApp(prodKey) {
    const prodConfig = CONFIG.PRODUCTS[prodKey];
    if (!prodConfig) return;

    const lang = state.currentLang;
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.hi;
    const qty = state.quantities[prodKey] || 1;

    let productName = lang === 'hi' ? prodConfig.name_hi : prodConfig.name_en;

    // Retrieve selected variant details (e.g. 500 gm, 250 gm)
    const selectedVariantId = state.selectedVariants[prodKey];
    let variantLabel = '';
    if (prodConfig.variants && selectedVariantId) {
      const vObj = prodConfig.variants.find((v) => v.id === selectedVariantId);
      if (vObj) {
        variantLabel = lang === 'hi' ? vObj.label_hi : vObj.label_en;
      }
    }

    // If Milk, attach selected milk type (Cow Milk vs Buffalo Milk) and pack size
    if (prodKey === 'milk') {
      const typeLabel = state.milkType === 'cow' 
        ? (lang === 'hi' ? 'गाय का दूध (Cow Milk)' : 'Cow Milk')
        : (lang === 'hi' ? 'भैंस का दूध (Buffalo Milk)' : 'Buffalo Milk');
      const details = variantLabel ? `${typeLabel} - ${variantLabel}` : typeLabel;
      productName = `${productName} [${details}]`;
    } else if (variantLabel) {
      productName = `${productName} [${variantLabel}]`;
    }

    // Build message
    const template = dict.wa_msg_product;
    const formattedItem = `${productName} (मात्रा / Qty: ${qty})`;
    const message = template.replace('{product}', formattedItem);

    // Open WhatsApp URL
    window.open(createWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  }

  /**
   * Setup Google Maps and Payment Details from central CONFIG
   */
  function setupMapAndPayment() {
    // 1. UPI ID and QR code display
    if (elements.upiIdDisplay) {
      elements.upiIdDisplay.textContent = CONFIG.UPI_ID;
    }
    if (elements.paymentQrImg && CONFIG.QR_IMAGE_PATH) {
      elements.paymentQrImg.src = CONFIG.QR_IMAGE_PATH;
    }

    // 2. Google Maps Route Link
    if (elements.btnViewRoute) {
      const mapsUrl = CONFIG.GOOGLE_MAPS_URL === 'YOUR_GOOGLE_MAPS_URL'
        ? 'https://maps.google.com/?q=Malpura,+Rajasthan,+India'
        : CONFIG.GOOGLE_MAPS_URL;
      elements.btnViewRoute.setAttribute('href', mapsUrl);
    }

    // 3. Google Maps Embed handling
    if (elements.mapIframe && elements.mapFallback) {
      if (CONFIG.GOOGLE_MAPS_EMBED_URL && CONFIG.GOOGLE_MAPS_EMBED_URL !== 'YOUR_GOOGLE_MAPS_EMBED_URL') {
        elements.mapIframe.src = CONFIG.GOOGLE_MAPS_EMBED_URL;
        elements.mapIframe.style.display = 'block';
        elements.mapFallback.style.display = 'none';
      } else {
        // Show clean placeholder card with Malpura location
        elements.mapIframe.style.display = 'none';
        elements.mapFallback.style.display = 'flex';
      }
    }

    // 4. Contact phone numbers sync
    document.querySelectorAll('.phone-call-link').forEach((link) => {
      link.setAttribute('href', `tel:${CONFIG.PHONE_DIAL_PREFIX}${CONFIG.PHONE_NUMBER}`);
    });

    document.querySelectorAll('.whatsapp-general-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS.hi;
        window.open(createWhatsAppUrl(dict.wa_msg_general), '_blank', 'noopener,noreferrer');
      });
    });

    document.querySelectorAll('.whatsapp-bulk-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS.hi;
        window.open(createWhatsAppUrl(dict.wa_msg_bulk), '_blank', 'noopener,noreferrer');
      });
    });

    // 5. Sync elements bound directly to CONFIG
    document.querySelectorAll('[data-config]').forEach((el) => {
      const key = el.getAttribute('data-config');
      if (CONFIG[key] !== undefined) {
        el.textContent = CONFIG[key];
      }
    });
  }

  /**
   * Copy UPI ID with UI Toast feedback
   */
  function copyUpiId() {
    const upiText = CONFIG.UPI_ID;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(upiText).then(() => {
        showToast(state.currentLang === 'hi' ? 'UPI ID कॉपी हो गया!' : 'UPI ID copied to clipboard!');
      }).catch(() => {
        fallbackCopy(upiText);
      });
    } else {
      fallbackCopy(upiText);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(state.currentLang === 'hi' ? 'UPI ID कॉपी हो गया!' : 'UPI ID copied to clipboard!');
    } catch (err) {
      console.warn('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }

  function showToast(msg) {
    if (!elements.toastNotice) return;
    elements.toastNotice.textContent = msg;
    elements.toastNotice.classList.add('show');
    setTimeout(() => {
      elements.toastNotice.classList.remove('show');
    }, 3200);
  }

  /**
   * Bulk Inquiry Form Handling & Validation
   */
  function handleBulkFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;

    // Fields
    const nameInput = form.querySelector('#bulkName');
    const typeInput = form.querySelector('#bulkType');
    const phoneInput = form.querySelector('#bulkPhone');
    const prodInput = form.querySelector('#bulkProduct');
    const qtyInput = form.querySelector('#bulkQty');
    const msgInput = form.querySelector('#bulkMsg');

    const requiredFields = [nameInput, typeInput, phoneInput, prodInput, qtyInput];

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
      }
    });

    // Validate phone number (at least 10 digits)
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      phoneInput.classList.add('is-invalid');
      isValid = false;
    }

    if (!isValid) {
      // Focus first invalid field for accessibility
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Build WhatsApp message for Bulk Order
    const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS.hi;
    const typeLabel = typeInput.options[typeInput.selectedIndex].text;
    const notesText = msgInput.value.trim() || (state.currentLang === 'hi' ? 'लागू नहीं' : 'None');

    let template = dict.wa_msg_bulk_form;
    template = template.replace('{name}', nameInput.value.trim());
    template = template.replace('{type}', typeLabel);
    template = template.replace('{phone}', phoneInput.value.trim());
    template = template.replace('{product}', prodInput.value.trim());
    template = template.replace('{qty}', qtyInput.value.trim());
    template = template.replace('{notes}', notesText);

    // Open WhatsApp
    window.open(createWhatsAppUrl(template), '_blank', 'noopener,noreferrer');

    // Reset validation styles
    requiredFields.forEach((f) => f.classList.remove('is-invalid'));
  }

  /**
   * Event Listeners Registration
   */
  function setupEventListeners() {
    // 1. Language Toggle
    elements.langToggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextLang = state.currentLang === 'hi' ? 'en' : 'hi';
        applyTranslations(nextLang);
      });
    });

    // 2. Mobile Menu Drawer Toggle
    if (elements.hamburgerBtn && elements.mobileDrawer) {
      elements.hamburgerBtn.addEventListener('click', () => {
        const isOpen = elements.mobileDrawer.classList.toggle('open');
        elements.hamburgerBtn.setAttribute('aria-expanded', isOpen);
        elements.hamburgerBtn.innerHTML = isOpen
          ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
          : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });

      // Close mobile drawer on link click
      elements.mobileNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
          elements.mobileDrawer.classList.remove('open');
          elements.hamburgerBtn.setAttribute('aria-expanded', 'false');
          elements.hamburgerBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        });
      });

      // Close on Escape key for accessibility
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.mobileDrawer.classList.contains('open')) {
          elements.mobileDrawer.classList.remove('open');
          elements.hamburgerBtn.setAttribute('aria-expanded', 'false');
          elements.hamburgerBtn.focus();
        }
      });
    }

    // 3. Copy UPI ID Button
    if (elements.copyUpiBtn) {
      elements.copyUpiBtn.addEventListener('click', copyUpiId);
    }

    // 4. Bulk Order Form Submit
    if (elements.bulkForm) {
      elements.bulkForm.addEventListener('submit', handleBulkFormSubmit);
    }
  }

  /**
   * Active link highlighting based on current page URL & section scroll
   */
  function setupActiveNav() {
    const rawPath = window.location.pathname.toLowerCase();
    const currentPage = rawPath.substring(rawPath.lastIndexOf('/') + 1) || 'index.html';

    // 1. Highlight link matching current file
    let pageMatched = false;
    elements.navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
        link.classList.add('active');
        pageMatched = true;
      } else if (href && !href.startsWith('#')) {
        link.classList.remove('active');
      }
    });

    if (elements.mobileNavLinks) {
      elements.mobileNavLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
          link.classList.add('active');
        } else if (href && !href.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }

    // 2. ScrollSpy for on-page sections if present
    if (elements.sections && elements.sections.length > 0 && ('IntersectionObserver' in window)) {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            elements.navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}` || href === `index.html#${id}`) {
                link.classList.add('active');
              } else if (href && href.startsWith('#')) {
                link.classList.remove('active');
              }
            });
            if (elements.mobileNavLinks) {
              elements.mobileNavLinks.forEach((link) => {
                const href = link.getAttribute('href');
                if (href === `#${id}` || href === `index.html#${id}`) {
                  link.classList.add('active');
                } else if (href && href.startsWith('#')) {
                  link.classList.remove('active');
                }
              });
            }
          }
        });
      }, observerOptions);

      elements.sections.forEach((section) => observer.observe(section));
    }
  }

  /**
   * Theme Color Switcher Logic
   */
  function initThemeSwitcher() {
    const savedTheme = localStorage.getItem('mkd_theme') || 'blue';
    setTheme(savedTheme);

    document.querySelectorAll('[data-theme-set]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme-set');
        if (theme) {
          setTheme(theme);
        }
      });
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('mkd_theme', theme);
    } catch (e) {
      // Ignore if localStorage unavailable
    }

    document.querySelectorAll('[data-theme-set]').forEach((btn) => {
      if (btn.getAttribute('data-theme-set') === theme) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /**
   * Background Tone Switcher Logic ("पीछे का रंग")
   */
  function initBgSwitcher() {
    const savedBg = localStorage.getItem('mkd_bg') || 'cream';
    setBg(savedBg);

    document.querySelectorAll('[data-bg-set]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const bg = btn.getAttribute('data-bg-set');
        if (bg) {
          setBg(bg);
        }
      });
    });
  }

  function setBg(bg) {
    document.documentElement.setAttribute('data-bg', bg);
    try {
      localStorage.setItem('mkd_bg', bg);
    } catch (e) {
      // Ignore if localStorage unavailable
    }

    document.querySelectorAll('[data-bg-set]').forEach((btn) => {
      if (btn.getAttribute('data-bg-set') === bg) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
