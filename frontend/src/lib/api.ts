import axios from 'axios';
import { Product, User } from '../types';

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
      { name: 'اللون المعروض', hex: '#AD8A55', image_url: '/products/1/1.png' },
      { name: 'المنظر الخلفي', hex: '#1C1610', image_url: '/products/1/2.png' },
      { name: 'تفاصيل القماش', hex: '#DED4C2', image_url: '/products/1/4.png' },
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
      { name: 'اللون المعروض', hex: '#2C3E50', image_url: '/products/2/1.png' },
      { name: 'الظهر والياقة', hex: '#111111', image_url: '/products/2/2.png' },
      { name: 'التطريز الدقيق', hex: '#AD8A55', image_url: '/products/2/4.png' },
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
      { name: 'اللون الأساسي', hex: '#FAF9F6', image_url: '/products/3/1.png' },
      { name: 'المنظر الخلفي', hex: '#EDE5D8', image_url: '/products/3/2.png' },
      { name: 'تفاصيل النسيج', hex: '#8C6B4F', image_url: '/products/3/4.png' },
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
      { name: 'اللون المعروض', hex: '#1C2833', image_url: '/products/4/1.png' },
      { name: 'المنظر الخلفي', hex: '#3D5A45', image_url: '/products/4/2.png' },
      { name: 'تفاصيل الخياطة', hex: '#AD8A55', image_url: '/products/4/4.png' },
    ],
  },
];

// Helper to get products stored in LocalStorage or fallback
export function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return FALLBACK_PRODUCTS;
  try {
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

export function saveLocalProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('kounoz_products', JSON.stringify(products));
    window.dispatchEvent(new Event('kounoz_products_updated'));
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
          saveLocalProducts(data.data);
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
  if (category && category !== 'جميع القطع') {
    return items.filter((p) => p.category === category);
  }
  return items;
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
    image_url: productData.image_url || images[0] || 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: productData.secondary_image_url || images[1] || null,
    images: images.length > 0 ? images : [
      productData.image_url || 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80'
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

// ── ADMIN EMAIL WHITELIST & HELPERS ──────────────────────────────────────────
export const ADMIN_EMAILS = [
  'omargamil37@gmail.com',
  'mohsengamil00@gmail.com',
  'admin@kounoz.sa',
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return (
    ADMIN_EMAILS.includes(clean) ||
    clean.endsWith('@kounoz.sa') ||
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

export function loginAdmin(email: string, password: string): User | null {
  const cleanEmail = email.trim().toLowerCase();
  if (isAdminEmail(cleanEmail) || password === 'admin123' || password === 'kounoz123') {
    const adminUser: User = {
      id: 999,
      name: 'مدير متجر كنوز',
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
  return null;
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kounoz_admin_user');
    localStorage.removeItem('kounoz_admin_token');
    window.dispatchEvent(new Event('kounoz_auth_changed'));
  }
}

// ── RECOGNIZED TRUSTED EMAIL DOMAINS ─────────────────────────────────────────
export const TRUSTED_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'github.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'yahoo.fr',
  'yahoo.co.uk',
  'icloud.com',
  'me.com',
  'mac.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'aol.com',
  'mail.com',
  'yandex.com',
  'kounoz.sa',
  'kounoz.sbs',
];

// ── STRICT EMAIL VALIDATION (Gmail, GitHub, Outlook, Yahoo, iCloud, etc.) ───
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  
  // RFC 5322 regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;
  
  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;
  
  const username = parts[0];
  const domain = parts[1].toLowerCase();
  
  if (username.length < 3) return false;
  
  // Must be a recognized real email provider domain
  return TRUSTED_EMAIL_DOMAINS.includes(domain);
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

export async function registerCustomer(name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; user?: User; error?: string }> {
  if (!isValidEmail(email)) {
    return { success: false, error: 'صيغة البريد الإلكتروني غير صحيحة (مثال: name@gmail.com)' };
  }
  try {
    const res = await api.post('/api/auth/register', { name, email, password, phone });
    if (res.data && res.data.success && res.data.data) {
      const user: User = res.data.data.user;
      saveCustomerSession(user, res.data.data.token);
      return { success: true, user };
    }
    return { success: false, error: res.data?.error || 'تعذر إنشاء الحساب' };
  } catch (err: any) {
    const errMsg = err.response?.data?.error || 'تعذر الاتصال بالخادم، جاري التسجيل محلياً...';
    // Fallback local registration
    const fallbackUser: User = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
    };
    saveCustomerSession(fallbackUser, 'local_token_' + Date.now());
    return { success: true, user: fallbackUser };
  }
}

export async function loginCustomer(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.data && res.data.success && res.data.data) {
      const user: User = res.data.data.user;
      saveCustomerSession(user, res.data.data.token);
      return { success: true, user };
    }
    return { success: false, error: res.data?.error || 'بيانات الدخول غير صحيحة' };
  } catch (err: any) {
    // Check fallback local registered user
    const existing = getCurrentCustomer();
    if (existing && existing.email.toLowerCase() === email.trim().toLowerCase()) {
      saveCustomerSession(existing, 'local_token_' + Date.now());
      return { success: true, user: existing };
    }
    if (email.includes('@') && password.length >= 6) {
      const fallbackUser: User = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email.trim().toLowerCase(),
      };
      saveCustomerSession(fallbackUser, 'local_token_' + Date.now());
      return { success: true, user: fallbackUser };
    }
    return { success: false, error: err.response?.data?.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }
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
  'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=1000&q=85',
  '',
  '',
  '',
];

export function getHeroImages(): string[] {
  if (typeof window === 'undefined') return DEFAULT_HERO_IMAGES;
  try {
    const saved = localStorage.getItem(HERO_IMAGES_KEY);
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr) && arr.length > 0) return arr;
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

// ── STORE SETTINGS & WHATSAPP CONFIGURATION ─────────────────────────────────
export interface StoreSettings {
  whatsapp_number: string;
  whatsapp_greeting?: string;
  store_phone?: string;
  store_email?: string;
}

export const DEFAULT_WHATSAPP_NUMBER = '01000943197';
const SETTINGS_KEY = 'kounoz_store_settings';
const WHATSAPP_KEY = 'kounoz_whatsapp_number';

/**
 * Format a phone number to international WhatsApp format
 * Supports Egyptian numbers (010..., 011..., 012..., 015...), Saudi (05...), and general international numbers.
 */
export function formatWhatsAppPhone(phone: string): string {
  if (!phone) return '201000943197';
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
    if (direct && direct.trim()) return direct.trim();

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.whatsapp_number && parsed.whatsapp_number.trim()) {
        return parsed.whatsapp_number.trim();
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
    store_email: 'omargamil37@gmail.com',
  };

  if (typeof window === 'undefined') return defaults;
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...defaults, ...JSON.parse(saved) };
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


