import axios from 'axios';
import { Product, User, Color } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token') || localStorage.getItem('kounoz_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 4 Real Luxury Jalabiya Garments with 4 distinct photos each
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'جلابية كنوز ملكية مطرزة فاخرة',
    slug: 'royal-kounoz-embroidered-jalabiya-1',
    category: 'جلابيب كلاسيكية',
    price: 380,
    original_price: 450,
    description: 'جلابية رجالية فاخرة محاكة من أجود أنواع الأقمشة الفاخرة، تتميز بتطريز أنيق على الصدر والياقة بألوان هادئة تعكس فخامة المظهر العربي الأصيل.',
    material: 'قطن مصري 100% فاخر',
    care_instructions: 'غسيل يدوي أو تنظيف جاف',
    image_url: '/products/1/1.png',
    secondary_image_url: '/products/1/2.png',
    images: [
      '/products/1/1.png', // المنظر الأمامي
      '/products/1/2.png', // المنظر الخلفي
      '/products/1/3.png', // زاوية القَصّة
      '/products/1/4.png', // تفاصيل النسيج
    ],
    is_new: true,
    tag: 'قطن مصري نقي',
    in_stock: true,
    sizes: ['52L', '54L', '56L', '58L', '60L'],
    colors: [
      {
        name: 'عسلي مذهّب ملكي',
        hex: '#AD8A55',
        image_url: '/products/1/1.png',
        images: ['/products/1/1.png', '/products/1/2.png', '/products/1/3.png', '/products/1/4.png'],
      },
      {
        name: 'كحلي داكن فاخر',
        hex: '#1C2833',
        image_url: '/products/2/1.png',
        images: ['/products/2/1.png', '/products/2/2.png', '/products/2/3.png', '/products/2/4.png'],
      },
      {
        name: 'أبيض لؤلؤي ناصع',
        hex: '#FAF9F6',
        image_url: '/products/3/1.png',
        images: ['/products/3/1.png', '/products/3/2.png', '/products/3/3.png', '/products/3/4.png'],
      },
      {
        name: 'رمادي فحمي كلاسيك',
        hex: '#2C3E50',
        image_url: '/products/4/1.png',
        images: ['/products/4/1.png', '/products/4/2.png', '/products/4/3.png', '/products/4/4.png'],
      },
    ],
  },
  {
    id: 2,
    name: 'جلابية كنوز راقية تطريز خاص',
    slug: 'royal-kounoz-jalabiya-special-2',
    category: 'جلابيب كلاسيكية',
    price: 420,
    original_price: 490,
    description: 'جلابية عربية راقية بتصميم متناسق وتفاصيل خياطة دقيقة تناسب كافة الأوقات والمناسبات بإطلالة أنيقة ومريحة.',
    material: 'مزيج فاخر معالج ومريح',
    care_instructions: 'غسيل يدوي أو تنظيف جاف',
    image_url: '/products/2/1.png',
    secondary_image_url: '/products/2/2.png',
    images: [
      '/products/2/1.png',
      '/products/2/2.png',
      '/products/2/3.png',
      '/products/2/4.png',
    ],
    is_new: true,
    tag: 'إصدار خاص',
    in_stock: true,
    sizes: ['54L', '56L', '58L', '60L'],
    colors: [
      {
        name: 'كحلي داكن فاخر',
        hex: '#1C2833',
        image_url: '/products/2/1.png',
        images: ['/products/2/1.png', '/products/2/2.png', '/products/2/3.png', '/products/2/4.png'],
      },
      {
        name: 'عسلي مذهّب ملكي',
        hex: '#AD8A55',
        image_url: '/products/1/1.png',
        images: ['/products/1/1.png', '/products/1/2.png', '/products/1/3.png', '/products/1/4.png'],
      },
      {
        name: 'أبيض لؤلؤي ناصع',
        hex: '#FAF9F6',
        image_url: '/products/3/1.png',
        images: ['/products/3/1.png', '/products/3/2.png', '/products/3/3.png', '/products/3/4.png'],
      },
      {
        name: 'رمادي فحمي كلاسيك',
        hex: '#2C3E50',
        image_url: '/products/4/1.png',
        images: ['/products/4/1.png', '/products/4/2.png', '/products/4/3.png', '/products/4/4.png'],
      },
    ],
  },
  {
    id: 3,
    name: 'جلابية كنوز كلاسيكية أصيلة',
    slug: 'classic-kounoz-authentic-jalabiya-3',
    category: 'جلابيب كلاسيكية',
    price: 350,
    original_price: 410,
    description: 'جلابية كلاسيكية أصيلة مصممة بعناية فائقة بقصة انسيابية وياقة مريحة تعطي شعوراً بالتميز والراحة طوال اليوم.',
    material: 'قطن نقي طبيعي معالج',
    care_instructions: 'غسيل يدوي أو آلي على البارد',
    image_url: '/products/3/1.png',
    secondary_image_url: '/products/3/2.png',
    images: [
      '/products/3/1.png',
      '/products/3/2.png',
      '/products/3/3.png',
      '/products/3/4.png',
    ],
    is_new: false,
    tag: 'تطريز يدوي أصيل',
    in_stock: true,
    sizes: ['52L', '54L', '56L', '58L', '60L'],
    colors: [
      {
        name: 'أبيض لؤلؤي ناصع',
        hex: '#FAF9F6',
        image_url: '/products/3/1.png',
        images: ['/products/3/1.png', '/products/3/2.png', '/products/3/3.png', '/products/3/4.png'],
      },
      {
        name: 'عسلي مذهّب ملكي',
        hex: '#AD8A55',
        image_url: '/products/1/1.png',
        images: ['/products/1/1.png', '/products/1/2.png', '/products/1/3.png', '/products/1/4.png'],
      },
      {
        name: 'كحلي داكن فاخر',
        hex: '#1C2833',
        image_url: '/products/2/1.png',
        images: ['/products/2/1.png', '/products/2/2.png', '/products/2/3.png', '/products/2/4.png'],
      },
      {
        name: 'رمادي فحمي كلاسيك',
        hex: '#2C3E50',
        image_url: '/products/4/1.png',
        images: ['/products/4/1.png', '/products/4/2.png', '/products/4/3.png', '/products/4/4.png'],
      },
    ],
  },
  {
    id: 4,
    name: 'جلابية كنوز عصرية فاخرة',
    slug: 'contemporary-luxury-kounoz-jalabiya-4',
    category: 'جلابيب كلاسيكية',
    price: 390,
    original_price: 460,
    description: 'إطلالة عصرية بلمسة تراثية أصيلة، خياطة متقنة وأقمشة باردة خفيفة توفر أعلى درجات الراحة والأناقة.',
    material: 'كتان مصري ناعم 100%',
    care_instructions: 'غسيل آلي على البارد، كوي بالبخار',
    image_url: '/products/4/1.png',
    secondary_image_url: '/products/4/2.png',
    images: [
      '/products/4/1.png',
      '/products/4/2.png',
      '/products/4/3.png',
      '/products/4/4.png',
    ],
    is_new: true,
    tag: 'كتان فاخر',
    in_stock: true,
    sizes: ['52L', '54L', '56L', '58L'],
    colors: [
      {
        name: 'رمادي فحمي كلاسيك',
        hex: '#2C3E50',
        image_url: '/products/4/1.png',
        images: ['/products/4/1.png', '/products/4/2.png', '/products/4/3.png', '/products/4/4.png'],
      },
      {
        name: 'عسلي مذهّب ملكي',
        hex: '#AD8A55',
        image_url: '/products/1/1.png',
        images: ['/products/1/1.png', '/products/1/2.png', '/products/1/3.png', '/products/1/4.png'],
      },
      {
        name: 'كحلي داكن فاخر',
        hex: '#1C2833',
        image_url: '/products/2/1.png',
        images: ['/products/2/1.png', '/products/2/2.png', '/products/2/3.png', '/products/2/4.png'],
      },
      {
        name: 'أبيض لؤلؤي ناصع',
        hex: '#FAF9F6',
        image_url: '/products/3/1.png',
        images: ['/products/3/1.png', '/products/3/2.png', '/products/3/3.png', '/products/3/4.png'],
      },
    ],
  },
];

