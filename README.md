# دار الأصالة — متجر الجلابيب والملابس العربية الفاخرة بتقنية 3D

تطبيق تجارة إلكترونية عربي فاخر متخصص في **الجلابيب والأثواب والبشوت العربية** باستخدام **Next.js 14**، **Node.js (Express)**، **MySQL**، ومكتبة **Three.js ثلاثية الأبعاد 3D**.

---

## 🏛️ الهوية البصرية والتراثية (Brand Identity)

- **اسم المتجر**: دار الأصالة للجلابيب والملابس العربية
- **التخصص**: جلابيب كلاسيكية ومودرن، أثواب ملكية شتوية وصيفية، بشوت حساوية مذهبة، شيل كشميرية وأشمغة وعُقل تراثية.
- **اللغة والاتجاه**: لغة عربية كاملة بنظام RTL وخطوط عربية كلاسيكية وحديثة (Cairo & Amiri).
- **العملة**: الريال السعودي (ر.س).

---

## 🏗️ هيكلية المشروع

```
Clothing_WebSite/
├── backend/                  # سيرفر Node.js + Express REST API
│   ├── src/
│   │   ├── server.js         # المنفذ 5000
│   │   ├── db.js             # اتصال MySQL
│   │   ├── db/seed.js        # إدخال الـ 10 منتجات التراثية والجداول
│   │   ├── routes/           # مسارات المنتجات، التسجيل والسلة
│   │   └── middleware/       # JWT Auth Middleware
│   ├── .env                  # إعدادات قاعدة البيانات
│   └── package.json
│
└── frontend/                 # واجهة Next.js 14 + Three.js بتقنية RTL
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx      # المعرض الرئيسي و 3D Hero
    │   │   ├── layout.tsx    # الهيكل العام RTL
    │   │   └── products/[id]/# صفحة المنتج التفصيلية مع العارض 3D
    │   ├── components/
    │   │   ├── 3d/           # مجسمات وتأثيرات Three.js التفاعلية
    │   │   ├── Navbar.tsx    # شريط التنقل العربي
    │   │   ├── ProductCard.tsx # كروت المنتجات
    │   │   ├── CartDrawer.tsx  # حقيبة المشتريات المنزلقة
    │   │   └── Footer.tsx
    │   ├── context/          # إدارة حالة السلة
    │   └── lib/              # كود الاتصال وقاعدة البيانات التجريبية
    ├── .env.local
    ├── tailwind.config.ts
    └── package.json
```

---

## 🚀 التشغيل السريع

### 1. تشغيل الـ Backend
```bash
cd backend
npm install
npm run seed   # يملأ قاعدة بيانات MySQL بـ 10 منتجات جلابيب وأثواب عربية
npm run dev    # يعمل على http://localhost:5000
```

### 2. تشغيل الـ Frontend
```bash
cd frontend
npm install
npm run dev    # يعمل على http://localhost:3000
```
"# Kounoz" 
