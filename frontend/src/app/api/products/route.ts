import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// In-memory Global Server Store for Next.js Serverless runtime
let globalProducts: Product[] = [
  {
    id: 1,
    name: 'جلابية كنوز ملكية قطن سوبر 100%',
    slug: 'royal-kounoz-super-cotton-jalabiya',
    category: 'جلابيب كلاسيكية',
    price: 380,
    original_price: 450,
    description: 'جلابية رجالية فاخرة محاكة من أجود أنواع القطن المصري 100%، تتميز بتطريز يدوي أنيق على الصدر والياقة بألوان هادئة تعكس فخامة المظهر العربي الأصيل.',
    material: 'قطن مصري 100% فاخر',
    care_instructions: 'غسيل يدوي أو تنظيف جاف',
    image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    ],
    is_new: true,
    tag: 'قطن مصري نقي',
    in_stock: true,
    sizes: ['52L', '54L', '56L', '58L', '60L'],
    colors: [
      { name: 'أبيض لؤلؤي', hex: '#FAF9F6', image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80' },
      { name: 'سكري هادئ', hex: '#EDE5D8', image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
      { name: 'كحلي ملكي', hex: '#1C2833', image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80' },
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
      { name: 'رمادي فحمي', hex: '#2C3E50', image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80' },
      { name: 'بني عسلي', hex: '#6B4226', image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80' },
      { name: 'زيتي ملكي', hex: '#3D5A45', image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
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
      { name: 'أسود ملكي', hex: '#111111', image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80' },
      { name: 'بني شوكولاتة', hex: '#4A2E18', image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
      { name: 'بيج صحراوي', hex: '#D2B48C', image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80' },
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
      { name: 'كتان خام طبيعي', hex: '#DED4C2', image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80' },
      { name: 'أزرق كحلي', hex: '#1C2833', image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80' },
      { name: 'زيتي هادئ', hex: '#8FAF8C', image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
    ],
  },
];

// GET: All Products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  let results = globalProducts;
  if (category && category !== 'جميع القطع') {
    results = results.filter((p) => p.category === category);
  }

  return NextResponse.json({
    success: true,
    data: results,
  });
}

// POST: Add new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProduct: Product = {
      ...body,
      id: body.id || Date.now(),
    };

    globalProducts = [newProduct, ...globalProducts];

    return NextResponse.json({
      success: true,
      data: newProduct,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error creating product' },
      { status: 400 }
    );
  }
}