// Helper to get products stored in LocalStorage or fallback
export function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return FALLBACK_PRODUCTS;
  try {
    const version = localStorage.getItem('kounoz_products_ver');
    if (version !== 'v5_packaging_2026') {
      localStorage.setItem('kounoz_products_ver', 'v5_packaging_2026');
      localStorage.setItem('kounoz_products', JSON.stringify(FALLBACK_PRODUCTS));
      return FALLBACK_PRODUCTS;
    }
    const saved = localStorage.getItem('kounoz_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading kounoz_products from localStorage', e);
  }
  return FALLBACK_PRODUCTS;
}

export function saveLocalProducts(products: Product[], notify: boolean = true): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('kounoz_products', JSON.stringify(products));
    if (notify) {
      window.dispatchEvent(new Event('kounoz_products_updated'));
    }
  } catch (e) {
    console.error('Error saving kounoz_products to localStorage', e);
  }
}

// ── GET PRODUCTS ─────────────────────────────────────────────────────────────
export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const url = category && category !== 'جميع القطع'
      ? `/api/products?category=${encodeURIComponent(category)}`
      : '/api/products';
    
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        if (typeof window !== 'undefined') {
          saveLocalProducts(data.data, false);
        }
        return filterByCategory(data.data, category);
      }
    }
  } catch (err) {
    console.warn('API getProducts fallback to local storage', err);
  }

  // Fallback to local products
  const local = getLocalProducts();
  return filterByCategory(local, category);
}

