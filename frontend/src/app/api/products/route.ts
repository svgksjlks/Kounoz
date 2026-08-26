import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// In-memory Global Server Store for Next.js Serverless runtime
let globalProducts: Product[] = [
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

// POST: Add or update product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existingIndex = globalProducts.findIndex((p) => p.id === body.id);

    if (existingIndex !== -1) {
      globalProducts[existingIndex] = { ...globalProducts[existingIndex], ...body };
      return NextResponse.json({
        success: true,
        data: globalProducts[existingIndex],
      });
    }

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
