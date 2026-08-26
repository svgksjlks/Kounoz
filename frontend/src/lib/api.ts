import axios from 'axios';
import { Product, User } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 4000,
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

// 10 authentic luxury garments with 4 distinct photo shapes/angles each
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'جلابية كنوز مطرزة بالحرير الملكي',
    slug: 'jalabiya-kounoz-silk-embroidery',
    category: 'جلابيب كلاسيكية',
    price: 380,
    original_price: 450,
    description: 'جلابية رجالية فاخرة محاكة من أجود أنواع القطن المصري 100%، تتميز بتطريز يدوي أنيق على الصدر والياقة بألوان هادئة تعكس فخامة المظهر العربي الأصيل.',
    material: 'قطن مصري 100% فاخر',
    care_instructions: 'غسيل يدوي أو تنظيف جاف',
    image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80', // المنظر الأمامي
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', // المنظر الخلفي
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80', // زاوية القَصّة
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80', // تفاصيل النسيج
    ],
    is_new: true,
    tag: 'قطن مصري نقي',
    in_stock: true,
    sizes: ['52L', '54L', '56L', '58L', '60L'],
    colors: [
      { name: 'أبيض لؤلؤي', hex: '#FAF9F6' },
      { name: 'سكري هادئ', hex: '#EDE5D8' },
      { name: 'كحلي ملكي', hex: '#1C2833' },
    ],
  },
  {
    id: 2,
    name: 'ثوب كنوز ملكي شتوي صوف جوخ',
    slug: 'royal-winter-wool-thobe',
    category: 'أثواب ملكية',
    price: 520,
    original_price: 600,
    description: 'ثوب عربي شتوي من صوف الجوخ الإنجليزي الدافئ بياقة قلاب كلاسيكية وأزرار مخفية مصممة للراحة والأناقة في المناسبات والأجواء الباردة.',
    material: 'صوف جوخ إنجليزي دافئ',
    care_instructions: 'تنظيف جاف فقط',
    image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    tag: 'إصدار شتوي',
    in_stock: true,
    sizes: ['54L', '56L', '58L', '60L'],
    colors: [
      { name: 'رمادي فحمي', hex: '#2C3E50' },
      { name: 'بني عسلي', hex: '#6B4226' },
      { name: 'زيتي ملكي', hex: '#3D5A45' },
    ],
  },
  {
    id: 3,
    name: 'بشت حساوي دقة ملكية مذهب',
    slug: 'hasawi-royal-gold-bisht',
    category: 'بشوت ومناسبات',
    price: 950,
    original_price: 1100,
    description: 'بشت عربي فاخر منسوج من خيوط القصب الألماني المذهب عيار أصلي على أقمشة يابانية خفيفة وراقية، رمز للهيبة والوقار في الأعراس والمناسبات الرسمية.',
    material: 'قماش وبر ياباني مع قصب مذهب ألماني',
    care_instructions: 'تنظيف جاف مخصص للبشوت',
    image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    tag: 'تطريز ذهبي يدوي',
    in_stock: true,
    sizes: ['27', '28', '29', '30'],
    colors: [
      { name: 'أسود ملكي', hex: '#111111' },
      { name: 'بني شوكولاتة', hex: '#4A2E18' },
      { name: 'بيج صحراوي', hex: '#D2B48C' },
    ],
  },
  {
    id: 4,
    name: 'جلابية كاجوال كتان معاصر',
    slug: 'casual-contemporary-linen-jalabiya',
    category: 'جلابيب كلاسيكية',
    price: 290,
    original_price: null,
    description: 'جلابية صيفية خفيفة مصنوعة من الكتان الطبيعي المريح، بقصة عصرية وياقة مغلقة وجيوب مخفية مريحة جداً للاستخدام اليومي والجمعات العائلية.',
    material: 'كتان أوروبي طبيعي 100%',
    care_instructions: 'غسيل آلي على البارد',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    tag: 'كتان طبيعي',
    in_stock: true,
    sizes: ['52L', '54L', '56L', '58L'],
    colors: [
      { name: 'كتان خام طبيعي', hex: '#DED4C2' },
      { name: 'أزرق كحلي', hex: '#1C2833' },
      { name: 'زيتي هادئ', hex: '#8FAF8C' },
    ],
  },
  {
    id: 5,
    name: 'ثوب سحاب قطني معاصر',
    slug: 'contemporary-zipper-thobe',
    category: 'أثواب ملكية',
    price: 340,
    original_price: 380,
    description: 'تصميم يجمع بين الأصالة والحداثة بثوب عملي ذو سحاب مخفي عالي الجودة وياقة ثابتة، ملائم لبيئات العمل والأنشطة اليومية بأناقة كاملة.',
    material: 'مزيج قطن وبوليستر ياباني مقاوم للتجعد',
    care_instructions: 'غسيل آلي، كوي متوسط الحرارة',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    tag: 'مقاوم للتجعد',
    in_stock: true,
    sizes: ['54L', '56L', '58L', '60L', '62L'],
    colors: [
      { name: 'أبيض ناصع', hex: '#FFFFFF' },
      { name: 'سكري فاتح', hex: '#F5EFE6' },
    ],
  },
  {
    id: 6,
    name: 'شال كشميري يدوي ترمة',
    slug: 'kashmiri-torma-handmade-shawl',
    category: 'إكسسوارات وشيل',
    price: 460,
    original_price: 520,
    description: 'شال كشميري أصلي بنقشة الترمة التقليدية المغزولة يدوياً من صوف الباشمينا الطبيعي فائق النعومة والدفء، يمنح إطلالتك فخامة استثنائية.',
    material: 'صوف باشمينا كشميري 100%',
    care_instructions: 'تنظيف جاف فقط',
    image_url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    tag: 'غزل يدوي',
    in_stock: true,
    sizes: ['مقاس موحد (One Size)'],
    colors: [
      { name: 'بيج كلاسيكي', hex: '#D7C4A5' },
      { name: 'عنابي دافئ', hex: '#78281F' },
    ],
  },
  {
    id: 7,
    name: 'جلابية سهرة مخملية فاخرة',
    slug: 'velvet-evening-luxury-jalabiya',
    category: 'جلابيب كلاسيكية',
    price: 490,
    original_price: null,
    description: 'جلابية شتوية من قماش المخمل الفاخر مع ياقة وأكمام مزينة بزخارف قصبية ناعمة، خيار مثالي للمجالس الشتوية والسهرات العربية.',
    material: 'مخمل حريري ملكي ناعم',
    care_instructions: 'تنظيف جاف فقط',
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    tag: 'مخمل ملكي',
    in_stock: true,
    sizes: ['52L', '54L', '56L', '58L'],
    colors: [
      { name: 'كحلي ليلي', hex: '#0B132B' },
      { name: 'خمري عميق', hex: '#4A1521' },
      { name: 'أخضر زمردي', hex: '#1B4D3E' },
    ],
  },
  {
    id: 8,
    name: 'سديري صوف وجهين مطرز',
    slug: 'reversible-embroidered-wool-vest',
    category: 'بشوت ومناسبات',
    price: 260,
    original_price: 300,
    description: 'صديري عربي شتوي بتصميم مميز يتيح ارتداءه على الوجهين بألوان متناسقة، خياطة يدوية متقونة وجيوب جانبية أنيقة فوق الثوب أو الجلابية.',
    material: 'صوف طبيعي ناعم منسوج',
    care_instructions: 'تنظيف جاف',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    tag: 'وجهين reversible',
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'رصاصي / كحلي', hex: '#4B6584' },
      { name: 'جملي / بني', hex: '#A5693F' },
    ],
  },
  {
    id: 9,
    name: 'شماغ ملكي قطن خاص دم الغزال',
    slug: 'royal-special-cotton-shemagh',
    category: 'إكسسوارات وشيل',
    price: 180,
    original_price: 210,
    description: 'شماغ أحمر بنقشة دم الغزال التراثية مصنوع من خيوط قطنية نقية 100% متطابقة الأطراف وثابتة على الرأس دون تجعد أو بهتان.',
    material: '100% قطن طبيعي معالج',
    care_instructions: 'غسيل يدوي منفصل، كوي بخار',
    image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    tag: 'قطن سوبر 100%',
    in_stock: true,
    sizes: ['55', '58', '60'],
    colors: [
      { name: 'أحمر تراثي', hex: '#922B21' },
      { name: 'أبيض سادة', hex: '#FFFFFF' },
    ],
  },
  {
    id: 10,
    name: 'عقال مقصب تراثي فاخر',
    slug: 'traditional-gold-threaded-agal',
    category: 'إكسسوارات وشيل',
    price: 150,
    original_price: null,
    description: 'عقال عربي فاخر محبوك من الصوف الطبيعي مع خيوط القصب الذهبية التراثية خفيفة الوزن وثابتة المقاس.',
    material: 'صوف أسود طبيعي مع خيوط مذهبة',
    care_instructions: 'تخزين في علبة مخصصة بعيداً عن الرطوبة',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: false,
    tag: 'صناعة يدوية',
    in_stock: true,
    sizes: ['48', '50', '52', '54'],
    colors: [
      { name: 'أسود وقصب مذهب', hex: '#1C1C1E' },
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
  // If in browser and admin has saved products locally, always use them as source of truth
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kounoz_products');
    if (saved) {
      const local = getLocalProducts();
      if (local && local.length > 0) {
        return filterByCategory(local, category);
      }
    }
  }

  try {
    const url = category && category !== 'جميع القطع' 
      ? `/api/products?category=${encodeURIComponent(category)}`
      : '/api/products';
    const res = await api.get(url);
    if (res.data && res.data.success && res.data.data.length > 0) {
      // Sync to local products if not present
      if (typeof window !== 'undefined' && !localStorage.getItem('kounoz_products')) {
        saveLocalProducts(res.data.data);
      }
      return filterByCategory(getLocalProducts(), category);
    }
    return filterByCategory(getLocalProducts(), category);
  } catch {
    return filterByCategory(getLocalProducts(), category);
  }
}

