'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { Product, Color } from '../../../types';
import { getProductById, formatWhatsAppUrl, getWhatsAppNumber, getColorShapes } from '../../../lib/api';
import { useCart } from '../../../context/CartContext';
import { ProductSizeGuide } from '../../../components/ProductSizeGuide';
import { MeasurementGuideCard } from '../../../components/MeasurementGuideCard';
import {
  ArrowRight,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Eye,
  MessageCircle,
  Ruler,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';

export default function ProductDetailPage() {
  const { dir } = useLanguage();
  const params = useParams();
  const id = params?.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('58L');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedToast, setAddedToast] = useState(false);

  const shapeLabels = [
    'المنظر الأمامي الكامل',
    'المنظر الخلفي والياقة',
    'زاوية القَصّة والجانب',
    'تفاصيل النسيج والتطريز الدقيق',
    'باكدجينج كنوز الفاخر (تستلمها هكذا)',
  ];

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
        setActiveImageIndex(0);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      }
    }
    loadProduct();

    const handleUpdate = () => {
      loadProduct();
    };
    window.addEventListener('kounoz_products_updated', handleUpdate);
    return () => window.removeEventListener('kounoz_products_updated', handleUpdate);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center" dir={dir}>
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-noir border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted text-xs">جاري تحميل تفاصيل ومواصفات القطعة...</p>
        </div>
      </div>
    );
  }

  // Guaranteed consistent 4 angles for the active selected color
  const allShapes = getColorShapes(product, selectedColor);

  const currentMainPhoto = allShapes[activeImageIndex] || allShapes[0] || product.image_url;

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: selectedColor?.name,
      size: selectedSize,
      image_url: currentMainPhoto,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleWhatsAppOrder = () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const colorText = selectedColor?.name ? selectedColor.name : 'اللون المعروض';
    const message = `السلام عليكم ورحمة الله،
أود طلب القطعة الفاخرة التالية من متجر كنوز:
🏷️ القطعة: ${product.name}
💰 السعر: ${product.price} ج.م
📐 المقاس المطلوب: ${selectedSize}
🎨 اللون: ${colorText}
📦 الكمية: ${quantity}
🔗 رابط القطعة: ${pageUrl}

يرجى تأكيد توفر الطلب وبيانات الشحن والتوصيل. شكراً!`;

    const url = formatWhatsAppUrl(getWhatsAppNumber(), message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-main" dir={dir}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16">
        {/* Back Link with micro-interaction */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted hover:text-noir transition-smooth mb-10 group"
        >
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-smooth" />
          العودة للتشكيلة الرئيسية
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Large Product Photo Stage + 4 Shape Viewers (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Container with 1-Click active shape - Vertical Frame (2:3) */}
            <div className="relative w-full aspect-[2/3] max-h-[820px] rounded-lg overflow-hidden bg-surface border border-border-subtle shadow-md">
              <Image
                src={currentMainPhoto}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 right-4 bg-[#141416]/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-2xl border border-white/20 ring-1 ring-black/40">
                <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse flex-shrink-0" />
                <Eye size={14} className="text-[#C5A059] flex-shrink-0" />
                <span className="text-white font-bold tracking-wide drop-shadow-sm">{shapeLabels[activeImageIndex] || `شكل ${activeImageIndex + 1}`}</span>
              </div>
            </div>

            {/* 5 Photos One-Click Selector Grid (4 Angles + Packaging) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="font-bold text-noir">أشكال وتفاصيل القطعة والباكدج (5 صور بنقرة واحدة):</span>
                <span className="text-[11px] text-accent font-semibold">اضغط لعرض أي زاوية أو الباكدج</span>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
                {allShapes.slice(0, 5).map((shapeUrl, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setActiveImageIndex(idx);
                    }}
                    className={`relative aspect-[3/4] sm:aspect-[2/3] rounded-md overflow-hidden cursor-pointer border flex flex-col justify-end p-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-accent ring-2 ring-accent ring-offset-2 shadow-md scale-102'
                        : 'border-border-subtle hover:border-noir opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={shapeUrl}
                      alt={shapeLabels[idx] || `شكل ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <span className="relative z-10 text-white text-[10px] sm:text-xs font-bold text-right leading-tight drop-shadow-md">
                      {['1. أمامي', '2. خلفي', '3. جانبي', '4. النسيج', '5. الباكدج'][idx]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Visual Measurement Guide Illustration Card */}
            <div className="pt-2">
              <MeasurementGuideCard />
            </div>
          </div>

          {/* Right Column: Garment Information & Specs (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 space-y-8 bg-card p-8 sm:p-10 rounded-lg border border-border-subtle shadow-sm text-right"
          >
            {/* Header: Name, Category, Badges */}
            <div className="space-y-3 border-b border-border-subtle pb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-accent bg-surface px-3 py-1 rounded border border-border-subtle">
                  {product.category}
                </span>
                {product.is_new && (
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-100 bg-accent px-2.5 py-0.5 rounded shadow-xs">
                    جديد
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-noir leading-tight">
                {product.name}
              </h1>

              {/* Tag / Quality badge */}
              {product.tag && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface border border-border-subtle text-muted text-xs">
                  <Sparkles size={13} className="text-accent" />
                  <span>{product.tag}</span>
                </div>
              )}
            </div>

            {/* Price & Discount Bar */}
            <div className="flex items-baseline gap-4 py-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-noir">
                {product.price} ج.م
              </span>
              {product.original_price && (
                <span className="text-base text-muted line-through">
                  {product.original_price} ج.م
                </span>
              )}
              {discountPercent && (
                <span className="text-xs font-bold text-slate-100 bg-accent px-2.5 py-1 rounded">
                  وفر {discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted text-sm leading-relaxed border-t border-border-subtle pt-6 font-normal">
              {product.description}
            </p>

            {/* Fabric Material Spec */}
            <div className="space-y-3 py-4 border-y border-border-subtle text-xs">
              <div className="flex justify-between">
                <span className="text-muted">الخامة والمنشأ:</span>
                <span className="font-bold text-noir">{product.material}</span>
              </div>
              {product.care_instructions && (
                <div className="flex justify-between">
                  <span className="text-muted">تعليمات العناية:</span>
                  <span className="font-bold text-noir">{product.care_instructions}</span>
                </div>
              )}
            </div>

            {/* 4 Luxury Color Options Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-noir">ألوان الجلابية المتاحة (4 ألوان):</span>
                    <span className="text-[11px] text-muted">(اضغط للتبديل الفوري)</span>
                  </div>
                  <span className="text-xs font-bold text-accent bg-surface px-2.5 py-1 rounded border border-border-subtle">
                    {selectedColor?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {product.colors.map((c, cIdx) => {
                    const isSelected = selectedColor?.name === c.name;
                    const colorImg = c.image_url || (product.images && product.images[cIdx]);
                    return (
                      <motion.button
                        key={c.name}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setSelectedColor(c);
                          setActiveImageIndex(0);
                        }}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'border-noir bg-surface shadow-sm ring-1 ring-noir'
                            : 'border-border-subtle bg-card hover:border-noir/60'
                        }`}
                      >
                        {/* Mini Image or Color Swatch */}
                        <div className="relative w-9 h-9 rounded-md overflow-hidden flex-shrink-0 border border-black/10 bg-surface">
                          {colorImg ? (
                            <Image src={colorImg} alt={c.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full" style={{ backgroundColor: c.hex }} />
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Check size={15} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-noir' : 'text-muted'}`}>
                            {c.name}
                          </span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span
                              className="w-2 h-2 rounded-full border border-black/20"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span className="text-[10px] text-muted font-normal">
                              {isSelected ? 'المحدد حالياً' : 'انقر للمعاينة'}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector with Clean Subtle Borders */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-noir">
                  المقاس المطلوب:
                </span>
                <span className="text-xs font-mono font-bold text-[#AD8A55] bg-surface px-2 py-0.5 rounded border border-border-subtle">
                  المحدد: {selectedSize}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.sizes && product.sizes.length > 0 ? product.sizes : ['52L', '54L', '56L', '58L', '60L']).map((size) => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3.5 text-xs font-semibold rounded-md border transition-smooth ${
                      selectedSize === size
                        ? 'bg-noir text-white border-noir shadow-sm'
                        : 'border-border-subtle text-muted hover:text-noir hover:border-noir hover:bg-surface'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Smart Size Guide and Recommendation Tool based on Height and Weight */}
            <ProductSizeGuide
              product={product}
              selectedSize={selectedSize}
              onSelectSize={(size) => setSelectedSize(size)}
              defaultOpen={false}
            />

            {/* Quantity and Add to Bag */}
            <div className="space-y-4 pt-3">
              <div className="flex gap-3">
                <div className="flex items-center border border-border-subtle rounded-md px-3 py-2 bg-main">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-muted hover:text-noir font-bold px-1 transition-smooth"
                    aria-label="تقليل"
                  >
                    -
                  </motion.button>
                  <span className="px-3 text-sm font-bold text-noir">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-muted hover:text-noir font-bold px-1 transition-smooth"
                    aria-label="زيادة"
                  >
                    +
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-noir hover:bg-accent text-white text-xs font-bold rounded-md transition-smooth shadow-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  إضافة لسلة المشتريات
                </motion.button>
              </div>

              {/* Direct WhatsApp Order Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-md transition-smooth shadow-sm flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="fill-current" />
                <span>طلب فوري مباشر عبر واتساب</span>
              </motion.button>

              <AnimatePresence>
                {addedToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3 bg-surface border border-border-subtle rounded-md text-noir text-xs flex items-center gap-2 font-medium"
                  >
                    <Check size={15} className="text-accent" />
                    تمت إضافة القطعة بنجاح إلى سلة مشترياتك!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Value Props with Minimalist Aesthetic */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-border-subtle text-[11px] text-muted text-center">
              <div className="flex flex-col items-center gap-1.5">
                <Truck size={15} className="text-noir" />
                <span className="font-medium">شحن فاخر وسريع</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RotateCcw size={15} className="text-noir" />
                <span className="font-medium">استبدال 30 يوم</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck size={15} className="text-noir" />
                <span className="font-medium">ضمان الجودة</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
