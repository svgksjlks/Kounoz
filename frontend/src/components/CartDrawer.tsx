'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalAmount, clearCart } = useCart();

  // Background Scroll Locking
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle touch swipe to dismiss (swipe left on the cart drawer in RTL)
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -400) {
      closeCart();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
          {/* Backdrop with fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-noir/50 backdrop-blur-sm touch-none"
            onClick={closeCart}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            {/* Sliding Drawer Container with mobile full-width & drag */}
            <motion.div
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.6, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-full sm:max-w-md bg-card shadow-2xl flex flex-col border-r border-border-subtle overscroll-contain z-10"
            >
              {/* Mobile Drag Indicator */}
              <div className="sm:hidden w-full flex justify-center pt-2 pb-1 bg-main">
                <div className="w-10 h-1 rounded-full bg-border-focus/20" />
              </div>

              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-border-subtle flex items-center justify-between bg-main">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={19} className="text-noir" />
                  <h2 className="font-serif text-xl font-bold text-noir">حقيبة المشتريات</h2>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={closeCart}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-border-subtle hover:border-noir text-noir text-xs font-bold transition-smooth shadow-sm"
                  aria-label="إغلاق السلة"
                >
                  <span>إغلاق</span>
                  <X size={16} />
                </motion.button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted py-16"
                  >
                    <ShoppingBag size={42} className="stroke-1 text-muted/40" />
                    <p className="text-sm font-medium">حقيبة المشتريات فارغة حالياً.</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeCart}
                      className="px-6 py-3 bg-noir text-white text-xs font-bold rounded-md hover:bg-accent transition-smooth"
                    >
                      تصفح التشكيلة
                    </motion.button>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        layout
                        key={`${item.id}-${item.color}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 p-4 bg-main rounded-md border border-border-subtle transition-smooth"
                      >
                        <div className="relative w-20 h-24 rounded-sm overflow-hidden bg-surface flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-noir line-clamp-1">
                              {item.name}
                            </h4>
                            {item.color && (
                              <p className="text-xs text-muted">اللون: {item.color}</p>
                            )}
                            <p className="text-sm font-extrabold text-noir">
                              {item.price} ر.س
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-border-subtle rounded-md overflow-hidden bg-card">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-2 hover:bg-surface transition-smooth text-noir"
                                aria-label="تقليل"
                              >
                                <Minus size={12} />
                              </motion.button>
                              <span className="px-3 text-xs font-bold text-noir">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-2 hover:bg-surface transition-smooth text-noir"
                                aria-label="زيادة"
                              >
                                <Plus size={12} />
                              </motion.button>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeItem(item.id)}
                              className="text-muted hover:text-rose-600 transition-smooth p-1.5"
                              aria-label="حذف"
                            >
                              <Trash2 size={15} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-border-subtle bg-card space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">المجموع الفرعي</span>
                    <span className="font-extrabold text-noir text-base">
                      {totalAmount.toFixed(2)} ر.س
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    الضرائب والشحن الفاخر المجاني يتم احتسابها عند إتمام الطلب.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert(`تم استلام طلبك بنجاح بقيمة ${totalAmount.toFixed(2)} ر.س! شكراً لثقتكم بدار الأصالة.`)}
                    className="w-full py-4 bg-noir text-white text-xs font-bold rounded-md hover:bg-accent transition-smooth shadow-sm"
                  >
                    متابعة الشراء وإنهاء الطلب
                  </motion.button>

                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs text-muted hover:text-noir transition-smooth underline py-1"
                  >
                    تفريغ الحقيبة
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
