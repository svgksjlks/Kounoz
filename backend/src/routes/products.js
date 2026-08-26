const express = require('express');
const router = express.Router();
const { pool, isDbAvailable } = require('../db');

// ── Fallback mock data (mirrors frontend FALLBACK_PRODUCTS) ──────────────────
const FALLBACK_PRODUCTS = [
  {
    id: 1, name: 'جلابية الأصالة مطرزة بالحرير', slug: 'jalabiya-asala-silk-embroidery',
    category: 'جلابيب كلاسيكية', price: 380, original_price: 450,
    description: 'جلابية رجالية فاخرة محاكة من أجود أنواع القطن المصري 100%.',
    material: 'قطن مصري 100% فاخر', care_instructions: 'غسيل يدوي أو تنظيف جاف',
    image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    is_new: true, has_3d: true, tag: 'قطن مصري نقي', in_stock: true,
    sizes: ['52L','54L','56L','58L','60L'],
    colors: [{ name: 'أبيض لؤلؤي', hex: '#FAF9F6' }, { name: 'سكري هادئ', hex: '#EDE5D8' }, { name: 'كحلي ملكي', hex: '#1C2833' }],
  },
  {
    id: 2, name: 'ثوب ملكي شتوي صوف جوخ', slug: 'royal-winter-wool-thobe',
    category: 'أثواب ملكية', price: 520, original_price: 600,
    description: 'ثوب عربي شتوي من صوف الجوخ الإنجليزي الدافئ.',
    material: 'صوف جوخ إنجليزي دافئ', care_instructions: 'تنظيف جاف فقط',
    image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
    is_new: true, has_3d: true, tag: 'إصدار شتوي', in_stock: true,
    sizes: ['54L','56L','58L','60L'],
    colors: [{ name: 'رمادي فحمي', hex: '#2C3E50' }, { name: 'بني عسلي', hex: '#6B4226' }, { name: 'زيتي ملكي', hex: '#3D5A45' }],
  },
  {
    id: 3, name: 'بشت حساوي دقة ملكية مذهب', slug: 'hasawi-royal-gold-bisht',
    category: 'بشوت ومناسبات', price: 950, original_price: 1100,
    description: 'بشت عربي فاخر منسوج من خيوط القصب الألماني المذهب.',
    material: 'قماش وبر ياباني مع قصب مذهب ألماني', care_instructions: 'تنظيف جاف مخصص للبشوت',
    image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: null,
    is_new: true, has_3d: true, tag: 'تطريز ذهبي يدوي', in_stock: true,
    sizes: ['27','28','29','30'],
    colors: [{ name: 'أسود ملكي', hex: '#111111' }, { name: 'بني شوكولاتة', hex: '#4A2E18' }, { name: 'بيج صحراوي', hex: '#D2B48C' }],
  },
  {
    id: 4, name: 'جلابية كاجوال كتان معاصر', slug: 'casual-contemporary-linen-jalabiya',
    category: 'جلابيب كلاسيكية', price: 290, original_price: null,
    description: 'جلابية صيفية خفيفة مصنوعة من الكتان الطبيعي المريح.',
    material: 'كتان أوروبي طبيعي 100%', care_instructions: 'غسيل آلي على البارد',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: null,
    is_new: false, has_3d: true, tag: 'كتان طبيعي', in_stock: true,
    sizes: ['52L','54L','56L','58L'],
    colors: [{ name: 'كتان خام طبيعي', hex: '#DED4C2' }, { name: 'أزرق كحلي', hex: '#1C2833' }, { name: 'زيتي هادئ', hex: '#8FAF8C' }],
  },
  {
    id: 5, name: 'ثوب سحاب قطني معاصر', slug: 'contemporary-zipper-thobe',
    category: 'أثواب ملكية', price: 340, original_price: 380,
    description: 'تصميم يجمع بين الأصالة والحداثة.',
    material: 'مزيج قطن وبوليستر ياباني مقاوم للتجعد', care_instructions: 'غسيل آلي، كوي متوسط الحرارة',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: null,
    is_new: false, has_3d: false, tag: 'مقاوم للتجعد', in_stock: true,
    sizes: ['54L','56L','58L','60L','62L'],
    colors: [{ name: 'أبيض ناصع', hex: '#FFFFFF' }, { name: 'سكري فاتح', hex: '#F5EFE6' }],
  },
  {
    id: 6, name: 'شال كشميري يدوي ترمة', slug: 'kashmiri-torma-handmade-shawl',
    category: 'إكسسوارات وشيل', price: 460, original_price: 520,
    description: 'شال كشميري أصلي بنقشة الترمة التقليدية.',
    material: 'صوف باشمينا كشميري 100%', care_instructions: 'تنظيف جاف فقط',
    image_url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: null,
    is_new: false, has_3d: false, tag: 'غزل يدوي', in_stock: true,
    sizes: ['مقاس موحد (One Size)'],
    colors: [{ name: 'بيج كلاسيكي', hex: '#D7C4A5' }, { name: 'عنابي دافئ', hex: '#78281F' }],
  },
  {
    id: 7, name: 'جلابية سهرة مخملية فاخرة', slug: 'velvet-evening-luxury-jalabiya',
    category: 'جلابيب كلاسيكية', price: 490, original_price: null,
    description: 'جلابية شتوية من قماش المخمل الفاخر.',
    material: 'مخمل حريري ملكي ناعم', care_instructions: 'تنظيف جاف فقط',
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: null,
    is_new: true, has_3d: true, tag: 'مخمل ملكي', in_stock: true,
    sizes: ['52L','54L','56L','58L'],
    colors: [{ name: 'كحلي ليلي', hex: '#0B132B' }, { name: 'خمري عميق', hex: '#4A1521' }, { name: 'أخضر زمردي', hex: '#1B4D3E' }],
  },
  {
    id: 8, name: 'سديري صوف وجهين مطرز', slug: 'reversible-embroidered-wool-vest',
    category: 'بشوت ومناسبات', price: 260, original_price: 300,
    description: 'صديري عربي شتوي بتصميم مميز يتيح ارتداءه على الوجهين.',
    material: 'صوف طبيعي ناعم منسوج', care_instructions: 'تنظيف جاف',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: null,
    is_new: false, has_3d: true, tag: 'وجهين reversible', in_stock: true,
    sizes: ['S','M','L','XL'],
    colors: [{ name: 'رصاصي / كحلي', hex: '#4B6584' }, { name: 'جملي / بني', hex: '#A5693F' }],
  },
  {
    id: 9, name: 'شماغ ملكي قطن خاص دم الغزال', slug: 'royal-special-cotton-shemagh',
    category: 'إكسسوارات وشيل', price: 180, original_price: 210,
    description: 'شماغ أحمر بنقشة دم الغزال التراثية.',
    material: '100% قطن طبيعي معالج', care_instructions: 'غسيل يدوي منفصل، كوي بخار',
    image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: null,
    is_new: true, has_3d: false, tag: 'قطن سوبر 100%', in_stock: true,
    sizes: ['55','58','60'],
    colors: [{ name: 'أحمر تراثي', hex: '#922B21' }, { name: 'أبيض سادة', hex: '#FFFFFF' }],
  },
  {
    id: 10, name: 'عقال مقصب تراثي فاخر', slug: 'traditional-gold-threaded-agal',
    category: 'إكسسوارات وشيل', price: 150, original_price: null,
    description: 'عقال عربي فاخر محبوك من الصوف الطبيعي مع خيوط القصب الذهبية.',
    material: 'صوف أسود طبيعي مع خيوط مذهبة', care_instructions: 'تخزين في علبة مخصصة بعيداً عن الرطوبة',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    secondary_image_url: null,
    is_new: false, has_3d: true, tag: 'صناعة يدوية', in_stock: true,
    sizes: ['48','50','52','54'],
    colors: [{ name: 'أسود وقصب مذهب', hex: '#1C1C1E' }],
  },
];

