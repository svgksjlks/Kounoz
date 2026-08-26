const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('🌱 جاري الاتصال بقاعدة بيانات MySQL وتجهيز الجداول...');

  // ── Create DB ───────────────────────────────────────────────
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'clothing_db'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await conn.query(`USE \`${process.env.DB_NAME || 'clothing_db'}\`;`);

  // ── Create Tables ───────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      email        VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS products (
      id                  INT AUTO_INCREMENT PRIMARY KEY,
      name                VARCHAR(255) NOT NULL,
      slug                VARCHAR(255) NOT NULL UNIQUE,
      category            VARCHAR(100) NOT NULL,
      price               DECIMAL(10,2) NOT NULL,
      original_price      DECIMAL(10,2) DEFAULT NULL,
      description         TEXT,
      material            VARCHAR(255),
      care_instructions   VARCHAR(255),
      image_url           TEXT NOT NULL,
      secondary_image_url TEXT,
      is_new              TINYINT(1) DEFAULT 0,
      has_3d              TINYINT(1) DEFAULT 0,
      tag                 VARCHAR(100) DEFAULT NULL,
      in_stock            TINYINT(1) DEFAULT 1,
      created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS product_colors (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      name       VARCHAR(100) NOT NULL,
      hex        VARCHAR(20)  NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS cart_items (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT NOT NULL,
      product_id INT NOT NULL,
      quantity   INT NOT NULL DEFAULT 1,
      color      VARCHAR(100) DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('✅ تم إنشاء الجداول بنجاح.');

  // ── Seed 10 Arabic Products ─────────────────────────────────
  const products = [
    {
      name: 'جلابية الأصالة مطرزة بالحرير',
      slug: 'jalabiya-asala-silk-embroidery',
      category: 'جلابيب كلاسيكية',
      price: 380.00,
      original_price: 450.00,
      description: 'جلابية رجالية فاخرة محاكة من أجود أنواع القطن المصري 100%، تتميز بتطريز يدوي أنيق على الصدر والياقة بألوان هادئة تعكس فخامة المظهر العربي الأصيل.',
      material: 'قطن مصري 100% فاخر',
      care_instructions: 'غسيل يدوي أو تنظيف جاف',
      image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      is_new: 1, has_3d: 1, tag: 'قطن مصري نقي',
      colors: [
        { name: 'أبيض لؤلؤي', hex: '#FAF9F6' },
        { name: 'سكري هادئ', hex: '#EDE5D8' },
        { name: 'كحلي ملكي', hex: '#1C2833' },
      ],
    },
    {
      name: 'ثوب ملكي شتوي صوف جوخ',
      slug: 'royal-winter-wool-thobe',
      category: 'أثواب ملكية',
      price: 520.00,
      original_price: null,
      description: 'ثوب عربي شتوي من صوف الجوخ الإنجليزي الدافئ بياقة قلاب كلاسيكية وأزرار مخفية مصممة للراحة والأناقة في المناسبات والأجواء الباردة.',
      material: 'صوف جوخ إنجليزي دافئ',
      care_instructions: 'تنظيف جاف فقط',
      image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
      is_new: 1, has_3d: 1, tag: 'إصدار شتوي',
      colors: [
        { name: 'رمادي فحمي', hex: '#2C3E50' },
        { name: 'بني عسلي', hex: '#6B4226' },
        { name: 'زيتي ملكي', hex: '#3D5A45' },
      ],
    },
    {
      name: 'بشت حساوي دقة ملكية مذهب',
      slug: 'hasawi-royal-gold-bisht',
      category: 'بشوت ومناسبات',
      price: 950.00,
      original_price: 1100.00,
      description: 'بشت عربي فاخر منسوج من خيوط القصب الألماني المذهب عيار أصلي على أقمشة يابانية خفيفة وراقية، رمز للهيبة والوقار في الأعراس والمناسبات الرسمية.',
      material: 'قماش وبر ياباني مع قصب مذهب ألماني',
      care_instructions: 'تنظيف جاف مخصص للبشوت',
      image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: null,
      is_new: 1, has_3d: 1, tag: 'تطريز ذهبي يدوي',
      colors: [
        { name: 'أسود ملكي', hex: '#111111' },
        { name: 'بني شوكولاتة', hex: '#4A2E18' },
        { name: 'بيج صحراوي', hex: '#D2B48C' },
      ],
    },
    {
      name: 'جلابية كاجوال كتان معاصر',
      slug: 'casual-contemporary-linen-jalabiya',
      category: 'جلابيب كلاسيكية',
      price: 290.00,
      original_price: null,
      description: 'جلابية صيفية خفيفة مصنوعة من الكتان الطبيعي المريح، بقصة عصرية وياقة مغلقة وجيوب مخفية مريحة جداً للاستخدام اليومي والجمعات العائلية.',
      material: 'كتان أوروبي طبيعي 100%',
      care_instructions: 'غسيل آلي على البارد',
      image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: null,
      is_new: 0, has_3d: 1, tag: 'كتان طبيعي',
      colors: [
        { name: 'كتان خام طبيعي', hex: '#DED4C2' },
        { name: 'أزرق كحلي', hex: '#1C2833' },
        { name: 'زيتي هادئ', hex: '#8FAF8C' },
      ],
    },
    {
      name: 'ثوب سحاب قطني معاصر',
      slug: 'contemporary-zipper-thobe',
      category: 'أثواب ملكية',
      price: 340.00,
      original_price: null,
      description: 'تصميم يجمع بين الأصالة والحداثة بثوب عملي ذو سحاب مخفي عالي الجودة وياقة ثابتة، ملائم لبيئات العمل والأنشطة اليومية بأناقة كاملة.',
      material: 'مزيج قطن وبوليستر ياباني مقاوم للتجعد',
      care_instructions: 'غسيل آلي، كوي متوسط الحرارة',
      image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: null,
      is_new: 0, has_3d: 0, tag: 'مقاوم للتجعد',
      colors: [
        { name: 'أبيض ناصع', hex: '#FFFFFF' },
        { name: 'سكري فاتح', hex: '#F5EFE6' },
      ],
    },
    {
      name: 'شال كشميري يدوي ترمة',
      slug: 'kashmiri-torma-handmade-shawl',
      category: 'إكسسوارات وشيل',
      price: 460.00,
      original_price: 520.00,
      description: 'شال كشميري أصلي بنقشة الترمة التقليدية المغزولة يدوياً من صوف الباشمينا الطبيعي فائق النعومة والدفء، يمنح إطلالتك فخامة استثنائية.',
      material: 'صوف باشمينا كشميري 100%',
      care_instructions: 'تنظيف جاف فقط',
      image_url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: null,
      is_new: 0, has_3d: 0, tag: 'غزل يدوي',
      colors: [
        { name: 'بيج كلاسيكي', hex: '#D7C4A5' },
        { name: 'عنابي دافئ', hex: '#78281F' },
      ],
    },
    {
      name: 'جلابية سهرة مخملية فاخرة',
      slug: 'velvet-evening-luxury-jalabiya',
      category: 'جلابيب كلاسيكية',
      price: 490.00,
      original_price: null,
      description: 'جلابية شتوية من قماش المخمل الفاخر مع ياقة وأكمام مزينة بزخارف قصبية ناعمة، خيار مثالي للمجالس الشتوية والسهرات العربية.',
      material: 'مخمل حريري ملكي ناعم',
      care_instructions: 'تنظيف جاف فقط',
      image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: null,
      is_new: 1, has_3d: 1, tag: 'مخمل ملكي',
      colors: [
        { name: 'كحلي ليلي', hex: '#0B132B' },
        { name: 'خمري عميق', hex: '#4A1521' },
        { name: 'أخضر زمردي', hex: '#1B4D3E' },
      ],
    },
    {
      name: 'سديري صوف وجهين مطرز',
      slug: 'reversible-embroidered-wool-vest',
      category: 'بشوت ومناسبات',
      price: 260.00,
      original_price: 300.00,
      description: 'صديري عربي شتوي بتصميم مميز يتيح ارتداءه على الوجهين بألوان متناسقة، خياطة يدوية متقونة وجيوب جانبية أنيقة فوق الثوب أو الجلابية.',
      material: 'صوف طبيعي ناعم منسوج',
      care_instructions: 'تنظيف جاف',
      image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: null,
      is_new: 0, has_3d: 1, tag: 'وجهين reversible',
      colors: [
        { name: 'رصاصي / كحلي', hex: '#4B6584' },
        { name: 'جملي / بني', hex: '#A5693F' },
      ],
    },
    {
      name: 'شماغ ملكي قطن خاص دم الغزال',
      slug: 'royal-special-cotton-shemagh',
      category: 'إكسسوارات وشيل',
      price: 180.00,
      original_price: null,
      description: 'شماغ أحمر بنقشة دم الغزال التراثية مصنوع من خيوط قطنية نقية 100% متطابقة الأطراف وثابتة على الرأس دون تجعد أو بهتان.',
      material: '100% قطن طبيعي معالج',
      care_instructions: 'غسيل يدوي منفصل، كوي بخار',
      image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: null,
      is_new: 1, has_3d: 0, tag: 'قطن سوبر 100%',
      colors: [
        { name: 'أحمر تراثي', hex: '#922B21' },
        { name: 'أبيض سادة', hex: '#FFFFFF' },
      ],
    },
    {
      name: 'عقال مقصب تراثي فاخر',
      slug: 'traditional-gold-threaded-agal',
      category: 'إكسسوارات وشيل',
      price: 150.00,
      original_price: null,
      description: 'عقال عربي فاخر محبوك من الصوف الطبيعي مع خيوط القصب الذهبية التراثية خفيفة الوزن وثابتة المقاس.',
      material: 'صوف أسود طبيعي مع خيوط مذهبة',
      care_instructions: 'تخزين في علبة مخصصة بعيداً عن الرطوبة',
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      secondary_image_url: null,
      is_new: 0, has_3d: 1, tag: 'صناعة يدوية',
      colors: [
        { name: 'أسود وقصب مذهب', hex: '#1C1C1E' },
      ],
    },
  ];

  for (const p of products) {
    const [existing] = await conn.query('SELECT id FROM products WHERE slug = ?', [p.slug]);

    let productId;
    if (existing.length > 0) {
      productId = existing[0].id;
      await conn.query(
        `UPDATE products SET
          name = ?, category = ?, price = ?, original_price = ?, description = ?,
          material = ?, care_instructions = ?, image_url = ?, is_new = ?, has_3d = ?, tag = ?
         WHERE id = ?`,
        [
          p.name, p.category, p.price, p.original_price, p.description,
          p.material, p.care_instructions, p.image_url, p.is_new, p.has_3d, p.tag,
          productId
        ]
      );
      console.log(`🔄 تم تحديث المنتج: ${p.name}`);
    } else {
      const [result] = await conn.query(
        `INSERT INTO products
          (name, slug, category, price, original_price, description, material,
           care_instructions, image_url, secondary_image_url, is_new, has_3d, tag, in_stock)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          p.name, p.slug, p.category, p.price, p.original_price, p.description,
          p.material, p.care_instructions, p.image_url, p.secondary_image_url,
          p.is_new, p.has_3d, p.tag,
        ]
      );
      productId = result.insertId;

      for (const color of p.colors) {
        await conn.query(
          'INSERT INTO product_colors (product_id, name, hex) VALUES (?, ?, ?)',
          [productId, color.name, color.hex]
        );
      }
      console.log(`✅ تم إضافة المنتج: ${p.name}`);
    }
  }

  console.log('\n🎉 تم إعداد قاعدة البيانات وتغذية 10 منتجات للجلابيب والملابس العربية بنجاح!');
  await conn.end();
}

seed().catch((err) => {
  console.error('❌ خطأ أثناء تغذية البيانات:', err);
  process.exit(1);
});