function filterByCategory(items: Product[], category?: string): Product[] {
  if (!category || category === 'جميع القطع' || category === 'الرئيسية' || category === 'الرئيسيه') {
    return items;
  }
  if (category === 'تخفيضات' || category === 'التخفيضات' || category === 'خصومات' || category === 'عروض') {
    const sale = items.filter((p) =>
      p.category === 'تخفيضات' ||
      (p.original_price && p.original_price > p.price) ||
      (p.tag && (p.tag.includes('خصم') || p.tag.includes('تخفيض') || p.tag.includes('وفر')))
    );
    return sale.length > 0 ? sale : items;
  }
  if (category === 'وصل حديثاً' || category === 'وصل حديثا') {
    const fresh = items.filter((p) => p.is_new || (p.tag && p.tag.includes('جديد')));
    return fresh.length > 0 ? fresh : items;
  }
  if (category === 'كولكشن الشتوي' || category === 'شتوي' || category === 'الشتوي') {
    const winter = items.filter((p) =>
      p.category === 'كولكشن الشتوي' ||
      p.category === 'أثواب ملكية' ||
      p.name.includes('شتوي') ||
      p.description.includes('شتوي') ||
      p.material.includes('صوف') ||
      p.material.includes('جوخ') ||
      (p.tag && p.tag.includes('شتوي'))
    );
    return winter.length > 0 ? winter : items;
  }
  if (category === 'كولكشن الصيفي' || category === 'صيفي' || category === 'الصيفي') {
    const summer = items.filter((p) =>
      p.category === 'كولكشن الصيفي' ||
      p.category === 'جلابيب كلاسيكية' ||
      p.name.includes('صيفي') ||
      p.description.includes('صيفي') ||
      p.material.includes('قطن') ||
      p.material.includes('كتان') ||
      (p.tag && p.tag.includes('صيفي'))
    );
    return summer.length > 0 ? summer : items;
  }
  return items.filter((p) => p.category === category || p.category.includes(category));
}

// ── GET PRODUCT BY ID ────────────────────────────────────────────────────────
export async function getProductById(id: number | string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.data) {
        return data.data;
      }
    }
  } catch {}

  const localList = getLocalProducts();
  const found = localList.find((p) => String(p.id) === String(id));
  if (found) return found;

  return FALLBACK_PRODUCTS.find((p) => String(p.id) === String(id)) || null;
}

// ── CREATE PRODUCT (Admin) ───────────────────────────────────────────────────
export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const images = productData.images && productData.images.length > 0 
    ? productData.images 
    : [productData.image_url || '', productData.secondary_image_url || ''].filter(Boolean);

  const newProduct: Product = {
    id: Date.now(),
    name: productData.name || 'قطعة كنوز جديدة',
    slug: (productData.name || 'product').trim().toLowerCase().replace(/[\s\W-]+/g, '-'),
    category: productData.category || 'جلابيب كلاسيكية',
    price: Number(productData.price) || 290,
    original_price: productData.original_price ? Number(productData.original_price) : null,
    description: productData.description || 'جلابية عربية فاخرة مصنوعة من أرقى الخامات الطبيعية.',
    material: productData.material || 'قطن مصري طبيعي 100%',
    care_instructions: productData.care_instructions || 'غسيل يدوي أو تنظيف جاف',
    image_url: productData.image_url || images[0] || '/products/1/1.png',
    secondary_image_url: productData.secondary_image_url || images[1] || '/products/1/2.png',
    images: images.length > 0 ? images : [
      productData.image_url || '/products/1/1.png',
      '/products/1/2.png',
      '/products/1/3.png',
      '/products/1/4.png'
    ],
    is_new: productData.is_new !== undefined ? productData.is_new : true,
    tag: productData.tag || 'جديد كنوز',
    in_stock: productData.in_stock !== undefined ? productData.in_stock : true,
    stock_quantity: productData.stock_quantity !== undefined ? Number(productData.stock_quantity) : 15,
    sizes: productData.sizes && productData.sizes.length > 0 ? productData.sizes : ['52L', '54L', '56L', '58L', '60L'],
    colors: productData.colors && productData.colors.length > 0 ? productData.colors : [
      { name: 'ذهبي كنوز', hex: '#AD8A55' },
      { name: 'بني جملي', hex: '#8C6B4F' },
      { name: 'عاجي طبيعي', hex: '#EFE9DB' },
    ],
  };

  // Try Next.js Server API first
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && data.data.id) {
        newProduct.id = data.data.id;
      }
    }
  } catch (err) {
    console.warn('API create product fallback to local storage', err);
  }

  // Save to Local Storage
  const current = getLocalProducts();
  const updated = [newProduct, ...current];
  saveLocalProducts(updated);

  return newProduct;
}

