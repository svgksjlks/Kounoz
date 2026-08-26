'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { Product, Color } from '../../../types';
import { getProductById } from '../../../lib/api';
import { useCart } from '../../../context/CartContext';
import {
  ArrowRight,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetailPage() {
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
      }
    }
    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-noir border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted text-xs">جاري تحميل تفاصيل ومواصفات القطعة...</p>
        </div>
      </div>
    );
  }

  const allShapes = (product.images && product.images.length > 0)
    ? product.images
    : [product.image_url, product.secondary_image_url].filter(Boolean) as string[];

  const currentMainPhoto = allShapes[activeImageIndex] || product.image_url;

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

  return (
    <div className="min-h-screen bg-main" dir="rtl">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Large Product Photo Stage + 4 Shape Viewers (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Container with 1-Click active shape */}
            <div className="relative w-full h-[450px] md:h-[560px] rounded-lg overflow-hidden bg-surface border border-border-subtle shadow-md">
              <Image
                src={currentMainPhoto}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-300"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute bottom-3 right-3 bg-noir/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                <Eye size={13} className="text-accent" />
                <span>{shapeLabels[activeImageIndex] || `شكل ${activeImageIndex + 1}`}</span>
              </div>
            </div>

            {/* 4 Shapes One-Click Selector Grid */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="font-bold text-noir">أشكال وزوايا القطعة (4 أشكال بنقرة واحدة):</span>
                <span className="text-[11px] text-accent font-medium">اضغط لعرض أي شكل في الصورة الرئيسية</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {allShapes.slice(0, 4).map((shapeUrl, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-28 rounded-md overflow-hidden cursor-pointer border flex flex-col justify-end p-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-accent ring-2 ring-accent ring-offset-2 shadow-md scale-102'
                        : 'border-border-subtle hover:border-noir opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={shapeUrl}
                      alt={shapeLabels[idx] || `شكل ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent" />
                    <span className="relative z-10 text-white text-[11px] font-bold text-right leading-tight">
                      {['1. أمامي', '2. خلفي', '3. جانبي', '4. النسيج'][idx]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Garment Information & Specs (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 space-y-8 bg-card p-8 sm:p-10 rounded-lg border border-border-subtle shadow-sm text-right"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-muted mb-2.5">
                <span className="font-semibold text-accent">
                  {product.category}
                </span>
                {product.tag && (
                  <span className="bg-surface px-2.5 py-0.5 rounded text-noir text-[11px] font-medium border border-border-subtle">
                    {product.tag}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl font-bold text-noir leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-extrabold text-noir">
                  {product.price} ر.س
                </span>
                {product.original_price && (
                  <span className="text-muted line-through text-sm font-normal">
                    {product.original_price} ر.س
                  </span>
                )}
              </div>
            </div>

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

            {/* Color Swatches with Micro-interactions */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-noir">
                    لون القماش المختار:
                  </span>
                  <span className="text-muted font-medium">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <motion.button
                      key={c.name}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full transition-smooth flex items-center justify-center ${
                        selectedColor?.name === c.name
                          ? 'ring-2 ring-noir ring-offset-2 scale-110 shadow-sm'
                          : 'border border-black/15 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={c.name}
                    >
                      {selectedColor?.name === c.name && (
                        <Check size={13} className={c.hex === '#1C1C1E' || c.hex === '#111111' || c.hex === '#0B132B' ? 'text-white' : 'text-noir'} />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector with Clean Subtle Borders */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-noir">
                  المقاس (بالإنش):
                </span>
                <span className="text-muted underline cursor-pointer hover:text-noir transition-smooth">جدول المقاسات</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {['52L', '54L', '56L', '58L', '60L'].map((size) => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 text-xs font-semibold rounded-md border transition-smooth ${
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
                  إضافة لحقيبة المشتريات
                </motion.button>
              </div>

              <AnimatePresence>
                {addedToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3 bg-surface border border-border-subtle rounded-md text-noir text-xs flex items-center gap-2 font-medium"
                  >
                    <Check size={15} className="text-accent" />
                    تمت إضافة القطعة بنجاح إلى حقيبة مشترياتك!
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