// ── GET /api/products ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const { category } = req.query;

  // ── Fallback mode ──────────────────────────────────────────────────────────
  if (!isDbAvailable()) {
    let data = FALLBACK_PRODUCTS;
    if (category && category !== 'جميع القطع') {
      data = data.filter((p) => p.category === category);
    }
    return res.json({ success: true, data, source: 'fallback' });
  }

  // ── DB mode ────────────────────────────────────────────────────────────────
  try {
    let query = `
      SELECT p.id, p.name, p.slug, p.category, p.price, p.original_price,
             p.description, p.material, p.image_url, p.secondary_image_url,
             p.is_new, p.has_3d, p.tag, p.in_stock
      FROM products p WHERE p.in_stock = 1
    `;
    const params = [];
    if (category && category !== 'جميع القطع') {
      query += ` AND p.category = ?`;
      params.push(category);
    }
    query += ` ORDER BY p.created_at DESC`;

    const [products] = await pool.query(query, params);
    const productIds = products.map((p) => p.id);
    let colors = [];
    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      const [colorRows] = await pool.query(
        `SELECT product_id, name, hex FROM product_colors WHERE product_id IN (${placeholders})`,
        productIds
      );
      colors = colorRows;
    }

    const result = products.map((p) => ({
      ...p,
      is_new: !!p.is_new, has_3d: !!p.has_3d, in_stock: !!p.in_stock,
      colors: colors.filter((c) => c.product_id === p.id).map(({ name, hex }) => ({ name, hex })),
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('❌ /api/products error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// ── GET /api/products/:id ────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // ── Fallback mode ──────────────────────────────────────────────────────────
  if (!isDbAvailable()) {
    const product = FALLBACK_PRODUCTS.find((p) => p.id === Number(id));
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    return res.json({ success: true, data: product, source: 'fallback' });
  }

  // ── DB mode ────────────────────────────────────────────────────────────────
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.category, p.price, p.original_price,
              p.description, p.material, p.care_instructions,
              p.image_url, p.secondary_image_url,
              p.is_new, p.has_3d, p.tag, p.in_stock
       FROM products p WHERE p.id = ? LIMIT 1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Product not found' });

    const product = rows[0];
    const [colors] = await pool.query(
      `SELECT name, hex FROM product_colors WHERE product_id = ?`, [id]
    );

    res.json({
      success: true,
      data: { ...product, is_new: !!product.is_new, has_3d: !!product.has_3d, in_stock: !!product.in_stock, colors },
    });
  } catch (err) {
    console.error('❌ /api/products/:id error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// ── POST /api/products (Admin create product with up to 4 shape images) ──────
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      original_price,
      description,
      material,
      care_instructions,
      image_url,
      secondary_image_url,
      images,
      tag,
      is_new,
      in_stock = true,
      stock_quantity = 15,
      colors = [],
      sizes = ['52L', '54L', '56L', '58L', '60L'],
    } = req.body;

    if (!name || !category || !price || !image_url) {
      return res.status(400).json({ success: false, error: 'الاسم والقسم والسعر ورابط الصورة الأساسية حقول مطلوبة' });
    }

    const slug = name.trim().toLowerCase().replace(/[\s\W-]+/g, '-');
    const allImages = Array.isArray(images) && images.length > 0 ? images : [image_url, secondary_image_url].filter(Boolean);

    const newProduct = {
      id: Date.now(),
      name,
      slug,
      category,
      price: Number(price),
      original_price: original_price ? Number(original_price) : null,
      description: description || '',
      material: material || 'قطن طبيعي 100%',
      care_instructions: care_instructions || 'غسيل يدوي أو تنظيف جاف',
      image_url,
      secondary_image_url: secondary_image_url || (allImages[1] || null),
      images: allImages,
      tag: tag || null,
      is_new: Boolean(is_new),
      in_stock: Boolean(in_stock),
      stock_quantity: Number(stock_quantity) || 0,
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : ['52L', '54L', '56L', '58L'],
    };

    FALLBACK_PRODUCTS.unshift(newProduct);

    if (isDbAvailable()) {
      try {
        const [result] = await pool.query(
          `INSERT INTO products (name, slug, category, price, original_price, description, material, care_instructions, image_url, secondary_image_url, is_new, in_stock, tag)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            name,
            slug,
            category,
            price,
            original_price || null,
            description,
            material,
            care_instructions,
            image_url,
            secondary_image_url || null,
            is_new ? 1 : 0,
            in_stock ? 1 : 0,
            tag || null,
          ]
        );
        newProduct.id = result.insertId;
      } catch (dbErr) {
        console.warn('DB insert error:', dbErr.message);
      }
    }

    res.status(201).json({ success: true, data: newProduct, message: 'تم إضافة المنتج بنجاح' });
  } catch (err) {
    console.error('❌ POST /api/products error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// ── PUT /api/products/:id (Admin update product) ─────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = FALLBACK_PRODUCTS.findIndex((p) => p.id === Number(id));
    if (index !== -1) {
      FALLBACK_PRODUCTS[index] = { ...FALLBACK_PRODUCTS[index], ...req.body };
    }

    if (isDbAvailable()) {
      try {
        const { name, category, price, original_price, description, material, image_url, secondary_image_url, tag, is_new, in_stock } = req.body;
        await pool.query(
          `UPDATE products SET name=?, category=?, price=?, original_price=?, description=?, material=?, image_url=?, secondary_image_url=?, tag=?, is_new=?, in_stock=? WHERE id=?`,
          [name, category, price, original_price || null, description, material, image_url, secondary_image_url, tag, is_new ? 1 : 0, in_stock ? 1 : 0, id]
        );
      } catch (dbErr) {
        console.warn('DB update error:', dbErr.message);
      }
    }

    res.json({ success: true, message: 'تم تحديث بيانات المنتج بنجاح' });
  } catch (err) {
    console.error('❌ PUT /api/products/:id error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// ── DELETE /api/products/:id (Admin delete product) ──────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = FALLBACK_PRODUCTS.findIndex((p) => p.id === Number(id));
    if (index !== -1) {
      FALLBACK_PRODUCTS.splice(index, 1);
    }

    if (isDbAvailable()) {
      try {
        await pool.query(`DELETE FROM products WHERE id=?`, [id]);
      } catch (dbErr) {
        console.warn('DB delete error:', dbErr.message);
      }
    }

    res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
  } catch (err) {
    console.error('❌ DELETE /api/products/:id error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

module.exports = router;