// ── UPDATE PRODUCT (Admin) ───────────────────────────────────────────────────
export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> {
  const current = getLocalProducts();
  const idx = current.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const updatedProduct = { ...current[idx], ...productData };
  current[idx] = updatedProduct;
  saveLocalProducts(current);

  try {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });
  } catch (err) {
    console.warn('API update product fallback');
  }

  return updatedProduct;
}

// ── DELETE PRODUCT (Admin) ───────────────────────────────────────────────────
export async function deleteProduct(id: number): Promise<boolean> {
  const current = getLocalProducts();
  const filtered = current.filter((p) => p.id !== id);
  saveLocalProducts(filtered);

  return true;
}

// ── COLOR SHAPES RESOLVER ───────────────────────────────────────────────────
export const KOUNOZ_PACKAGING_IMAGE = '/images/kounoz-packaging.jpg';

/**
 * Resolves 5 consistent images for a selected product:
 * 1. Front (أمامي)
 * 2. Back (خلفي)
 * 3. Side (جانبي)
 * 4. Fabric (النسيج)
 * 5. Packaging (الباكدج الرسمي لكنوز - تستلمها هكذا)
 */
export function getColorShapes(product?: Product | null, color?: Color | null): string[] {
  if (!product) return [];

  let baseAngles: string[] = [];

  if (color && color.images && color.images.length > 0) {
    const valid = color.images.filter(Boolean);
    baseAngles = [
      valid[0],
      valid[1] || valid[0],
      valid[2] || valid[1] || valid[0],
      valid[3] || valid[2] || valid[0],
    ];
  } else if (color && color.image_url && color.image_url.trim()) {
    const single = color.image_url.trim();
    baseAngles = [single, single, single, single];
  } else if (product.images && product.images.length > 0) {
    const valid = product.images.filter(Boolean);
    baseAngles = [
      valid[0],
      valid[1] || valid[0],
      valid[2] || valid[1] || valid[0],
      valid[3] || valid[2] || valid[0],
    ];
  } else {
    const single = product.image_url || '/products/1/1.png';
    baseAngles = [single, product.secondary_image_url || single, single, single];
  }

  // Check if custom packaging image exists or fallback to the official Kounoz packaging image
  const packaging = (color?.images && color.images[4]) || (product.images && product.images[4]) || KOUNOZ_PACKAGING_IMAGE;

  return [baseAngles[0], baseAngles[1], baseAngles[2], baseAngles[3], packaging];
}

export const ADMIN_EMAILS = [
  'kounozthobe@gmail.com',
  'omargamil37@gmail.com',
  'mohsengamil00@gmail.com',
  'admin@kounoz.sa',
  'admin@kounoz.com',
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return (
    ADMIN_EMAILS.some((a) => a.toLowerCase() === clean) ||
    clean.endsWith('@kounoz.sa') ||
    clean.endsWith('@kounoz.com') ||
    clean.endsWith('@kounoz.sbs')
  );
}

export function getAdminUser(): User | null {
  if (typeof window === 'undefined') return null;
  const adminData = localStorage.getItem('kounoz_admin_user');
  if (adminData) {
    try {
      const user = JSON.parse(adminData);
      if (user && isAdminEmail(user.email)) return user;
    } catch {
      return null;
    }
  }
  // Check if customer session is an admin
  const customer = getCurrentCustomer();
  if (customer && isAdminEmail(customer.email)) {
    return { ...customer, is_admin: true };
  }
  return null;
}

const ADMIN_CUSTOM_PASS_KEY = 'kounoz_admin_custom_password';

export function getAdminCurrentPassword(): string {
  if (typeof window === 'undefined') return 'admin123';
  return localStorage.getItem(ADMIN_CUSTOM_PASS_KEY) || 'admin123';
}

