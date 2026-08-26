# تسجيل دخول حقيقي مع Google OAuth

## الفكرة

إضافة نظام مصادقة حقيقي للمتجر يدعم:
- **تسجيل دخول بـ Google/Gmail** (OAuth 2.0)
- **حماية لوحة الأدمن** بحيث فقط الإيميلات المعتمدة تقدر تدخل
- **تجربة مستخدم** سلسة وفاخرة مع زر "ادخل بـ Google"

## الأداة المستخدمة: NextAuth.js v4

**لماذا NextAuth؟**
- مكتبة الـ Auth الرسمية لـ Next.js
- دعم Google OAuth خارج الصندوق
- لا تحتاج بناء backend منفصل
- مجانية تماماً

---

## ⚠️ مطلوب منك: إعداد Google Cloud Console

> [!IMPORTANT]
> قبل ما نبدأ التنفيذ، محتاج تعمل **Google OAuth App** في Google Cloud Console. دي خطوة واحدة مش بتتكرر.

### خطوات إنشاء الـ App (5 دقائق):

1. افتح **[Google Cloud Console](https://console.cloud.google.com/)**
2. أنشئ Project جديد أو اختر موجود
3. من القائمة الجانبية → **APIs & Services** → **Credentials**
4. انقر **Create Credentials** → **OAuth 2.0 Client IDs**
5. نوع التطبيق: **Web application**
6. في **Authorized redirect URIs** أضف:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. انسخ الـ **Client ID** والـ **Client Secret**

---

## الملفات اللي هتتعدّل

### جديدة [NEW]
#### [NEW] `src/app/api/auth/[...nextauth]/route.ts`
- إعداد NextAuth مع Google Provider
- تحديد قائمة الإيميلات المسموح لها بدخول الأدمن

#### [NEW] `src/types/next-auth.d.ts`
- توسيع TypeScript types لـ NextAuth session

---

### تعديل [MODIFY]
#### [MODIFY] [`layout.tsx`](file:///d:/Clothing_WebSite/frontend/src/app/layout.tsx)
- إضافة `SessionProvider` من NextAuth حتى يكون متاح في كل الصفحات

#### [MODIFY] [`admin/page.tsx`](file:///d:/Clothing_WebSite/frontend/src/app/admin/page.tsx)
- استبدال شاشة الـ Login الحالية بشاشة تحتوي زر "ادخل بـ Google"
- استخدام `useSession()` بدل `getAdminUser()` الـ localStorage
- الحماية: لو الجلسة مفيهاش إيميل مسموح → ترحيل لشاشة رفض الوصول

#### [MODIFY] [`.env.local`](file:///d:/Clothing_WebSite/frontend/.env.local)
- إضافة `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

#### [MODIFY] [`next.config.js`](file:///d:/Clothing_WebSite/frontend/next.config.js)
- إضافة `lh3.googleusercontent.com` في `remotePatterns` (صور البروفايل من Google)

---

## Open Questions

> [!IMPORTANT]
> **إيميلك على Google** — هتستخدم تسجيل الدخول بجوجل، فمحتاج إيميل Gmail الخاص بيك عشان أضيفه في قائمة الأدمن المسموح لهم. أنا هضيف `admin@kounoz.sa` و`kounoztest@gmail.com` كـ placeholders، وتقدر تغيرهم بعدين في كود بسيط.

---

## Verification Plan

### Automated
- `npm run build` — يتأكد إن الكود بيبني بدون أخطاء

### Manual
1. تفتح `/admin` → شاشة تسجيل دخول بزر Google تظهر
2. تنقر "ادخل بـ Google" → Google OAuth flow يشتغل
3. بعد الموافقة → تدخل لوحة التحكم (لو إيميلك مسموح)
4. إيميل غير مسموح → تظهر صفحة "غير مصرح"
5. زر "خروج" يعمل logout حقيقي من Google session
