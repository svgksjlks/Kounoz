'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Check, ArrowLeft, Eye } from 'lucide-react';
import { Product, Color } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  // 4 shape labels
  const shapeLabels = ['المنظر الأمامي', 'المنظر الخلفي', 'زاوية القَصّة والجانب', 'تفاصيل النسيج والخياطة'];

  const allShapes = product ? (
    (product.images && product.images.length > 0)
      ? product.images
      : [product.image_url, product.secondary_image_url].filter(Boolean) as string[]
  ) : [];

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || null);
      setSelectedSize(product.sizes?.[0] || '58L');
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [product]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!product || !isOpen) return null;

  const currentMainPhoto = allShapes[activeImageIndex] || product.image_url;

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor?.name,
      size: selectedSize,
      image_url: currentMainPhoto,
    });
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" dir="rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-noir/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window with Scale & Fade */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-card rounded-lg border border-border-subtle shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-20 p-2 rounded-md bg-card/90 hover:bg-surface border border-border-subtle text-noir transition-smooth shadow-sm"
            aria-label="إغلاق المعاينة"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* Right Side: High Quality Product Photo Stage with 4-Shape 1-Click Thumbnails (6 cols) */}
            <div className="md:col-span-6 bg-surface p-6 flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-l border-border-subtle">
              {/* Main Photo Viewer Container */}
              <div className="relative h-[320px] sm:h-[380px] w-full rounded-md overflow-hidden bg-main border border-border-subtle shadow-sm">
                <Image
                  src={currentMainPhoto}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-2.5 right-2.5 bg-noir/80 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">
                  {shapeLabels[activeImageIndex] || `شكل ${activeImageIndex + 1}`}
                </div>
              </div>

              {/* 4 Shapes One-Click Switcher Bar */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-noir flex items-center gap-1.5">
                  <Eye size={12} className="text-accent" />
                  معاينة زوايا وأشكال القطعة (4 أشكال بنقرة واحدة):
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {allShapes.slice(0, 4).map((shapeUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-md overflow-hidden border transition-all ${
                        activeImageIndex === idx
                          ? 'border-accent ring-2 ring-accent ring-offset-1 shadow-md scale-105'
                          : 'border-border-subtle opacity-70 hover:opacity-100 hover:border-noir'
                      }`}
                    >
                      <Image src={shapeUrl} alt={shapeLabels[idx] || `شكل ${idx + 1}`} fill className="object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-noir/70 text-white text-[8px] sm:text-[9px] py-0.5 text-center truncate px-0.5">
                        {['أمامي', 'خلفي', 'جانبي', 'نسيج'][idx] || `شكل ${idx + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href={`/products/${product.id}`}
                onClick={onClose}
                className="text-xs text-muted hover:text-noir flex items-center justify-center gap-1.5 py-1 text-center font-medium transition-smooth"
              >
                <span>الانتقال لصفحة المواصفات الكاملة</span>
                <ArrowLeft size={13} />
              </Link>
            </div>

            {/* Left Side: Product Information & Add to Bag (6 cols) */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-right">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="font-semibold text-accent">{product.category}</span>
                  {discountPercent && (
                    <span className="bg-noir text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      خصم {discountPercent}%
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-noir">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-noir">
                    {product.price} ر.س
                  </span>
                  {product.original_price && (
                    <span className="text-muted line-through text-sm">
                      {product.original_price} ر.س
                    </span>
                  )}
                </div>

                <p className="text-muted text-xs leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border-subtle">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-noir">اللون:</span>
                      <span className="text-muted">{selectedColor?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c)}
                          className={`w-6 h-6 rounded-full transition-smooth flex items-center justify-center ${
                            selectedColor?.name === c.name
                              ? 'ring-2 ring-noir ring-offset-2 scale-110'
                              : 'border border-black/15 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border-subtle">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-noir">المقاسات المتوفرة:</span>
                      <span className="text-muted font-medium">{selectedSize}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-smooth ${
                            selectedSize === size
                              ? 'bg-noir text-white border-noir shadow-sm'
                              : 'border-border-subtle text-muted hover:text-noir hover:border-noir hover:bg-surface'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-border-subtle">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-noir hover:bg-accent text-white text-xs font-bold rounded-md transition-smooth shadow-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  إضافة لحقيبة المشتريات
                </button>

                {addedToast && (
                  <div className="p-2.5 bg-surface border border-border-subtle rounded-md text-noir text-xs flex items-center justify-center gap-2 animate-fade-in font-medium">
                    <Check size={14} className="text-accent" />
                    تمت الإضافة إلى الحقيبة بنجاح!
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