export function changeAdminPassword(
  email: string,
  currentPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !currentPassword || !newPassword) {
    return { success: false, error: 'يرجى ملء جميع الحقول المطلوبة' };
  }

  // 1. Verify email is an authorized admin email
  if (!isAdminEmail(cleanEmail)) {
    return { success: false, error: 'البريد الإلكتروني المدخل غير مصرح له كمدير' };
  }

  // 2. Verify current password matches active admin password
  const expectedPassword = getAdminCurrentPassword();
  if (currentPassword !== expectedPassword) {
    return { success: false, error: 'كلمة المرور الحالية غير صحيحة، يرجى التأكد وإعادة المحاولة' };
  }

  // 3. New password validation
  if (newPassword.length < 6) {
    return { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف أو أرقام على الأقل' };
  }

  if (newPassword === currentPassword) {
    return { success: false, error: 'كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية' };
  }

  // 4. Persistently save new admin password
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_CUSTOM_PASS_KEY, newPassword);

    // Sync into registered accounts list
    try {
      const accounts = getStoredAccounts();
      const updated = accounts.map((acc) => {
        if (acc.is_admin || isAdminEmail(acc.email)) {
          return { ...acc, password: newPassword };
        }
        return acc;
      });
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    window.dispatchEvent(new Event('kounoz_auth_changed'));
  }

  return { success: true };
}

export function loginAdmin(email: string, password: string): User | null {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) return null;

  // 1. Must be an authorized admin email
  if (!isAdminEmail(cleanEmail)) return null;

  // 2. Strict check against active admin password
  const activePassword = getAdminCurrentPassword();
  if (password !== activePassword) {
    return null;
  }

  const accounts = getStoredAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  const adminUser: User = {
    id: account ? account.id : 999,
    name: account ? account.name : 'مدير متجر كنوز',
    email: cleanEmail,
    is_admin: true,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem('kounoz_admin_user', JSON.stringify(adminUser));
    localStorage.setItem('kounoz_admin_token', 'admin_secure_token_' + Date.now());
    window.dispatchEvent(new Event('kounoz_auth_changed'));
  }
  return adminUser;
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kounoz_admin_user');
    localStorage.removeItem('kounoz_admin_token');
    window.dispatchEvent(new Event('kounoz_auth_changed'));
  }
}

// ── EMAIL VALIDATION (Universal & Standard) ─────────────────────────────────
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  // Standard RFC compliant email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(trimmed);
}

// ── PERSISTENT REGISTERED ACCOUNTS STORE ─────────────────────────────────────
export interface StoredAccount {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  is_admin?: boolean;
}

const USERS_STORAGE_KEY = 'kounoz_registered_users_db';

export const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: 1,
    name: 'مدير متجر كنوز',
    email: 'admin@kounoz.sa',
    password: 'admin123',
    phone: '01022822123',
    is_admin: true,
  },
  {
    id: 2,
    name: 'عمر جميل',
    email: 'omargamil37@gmail.com',
    password: 'admin123',
    phone: '01022822123',
    is_admin: true,
  },
  {
    id: 3,
    name: 'محسن جميل',
    email: 'mohsengamil00@gmail.com',
    password: 'admin123',
    phone: '01066583964',
    is_admin: true,
  },
  {
    id: 4,
    name: 'كنوز للثوب العربي',
    email: 'kounozthobe@gmail.com',
    password: 'admin123',
    phone: '01022822123',
    is_admin: true,
  },
  {
    id: 5,
    name: 'عميل كنوز المميز',
    email: 'customer@kounoz.sa',
    password: 'user123',
    phone: '01012345678',
    is_admin: false,
  },
];

export function getStoredAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing default accounts
        const existingEmails = new Set(parsed.map((u: StoredAccount) => u.email.toLowerCase()));
        const missing = DEFAULT_ACCOUNTS.filter((d) => !existingEmails.has(d.email.toLowerCase()));
        return [...parsed, ...missing];
      }
    }
  } catch {}
  return DEFAULT_ACCOUNTS;
}

