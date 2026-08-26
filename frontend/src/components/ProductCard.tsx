'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '58L');
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Dynamic shapes based on selected color
  const colorShapes = selectedColor?.images && selectedColor.images.length > 0
    ? selectedColor.images
    : selectedColor?.image_url
    ? [
        selectedColor.image_url,
        ...(product.images || [product.image_url, product.secondary_image_url]).filter(
          (img): img is string => Boolean(img) && img !== selectedColor.image_url
        ),
      ]
    : null;

  const allShapes = colorShapes || (
    (product.images && product.images.length > 0)
      ? product.images
      : [product.image_url, product.secondary_image_url].filter(Boolean) as string[]
  );

  const currentDisplayImage = allShapes[activeImageIndex] || allShapes[0] || product.image_url;

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      color: selectedColor?.name,
      size: selectedSize,
      image_url: currentDisplayImage,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleShapeClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex(index);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group flex flex-col bg-card rounded-md sm:rounded-lg border border-border-subtle overflow-hidden transition-smooth shadow-sm hover:shadow-md relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Large Crisp Product Image Stage (Aspect 3/4) */}
      <div className="relative w-full aspect-[3/4] bg-surface overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full relative">
          <Image
            src={currentDisplayImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Compact Badges */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent && (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#141416] text-white text-[9px] sm:text-[10px] font-extrabold rounded-md tracking-wider shadow-md border border-white/15">
              -{discountPercent}%
            </span>
          )}
          {product.is_new && !discountPercent && (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#141416] text-white text-[9px] sm:text-[10px] font-bold rounded-md tracking-wider shadow-md border border-white/15">
              جديد
            </span>
          )}
        </div>

        {/* 4 Shapes One-Click Interactive Bar on the Photo */}
        {allShapes.length > 1 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 bg-[#141416]/90 backdrop-blur-md p-1 rounded-md border border-white/20 z-20 shadow-md">
            {allShapes.slice(0, 4).map((shapeUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleShapeClick(e, idx)}
                title={`معاينة الزاوية ${idx + 1}`}
                className={`relative w-4 h-4 sm:w-5 sm:h-5 rounded-sm overflow-hidden border transition-all ${
                  activeImageIndex === idx
                    ? 'border-[#C5A059] ring-2 ring-[#C5A059] scale-110 shadow-sm'
                    : 'border-white/30 opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <Image src={shapeUrl} alt={`زاوية ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Action Bar on Hover (Desktop & Mobile Touch) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-3 flex gap-1.5 sm:gap-2 z-10"
            >
              <button
                type="button"
                onClick={() => onQuickView && onQuickView(product)}
                className="flex-1 py-2 sm:py-2.5 bg-[#141416]/95 backdrop-blur-md hover:bg-[#AD8A55] text-white text-[11px] sm:text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg border border-white/20"
              >
                <Eye size={13} className="text-[#C5A059]" />
                <span className="hidden xs:inline">معاينة سريعة</span>
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleQuickAdd}
                className={`px-3 py-2 sm:px-3.5 sm:py-2.5 text-white rounded-lg flex items-center justify-center transition-all shadow-lg border border-white/20 ${
                  addedAnimation ? 'bg-emerald-700' : 'bg-[#141416]/95 hover:bg-[#AD8A55]'
                }`}
                aria-label="إضافة سريعة"
              >
                {addedAnimation ? <Check size={13} className="text-white" /> : <ShoppingBag size={13} />}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Compact, Refined Card Details */}
      <div className="p-3 sm:p-4.5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 bg-card text-right">
        <div>
          <span className="text-[10px] sm:text-xs text-muted font-medium block mb-0.5 sm:mb-1 line-clamp-1">
            {product.category}
          </span>

          <Link href={`/products/${product.id}`} className="block group-hover:text-accent transition-smooth">
            <h3 className="font-bold text-noir text-xs sm:text-sm md:text-base line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Compact Size Bar */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
            {product.sizes.slice(0, 4).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded border transition-smooth ${
                  selectedSize === size
                    ? 'bg-noir text-white border-noir'
                    : 'border-border-subtle text-muted hover:text-noir hover:border-noir'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Price & Available Colors */}
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          {/* Price */}
          <div className="flex items-baseline gap-1 sm:gap-1.5">
            <span className="font-extrabold text-noir text-xs sm:text-sm md:text-base">
              {product.price} ج.م
            </span>
            {product.original_price && (
              <span className="text-[10px] sm:text-xs text-muted line-through font-normal">
                {product.original_price} ج.م
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1 space-x-reverse">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(c);
                    setActiveImageIndex(0);
                  }}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-smooth ${
                    selectedColor?.name === c.name
                      ? 'ring-1 sm:ring-2 ring-noir ring-offset-1 scale-110'
                      : 'border border-black/15 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
