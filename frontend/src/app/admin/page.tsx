'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  LogOut,
  ShoppingBag,
  Layers,
  Sparkles,
  ShieldCheck,
  Search,
  X,
  Check,
  ArrowRight,
  Upload,
  Lock,
  Loader2,
  FileUp,
  Image as ImageIcon,
  Link as LinkIcon,
  RefreshCw,
  Palette,
  Ruler,
  Package,
  Tag,
  MessageCircle,
  Phone,
  ExternalLink,
  Save,
} from 'lucide-react';
import { Product, CATEGORIES, Category, User, Color } from '../../types';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  loginAdmin,
  getAdminUser,
  logoutAdmin,
  isAdminEmail,
  uploadImage,
  uploadMultipleImages,
  getHeroImages,
  saveHeroImages,
  getHeroBadge,
  saveHeroBadge,
  getStoreSettings,
  saveStoreSettings,
  formatWhatsAppPhone,
  formatWhatsAppUrl,
} from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

// Presets for quick luxury clothing setup
const PRESET_COLORS: Color[] = [
  { name: 'أبيض لؤلؤي', hex: '#FAF9F6' },
  { name: 'أسود ملكي', hex: '#111111' },
  { name: 'كحلي ليلي', hex: '#1C2833' },
  { name: 'سكري هادئ', hex: '#EDE5D8' },
  { name: 'بني عسلي', hex: '#6B4226' },
  { name: 'رمادي فحمي', hex: '#2C3E50' },
  { name: 'زيتي ملكي', hex: '#3D5A45' },
  { name: 'خمري عنابي', hex: '#581825' },
  { name: 'ذهبي مذهب', hex: '#C5A059' },
  { name: 'بيج صحراوي', hex: '#D2B48C' },
];

const PRESET_SIZES_JALABIYA = ['50L', '52L', '54L', '56L', '58L', '60L', '62L'];
const PRESET_SIZES_STANDARD = ['S', 'M', 'L', 'XL', '2XL', '3XL', 'مقاس موحد'];