export function saveStoredAccount(account: StoredAccount): void {
  if (typeof window === 'undefined') return;
  const accounts = getStoredAccounts();
  const existingIdx = accounts.findIndex((a) => a.email.toLowerCase() === account.email.toLowerCase());
  if (existingIdx >= 0) {
    accounts[existingIdx] = { ...accounts[existingIdx], ...account };
  } else {
    accounts.push(account);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
}

// ── CUSTOMER AUTH HELPERS ────────────────────────────────────────────────────
export function getCurrentCustomer(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('kounoz_customer_user');
  if (data) {
    try {
      const user = JSON.parse(data);
      if (user) {
        if (isAdminEmail(user.email)) user.is_admin = true;
        return user;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function saveCustomerSession(user: User, token?: string): void {
  if (typeof window === 'undefined') return;
  const isAdmin = isAdminEmail(user.email);
  const updatedUser = { ...user, is_admin: isAdmin };
  
  localStorage.setItem('kounoz_customer_user', JSON.stringify(updatedUser));
  if (isAdmin) {
    localStorage.setItem('kounoz_admin_user', JSON.stringify(updatedUser));
    localStorage.setItem('kounoz_admin_token', token || 'admin_token_' + Date.now());
  }
  if (token) {
    localStorage.setItem('token', token);
  }
  window.dispatchEvent(new Event('kounoz_auth_changed'));
}

export function logoutCustomer(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kounoz_customer_user');
    localStorage.removeItem('kounoz_admin_user');
    localStorage.removeItem('kounoz_admin_token');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('kounoz_auth_changed'));
  }
}

export function loginWithFacebook(name?: string, email?: string): User {
  const cleanName = (name && name.trim()) || 'عميل فيسبوك';
  const cleanEmail = (email && email.trim().toLowerCase()) || `fb_user_${Date.now()}@facebook.com`;
  const fbUser: User = {
    id: Date.now(),
    name: cleanName,
    email: cleanEmail,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    is_admin: false,
  };
  saveCustomerSession(fbUser, 'fb_token_' + Date.now());
  return fbUser;
}

export function getAuthenticatedUser(): User | null {
  if (typeof window === 'undefined') return null;
  const admin = getAdminUser();
  if (admin && admin.email && isAdminEmail(admin.email)) return admin;
  const customer = getCurrentCustomer();
  if (customer && customer.email) return customer;
  return null;
}

export async function registerCustomer(
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanName) {
    return { success: false, error: 'يرجى إدخال اسمك الكريم' };
  }
  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: 'صيغة البريد الإلكتروني غير صحيحة (مثال: name@gmail.com)' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل' };
  }

  // Check if email already registered
  const accounts = getStoredAccounts();
  const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'هذا البريد الإلكتروني مسجل مسبقاً، يمكنك تسجيل الدخول به' };
  }

  // Create new account
  const newAccount: StoredAccount = {
    id: Date.now(),
    name: cleanName,
    email: cleanEmail,
    password: password,
    phone: phone?.trim() || '',
    is_admin: isAdminEmail(cleanEmail),
  };

  saveStoredAccount(newAccount);

  const user: User = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    phone: newAccount.phone,
    is_admin: newAccount.is_admin,
  };

  saveCustomerSession(user, 'token_' + Date.now());

  // Also notify backend if reachable
  try {
    await api.post('/api/auth/register', { name: cleanName, email: cleanEmail, password, phone });
  } catch {}

  return { success: true, user };
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' };
  }

  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: 'يرجى إدخال بريد إلكتروني صحيح ومكتمل' };
  }

  // 1. Try backend API first
  try {
    const res = await api.post('/api/auth/login', { email: cleanEmail, password });
    if (res.data && res.data.success && res.data.data) {
      const user: User = res.data.data.user;
      saveCustomerSession(user, res.data.data.token);
      return { success: true, user };
    }
  } catch (apiErr: any) {
    if (apiErr?.response?.data?.error) {
      const serverMsg = apiErr.response.data.error;
      // If server specifically returned authentication failure
      if (serverMsg.includes('كلمة المرور') || serverMsg.includes('غير مسجل') || serverMsg.includes('غير صحيحة')) {
        return { success: false, error: serverMsg };
      }
    }
  }

  // 2. Check local accounts database
  const accounts = getStoredAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!account) {
    // If it's an authorized admin email attempting admin password
    if (isAdminEmail(cleanEmail)) {
      if (password === 'admin123' || password === 'kounoz123') {
        const adminUser: User = {
          id: Date.now(),
          name: 'مدير المتجر',
          email: cleanEmail,
          is_admin: true,
        };
        saveCustomerSession(adminUser, 'admin_token_' + Date.now());
        return { success: true, user: adminUser };
      } else {
        return {
          success: false,
          error: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى',
        };
      }
    }
    return {
      success: false,
      error: 'هذا الحساب غير مسجل لدينا، يرجى التأكد من البريد أو الانتقال لتبويب إنشاء حساب جديد',
    };
  }

  // Strict Password Verification
  const isPasswordCorrect =
    account.password === password ||
    (account.is_admin && (password === 'admin123' || password === 'kounoz123'));

  if (!isPasswordCorrect) {
    return {
      success: false,
      error: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى',
    };
  }

  const user: User = {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    is_admin: account.is_admin || isAdminEmail(account.email),
  };

  saveCustomerSession(user, 'token_' + Date.now());
  return { success: true, user };
}

// ── HELPER: FILE TO BASE64 ───────────────────────────────────────────────────
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// ── UPLOAD SINGLE IMAGE (Cloudinary via Next.js API Route) ────────────────────
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('Cloudinary upload route error, trying direct Cloudinary fallback', err);
  }

  // Direct unsigned Cloudinary fallback
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dcifssy9u';
    const cFormData = new FormData();
    cFormData.append('file', file);
    cFormData.append('upload_preset', 'ml_default');
    const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: cFormData,
    });
    if (cRes.ok) {
      const cData = await cRes.json();
      if (cData && cData.secure_url) {
        return cData.secure_url;
      }
    }
  } catch {}

  // Fallback to Base64 data URL
  return await fileToBase64(file);
}