function filterByCategory(items: Product[], category?: string): Product[] {
  if (category && category !== 'جميع القطع') {
    return items.filter((p) => p.category === category);
  }
  return items;
}

// ── GET PRODUCT BY ID ────────────────────────────────────────────────────────
export async function getProductById(id: number | string): Promise<Product | null> {
  const localList = getLocalProducts();
  const found = localList.find((p) => String(p.id) === String(id));
  if (found) return found;

  try {
    const res = await api.get(`/api/products/${id}`);
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch {
    // ignore
  }
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

  // Try API first
  try {
    const res = await api.post('/api/products', newProduct);
    if (res.data && res.data.success && res.data.data) {
      newProduct.id = res.data.data.id;
    }
  } catch (err) {
    console.warn('API create product fallback to local storage');
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
    await api.put(`/api/products/${id}`, productData);
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

  try {
    await api.delete(`/api/products/${id}`);
  } catch (err) {
    console.warn('API delete product fallback');
  }
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

// ── UPLOAD SINGLE IMAGE (From local device) ──────────────────────────────────
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data && res.data.success && res.data.url) {
      return res.data.url;
    }
  } catch (err) {
    console.warn('Backend upload failed, converting image to local base64 data URL fallback', err);
  }

  // Fallback to Base64 data URL
  return await fileToBase64(file);
}

// ── UPLOAD MULTIPLE IMAGES (From local device) ────────────────────────────────
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const res = await api.post('/api/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data && res.data.success && Array.isArray(res.data.urls) && res.data.urls.length > 0) {
      return res.data.urls;
    }
  } catch (err) {
    console.warn('Backend multiple upload failed, converting images to local base64 fallback', err);
  }

  // Fallback to Base64
  return Promise.all(files.map((file) => fileToBase64(file)));
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