export default function AdminPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [emailInput, setEmailInput] = useState('admin@kounoz.sa');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('جميع القطع');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for 1 Main Photo + 4 Shapes + Colors + Sizes + Stock Quantity
  const [formData, setFormData] = useState({
    name: '',
    category: 'جلابيب كلاسيكية' as Category,
    price: '',
    original_price: '',
    material: 'قطن مصري 100% فاخر',
    care_instructions: 'غسيل يدوي أو تنظيف جاف',
    description: '',
    tag: 'جديد كنوز',
    in_stock: true,
    stock_quantity: '15',
    is_new: true,
    // 4 Shapes / Angles:
    shape1: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80', // الأمامي
    shape2: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', // الخلفي
    shape3: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80', // الجانبي
    shape4: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80', // النسيج
    colors: [
      { name: 'أبيض لؤلؤي', hex: '#FAF9F6' },
      { name: 'سكري هادئ', hex: '#EDE5D8' },
      { name: 'كحلي ملكي', hex: '#1C2833' },
    ] as Color[],
    sizes: ['52L', '54L', '56L', '58L', '60L'] as string[],
  });

  // Custom Color / Size Inputs
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex]   = useState('#1C2833');
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Admin interactive live preview active shape
  const [previewShapeIndex, setPreviewShapeIndex] = useState(0);

  // ── Hero Image State (4 slots) ─────────────────────────────────────────────
  const [heroImages, setHeroImages]           = useState<string[]>(['', '', '', '']);
  const [heroPreviewIdx, setHeroPreviewIdx]   = useState(0);
  const [uploadingHeroSlot, setUploadingHeroSlot] = useState<number | null>(null);
  const [showHeroUrlInput, setShowHeroUrlInput]   = useState<Record<number, boolean>>({});
  const [heroBadgeName, setHeroBadgeName]         = useState('جلابية كنوز الملكية');
  const [heroBadgeMaterial, setHeroBadgeMaterial] = useState('قطن مصري 100% نقي');
  const [heroSaved, setHeroSaved]                 = useState(false);

  // ── WhatsApp & Store Settings State ───────────────────────────────────────
  const [whatsappNumber, setWhatsappNumber]       = useState('01000943197');
  const [whatsappGreeting, setWhatsappGreeting]   = useState('مرحباً، أود الاستفسار والطلب من تشكيلة كنوز الفاخرة');
  const [whatsappSaved, setWhatsappSaved]         = useState(false);
  const [isSavingWhatsapp, setIsSavingWhatsapp]   = useState(false);

  // Upload States (for products)
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const [showUrlInputs, setShowUrlInputs] = useState<Record<number, boolean>>({});

  const toggleUrlInput = (slot: number) => {
    setShowUrlInputs((prev) => ({ ...prev, [slot]: !prev[slot] }));
  };

  // Color Handlers
  const addColor = (color: Color) => {
    if (!color.name.trim()) return;
    if (formData.colors.some((c) => c.name.trim().toLowerCase() === color.name.trim().toLowerCase())) return;
    setFormData((prev) => ({ ...prev, colors: [...prev.colors, color] }));
  };

  const removeColor = (index: number) => {
    setFormData((prev) => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
  };

  const updateColor = (index: number, updated: Partial<Color>) => {
    setFormData((prev) => {
      const next = [...prev.colors];
      next[index] = { ...next[index], ...updated };
      return { ...prev, colors: next };
    });
  };

  // Size Handlers
  const toggleSize = (size: string) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const nextSizes = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: nextSizes };
    });
  };

  const addCustomSize = (size: string) => {
    const trimmed = size.trim();
    if (!trimmed || formData.sizes.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, trimmed] }));
    setCustomSizeInput('');
  };

  const handleSingleFileUpload = async (slotNumber: 1 | 2 | 3 | 4, file: File) => {
    if (!file) return;
    setUploadingSlot(slotNumber);
    try {
      const uploadedUrl = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        [`shape${slotNumber}`]: uploadedUrl,
      }));
      setPreviewShapeIndex(slotNumber - 1);
      showToast(`تم رفع صورة الشكل ${slotNumber} من جهازك بنجاح`);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleBatchUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsBatchUploading(true);
    try {
      const fileArray = Array.from(files).slice(0, 4);
      const urls = await uploadMultipleImages(fileArray);

      setFormData((prev) => {
        const next = { ...prev };
        if (urls[0]) next.shape1 = urls[0];
        if (urls[1]) next.shape2 = urls[1];
        if (urls[2]) next.shape3 = urls[2];
        if (urls[3]) next.shape4 = urls[3];
        return next;
      });
      setPreviewShapeIndex(0);
      showToast(`تم رفع ${urls.length} صور بنجاح من جهازك`);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع الصور');
    } finally {
      setIsBatchUploading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      // Only grant admin access if the email is whitelisted
      if (isAdminEmail(session.user.email)) {
        setAdminUser({
          id: 1,
          name: session.user.name || 'مدير كنوز',
          email: session.user.email,
          is_admin: true,
        });
      }
    } else {
      const stored = getAdminUser();
      if (stored && isAdminEmail(stored.email)) setAdminUser(stored);
    }
    loadProductList();
    // Load hero images + badge
    const imgs = getHeroImages();
    if (imgs?.length) setHeroImages(imgs);
    const badge = getHeroBadge();
    if (badge) { setHeroBadgeName(badge.name); setHeroBadgeMaterial(badge.material); }
    // Load store settings & WhatsApp number
    const settings = getStoreSettings();
    if (settings.whatsapp_number) setWhatsappNumber(settings.whatsapp_number);
    if (settings.whatsapp_greeting) setWhatsappGreeting(settings.whatsapp_greeting);
  }, [session]);

  const handleSaveWhatsapp = async () => {
    if (!whatsappNumber.trim()) {
      alert('يرجى إدخال رقم الواتساب للطلب');
      return;
    }
    setIsSavingWhatsapp(true);
    try {
      await saveStoreSettings({
        whatsapp_number: whatsappNumber.trim(),
        whatsapp_greeting: whatsappGreeting.trim(),
      });
      setWhatsappSaved(true);
      setTimeout(() => setWhatsappSaved(false), 3000);
      showToast('تم حفظ رقم الواتساب وتحديث المتجر بنجاح ✅');
    } catch (err) {
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSavingWhatsapp(false);
    }
  };

  async function loadProductList() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const user = loginAdmin(emailInput, passwordInput);
    if (user) {
      setAdminUser(user);
      loadProductList();
    } else {
      setLoginError('بيانات الدخول غير صحيحة (كلمة المرور الافتراضية: admin123)');
    }
  };

  const handleLogout = async () => {
    logoutAdmin();
    setAdminUser(null);
    if (session) {
      await signOut({ callbackUrl: '/admin' });
    }
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      category: 'جلابيب كلاسيكية',
      price: '',
      original_price: '',
      material: 'قطن مصري 100% فاخر',
      care_instructions: 'غسيل يدوي أو تنظيف جاف',
      description: '',
      tag: 'جديد كنوز',
      in_stock: true,
      stock_quantity: '15',
      is_new: true,
      shape1: '',
      shape2: '',
      shape3: '',
      shape4: '',
      colors: [
        { name: 'أبيض لؤلؤي', hex: '#FAF9F6' },
        { name: 'سكري هادئ', hex: '#EDE5D8' },
        { name: 'كحلي ملكي', hex: '#1C2833' },
      ],
      sizes: ['52L', '54L', '56L', '58L', '60L'],
    });
    setCustomColorName('');
    setCustomColorHex('#1C2833');
    setCustomSizeInput('');
    setPreviewShapeIndex(0);
    setShowUrlInputs({});
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    const shapes = (product.images && product.images.length > 0)
      ? product.images
      : [product.image_url, product.secondary_image_url].filter(Boolean) as string[];

    setFormData({
      name: product.name,
      category: (product.category as Category) || 'جلابيب كلاسيكية',
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : '',
      material: product.material || '',
      care_instructions: product.care_instructions || '',
      description: product.description || '',
      tag: product.tag || '',
      in_stock: product.in_stock,
      stock_quantity: String(product.stock_quantity ?? (product.in_stock ? 15 : 0)),
      is_new: product.is_new,
      shape1: shapes[0] || product.image_url,
      shape2: shapes[1] || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      shape3: shapes[2] || 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
      shape4: shapes[3] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      colors: product.colors && product.colors.length > 0 ? product.colors : [
        { name: 'أبيض لؤلؤي', hex: '#FAF9F6' },
        { name: 'سكري هادئ', hex: '#EDE5D8' },
        { name: 'كحلي ملكي', hex: '#1C2833' },
      ],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['52L', '54L', '56L', '58L', '60L'],
    });
    setCustomColorName('');
    setCustomColorHex('#1C2833');
    setCustomSizeInput('');
    setPreviewShapeIndex(0);
    setShowUrlInputs({});
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (confirm(`هل أنت متأكد من حذف قطعة "${name}"؟`)) {
      await deleteProduct(id);
      showToast(`تم حذف "${name}" بنجاح`);
      loadProductList();
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('يرجى ملء اسم القطعة والسعر على الأقل');
      return;
    }
    if (!formData.shape1) {
      alert('يرجى اختيار صورة رئيسية للمنتج من جهازك أو إدخال رابط URL');
      return;
    }

    const shapesArray = [
      formData.shape1.trim(),
      formData.shape2.trim(),
      formData.shape3.trim(),
      formData.shape4.trim(),
    ].filter(Boolean);

    const stockNum = Number(formData.stock_quantity) || 0;
    const isAvailable = formData.in_stock && stockNum > 0;

    const productPayload: Partial<Product> = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : null,
      material: formData.material,
      care_instructions: formData.care_instructions,
      description: formData.description || `قطعة مميزة من تشكيلة ${formData.category} الفاخرة من كنوز.`,
      tag: formData.tag || null,
      in_stock: isAvailable,
      stock_quantity: stockNum,
      is_new: formData.is_new,
      image_url: shapesArray[0],
      secondary_image_url: shapesArray[1] || null,
      images: shapesArray,
      colors: formData.colors.length > 0 ? formData.colors : [
        { name: 'ذهبي كنوز', hex: '#AD8A55' }
      ],
      sizes: formData.sizes.length > 0 ? formData.sizes : ['52L', '54L', '56L', '58L', '60L'],
    };

    setIsSaving(true);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productPayload);
        showToast('تم تحديث بيانات القطعة والألوان والمقاسات بنجاح');
      } else {
        await createProduct(productPayload);
        showToast('تم إضافة القطعة الجديدة مع الألوان والمقاسات بنجاح');
      }
    } finally {
      setIsSaving(false);
    }

    setIsModalOpen(false);
    loadProductList();
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedFilterCategory === 'جميع القطع' || p.category === selectedFilterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const currentPreviewUrl = [formData.shape1, formData.shape2, formData.shape3, formData.shape4][previewShapeIndex] || formData.shape1;

  // ── 1. LOADING STATE ────────────────────────────────────────────────────────
  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-accent mx-auto" size={40} />
          <p className="text-sm text-muted">جاري التحقق من الهوية...</p>
        </div>
      </div>
    );
  }

  // ── 2. UNAUTHORIZED GOOGLE USER ──────────────────────────────────────────────
  if (session?.user?.email && !isAdminEmail(session.user.email)) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-md bg-card p-8 rounded-xl border border-red-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <ShieldCheck className="text-red-500" size={32} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-noir">غير مصرح بالدخول</h2>
          <p className="text-xs text-muted leading-relaxed">
            حسابك (<span className="font-bold text-noir">{session.user?.email}</span>) غير مضاف في قائمة المديرين المعتمدين.
            فقط الحسابات المعتمدة يمكنها الوصول للوحة التحكم.
          </p>
          <button
            onClick={() => signOut({ callbackUrl: '/admin' })}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            الخروج والمحاولة بحساب آخر
          </button>
          <Link href="/" className="text-xs text-muted hover:text-noir transition-smooth inline-flex items-center gap-1 justify-center">
            <span>العودة لمتجر كنوز</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  // ── 3. LOGIN SCREEN IF NOT AUTHENTICATED ──────────────────────────────────
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-md bg-card p-8 rounded-xl border border-border-subtle shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <Image src="/kounoz-logo.png" alt="كنوز" fill className="object-contain" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-noir">لوحة تحكم إدارة كنوز</h1>
            <p className="text-xs text-muted">تسجيل الدخول لإدارة المنتجات والصور</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md text-center">
              {loginError}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={() => signIn('google', { callbackUrl: `${window.location.origin}/admin` })}
            className="w-full py-3.5 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            ادخل بـ Google
          </button>

          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="flex-1 h-px bg-border-subtle"></div>
            <span>أو</span>
            <div className="flex-1 h-px bg-border-subtle"></div>
          </div>

          {/* Toggle Password Login */}
          {!showPasswordLogin ? (
            <button
              onClick={() => setShowPasswordLogin(true)}
              className="w-full py-2.5 text-xs text-muted hover:text-noir border border-border-subtle rounded-md transition-smooth"
            >
              الدخول بكلمة المرور (احتياطي)
            </button>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-noir">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-md text-xs text-noir focus:border-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-noir">كلمة المرور</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-md text-xs text-noir focus:border-accent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-noir hover:bg-accent text-white text-xs font-bold rounded-md transition-smooth shadow-md flex items-center justify-center gap-2"
              >
                <Lock size={14} />
                دخول لوحة التحكم
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-border-subtle text-center">
            <Link href="/" className="text-xs text-muted hover:text-noir transition-smooth inline-flex items-center gap-1">
              <span>العودة لمتجر كنوز</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    );
  }


  // ── 2. ADMIN DASHBOARD VIEW ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-main" dir="rtl">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-emerald-800 text-white text-xs font-bold rounded-md shadow-xl flex items-center gap-2"
          >
            <Check size={16} />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border-subtle shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-11 h-11">
              <Image src="/kounoz-logo.png" alt="كنوز" fill className="object-contain" />
            </div>
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-noir">لوحة تحكم كنوز</span>
                <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded">ADMIN</span>
              </div>
              <span className="text-[11px] text-muted">{adminUser.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-surface hover:bg-mutedbg text-noir text-xs font-semibold rounded-md border border-border-subtle transition-smooth flex items-center gap-1.5"
            >
              <span>معاينة المتجر</span>
              <Eye size={14} />
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-md border border-red-200 transition-smooth flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-10 space-y-8">

        {/* ── WhatsApp Order & Contact Manager ───────────────────────────── */}
        <div className="bg-card rounded-xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-[#1C1610] text-[#F6F2E9]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
                <MessageCircle size={20} className="fill-current" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <span>إعدادات رقم الواتساب والطلب المباشر</span>
                  <Sparkles size={14} className="text-[#AD8A55]" />
                </h2>
                <p className="text-[11px] text-[#D8C6A3]">تحكم في رقم الواتساب الذي يستقبل طلبات واستفسارات العملاء من المتجر</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>الواتساب متصل بالمتجر</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4 text-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-noir flex items-center gap-1.5">
                    <Phone size={13} className="text-emerald-700" />
                    <span>رقم الواتساب المعتمد للطلب:</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="01000943197 أو +201000943197"
                      className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-lg text-xs font-mono font-bold text-noir focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-muted">
                    يقبل الرقم المصري المباشر (مثل 01000943197) أو السعودي أو الدولي بكود الدولة.
                  </p>
                </div>

                {/* Formatted Preview */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-noir block">
                    الصيغة الدولية والرابط المباشر:
                  </label>
                  <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                    <span className="font-mono font-bold">{formatWhatsAppPhone(whatsappNumber)}</span>
                    <a
                      href={formatWhatsAppUrl(whatsappNumber, 'تجربة رسالة طلب من متجر كنوز')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline"
                    >
                      <span>تجربة الرابط</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className="text-[10px] text-muted">
                    يتم تحويله تلقائياً إلى رابط <span className="font-mono font-semibold">wa.me</span> جاهز للمحادثة.
                  </p>
                </div>
              </div>

              {/* Greeting Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-noir block">
                  نص الرسالة الترحيبية الافتراضية:
                </label>
                <input
                  type="text"
                  value={whatsappGreeting}
                  onChange={(e) => setWhatsappGreeting(e.target.value)}
                  placeholder="مرحباً، أود الاستفسار والطلب من تشكيلة كنوز الفاخرة"
                  className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-lg text-xs text-noir focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveWhatsapp}
                  disabled={isSavingWhatsapp}
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-smooth shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingWhatsapp ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : whatsappSaved ? (
                    <Check size={14} />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>{whatsappSaved ? 'تم حفظ الرقم بنجاح!' : 'حفظ وتطبيق رقم الواتساب في كامل المتجر'}</span>
                </motion.button>

                <span className="text-[11px] text-muted">
                  * يتم تحديث الأيقونة العائمة، صفحة تفاصيل القطعة، والسلة فورياً بدون إعادة تحميل.
                </span>
              </div>
            </div>

            {/* Quick Overview Card */}
            <div className="lg:col-span-4 p-4 bg-surface rounded-xl border border-border-subtle space-y-3 text-right">
              <span className="text-xs font-bold text-noir block border-b border-border-subtle pb-2">
                أماكن ظهور الواتساب في متجر كنوز:
              </span>
              <ul className="space-y-2 text-xs text-muted">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span><strong>الأيقونة العائمة:</strong> أسفل يسار الشاشة في جميع الصفحات.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span><strong>صفحة القطعة:</strong> زر "طلب فوري مباشر عبر واتساب" مع تفاصيل المقاس واللون والسعر.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span><strong>المعاينة السريعة:</strong> زر طلب فوري بنقرة واحدة.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span><strong>حقيبة المشتريات:</strong> إرسال كامل محتويات السلة في رسالة منسقة.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Hero Image Manager (4 slots) ───────────────────────────── */}
        <div className="bg-card rounded-xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle flex items-center gap-3 bg-main">
            <div className="p-2 rounded bg-card border border-border-subtle text-accent">
              <ImageIcon size={16} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-noir">صور الواجهة الرئيسية (Hero) — 4 صور</h2>
              <p className="text-[11px] text-muted">غيّر الصور التي تظهر في الصفحة الرئيسية — ارفع من جهازك مباشرة</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: slots */}
            <div className="md:col-span-7 space-y-4 text-right">

              {/* 4 image slots */}
              <div className="p-4 bg-surface rounded-lg border border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-noir flex items-center gap-1.5">
                    <FileUp size={14} className="text-accent" />
                    صور الواجهة (4 زوايا) — ارفع من جهازك:
                  </span>
                  {/* Batch hero upload */}
                  <label className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-bold border transition-all ${uploadingHeroSlot !== null ? 'bg-surface text-muted border-border-subtle cursor-not-allowed' : 'bg-noir hover:bg-accent text-white border-transparent'}`}>
                    <Upload size={11} /> رفع 4 دفعة
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={uploadingHeroSlot !== null}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []).slice(0, 4);
                        if (!files.length) return;
                        setUploadingHeroSlot(0);
                        try {
                          const { uploadMultipleImages: umr } = await import('../../lib/api');
                          const urls = await umr(files);
                          const next = [...heroImages];
                          urls.forEach((u, i) => { if (u) next[i] = u; });
                          setHeroImages(next);
                          setHeroPreviewIdx(0);
                          showToast(`تم رفع ${urls.length} صور للواجهة بنجاح`);
                        } catch { alert('خطأ أثناء رفع الصور'); }
                        finally { setUploadingHeroSlot(null); }
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  {([
                    { slot: 0, label: 'الصورة 1: المنظر الأمامي الأساسي', required: true },
                    { slot: 1, label: 'الصورة 2: المنظر الخلفي', required: false },
                    { slot: 2, label: 'الصورة 3: زاوية القَصّة / الجانب', required: false },
                    { slot: 3, label: 'الصورة 4: تفاصيل النسيج والتطريز', required: false },
                  ] as { slot: number; label: string; required: boolean }[]).map(({ slot, label, required }) => (
                    <div key={slot} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-muted">{label}{required ? ' *' : ''}</label>
                        <button
                          type="button"
                          onClick={() => setShowHeroUrlInput((p) => ({ ...p, [slot]: !p[slot] }))}
                          className="text-[10px] text-muted hover:text-accent transition-smooth flex items-center gap-0.5"
                        >
                          <LinkIcon size={10} />
                          {showHeroUrlInput[slot] ? 'إخفاء الرابط' : 'URL رابط'}
                        </button>
                      </div>

                      <div className="flex gap-1.5 items-center">
                        {/* Upload from device */}
                        <label className={`flex-shrink-0 cursor-pointer flex items-center justify-center gap-1 px-3 py-2 rounded border text-[11px] font-semibold transition-all ${
                          uploadingHeroSlot === slot
                            ? 'bg-surface text-muted border-border-subtle cursor-not-allowed'
                            : 'bg-card hover:bg-noir hover:text-white text-noir border-border-subtle'
                        }`}>
                          {uploadingHeroSlot === slot ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : heroImages[slot] ? (
                            <RefreshCw size={12} />
                          ) : (
                            <ImageIcon size={12} />
                          )}
                          <span>{uploadingHeroSlot === slot ? 'يتم الرفع...' : heroImages[slot] ? 'تغيير' : 'اختر من الجهاز'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingHeroSlot !== null}
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              setUploadingHeroSlot(slot);
                              try {
                                const url = await uploadImage(f);
                                const next = [...heroImages];
                                next[slot] = url;
                                setHeroImages(next);
                                setHeroPreviewIdx(slot);
                                showToast(`تم رفع صورة الواجهة ${slot + 1} بنجاح`);
                              } catch { alert('خطأ أثناء رفع الصورة'); }
                              finally { setUploadingHeroSlot(null); }
                            }}
                          />
                        </label>

                        {/* Thumbnail */}
                        {heroImages[slot] && (
                          <button
                            type="button"
                            onClick={() => setHeroPreviewIdx(slot)}
                            className={`relative w-9 h-9 rounded border overflow-hidden flex-shrink-0 transition-all ${
                              heroPreviewIdx === slot ? 'border-accent ring-2 ring-accent/40' : 'border-border-subtle'
                            }`}
                          >
                            <Image
                              src={heroImages[slot]}
                              alt={`واجهة ${slot + 1}`}
                              fill
                              className="object-cover"
                              unoptimized={heroImages[slot].startsWith('data:')}
                            />
                          </button>
                        )}

                        {/* URL input (collapsible) */}
                        {showHeroUrlInput[slot] && (
                          <input
                            type="url"
                            value={heroImages[slot] || ''}
                            onChange={(e) => {
                              const next = [...heroImages];
                              next[slot] = e.target.value;
                              setHeroImages(next);
                              setHeroPreviewIdx(slot);
                            }}
                            placeholder="https://..."
                            className="flex-1 px-2 py-2 bg-card text-noir text-xs rounded border border-border-subtle focus:border-noir focus:outline-none"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-noir block">اسم القطعة في البادج</label>
                  <input type="text" value={heroBadgeName} onChange={(e) => setHeroBadgeName(e.target.value)}
                    placeholder="جلابية كنوز الملكية"
                    className="w-full px-3 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-noir block">الخامة في البادج</label>
                  <input type="text" value={heroBadgeMaterial} onChange={(e) => setHeroBadgeMaterial(e.target.value)}
                    placeholder="قطن مصري 100% نقي"
                    className="w-full px-3 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none" />
                </div>
              </div>

              {/* Save */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!heroImages[0]) { alert('يرجى إضافة الصورة الأولى على الأقل'); return; }
                  saveHeroImages(heroImages);
                  saveHeroBadge(heroBadgeName, heroBadgeMaterial);
                  window.dispatchEvent(new Event('kounoz_hero_updated'));
                  setHeroSaved(true);
                  setTimeout(() => setHeroSaved(false), 3000);
                  showToast('تم حفظ صور الواجهة بنجاح ✅');
                }}
                className="w-full py-3 bg-accent hover:bg-noir text-white text-xs font-bold rounded-md transition-smooth shadow-md flex items-center justify-center gap-2"
              >
                {heroSaved ? <><Check size={14} /> تم الحفظ!</> : <><Check size={14} /> حفظ صور الواجهة</>}
              </motion.button>
            </div>

            {/* Live preview */}
            <div className="md:col-span-5">
              <span className="text-xs font-bold text-noir block mb-2 text-right">المعاينة الحية:</span>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border-subtle bg-surface shadow-md">
                {heroImages[heroPreviewIdx] ? (
                  <Image
                    src={heroImages[heroPreviewIdx]}
                    alt="معاينة الواجهة"
                    fill
                    className="object-cover object-top"
                    unoptimized={heroImages[heroPreviewIdx].startsWith('data:')}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted text-xs">
                    ارفع صورة للمعاينة
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-transparent pointer-events-none" />
                {heroImages[heroPreviewIdx] && (
                  <div className="absolute bottom-3 right-3 left-3 p-3 rounded-md bg-card/90 backdrop-blur-md border border-border-subtle flex items-center justify-between text-noir shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold">{heroBadgeName}</span>
                      <span className="text-[9px] text-muted">{heroBadgeMaterial}</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-noir text-white text-[9px] font-bold">عرض التفاصيل</span>
                  </div>
                )}
              </div>
              {/* Thumbnail switcher */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[0, 1, 2, 3].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!heroImages[idx]}
                    onClick={() => heroImages[idx] && setHeroPreviewIdx(idx)}
                    className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                      !heroImages[idx]
                        ? 'border-border-subtle opacity-25 cursor-default bg-surface'
                        : heroPreviewIdx === idx
                        ? 'border-accent ring-2 ring-accent/40 scale-105 shadow-sm'
                        : 'border-border-subtle opacity-60 hover:opacity-100'
                    }`}
                  >
                    {heroImages[idx] ? (
                      <Image src={heroImages[idx]} alt={`واجهة ${idx + 1}`} fill className="object-cover"
                        unoptimized={heroImages[idx].startsWith('data:')} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted text-[9px]">{idx + 1}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg border border-border-subtle shadow-sm flex items-center justify-between text-right">
            <div>
              <p className="text-xs text-muted font-medium">إجمالي المنتجات</p>
              <h3 className="text-3xl font-extrabold text-noir mt-1">{products.length}</h3>
            </div>
            <div className="p-3.5 rounded-md bg-surface text-accent">
              <ShoppingBag size={24} />
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border-subtle shadow-sm flex items-center justify-between text-right">
            <div>
              <p className="text-xs text-muted font-medium">الأقسام النشطة</p>
              <h3 className="text-3xl font-extrabold text-noir mt-1">4</h3>
            </div>
            <div className="p-3.5 rounded-md bg-surface text-accent">
              <Layers size={24} />
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border-subtle shadow-sm flex items-center justify-between text-right">
            <div>
              <p className="text-xs text-muted font-medium">ميزة العرض</p>
              <h3 className="text-sm font-bold text-accent mt-1">4 أشكال بنقرة واحدة</h3>
            </div>
            <div className="p-3.5 rounded-md bg-surface text-accent">
              <Sparkles size={24} />
            </div>
          </div>
        </div>

        {/* Action Controls & Filter */}
        <div className="bg-card p-6 rounded-lg border border-border-subtle shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="ابحث عن قطعة، قسم، قماش..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none"
              />
              <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
            </div>

            {/* Add Product Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAddModal}
              className="w-full sm:w-auto px-6 py-3 bg-noir hover:bg-accent text-white text-xs font-bold rounded-md transition-smooth shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span>إضافة قطعة جديدة (مع 4 أشكال)</span>
            </motion.button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-border-subtle no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilterCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-smooth whitespace-nowrap ${
                  selectedFilterCategory === cat
                    ? 'bg-noir text-white shadow-sm'
                    : 'bg-surface text-muted hover:text-noir border border-border-subtle'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-card rounded-lg border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-noir">قائمة المعروضات ({filteredProducts.length})</h2>
            <span className="text-xs text-muted">انقر على تعديل لضبط الأشكال الأربعة والأسعار</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface text-muted uppercase font-bold border-b border-border-subtle">
                <tr>
                  <th className="p-4">الصورة الرئيسية</th>
                  <th className="p-4">اسم القطعة</th>
                  <th className="p-4">القسم</th>
                  <th className="p-4">السعر</th>
                  <th className="p-4">الألوان والمقاسات</th>
                  <th className="p-4">الكمية بالمخزن</th>
                  <th className="p-4">أشكال المعاينة (4 أشكال)</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredProducts.map((product) => {
                  const shapes = (product.images && product.images.length > 0)
                    ? product.images
                    : [product.image_url, product.secondary_image_url].filter(Boolean) as string[];

                  const quantity = product.stock_quantity ?? (product.in_stock ? 15 : 0);

                  return (
                    <tr key={product.id} className="hover:bg-main/40 transition-smooth">
                      <td className="p-4">
                        <div className="relative w-12 h-16 rounded overflow-hidden border border-border-subtle">
                          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                        </div>
                      </td>

                      <td className="p-4 font-bold text-noir">
                        <div>{product.name}</div>
                        <span className="text-[10px] text-muted font-normal">{product.material}</span>
                      </td>

                      <td className="p-4 text-muted font-medium">{product.category}</td>

                      <td className="p-4">
                        <span className="font-extrabold text-noir">{product.price} ج.م</span>
                        {product.original_price && (
                          <span className="text-[10px] text-muted line-through mr-1.5">{product.original_price} ج.م</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="space-y-1.5">
                          {/* Color dots */}
                          {product.colors && product.colors.length > 0 && (
                            <div className="flex items-center gap-1">
                              {product.colors.map((c, i) => (
                                <span
                                  key={i}
                                  className="w-3.5 h-3.5 rounded-full border border-black/20 inline-block shadow-2xs"
                                  style={{ backgroundColor: c.hex }}
                                  title={c.name}
                                />
                              ))}
                              <span className="text-[9px] text-muted mr-1 font-semibold">({product.colors.length} ألوان)</span>
                            </div>
                          )}
                          {/* Sizes pills */}
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="flex flex-wrap gap-1 max-w-[140px]">
                              {product.sizes.slice(0, 4).map((s, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-[9px] font-bold text-noir">
                                  {s}
                                </span>
                              ))}
                              {product.sizes.length > 4 && (
                                <span className="text-[9px] text-muted font-bold">+{product.sizes.length - 4}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Package size={13} className={quantity > 0 ? "text-accent" : "text-red-500"} />
                          <span className={`font-bold ${quantity > 5 ? "text-noir" : quantity > 0 ? "text-amber-600" : "text-red-600"}`}>
                            {quantity} قطعة
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {shapes.slice(0, 4).map((shapeUrl, sIdx) => (
                            <div key={sIdx} className="relative w-8 h-8 rounded border border-border-subtle overflow-hidden" title={`شكل ${sIdx + 1}`}>
                              <Image src={shapeUrl} alt={`شكل ${sIdx + 1}`} fill className="object-cover" />
                            </div>
                          ))}
                          <span className="text-[10px] font-bold text-accent mr-1">
                            {shapes.length} أشكال
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        {product.in_stock && quantity > 0 ? (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                            متوفر
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded">
                            نفذ
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-left">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 bg-surface hover:bg-noir hover:text-white rounded text-muted transition-smooth"
                            title="تعديل القطعة"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-2 bg-red-50 hover:bg-red-600 hover:text-white rounded text-red-600 transition-smooth"
                            title="حذف القطعة"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── 3. ADD / EDIT PRODUCT MODAL WITH 4-SHAPE ONE-CLICK PREVIEW ──────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-noir/70 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-card rounded-xl border border-border-subtle shadow-2xl overflow-hidden z-10 my-6"
            >
              {/* Header */}
              <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-main">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-card border border-border-subtle text-accent">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-noir">
                      {editingProductId ? 'تعديل بيانات وأشكال القطعة' : 'إضافة قطعة جديدة مع 4 أشكال'}
                    </h3>
                    <p className="text-[11px] text-muted">اضبط تفاصيل القطعة وصور الزوايا الأربعة مع المعاينة التفاعلية الفورية</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-md hover:bg-surface text-noir transition-smooth"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProduct} className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-right">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Form Fields (7 cols) */}
                  <div className="md:col-span-7 space-y-5">
                    {/* Basic Info */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-noir">اسم القطعة *</label>
                      <input
                        type="text"
                        placeholder="مثال: جلابية كنوز مطرزة بالحرير الملكي"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-noir">القسم *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                          className="w-full px-3 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none"
                        >
                          <option value="جلابيب كلاسيكية">جلابيب كلاسيكية</option>
                          <option value="أثواب ملكية">أثواب ملكية</option>
                          <option value="بشوت ومناسبات">بشوت ومناسبات</option>
                          <option value="إكسسوارات وشيل">إكسسوارات وشيل</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-noir">السعر (ج.م) *</label>
                        <input
                          type="number"
                          placeholder="380"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                          className="w-full px-4 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-noir">السعر الأصلي قبل الخصم (اختياري)</label>
                        <input
                          type="number"
                          placeholder="450"
                          value={formData.original_price}
                          onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                          className="w-full px-4 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-noir">الشارة / البادج (Tag)</label>
                        <input
                          type="text"
                          placeholder="مثال: قطن مصري 100%"
                          value={formData.tag}
                          onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                          className="w-full px-4 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Stock & Quantity Control */}
                    <div className="p-4 bg-surface rounded-lg border border-border-subtle space-y-3">
                      <div className="flex items-center gap-2">
                        <Package size={15} className="text-accent" />
                        <span className="text-xs font-bold text-noir">إدارة المخزون وعدد القطع المتاحة</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted">عدد القطع المتوفرة *</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="15"
                            value={formData.stock_quantity}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData({
                                ...formData,
                                stock_quantity: val,
                                in_stock: Number(val) > 0,
                              });
                            }}
                            className="w-full px-3 py-2 bg-card text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted">حالة التوفر</label>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, in_stock: !formData.in_stock })}
                            className={`w-full py-2 px-3 rounded-md text-xs font-bold transition-smooth border flex items-center justify-center gap-1.5 ${
                              formData.in_stock && Number(formData.stock_quantity) > 0
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-red-50 text-red-800 border-red-300'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${formData.in_stock && Number(formData.stock_quantity) > 0 ? 'bg-emerald-600' : 'bg-red-600'}`} />
                            {formData.in_stock && Number(formData.stock_quantity) > 0 ? 'متوفر للطلب' : 'نفذ من المخزن'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Color Management */}
                    <div className="p-4 bg-surface rounded-lg border border-border-subtle space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-noir flex items-center gap-1.5">
                          <Palette size={14} className="text-accent" />
                          ألوان القطعة ({formData.colors.length} ألوان مضافة):
                        </span>
                      </div>

                      {/* Quick preset colors clickers */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] text-muted block">ألوان فاخرة سريعة (انقر للإضافة):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_COLORS.map((preset, pIdx) => {
                            const isAdded = formData.colors.some((c) => c.name === preset.name);
                            return (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => addColor(preset)}
                                className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1.5 border transition-all ${
                                  isAdded
                                    ? 'bg-noir text-white border-noir opacity-90'
                                    : 'bg-card text-noir border-border-subtle hover:border-accent hover:bg-main'
                                }`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: preset.hex }} />
                                <span>{preset.name}</span>
                                {isAdded && <Check size={10} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* List of active colors */}
                      <div className="space-y-2 pt-2 border-t border-border-subtle">
                        {formData.colors.map((color, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 bg-card p-2 rounded-md border border-border-subtle">
                            {/* Color preview & picker */}
                            <div className="relative flex items-center">
                              <input
                                type="color"
                                value={color.hex}
                                onChange={(e) => updateColor(cIdx, { hex: e.target.value })}
                                className="w-7 h-7 rounded-full border border-border-subtle cursor-pointer p-0 bg-transparent"
                                title="اختر اللون"
                              />
                            </div>

                            {/* Color name input */}
                            <input
                              type="text"
                              value={color.name}
                              onChange={(e) => updateColor(cIdx, { name: e.target.value })}
                              placeholder="اسم اللون (مثال: أبيض لؤلؤي)"
                              className="flex-1 px-2.5 py-1.5 bg-surface text-noir text-xs rounded border border-border-subtle focus:border-noir focus:outline-none"
                            />

                            {/* Hex input */}
                            <input
                              type="text"
                              value={color.hex}
                              onChange={(e) => updateColor(cIdx, { hex: e.target.value })}
                              className="w-20 px-2 py-1.5 bg-surface text-noir text-[11px] font-mono rounded border border-border-subtle focus:border-noir focus:outline-none text-center"
                            />

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeColor(cIdx)}
                              className="p-1.5 rounded hover:bg-red-50 text-muted hover:text-red-600 transition-smooth"
                              title="حذف هذا اللون"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Custom color adder */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="color"
                          value={customColorHex}
                          onChange={(e) => setCustomColorHex(e.target.value)}
                          className="w-8 h-8 rounded border border-border-subtle cursor-pointer p-0 self-center"
                        />
                        <input
                          type="text"
                          placeholder="اسم لون مخصص (مثال: بترولي هادئ)"
                          value={customColorName}
                          onChange={(e) => setCustomColorName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-card text-noir text-xs rounded border border-border-subtle focus:border-noir focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customColorName.trim()) {
                              addColor({ name: customColorName.trim(), hex: customColorHex });
                              setCustomColorName('');
                            }
                          }}
                          className="px-3 py-1.5 bg-noir hover:bg-accent text-white text-xs font-bold rounded transition-smooth flex items-center gap-1"
                        >
                          <Plus size={13} />
                          <span>إضافة</span>
                        </button>
                      </div>
                    </div>

                    {/* Sizes Management */}
                    <div className="p-4 bg-surface rounded-lg border border-border-subtle space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-noir flex items-center gap-1.5">
                          <Ruler size={14} className="text-accent" />
                          المقاسات المتوفرة ({formData.sizes.length} مقاس محدد):
                        </span>
                      </div>

                      {/* Jalabiya / Thobe Sizes Pills */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-muted block">مقاسات الجلابيب والأثواب (انقر للتفعيل/الإلغاء):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_SIZES_JALABIYA.map((size) => {
                            const isSelected = formData.sizes.includes(size);
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                                  isSelected
                                    ? 'bg-noir text-white border-noir shadow-xs scale-105'
                                    : 'bg-card text-muted border-border-subtle hover:text-noir hover:border-noir'
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Standard Letter Sizes Pills */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] text-muted block">مقاسات عامة (S, M, L...):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_SIZES_STANDARD.map((size) => {
                            const isSelected = formData.sizes.includes(size);
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                                  isSelected
                                    ? 'bg-noir text-white border-noir shadow-xs scale-105'
                                    : 'bg-card text-muted border-border-subtle hover:text-noir hover:border-noir'
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Size Adder */}
                      <div className="flex gap-2 pt-2 border-t border-border-subtle">
                        <input
                          type="text"
                          placeholder="أضف مقاساً مخصصاً (مثال: 64L أو 4XL)"
                          value={customSizeInput}
                          onChange={(e) => setCustomSizeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCustomSize(customSizeInput);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-card text-noir text-xs rounded border border-border-subtle focus:border-noir focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomSize(customSizeInput)}
                          className="px-3 py-1.5 bg-noir hover:bg-accent text-white text-xs font-bold rounded transition-smooth flex items-center gap-1"
                        >
                          <Plus size={13} />
                          <span>إضافة مقاس</span>
                        </button>
                      </div>
                    </div>

                    {/* Material & Description */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-noir">الخامة والمنشأ</label>
                      <input
                        type="text"
                        placeholder="مثال: قطن مصري 100% طبيعي فاخر"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-noir">الوصف والتفاصيل</label>
                      <textarea
                        rows={3}
                        placeholder="اكتب وصفاً جذاباً عن جودة القماش والتطريز والقصّة..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface text-noir text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none"
                      />
                    </div>

                    {/* 4 Shapes Image Upload */}
                    <div className="p-4 bg-surface rounded-lg border border-border-subtle space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-noir flex items-center gap-1.5">
                          <FileUp size={14} className="text-accent" />
                          صور المنتج (4 أشكال) – ارفع من جهازك:
                        </span>
                        {/* Batch Upload all 4 at once */}
                        <label className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-bold border transition-all ${isBatchUploading ? 'bg-surface text-muted border-border-subtle cursor-not-allowed' : 'bg-noir hover:bg-accent text-white border-transparent'}`}>
                          {isBatchUploading ? (
                            <><Loader2 size={11} className="animate-spin" /> جاري الرفع...</>
                          ) : (
                            <><Upload size={11} /> رفع 4 صور دفعة</>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={isBatchUploading}
                            onChange={(e) => handleBatchUpload(e.target.files)}
                          />
                        </label>
                      </div>

                      <div className="space-y-3">
                        {([
                          { key: 'shape1' as const, slot: 1 as const, label: 'الشكل 1: المنظر الأمامي الأساسي', required: true },
                          { key: 'shape2' as const, slot: 2 as const, label: 'الشكل 2: المنظر الخلفي والياقة', required: false },
                          { key: 'shape3' as const, slot: 3 as const, label: 'الشكل 3: زاوية القَصّة والجانب', required: false },
                          { key: 'shape4' as const, slot: 4 as const, label: 'الشكل 4: نسيج القماش والتطريز', required: false },
                        ]).map(({ key, slot, label, required }) => (
                          <div key={slot} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] text-muted">{label}{required ? ' *' : ''}</label>
                              <button
                                type="button"
                                onClick={() => toggleUrlInput(slot)}
                                className="text-[10px] text-muted hover:text-accent transition-smooth flex items-center gap-0.5"
                              >
                                <LinkIcon size={10} />
                                {showUrlInputs[slot] ? 'إخفاء الرابط' : 'رابط URL'}
                              </button>
                            </div>

                            <div className="flex gap-1.5 items-center">
                              {/* Upload from device button */}
                              <label className={`flex-shrink-0 cursor-pointer flex items-center justify-center gap-1 px-3 py-2 rounded border text-[11px] font-semibold transition-all ${uploadingSlot === slot ? 'bg-surface text-muted border-border-subtle cursor-not-allowed' : 'bg-card hover:bg-noir hover:text-white text-noir border-border-subtle'}`}>
                                {uploadingSlot === slot ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : formData[key] ? (
                                  <RefreshCw size={12} />
                                ) : (
                                  <ImageIcon size={12} />
                                )}
                                <span>{uploadingSlot === slot ? 'يتم الرفع...' : formData[key] ? 'تغيير' : 'اختر من الجهاز'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingSlot !== null}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleSingleFileUpload(slot, f);
                                  }}
                                />
                              </label>

                              {/* Preview thumbnail if image exists */}
                              {formData[key] && (
                                <div className="relative w-9 h-9 rounded border border-border-subtle overflow-hidden flex-shrink-0">
                                  <Image
                                    src={formData[key]}
                                    alt={`معاينة ${slot}`}
                                    fill
                                    className="object-cover"
                                    unoptimized={formData[key].startsWith('data:')}
                                  />
                                </div>
                              )}

                              {/* URL input (collapsible) */}
                              {showUrlInputs[slot] && (
                                <input
                                  type="url"
                                  value={formData[key]}
                                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                  placeholder="https://..."
                                  className="flex-1 px-2 py-2 bg-card text-noir text-xs rounded border border-border-subtle focus:border-noir focus:outline-none"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Interactive 4-Shape Preview & Summary (5 cols) */}
                  <div className="md:col-span-5 bg-surface p-5 rounded-lg border border-border-subtle flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-noir flex items-center gap-1.5">
                          <Eye size={13} className="text-accent" />
                          المعاينة الحية الفورية (جرب النقر):
                        </span>
                        <span className="text-[10px] text-accent font-semibold">
                          الشكل {previewShapeIndex + 1}
                        </span>
                      </div>

                      {/* Main Preview Photo Box */}
                      <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-main border border-border-subtle shadow-md">
                        {currentPreviewUrl ? (
                          <Image
                            src={currentPreviewUrl}
                            alt="معاينة"
                            fill
                            className="object-cover transition-all duration-300"
                            unoptimized={currentPreviewUrl.startsWith('data:')}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted text-xs">
                            أدخل رابط الصورة للمعاينة
                          </div>
                        )}
                        <div className="absolute bottom-2 inset-x-2 bg-noir/80 backdrop-blur-md text-white text-[10px] py-1 px-2 rounded text-center">
                          {['1. المنظر الأمامي', '2. المنظر الخلفي', '3. زاوية القَصّة', '4. نسيج القماش'][previewShapeIndex]}
                        </div>
                      </div>

                      {/* 4 Shapes Clicker Thumbnails */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] text-muted block">انقر لتغيير المعاينة الفورية:</span>
                        <div className="grid grid-cols-4 gap-2">
                          {[formData.shape1, formData.shape2, formData.shape3, formData.shape4].map((url, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPreviewShapeIndex(idx)}
                              className={`relative aspect-square rounded overflow-hidden border transition-all ${
                                previewShapeIndex === idx
                                  ? 'border-accent ring-2 ring-accent scale-105 shadow-sm'
                                  : 'border-border-subtle opacity-60 hover:opacity-100'
                              }`}
                            >
                              {url ? (
                                <Image
                                  src={url}
                                  alt={`شكل ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                  unoptimized={url.startsWith('data:')}
                                />
                              ) : (
                                <div className="bg-main text-muted text-[9px] flex items-center justify-center h-full">
                                  {idx + 1}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Summary Card */}
                    <div className="p-3.5 rounded-lg bg-card border border-border-subtle space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-noir block">{formData.name || 'اسم القطعة هنا'}</span>
                        <span className="text-xs font-extrabold text-accent block">{formData.price || '0'} ج.م</span>
                      </div>

                      {/* Live Stock Badge */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border-subtle">
                        <span className="text-muted">المخزون المتوفر:</span>
                        <span className={`font-bold ${Number(formData.stock_quantity) > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          {formData.stock_quantity || 0} قطعة ({formData.in_stock && Number(formData.stock_quantity) > 0 ? 'متوفر' : 'نفذ'})
                        </span>
                      </div>

                      {/* Live Colors Preview */}
                      {formData.colors.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-border-subtle">
                          <span className="text-[10px] text-muted block">الألوان ({formData.colors.length}):</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {formData.colors.map((c, idx) => (
                              <span
                                key={idx}
                                className="w-4 h-4 rounded-full border border-black/20 inline-block shadow-2xs"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Live Sizes Preview */}
                      {formData.sizes.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-border-subtle">
                          <span className="text-[10px] text-muted block">المقاسات ({formData.sizes.length}):</span>
                          <div className="flex flex-wrap gap-1">
                            {formData.sizes.map((s, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-[9px] font-bold text-noir">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-md bg-surface text-noir text-xs font-semibold hover:bg-mutedbg transition-smooth disabled:opacity-50"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving || uploadingSlot !== null || isBatchUploading}
                    className="px-7 py-2.5 rounded-md bg-noir hover:bg-accent text-white text-xs font-bold transition-smooth shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <><Loader2 size={14} className="animate-spin" /> جاري الحفظ...</>
                    ) : (
                      <><Check size={14} /> {editingProductId ? 'حفظ التعديلات' : 'إضافة القطعة إلى المتجر'}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