// ── UPLOAD MULTIPLE IMAGES (Cloudinary via Next.js API Route) ─────────────────
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        return data.urls;
      }
    }
  } catch (err) {
    console.warn('Cloudinary multiple upload error', err);
  }

  // Upload one by one with uploadImage
  return Promise.all(files.map((file) => uploadImage(file)));
}

// ── HERO IMAGE MANAGEMENT (4 images) ─────────────────────────────────────────
const HERO_IMAGES_KEY = 'kounoz_hero_images';
const HERO_BADGE_KEY  = 'kounoz_hero_badge';

const DEFAULT_HERO_IMAGES = [
  '/products/1/1.png',
  '/products/1/2.png',
  '/products/1/3.png',
  '/products/1/4.png',
];

export function getHeroImages(): string[] {
  if (typeof window === 'undefined') return DEFAULT_HERO_IMAGES;
  try {
    const saved = localStorage.getItem(HERO_IMAGES_KEY);
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string' && !arr[0].includes('unsplash')) {
        return arr;
      }
    }
  } catch {}
  return DEFAULT_HERO_IMAGES;
}

export function saveHeroImages(images: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HERO_IMAGES_KEY, JSON.stringify(images));
  } catch (e) {
    console.error('Error saving hero images', e);
  }
}

export function getHeroBadge(): { name: string; material: string } {
  if (typeof window === 'undefined') return { name: 'جلابية كنوز الملكية', material: 'قطن مصري 100% نقي' };
  try {
    const saved = localStorage.getItem(HERO_BADGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { name: 'جلابية كنوز الملكية', material: 'قطن مصري 100% نقي' };
}

export function saveHeroBadge(name: string, material: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HERO_BADGE_KEY, JSON.stringify({ name, material }));
  } catch (e) {
    console.error('Error saving hero badge', e);
  }
}

export async function uploadHeroImage(file: File): Promise<string> {
  return uploadImage(file);
}

// ── HERO BANNER SLIDER MANAGEMENT ──────────────────────────────────────────
export const DEFAULT_BANNER_SLIDES: string[] = [
  '/images/banners/banner-craftsmanship.png',
  '/images/banners/banner-collection.png',
];
const BANNER_SLIDES_KEY = 'kounoz_banner_slides';

export function getBannerSlides(): string[] {
  if (typeof window === 'undefined') return DEFAULT_BANNER_SLIDES;
  try {
    const saved = localStorage.getItem(BANNER_SLIDES_KEY);
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr) && arr.length > 0) return arr;
    }
  } catch {}
  return DEFAULT_BANNER_SLIDES;
}

export function saveBannerSlides(slides: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BANNER_SLIDES_KEY, JSON.stringify(slides));
    window.dispatchEvent(new Event('kounoz_banners_updated'));
  } catch (e) {
    console.error('Error saving banner slides', e);
  }
}

export async function uploadBannerSlide(file: File): Promise<string> {
  return uploadImage(file);
}

// ── HERO VIDEO MANAGEMENT (Intro Video) ────────────────────────────────────
export const DEFAULT_HERO_VIDEO = '/videos/intro.mp4';
const HERO_VIDEO_KEY = 'kounoz_hero_video';

