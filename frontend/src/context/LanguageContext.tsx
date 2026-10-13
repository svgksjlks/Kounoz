'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navigation & Header
  home: { ar: 'الرئيسية', en: 'Home' },
  discounts: { ar: 'تخفيضات', en: 'Discounts / Sale' },
  new_arrivals: { ar: 'وصل حديثاً', en: 'New Arrivals' },
  winter_collection: { ar: 'كولكشن الشتوي', en: 'Winter Collection' },
  summer_collection: { ar: 'كولكشن الصيفي', en: 'Summer Collection' },
  summer_sale: { ar: 'تخفيضات الصيفي', en: 'Summer Sale' },
  abayas: { ar: 'عبايات', en: 'Abayas' },
  about_us: { ar: 'من نحن', en: 'About Us' },
  menu: { ar: 'القائمة', en: 'Menu' },
  cart: { ar: 'سلة المشتريات', en: 'Cart' },
  search: { ar: 'البحث', en: 'Search' },
  account: { ar: 'حسابي', en: 'My Account' },
  login: { ar: 'تسجيل الدخول', en: 'Login' },
  admin: { ar: 'لوحة التحكم', en: 'Admin' },
  switch_lang: { ar: 'English', en: 'العربية' },

  // Hero Section
  hero_badge: { ar: 'كنوز KOUNOZ — الموسم الجديد', en: 'KOUNOZ — New Season' },
  hero_title_1: { ar: 'أصالة المظهر،', en: 'Authentic Elegance,' },
  hero_title_2: { ar: 'وهيبة الحضور.', en: 'Regal Presence.' },
  hero_desc: {
    ar: 'جلابيب وأثواب عربية فاخرة محاكة يدوياً من أنقى خيوط القطن وصوف الجوخ لتعكس وقار الرجل العربي.',
    en: 'Luxury Arabic jalabiyas and thobes handcrafted from the purest cotton and wool to reflect distinction and heritage.'
  },
  discover: { ar: 'اكتشف المجموعة', en: 'Discover Collection' },
  live_showcase: { ar: 'عرض مرئي حي', en: 'Live Showcase' },
  view_details: { ar: 'عرض التفاصيل', en: 'View Details' },

  // Features / Values
  handmade: { ar: 'خياطة يدوية دقيقة', en: 'Handcrafted Precision' },
  handmade_sub: { ar: 'تطريز تراثي متقن', en: 'Masterful Traditional Embroidery' },
  perfect_fit: { ar: 'مقاسات مضبوطة ومثالية', en: 'Engineered Arabic Fits' },
  perfect_fit_sub: { ar: 'قصّات عربية مدروسة بعناية', en: 'Tailored for Grace & Comfort' },
  fast_shipping: { ar: 'شحن فاخر وسريع', en: 'Luxury Express Shipping' },
  fast_shipping_sub: { ar: 'تغليف كونسيرج فاخر', en: 'Concierge Gift Packaging' },

  // Catalog & Categories
  collection_sub: { ar: 'تشكيلة كنوز الفاخرة', en: 'Kounoz Signature Collection' },
  collection_title: { ar: 'القطع الـ 10 الدائمة', en: 'The 10 Timeless Pieces' },
  all_pieces: { ar: 'جميع القطع', en: 'All Pieces' },
  classic_jalabiyas: { ar: 'جلابيب كلاسيكية', en: 'Classic Jalabiyas' },
  royal_thobes: { ar: 'أثواب ملكية', en: 'Royal Thobes' },
  bishts: { ar: 'بشوت ومناسبات', en: 'Bishts & Formal' },
  accessories: { ar: 'إكسسوارات وشيل', en: 'Accessories & Shawls' },

  // Product Card & Actions
  quick_view: { ar: 'معاينة سريعة', en: 'Quick View' },
  add_to_cart: { ar: 'إضافة لسلة المشتريات', en: 'Add to Bag' },
  order_whatsapp: { ar: 'طلب مباشر عبر واتساب', en: 'Order via WhatsApp' },
  size_guide: { ar: 'دليل المقاسات', en: 'Size Guide' },
  currency: { ar: 'ج.م', en: 'EGP' },
  new_badge: { ar: 'جديد', en: 'NEW' },
  discount: { ar: 'خصم', en: 'OFF' },

  // Editorial Banner
  banner_tag: { ar: 'حرفية وخياطة متوارثة', en: 'Heritage Craftsmanship' },
  banner_title: {
    ar: 'فخامة التطريز اليدوي والأقمشة الطبيعية الأصيلة',
    en: 'The Luxury of Hand Embroidery & Pure Natural Fabrics'
  },
  banner_desc: {
    ar: 'نختار بعناية فائقة أنقى خامات القطن والكتان وصوف الجوخ، ونحيكها بأيدي أمهر الحرفيين لنقدم لك قطعاً تليق بأرقى المناسبات وتعكس وقار الرجل العربي.',
    en: 'We meticulously select the purest cotton, linen, and wool fabrics, tailored by master artisans to elevate every occasion with dignity.'
  },
  banner_btn: { ar: 'استعراض التشكيلة كاملة', en: 'Explore Complete Range' },

  // About Section
  about_badge: { ar: 'أكثر من 20 عاماً من الخبرة', en: 'Over 20 Years of Heritage' },
  about_title: { ar: 'كنوز للثوب العربي', en: 'Kounoz Arabic Thobes' },
  about_p1_title: { ar: 'أناقة عربية بروح عصرية', en: 'Arabic Elegance with Modern Spirit' },
  about_p1_text: {
    ar: 'كنوز علامة متخصصة في صناعة الثوب العربي، تستند إلى خبرة تمتد لأكثر من 20 عامًا في عالم الأقمشة والتفصيل وصناعة الأثواب، حيث تجتمع الخبرة الطويلة مع الاهتمام بأدق التفاصيل لتقديم ثوب يعكس الأناقة العربية بروح عصرية.',
    en: 'Kounoz specializes in crafting luxury Arabic thobes with over two decades of expertise in fabric selection, bespoke tailoring, and timeless Arab refinement.'
  },
  about_p2_title: { ar: 'خبرة عالمية متعددة الأسواق', en: 'Global Multi-Market Craftsmanship' },
  about_p2_text: {
    ar: 'على مدار أكثر من عقدين، اكتسبنا خبرة واسعة في فهم احتياجات عملائنا واختلاف الأذواق والأسواق، وهو ما نترجمه اليوم في كل قطعة تحمل اسم كنوز.',
    en: 'Over more than two decades, we have honed an innate understanding of diverse connoisseurs across global hubs, channeled into every piece bearing the Kounoz name.'
  },
  experience_in: { ar: 'كنوز — أكثر من 20 عامًا من الخبرة في:', en: 'Kounoz — Over 20 years of craftsmanship across:' },
  china: { ar: '🇨🇳 الصين', en: '🇨🇳 China' },
  turkey: { ar: '🇹🇷 تركيا', en: '🇹🇷 Turkey' },
  egypt: { ar: '🇪🇬 مصر', en: '🇪🇬 Egypt' },
  tagline: { ar: 'نصنع فيها الأناقة ونحافظ على الأصالة.', en: 'Crafting elegance while preserving authentic heritage.' },

  // Cart Drawer & Modals
  empty_cart: { ar: 'سلة المشتريات فارغة حالياً.', en: 'Your shopping bag is currently empty.' },
  browse_collection: { ar: 'تصفح التشكيلة', en: 'Browse Collection' },
  subtotal: { ar: 'المجموع الفرعي', en: 'Subtotal' },
  checkout: { ar: 'إتمام الطلب والدفع', en: 'Proceed to Checkout' },
  close: { ar: 'إغلاق', en: 'Close' },
  whatsapp_confirm: { ar: 'إرسال وتأكيد الطلب بالكامل عبر واتساب', en: 'Send & Confirm Order via WhatsApp' },

  // Footer
  footer_desc: {
    ar: 'كنوز علامة متخصصة في صناعة الثوب العربي، تستند إلى خبرة تمتد لأكثر من 20 عامًا في الصين وتركيا ومصر، نصنع فيها الأناقة ونحافظ على الأصالة بأدق تفاصيل القص والتفصيل.',
    en: 'Kounoz is dedicated to the artistry of Arabic thobes with 20+ years of pedigree across China, Turkey, and Egypt.'
  },
  customer_care: { ar: 'خدمة العملاء والإدارة', en: 'Customer Concierge' },
  direct_whatsapp: { ar: '💬 الطلب المباشر عبر واتساب', en: '💬 Direct WhatsApp Concierge' },
  direct_call: { ar: 'الاتصال المباشر (01022822123)', en: 'Direct Call (01022822123)' },
  wholesale_call: { ar: 'لطلب الجملة الاتصال على : 01066583964', en: 'Wholesale Orders: 01066583964' },
  contact_email: { ar: 'التواصل: Kounozthobe@gmail.com', en: 'Email: Kounozthobe@gmail.com' },
  all_rights: { ar: 'كنوز KOUNOZ للملابس العربية الفاخرة. جميع الحقوق محفوظة.', en: 'KOUNOZ Luxury Arabic Attire. All rights reserved.' },
  timeless_tag: { ar: 'فخامة وأصالة تدوم', en: 'Enduring Luxury & Heritage' },

  // Announcements
  announcement_1: { ar: 'نهاية الصيف بدأت', en: 'End-of-Summer Sale has begun' },
  announcement_2: { ar: 'خصم 30% عالقطعة الثانية ( منتجات مختارة )', en: '30% Off on 2nd Item (Selected Pieces)' },
  announcement_3: { ar: 'شحن فاخر للطلبات في مصر والخليج', en: 'Express Concierge Shipping Worldwide' },
  announcement_4: { ar: 'ضمان ذهبي لرضا العملاء والأصالة', en: 'Golden Guarantee of Authentic Quality' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function setCookie(name: string, value: string, days?: number) {
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days !== undefined) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  const host = window.location.hostname;
  document.cookie = `${name}=${value}${expires}; path=/;`;
  if (host) {
    document.cookie = `${name}=${value}${expires}; path=/; domain=${host};`;
    if (!host.startsWith('127.') && !host.startsWith('192.') && host.includes('.')) {
      const parts = host.split('.');
      if (parts.length > 1) {
        document.cookie = `${name}=${value}${expires}; path=/; domain=.${parts.slice(-2).join('.')};`;
      }
    }
  }
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  const host = window.location.hostname;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  if (host) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
    if (!host.startsWith('127.') && !host.startsWith('192.') && host.includes('.')) {
      const parts = host.split('.');
      if (parts.length > 1) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${parts.slice(-2).join('.')};`;
      }
    }
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  const triggerGoogleTranslate = (targetLang: Language): boolean => {
    if (typeof document === 'undefined') return false;
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo) {
      combo.value = targetLang;
      combo.dispatchEvent(new Event('change'));
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Read from localStorage on mount
    const saved = localStorage.getItem('kounoz_lang') as Language;
    if (saved === 'en') {
      setLanguageState('en');
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
      setCookie('googtrans', '/ar/en', 30);

      // Attempt to trigger if combo is already available or wait for it
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerGoogleTranslate('en') || attempts > 15) {
          clearInterval(interval);
        }
      }, 300);
    } else {
      setLanguageState('ar');
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
      clearCookie('googtrans');
    }

    // Continuous suppressor for Google Translate banner frame & top body shift
    const cleanGoogleUI = () => {
      if (document.body && document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      const banners = document.querySelectorAll(
        '.goog-te-banner-frame, iframe.goog-te-banner-frame, .VIpgJd-ZVi9I-OR9QNe-OR9QNe, body > .skiptranslate'
      );
      banners.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.setProperty('display', 'none', 'important');
        htmlEl.style.setProperty('visibility', 'hidden', 'important');
        htmlEl.style.setProperty('height', '0px', 'important');
      });
    };

    cleanGoogleUI();
    const observer = new MutationObserver(cleanGoogleUI);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kounoz_lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      if (lang === 'en') {
        setCookie('googtrans', '/ar/en', 30);
        const triggered = triggerGoogleTranslate('en');
        if (!triggered) {
          // Poll a few times, if still not ready, reload to let the cookie auto-translate
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            if (triggerGoogleTranslate('en')) {
              clearInterval(interval);
            } else if (attempts >= 10) {
              clearInterval(interval);
              window.location.reload();
            }
          }, 200);
        }
      } else {
        clearCookie('googtrans');
        setCookie('googtrans', '/ar/ar', 30);
        const triggered = triggerGoogleTranslate('ar');
        // When switching back to Arabic, a quick clean reload or reset ensures complete restoration
        setTimeout(() => {
          clearCookie('googtrans');
          if (!triggered) {
            window.location.reload();
          } else {
            // Check if page reverted, reload to ensure crisp original Arabic without artifacts
            window.location.reload();
          }
        }, 300);
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string, fallback?: string): string => {
    const item = translations[key];
    if (item && item[language]) {
      return item[language];
    }
    return fallback || key;
  };

  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isRTL,
        dir,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
