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
  EyeOff,
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
  KeyRound,
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
  Mail,
  ExternalLink,
  Save,
  Download,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Copy,
} from 'lucide-react';
import { Product, CATEGORIES, Category, User, Color } from '../../types';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLocalProducts,
  saveLocalProducts,
  loginAdmin,
  changeAdminPassword,
  getAdminUser,
  logoutAdmin,
  isAdminEmail,
  uploadImage,
  uploadMultipleImages,
  getHeroImages,
  saveHeroImages,
  getHeroBadge,
  saveHeroBadge,
  getHeroVideo,
  saveHeroVideo,
  uploadHeroVideo,
  DEFAULT_HERO_VIDEO,
  getBannerSlides,
  saveBannerSlides,
  uploadBannerSlide,
  DEFAULT_BANNER_SLIDES,
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
  const [passwordInput, setPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ── Change Password Modal State ─────────────────────────────────────────────
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [changeEmail, setChangeEmail] = useState('admin@kounoz.sa');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

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
    category: 'كولكشن الصيفي' as Category,
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
    shape1: '/products/1/1.png', // الأمامي
    shape2: '/products/1/2.png', // الخلفي
    shape3: '/products/1/3.png', // الجانبي
    shape4: '/products/1/4.png', // النسيج
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

  // ── Hero Banner Slider State ───────────────────────────────────────────────
  const [bannerSlides, setBannerSlides]           = useState<string[]>(DEFAULT_BANNER_SLIDES);
  const [uploadingBannerIdx, setUploadingBannerIdx] = useState<number | null>(null);
  const [bannerSaved, setBannerSaved]             = useState(false);

  // ── Hero Video State ────────────────────────────────────────────────────────
  const [heroVideoUrl, setHeroVideoUrl]           = useState(DEFAULT_HERO_VIDEO);
  const [heroVideoInput, setHeroVideoInput]       = useState('');
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [heroVideoSaved, setHeroVideoSaved]       = useState(false);

  // ── WhatsApp & Store Settings State ───────────────────────────────────────
  const [whatsappNumber, setWhatsappNumber]       = useState('01022822123');
  const [whatsappGreeting, setWhatsappGreeting]   = useState('مرحباً، أود الاستفسار والطلب من تشكيلة كنوز الفاخرة');
  const [storePhone, setStorePhone]               = useState('01022822123');
  const [wholesalePhone, setWholesalePhone]       = useState('01066583964');
  const [storeEmail, setStoreEmail]               = useState('Kounozthobe@gmail.com');
  const [whatsappSaved, setWhatsappSaved]         = useState(false);
  const [isSavingWhatsapp, setIsSavingWhatsapp]   = useState(false);

  // Upload States (for products)
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadingColorIdx, setUploadingColorIdx] = useState<number | null>(null);
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

  const [uploadingColorSlot, setUploadingColorSlot] = useState<{ cIdx: number; slot: number } | null>(null);
  const [expandedColorAngles, setExpandedColorAngles] = useState<Record<number, boolean>>({});

  const toggleColorAngles = (cIdx: number) => {
    setExpandedColorAngles((prev) => ({ ...prev, [cIdx]: !prev[cIdx] }));
  };

  const handleColorImageUpload = async (cIdx: number, file: File, slot: number = 0) => {
    if (!file) return;
    setUploadingColorIdx(cIdx);
    setUploadingColorSlot({ cIdx, slot });
    try {
      const uploadedUrl = await uploadImage(file);
      const color = formData.colors[cIdx];
      const existingImages = color.images && color.images.length > 0
        ? [...color.images]
        : [color.image_url || uploadedUrl, color.image_url || uploadedUrl, color.image_url || uploadedUrl, color.image_url || uploadedUrl];
      
      while (existingImages.length < 4) {
        existingImages.push(existingImages[0] || uploadedUrl);
      }
      existingImages[slot] = uploadedUrl;

      const primaryUrl = slot === 0 ? uploadedUrl : (color.image_url || existingImages[0]);

      if (slot === 0 && (!color.images || color.images.filter(Boolean).length <= 1)) {
        updateColor(cIdx, {
          image_url: uploadedUrl,
          images: [uploadedUrl, uploadedUrl, uploadedUrl, uploadedUrl],
        });
      } else {
        updateColor(cIdx, {
          image_url: primaryUrl,
          images: existingImages,
        });
      }
      showToast(`تم رفع صورة الزاوية ${slot + 1} للون "${formData.colors[cIdx]?.name || ''}" بنجاح`);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع صورة اللون');
    } finally {
      setUploadingColorIdx(null);
      setUploadingColorSlot(null);
    }
  };

  const updateColorAngle = (cIdx: number, slot: number, url: string) => {
    const color = formData.colors[cIdx];
    const existingImages = color.images && color.images.length > 0
      ? [...color.images]
      : [color.image_url || url, color.image_url || url, color.image_url || url, color.image_url || url];
    while (existingImages.length < 4) {
      existingImages.push(existingImages[0] || url);
    }
    existingImages[slot] = url;
    const primaryUrl = slot === 0 ? url : (color.image_url || existingImages[0]);
    updateColor(cIdx, {
      image_url: primaryUrl,
      images: existingImages,
    });
  };

  const applyColorImageToAllAngles = (cIdx: number) => {
    const color = formData.colors[cIdx];
    const img = color.image_url || color.images?.[0];
    if (!img) {
      alert('يرجى تحديد أو رفع صورة للون أولاً');
      return;
    }
    updateColor(cIdx, {
      image_url: img,
      images: [img, img, img, img],
    });
    showToast(`تم تعيين نفس صورة اللون "${color.name}" لكافة الزوايا الأربعة بنجاح`);
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
    // Load hero video
    const vid = getHeroVideo();
    if (vid) setHeroVideoUrl(vid);
    // Load hero banner slides
    const bSlides = getBannerSlides();
    if (bSlides?.length) setBannerSlides(bSlides);
    // Load store settings & WhatsApp number
    const settings = getStoreSettings();
    if (settings.whatsapp_number) setWhatsappNumber(settings.whatsapp_number);
    if (settings.whatsapp_greeting) setWhatsappGreeting(settings.whatsapp_greeting);
    if (settings.store_phone) setStorePhone(settings.store_phone);
    if (settings.wholesale_phone) setWholesalePhone(settings.wholesale_phone);
    if (settings.store_email) setStoreEmail(settings.store_email);
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
        store_phone: storePhone.trim() || whatsappNumber.trim(),
        wholesale_phone: wholesalePhone.trim() || '01066583964',
        store_email: storeEmail.trim() || 'Kounozthobe@gmail.com',
      });
      setWhatsappSaved(true);
      setTimeout(() => setWhatsappSaved(false), 3000);
      showToast('تم حفظ أرقام وبيانات التواصل وتحديث كامل المتجر بنجاح ✅');
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
    if (!passwordInput.trim()) {
      setLoginError('يرجى إدخال كلمة المرور');
      return;
    }
    const user = loginAdmin(emailInput, passwordInput);
    if (user) {
      setAdminUser(user);
      loadProductList();
    } else {
      setLoginError('كلمة المرور غير صحيحة، أو هذا البريد غير مصرح له كمدير');
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    const cleanEmail = changeEmail.trim().toLowerCase();
    if (!cleanEmail || !currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
      setChangePasswordError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (newPasswordInput !== confirmNewPasswordInput) {
      setChangePasswordError('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    const res = changeAdminPassword(cleanEmail, currentPasswordInput, newPasswordInput);
    if (res.success) {
      setChangePasswordSuccess('تم تغيير كلمة مرور الأدمن بنجاح ✅');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmNewPasswordInput('');
      showToast('تم تحديث وحفظ كلمة مرور الإدارة بنجاح ✅');
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setChangePasswordSuccess('');
      }, 1500);
    } else {
      setChangePasswordError(res.error || 'حدث خطأ أثناء تغيير كلمة المرور');
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
      category: 'كولكشن الصيفي',
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
      category: (product.category as Category) || 'كولكشن الصيفي',
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : '',
      material: product.material || '',
      care_instructions: product.care_instructions || '',
      description: product.description || '',
      tag: product.tag || '',
      in_stock: product.in_stock,
      stock_quantity: String(product.stock_quantity ?? (product.in_stock ? 15 : 0)),
      is_new: product.is_new,
      shape1: shapes[0] || product.image_url || '/products/1/1.png',
      shape2: shapes[1] || '/products/1/2.png',
      shape3: shapes[2] || '/products/1/3.png',
      shape4: shapes[3] || '/products/1/4.png',
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

  const handleExportProducts = () => {
    const current = getLocalProducts();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(current, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kounoz_products_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('تم تصدير ملف المنتجات بنجاح ✅');
  };

  const handleImportProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          saveLocalProducts(parsed);
          loadProductList();
          showToast(`تم استيراد وحفظ ${parsed.length} قطعة بنجاح! ✅`);
        } else {
          alert('ملف JSON غير صالح');
        }
      } catch {
        alert('خطأ في قراءة ملف JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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

    const sanitizedColors = formData.colors.map((c) => {
      const primary = (c.image_url || c.images?.[0] || '').trim();
      let colorImages = c.images && c.images.length > 0 ? [...c.images] : [];
      if (colorImages.length === 0 && primary) {
        colorImages = [primary, primary, primary, primary];
      } else if (colorImages.length > 0) {
        while (colorImages.length < 4) {
          colorImages.push(colorImages[0] || primary);
        }
      }
      return {
        ...c,
        image_url: primary || undefined,
        images: colorImages.length > 0 ? colorImages : undefined,
      };
    });

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
      colors: sanitizedColors.length > 0 ? sanitizedColors : [
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
    let matchesCategory = true;
    if (selectedFilterCategory === 'تخفيضات') {
      matchesCategory = Boolean(
        p.category === 'تخفيضات' ||
        (p.original_price && p.original_price > p.price) ||
        (p.tag && (p.tag.includes('خصم') || p.tag.includes('تخفيض') || p.tag.includes('وفر')))
      );
    } else if (selectedFilterCategory === 'وصل حديثاً') {
      matchesCategory = Boolean(p.is_new || (p.tag && p.tag.includes('جديد')) || p.category === 'وصل حديثاً');
    } else if (selectedFilterCategory === 'كولكشن الشتوي') {
      matchesCategory = Boolean(
        p.category === 'كولكشن الشتوي' ||
        p.category === 'أثواب ملكية' ||
        p.name.includes('شتوي') ||
        p.description.includes('شتوي') ||
        p.material.includes('صوف') ||
        p.material.includes('جوخ') ||
        (p.tag && p.tag.includes('شتوي'))
      );
    } else if (selectedFilterCategory === 'كولكشن الصيفي') {
      matchesCategory = Boolean(
        p.category === 'كولكشن الصيفي' ||
        p.category === 'جلابيب كلاسيكية' ||
        p.name.includes('صيفي') ||
        p.description.includes('صيفي') ||
        p.material.includes('قطن') ||
        p.material.includes('كتان') ||
        (p.tag && p.tag.includes('صيفي'))
      );
    } else if (selectedFilterCategory !== 'جميع القطع') {
      matchesCategory = p.category === selectedFilterCategory;
    }

    const matchesSearch = Boolean(
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.includes(searchQuery) ||
      (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
  if (session?.user?.email && !isAdminEmail(session.user.email) && !adminUser) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-md bg-card p-8 rounded-xl border border-red-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <ShieldCheck className="text-red-500" size={32} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-noir">غير مصرح بالدخول</h2>
          <p className="text-xs text-muted leading-relaxed">
            حسابك (<span className="font-bold text-noir">{session.user?.email}</span>) غير مضاف في قائمة المديرين المعتمدين.
          </p>
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={async () => {
                await signOut({ redirect: false });
                setAdminUser(null);
                setPasswordInput('');
                setLoginError('');
              }}
              className="w-full py-3 bg-accent hover:bg-noir text-white text-xs font-bold rounded-md transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Lock size={14} />
              الدخول كمدير بالبريد وكلمة المرور
            </button>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/admin' })}
              className="w-full py-2.5 bg-surface hover:bg-card text-muted hover:text-noir text-xs font-semibold rounded-md border border-border-subtle transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              الخروج من حساب Google
            </button>
          </div>
          <Link href="/" className="text-xs text-muted hover:text-noir transition-smooth inline-flex items-center gap-1 justify-center pt-2">
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
            <div className="relative w-16 h-16 mx-auto mb-2 rounded-full bg-[#FAF6EE] p-2 border border-[#D4AF37]/50 shadow-md flex items-center justify-center overflow-hidden">
              <Image src="/kounoz-logo.png" alt="كنوز" fill className="object-contain p-1" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-noir">لوحة تحكم إدارة كنوز</h1>
            <p className="text-xs text-muted">تسجيل الدخول لإدارة المنتجات، الصور، والبانرات</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md text-center">
              {loginError}
            </div>
          )}

          {/* Form Login (Direct & Reliable) */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-noir">البريد الإلكتروني للإدارة</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@kounoz.sa"
                required
                className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-md text-xs text-noir focus:border-accent focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-noir">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="أدخل كلمة المرور الخاصة بالمدير"
                  required
                  className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-md text-xs text-noir focus:border-accent focus:outline-none font-mono pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir transition-colors"
                >
                  {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-noir hover:bg-accent text-white text-xs font-bold rounded-md transition-smooth shadow-md flex items-center justify-center gap-2"
            >
              <Lock size={14} />
              دخول لوحة التحكم
            </button>
          </form>

          {/* Change Password Button for Admin */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setChangeEmail(emailInput || 'admin@kounoz.sa');
                setIsChangePasswordOpen(true);
                setChangePasswordError('');
                setChangePasswordSuccess('');
              }}
              className="text-xs text-accent hover:text-noir font-bold transition-colors inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-surface border border-transparent hover:border-border-subtle"
            >
              <KeyRound size={14} className="text-[#D4AF37]" />
              <span>تغيير كلمة مرور الإدارة (Check by Email & Password)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-border-subtle text-center">
            <Link href="/" className="text-xs text-muted hover:text-noir transition-smooth inline-flex items-center gap-1">
              <span>العودة لمتجر كنوز</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Change Password Modal (also available on login screen) */}
        <AnimatePresence>
          {isChangePasswordOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full max-w-md bg-card rounded-2xl border border-border-subtle shadow-2xl overflow-hidden text-right"
              >
                <div className="p-5 border-b border-border-subtle bg-gradient-to-r from-[#20050D] via-[#4A0A19] to-[#20050D] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                      <KeyRound size={16} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">تغيير كلمة مرور الإدارة</h3>
                      <p className="text-[11px] text-[#EDE5D8]/70">فحص البريد وكلمة المرور الحالية (Check by Email & Password)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
                  {changePasswordError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <span className="font-bold">{changePasswordError}</span>
                    </div>
                  )}

                  {changePasswordSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold">
                      <span>{changePasswordSuccess}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-noir block">البريد الإلكتروني للمدير</label>
                    <input
                      type="email"
                      value={changeEmail}
                      onChange={(e) => setChangeEmail(e.target.value)}
                      placeholder="admin@kounoz.sa"
                      required
                      className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-noir block">كلمة المرور الحالية (Current Password)</label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="أدخل كلمة المرور الحالية"
                        required
                        className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none font-mono pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir"
                      >
                        {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-noir block">كلمة المرور الجديدة (New Password)</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="6 خانات أو أكثر"
                        required
                        className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none font-mono pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir"
                      >
                        {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-noir block">تأكيد كلمة المرور الجديدة (Confirm New Password)</label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmNewPasswordInput}
                        onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                        required
                        className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none font-mono pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir"
                      >
                        {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#7A0C28] hover:bg-noir text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Save size={15} />
                      <span>تحديث وحفظ كلمة المرور</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangePasswordOpen(false)}
                      className="px-4 py-3 bg-surface hover:bg-mutedbg text-muted hover:text-noir text-xs font-semibold rounded-xl border border-border-subtle transition-all"
                    >
                      إلغاء
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
            <div className="relative w-11 h-11 rounded-full bg-[#FAF6EE] p-1 border border-[#D4AF37]/50 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image src="/kounoz-logo.png" alt="كنوز" fill className="object-contain p-0.5" />
            </div>
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-noir">لوحة تحكم كنوز</span>
                <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded">ADMIN</span>
              </div>
              <span className="text-[11px] text-muted">{adminUser.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setChangeEmail(adminUser?.email || emailInput || 'admin@kounoz.sa');
                setIsChangePasswordOpen(true);
                setChangePasswordError('');
                setChangePasswordSuccess('');
              }}
              className="px-3.5 py-2 bg-[#FAF6EE] hover:bg-[#D4AF37]/20 text-[#7A0C28] text-xs font-bold rounded-md border border-[#D4AF37]/50 transition-smooth flex items-center gap-1.5 shadow-sm"
              title="تغيير كلمة مرور الإدارة"
            >
              <KeyRound size={14} className="text-[#D4AF37]" />
              <span className="hidden sm:inline">تغيير كلمة المرور</span>
            </button>

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
                <h2 className="font-serif text-xl font-bold text-noir flex items-center gap-2">
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
                      placeholder="01022822123 أو +201022822123"
                      className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-lg text-xs font-mono font-bold text-noir focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-muted">
                    يقبل الرقم المصري المباشر (مثل 01022822123) أو السعودي أو الدولي بكود الدولة.
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

              {/* Direct Call Phone, Wholesale Phone & Store Email Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-noir flex items-center gap-1.5">
                    <Phone size={13} className="text-accent" />
                    <span>هاتف الاتصال المباشر:</span>
                  </label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    placeholder="01022822123"
                    className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-lg text-xs font-mono font-bold text-noir focus:border-accent focus:outline-none"
                  />
                  <p className="text-[10px] text-muted">
                    يظهر في القائمة الجانبية وأسفل الموقع.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-noir flex items-center gap-1.5">
                    <Phone size={13} className="text-accent" />
                    <span>هاتف طلب الجملة:</span>
                  </label>
                  <input
                    type="text"
                    value={wholesalePhone}
                    onChange={(e) => setWholesalePhone(e.target.value)}
                    placeholder="01066583964"
                    className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-lg text-xs font-mono font-bold text-noir focus:border-accent focus:outline-none"
                  />
                  <p className="text-[10px] text-muted">
                    يظهر في الفوتر لطلبات تجار الجملة.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-noir flex items-center gap-1.5">
                    <Mail size={13} className="text-accent" />
                    <span>البريد الإلكتروني للدعم:</span>
                  </label>
                  <input
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    placeholder="Kounozthobe@gmail.com"
                    className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-lg text-xs font-mono font-bold text-noir focus:border-accent focus:outline-none"
                  />
                  <p className="text-[10px] text-muted">
                    يظهر للعملاء في الفوتر لخدمة العملاء.
                  </p>
                </div>
              </div>

              {/* Greeting Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-noir block">
                  نص الرسالة الترحيبية الافتراضية للواتساب:
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
                  <span>{whatsappSaved ? 'تم حفظ البيانات بنجاح!' : 'حفظ وتطبيق أرقام وبيانات التواصل في كامل المتجر'}</span>
                </motion.button>

                <span className="text-[11px] text-muted">
                  * يتم تحديث القائمة الجانبية، الأيقونة العائمة، السلة، والفوتر فورياً بدون إعادة تحميل.
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
                  <span><strong>سلة المشتريات:</strong> إرسال كامل محتويات السلة في رسالة منسقة.</span>
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

        {/* ── Banner Slider Manager (Before Video) ──────────────────────── */}
        <div className="bg-card rounded-xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-main">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-card border border-border-subtle text-accent">
                <ImageIcon size={16} />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-noir">سلايدر البانرات الإعلانية (قبل جزئية الفيديو)</h2>
                <p className="text-[11px] text-muted">إدارة صور وبانرات السلايدر العريض بأعلى الصفحة الرئيسية (16:9) — أضف أو عدّل أي بانر</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-accent/15 text-accent border border-accent/30 rounded-full">
              {bannerSlides.length} بانرات معروضة
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bannerSlides.map((slideUrl, idx) => (
                <div key={idx} className="p-4 bg-surface rounded-xl border border-border-subtle space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-noir flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      بانر الشريحة {idx + 1}
                    </span>
                    {bannerSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = bannerSlides.filter((_, i) => i !== idx);
                          setBannerSlides(updated);
                        }}
                        className="text-[11px] text-red-500 hover:text-red-700 font-semibold px-2 py-0.5 rounded hover:bg-red-50 transition-colors"
                      >
                        حذف البانر
                      </button>
                    )}
                  </div>

                  {/* Banner Preview Frame */}
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-border-subtle bg-[#5A081D]">
                    {slideUrl ? (
                      <Image
                        src={slideUrl}
                        alt={`بانر ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={slideUrl.startsWith('data:')}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted text-xs">
                        لا توجد صورة
                      </div>
                    )}
                  </div>

                  {/* Upload / Replace */}
                  <div className="flex items-center gap-2 pt-1">
                    <label className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                      uploadingBannerIdx === idx
                        ? 'bg-surface text-muted border-border-subtle cursor-not-allowed'
                        : 'bg-noir hover:bg-accent text-white border-transparent'
                    }`}>
                      {uploadingBannerIdx === idx ? (
                        <><Loader2 size={13} className="animate-spin" /> جاري الرفع...</>
                      ) : (
                        <><Upload size={13} /> {slideUrl ? 'استبدال الصورة' : 'اختر صورة من الجهاز'}</>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingBannerIdx !== null}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingBannerIdx(idx);
                          try {
                            const url = await uploadImage(file);
                            const updated = [...bannerSlides];
                            updated[idx] = url;
                            setBannerSlides(updated);
                            saveBannerSlides(updated);
                            showToast(`تم تحديث بانر الشريحة ${idx + 1} بنجاح ✅`);
                          } catch {
                            alert('حدث خطأ أثناء رفع الصورة');
                          } finally {
                            setUploadingBannerIdx(null);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => {
                  setBannerSlides([...bannerSlides, '/images/banners/banner-craftsmanship.png']);
                }}
                className="px-4 py-2.5 rounded-lg border border-border-subtle hover:border-noir text-xs font-bold text-noir transition-all flex items-center gap-2 hover:bg-surface"
              >
                <Plus size={14} className="text-accent" />
                <span>إضافة شريحة بانر جديدة</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  saveBannerSlides(bannerSlides);
                  setBannerSaved(true);
                  setTimeout(() => setBannerSaved(false), 3000);
                  showToast('تم حفظ سلايدر البانرات بنجاح ✅');
                }}
                className="px-8 py-3 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg transition-smooth shadow-md flex items-center gap-2"
              >
                {bannerSaved ? <><Check size={14} /> تم الحفظ بنجاح!</> : <><Check size={14} /> حفظ تغييرات السلايدر</>}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Hero Video Manager (Intro Video) ─────────────────────────── */}
        <div className="bg-card rounded-xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle flex items-center gap-3 bg-main">
            <div className="p-2 rounded bg-card border border-border-subtle text-accent">
              <UploadCloud size={16} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-noir">فيديو الواجهة التعريفي (Intro Video)</h2>
              <p className="text-[11px] text-muted">غيّر الفيديو الذي يظهر في الصفحة الرئيسية — ارفع من جهازك (MP4/WebM) أو الصق رابطاً</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Controls */}
            <div className="md:col-span-7 space-y-4 text-right">
              {/* Upload from device */}
              <div className="p-4 bg-surface rounded-lg border border-border-subtle space-y-3">
                <span className="text-xs font-bold text-noir flex items-center gap-1.5">
                  <FileUp size={14} className="text-accent" />
                  رفع فيديو من جهازك (MP4 / WebM):
                </span>
                <label className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg border text-xs font-bold transition-all ${uploadingHeroVideo ? 'bg-surface text-muted border-border-subtle cursor-not-allowed' : 'bg-noir hover:bg-accent text-white border-transparent'}`}>
                  {uploadingHeroVideo ? (
                    <><Loader2 size={14} className="animate-spin" /> جاري رفع الفيديو...</>
                  ) : (
                    <><Upload size={14} /> اختر ملف فيديو من جهازك</>
                  )}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/*"
                    className="hidden"
                    disabled={uploadingHeroVideo}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingHeroVideo(true);
                      try {
                        const url = await uploadHeroVideo(file);
                        setHeroVideoUrl(url);
                        saveHeroVideo(url);
                        setHeroVideoSaved(true);
                        setTimeout(() => setHeroVideoSaved(false), 3000);
                        showToast('تم رفع وحفظ الفيديو التعريفي بنجاح ✅');
                      } catch (err) {
                        console.error(err);
                        alert('حدث خطأ أثناء رفع الفيديو');
                      } finally {
                        setUploadingHeroVideo(false);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>

              {/* Or enter URL */}
              <div className="p-4 bg-surface rounded-lg border border-border-subtle space-y-2">
                <span className="text-xs font-bold text-noir flex items-center gap-1.5">
                  <LinkIcon size={13} className="text-accent" />
                  أو الصق رابط الفيديو (URL):
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://res.cloudinary.com/... أو /videos/intro.mp4"
                    value={heroVideoInput}
                    onChange={(e) => setHeroVideoInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-card text-noir text-xs rounded border border-border-subtle focus:border-noir focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!heroVideoInput.trim()) return;
                      const url = heroVideoInput.trim();
                      setHeroVideoUrl(url);
                      saveHeroVideo(url);
                      setHeroVideoInput('');
                      setHeroVideoSaved(true);
                      setTimeout(() => setHeroVideoSaved(false), 3000);
                      showToast('تم حفظ رابط الفيديو بنجاح ✅');
                    }}
                    className="px-4 py-2 bg-accent hover:bg-noir text-white text-xs font-bold rounded transition-smooth flex items-center gap-1.5"
                  >
                    <Check size={13} />
                    حفظ
                  </motion.button>
                </div>
              </div>

              {/* Current video info */}
              <div className="p-3 bg-surface rounded-lg border border-border-subtle flex items-center justify-between gap-3">
                <span className="text-[10px] text-muted font-mono truncate flex-1 text-left">{heroVideoUrl}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {heroVideoSaved && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <Check size={10} />
                      تم الحفظ
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setHeroVideoUrl(DEFAULT_HERO_VIDEO);
                      saveHeroVideo(DEFAULT_HERO_VIDEO);
                      showToast('تم إعادة تعيين الفيديو للافتراضي ✅');
                    }}
                    className="text-[10px] text-muted hover:text-red-600 px-2 py-1 rounded border border-border-subtle hover:border-red-300 transition-smooth flex items-center gap-1"
                  >
                    <RefreshCw size={10} />
                    إعادة الافتراضي
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Video Preview */}
            <div className="md:col-span-5">
              <span className="text-xs font-bold text-noir block mb-2 text-right">المعاينة الحية للفيديو:</span>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border-subtle bg-surface shadow-md">
                <video
                  key={heroVideoUrl}
                  src={heroVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-md border border-border-subtle text-slate-200 text-[10px] font-semibold shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  معاينة حية
                </div>
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

            {/* Action Buttons: Add + Export + Import */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full sm:w-auto">
              <button
                type="button"
                onClick={handleExportProducts}
                className="px-3.5 py-2.5 bg-surface hover:bg-[#EFE9DB] text-noir text-xs font-bold rounded-md border border-border-subtle transition-smooth flex items-center gap-1.5 shadow-xs"
                title="تنزيل نسخة احتياطية من كل المنتجات والصور كملف JSON لنقلها لأي جهاز أو دومين"
              >
                <Download size={14} className="text-[#AD8A55]" />
                <span>تصدير المنتجات (نسخة JSON)</span>
              </button>

              <label
                className="cursor-pointer px-3.5 py-2.5 bg-surface hover:bg-[#EFE9DB] text-noir text-xs font-bold rounded-md border border-border-subtle transition-smooth flex items-center gap-1.5 shadow-xs"
                title="استيراد المنتجات من ملف JSON وحفظها فوراً"
              >
                <UploadCloud size={14} className="text-[#AD8A55]" />
                <span>استيراد منتجات</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleImportProducts}
                />
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openAddModal}
                className="px-5 py-2.5 bg-noir hover:bg-accent text-white text-xs font-bold rounded-md transition-smooth shadow-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>إضافة قطعة جديدة</span>
              </motion.button>
            </div>
          </div>

          {/* Category Filter Pills (زي صفحة العميل) */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-border-subtle no-scrollbar">
            {['جميع القطع', 'تخفيضات', 'وصل حديثاً', 'كولكشن الشتوي', 'كولكشن الصيفي'].map((cat) => (
              <motion.button
                key={cat}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilterCategory(cat)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-xs font-semibold tracking-wide transition-smooth whitespace-nowrap ${
                  selectedFilterCategory === cat
                    ? 'bg-accent text-gray-200 shadow-md shadow-accent/30 border border-accent-hover/50'
                    : 'bg-card text-muted border border-border-subtle hover:text-noir hover:border-accent hover:bg-surface'
                }`}
              >
                {cat}
              </motion.button>
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
                          <option value="كولكشن الصيفي">كولكشن الصيفي</option>
                          <option value="كولكشن الشتوي">كولكشن الشتوي</option>
                          <option value="وصل حديثاً">وصل حديثاً</option>
                          <option value="تخفيضات">تخفيضات</option>
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

                      {/* List of active colors with individual image support */}
                      <div className="space-y-3 pt-2 border-t border-border-subtle">
                        {formData.colors.map((color, cIdx) => (
                          <div key={cIdx} className="bg-card p-3 rounded-lg border border-border-subtle space-y-2.5 shadow-xs">
                            {/* Color Header: Swatch + Name + Hex + Delete */}
                            <div className="flex items-center gap-2">
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
                                className="flex-1 px-2.5 py-1.5 bg-surface text-noir text-xs rounded border border-border-subtle focus:border-noir focus:outline-none font-semibold"
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
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {/* Color Image Row: Main Upload + 4 Angles Customizer */}
                            <div className="space-y-2 pt-2 border-t border-dashed border-border-subtle bg-surface/60 p-2.5 rounded-md">
                              <div className="flex items-center gap-2.5">
                                {/* Mini Image Preview */}
                                {color.image_url ? (
                                  <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border-subtle flex-shrink-0 group bg-main shadow-xs">
                                    <Image
                                      src={color.image_url}
                                      alt={color.name}
                                      fill
                                      className="object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => updateColor(cIdx, { image_url: '', images: [] })}
                                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="إزالة صورة هذا اللون"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-md border border-dashed border-border-subtle flex items-center justify-center flex-shrink-0 text-muted bg-card">
                                    <ImageIcon size={18} />
                                  </div>
                                )}

                                {/* Upload Button + URL Input */}
                                <div className="flex-1 space-y-1 text-right">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <label
                                      className={`cursor-pointer px-2.5 py-1 text-[11px] font-bold rounded border transition-smooth inline-flex items-center gap-1.5 ${
                                        uploadingColorIdx === cIdx && uploadingColorSlot?.slot === 0
                                          ? 'bg-noir text-white opacity-80'
                                          : 'bg-card hover:bg-noir hover:text-white border-border-subtle text-noir'
                                      }`}
                                    >
                                      {uploadingColorIdx === cIdx && uploadingColorSlot?.slot === 0 ? (
                                        <>
                                          <Loader2 size={12} className="animate-spin" />
                                          <span>جاري رفع صورة {color.name}...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Upload size={12} />
                                          <span>{color.image_url ? 'تغيير صورة هذا اللون' : 'رفع صورة لهذا اللون'}</span>
                                        </>
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingColorIdx === cIdx}
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleColorImageUpload(cIdx, file, 0);
                                        }}
                                      />
                                    </label>

                                    {color.image_url && (
                                      <button
                                        type="button"
                                        onClick={() => applyColorImageToAllAngles(cIdx)}
                                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30 transition-smooth inline-flex items-center gap-1"
                                        title="تطبيق هذه الصورة على زوايا اللون الأربعة"
                                      >
                                        <Copy size={10} />
                                        <span>تطبيق على الـ 4 زوايا</span>
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => toggleColorAngles(cIdx)}
                                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface hover:bg-card border border-border-subtle text-muted transition-smooth inline-flex items-center gap-1 mr-auto"
                                    >
                                      <span>الزوايا الـ 4 للون</span>
                                      {expandedColorAngles[cIdx] ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                    </button>
                                  </div>

                                  <input
                                    type="text"
                                    value={color.image_url || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateColor(cIdx, {
                                        image_url: val,
                                        images: [val, val, val, val],
                                      });
                                    }}
                                    placeholder="أو الصق رابط صورة اللون (URL)..."
                                    className="w-full px-2 py-1 bg-card text-noir text-[10px] rounded border border-border-subtle focus:border-noir focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* 4 Angles Detailed Manager for This Color */}
                              {expandedColorAngles[cIdx] && (
                                <div className="mt-2 pt-2 border-t border-border-subtle space-y-2 bg-card/60 p-2.5 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-noir flex items-center gap-1">
                                      <Sparkles size={11} className="text-accent" />
                                      <span>تخصيص صور زوايا لون "{color.name}" (4 أشكال):</span>
                                    </span>
                                    <span className="text-[10px] text-muted">
                                      تظهر هذه الزوايا الأربعة عند اختيار هذا اللون في المتجر
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[
                                      { label: '1. أمامي (الرئيسي)', idx: 0 },
                                      { label: '2. خلفي', idx: 1 },
                                      { label: '3. جانبي / القَصّة', idx: 2 },
                                      { label: '4. نسيج وتفاصيل', idx: 3 },
                                    ].map((angle) => {
                                      const angleImg = (color.images && color.images[angle.idx]) || (angle.idx === 0 ? color.image_url : '') || '';
                                      const isSlotUploading = uploadingColorIdx === cIdx && uploadingColorSlot?.slot === angle.idx;

                                      return (
                                        <div key={angle.idx} className="p-2 bg-surface rounded-md border border-border-subtle space-y-1.5 text-right">
                                          <div className="flex items-center justify-between text-[10px]">
                                            <span className="font-bold text-noir">{angle.label}</span>
                                            {angleImg && (
                                              <button
                                                type="button"
                                                onClick={() => updateColorAngle(cIdx, angle.idx, '')}
                                                className="text-muted hover:text-red-600 transition-colors"
                                                title="مسح"
                                              >
                                                <X size={11} />
                                              </button>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-2">
                                            {angleImg ? (
                                              <div className="relative w-9 h-9 rounded overflow-hidden border border-border-subtle flex-shrink-0 bg-main">
                                                <Image src={angleImg} alt={angle.label} fill className="object-cover" />
                                              </div>
                                            ) : (
                                              <div className="w-9 h-9 rounded border border-dashed border-border-subtle flex items-center justify-center flex-shrink-0 text-muted bg-card">
                                                <ImageIcon size={13} />
                                              </div>
                                            )}

                                            <div className="flex-1 space-y-1">
                                              <label className="cursor-pointer px-2 py-0.5 text-[10px] font-bold rounded border bg-card hover:bg-noir hover:text-white border-border-subtle text-noir transition-smooth inline-flex items-center gap-1">
                                                {isSlotUploading ? (
                                                  <>
                                                    <Loader2 size={10} className="animate-spin" />
                                                    <span>رفع...</span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Upload size={10} />
                                                    <span>{angleImg ? 'تغيير' : 'رفع'}</span>
                                                  </>
                                                )}
                                                <input
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  disabled={isSlotUploading}
                                                  onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleColorImageUpload(cIdx, file, angle.idx);
                                                  }}
                                                />
                                              </label>
                                              <input
                                                type="text"
                                                value={angleImg}
                                                onChange={(e) => updateColorAngle(cIdx, angle.idx, e.target.value)}
                                                placeholder="رابط الصورة..."
                                                className="w-full px-1.5 py-0.5 bg-card text-noir text-[9px] rounded border border-border-subtle focus:outline-none"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
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