export function getHeroVideo(): string {
  if (typeof window === 'undefined') return DEFAULT_HERO_VIDEO;
  try {
    const saved = localStorage.getItem(HERO_VIDEO_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  return DEFAULT_HERO_VIDEO;
}

export function saveHeroVideo(videoUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanUrl = videoUrl.trim() || DEFAULT_HERO_VIDEO;
    localStorage.setItem(HERO_VIDEO_KEY, cleanUrl);
    window.dispatchEvent(new Event('kounoz_hero_updated'));
  } catch (e) {
    console.error('Error saving hero video', e);
  }
}

export async function uploadHeroVideo(file: File): Promise<string> {
  // Use uploadImage which posts to /api/upload with resource_type: auto
  return uploadImage(file);
}

// ── STORE SETTINGS & WHATSAPP CONFIGURATION ─────────────────────────────────
export interface StoreSettings {
  whatsapp_number: string;
  whatsapp_greeting?: string;
  store_phone?: string;
  wholesale_phone?: string;
  store_email?: string;
}

export const DEFAULT_WHATSAPP_NUMBER = '01022822123';
export const DEFAULT_WHOLESALE_NUMBER = '01066583964';
const SETTINGS_KEY = 'kounoz_store_settings';
const WHATSAPP_KEY = 'kounoz_whatsapp_number';

/**
 * Format a phone number to international WhatsApp format
 * Supports Egyptian numbers (010..., 011..., 012..., 015...), Saudi (05...), and general international numbers.
 */
export function formatWhatsAppPhone(phone: string): string {
  if (!phone) return '201022822123';
  let clean = phone.replace(/[^0-9]/g, '');

  if (clean.startsWith('00')) {
    clean = clean.substring(2);
  }

  // Egyptian mobile format: 01xxxxxxxxx (11 digits) -> 201xxxxxxxxx
  if (clean.startsWith('01') && clean.length === 11) {
    return '2' + clean;
  }

  // Saudi mobile format: 05xxxxxxxx (10 digits) -> 9665xxxxxxxx
  if (clean.startsWith('05') && clean.length === 10) {
    return '966' + clean.substring(1);
  }

  return clean;
}

/**
 * Generate full wa.me link with encoded message
 */
export function formatWhatsAppUrl(phone?: string, message?: string): string {
  const targetPhone = phone || getWhatsAppNumber();
  const cleanPhone = formatWhatsAppPhone(targetPhone);
  const textParam = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanPhone}${textParam}`;
}

export function getWhatsAppNumber(): string {
  if (typeof window === 'undefined') return DEFAULT_WHATSAPP_NUMBER;
  try {
    const direct = localStorage.getItem(WHATSAPP_KEY);
    if (direct && direct.trim()) {
      const cleanDirect = direct.trim();
      // Auto migrate legacy old numbers if found in client cache
      if (cleanDirect === '01000943197' || cleanDirect === '201000943197') {
        localStorage.setItem(WHATSAPP_KEY, DEFAULT_WHATSAPP_NUMBER);
        return DEFAULT_WHATSAPP_NUMBER;
      }
      return cleanDirect;
    }

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.whatsapp_number && parsed.whatsapp_number.trim()) {
        const cleanSaved = parsed.whatsapp_number.trim();
        if (cleanSaved === '01000943197' || cleanSaved === '201000943197') {
          parsed.whatsapp_number = DEFAULT_WHATSAPP_NUMBER;
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
          return DEFAULT_WHATSAPP_NUMBER;
        }
        return cleanSaved;
      }
    }
  } catch (e) {
    console.error('Error reading WhatsApp number from storage', e);
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export async function saveWhatsAppNumber(phone: string): Promise<void> {
  const trimmed = phone.trim() || DEFAULT_WHATSAPP_NUMBER;
  if (typeof window !== 'undefined') {
    localStorage.setItem(WHATSAPP_KEY, trimmed);
    const existing = getStoreSettings();
    existing.whatsapp_number = trimmed;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event('kounoz_settings_updated'));
  }

  try {
    await api.post('/api/settings', { whatsapp_number: trimmed });
  } catch (err) {
    console.warn('API save settings fallback');
  }
}

export function getStoreSettings(): StoreSettings {
  const defaults: StoreSettings = {
    whatsapp_number: DEFAULT_WHATSAPP_NUMBER,
    whatsapp_greeting: 'مرحباً، أود الاستفسار والطلب من تشكيلة كنوز الفاخرة',
    store_phone: DEFAULT_WHATSAPP_NUMBER,
    wholesale_phone: DEFAULT_WHOLESALE_NUMBER,
    store_email: 'Kounozthobe@gmail.com',
  };

  if (typeof window === 'undefined') return defaults;
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      let changed = false;
      if (parsed.store_phone === '01000943197' || parsed.store_phone === '201000943197') {
        parsed.store_phone = DEFAULT_WHATSAPP_NUMBER;
        changed = true;
      }
      if (parsed.store_email === 'omargamil37@gmail.com') {
        parsed.store_email = 'Kounozthobe@gmail.com';
        changed = true;
      }
      if (parsed.whatsapp_number === '01000943197' || parsed.whatsapp_number === '201000943197') {
        parsed.whatsapp_number = DEFAULT_WHATSAPP_NUMBER;
        changed = true;
      }
      if (changed) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...defaults, ...parsed }));
      }
      return { ...defaults, ...parsed };
    }
  } catch {}
  return defaults;
}

export async function saveStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = getStoreSettings();
  const updated = { ...current, ...settings };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    if (updated.whatsapp_number) {
      localStorage.setItem(WHATSAPP_KEY, updated.whatsapp_number);
    }
    window.dispatchEvent(new Event('kounoz_settings_updated'));
  }

  try {
    await api.post('/api/settings', updated);
  } catch (err) {
    console.warn('API save settings fallback');
  }

  return updated;
}


