'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product, CATEGORIES } from '../types';
import { getProducts } from '../lib/api';
import { Sparkles, Layers, ShieldCheck, Feather, Truck, Award } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('جميع القطع');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getProducts(selectedCategory);
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-main" dir="rtl">
      {/* Navbar */}
      <Navbar
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main>
        {/* Grand Luxury Hero Section */}
        <HeroSection />

        {/* Brand Value Pillars */}
        <section className="border-b border-border-subtle bg-card py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="flex items-center gap-3 text-right">
              <div className="p-2.5 sm:p-3 rounded-md bg-main text-accent border border-border-subtle flex-shrink-0">
                <Feather size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-noir">أقمشة طبيعية 100%</h4>
                <p className="text-[10px] sm:text-[11px] text-muted">قطن مصري وصوف إنجليزي</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div className="p-2.5 sm:p-3 rounded-md bg-main text-accent border border-border-subtle flex-shrink-0">
                <Award size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-noir">خياطة يدوية دقيقة</h4>
                <p className="text-[10px] sm:text-[11px] text-muted">تطريز تراثي متقن</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div className="p-2.5 sm:p-3 rounded-md bg-main text-accent border border-border-subtle flex-shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-noir">مقاسات مضبوطة ومثالية</h4>
                <p className="text-[10px] sm:text-[11px] text-muted">قصّات عربية مدروسة بعناية</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div className="p-2.5 sm:p-3 rounded-md bg-main text-accent border border-border-subtle flex-shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-noir">شحن فاخر وسريع</h4>
                <p className="text-[10px] sm:text-[11px] text-muted">تغليف كونسيرج فاخر</p>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section with 2-cards-per-row on mobile and balanced spacing */}
        <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-widest text-accent font-bold">
                تشكيلة كنوز الفاخرة
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-noir font-bold">
                القطع الـ 10 الدائمة
              </h2>
            </div>

            {/* Category Filter Pills (Horizontal scroll on small mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-xs font-semibold tracking-wide transition-smooth whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-noir text-white shadow-sm'
                      : 'bg-card text-muted border border-border-subtle hover:text-noir hover:border-noir hover:bg-surface'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 
            CRITICAL MOBILE REQUIREMENT:
            - grid-cols-2 on Mobile (2 products per row)
            - gap-3.5 on mobile for balanced spacing
            - Clean, non-bulky card proportions
          */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-surface rounded-md sm:rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Luxury Editorial Heritage Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 sm:mt-28 p-8 sm:p-14 rounded-xl bg-noir text-main relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 border border-noir shadow-lg"
          >
            <div className="space-y-4 max-w-xl z-10 text-right">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 text-xs text-white font-semibold tracking-wide">
                <Sparkles size={13} className="text-accent" />
                حرفية وخياطة متوارثة
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                فخامة التطريز اليدوي والأقمشة الطبيعية الأصيلة
              </h3>
              <p className="text-lighttext text-xs sm:text-sm leading-relaxed font-normal">
                نختار بعناية فائقة أنقى خامات القطن والكتان وصوف الجوخ، ونحيكها بأيدي أمهر الحرفيين لنقدم لك قطعاً تليق بأرقى المناسبات وتعكس وقار الرجل العربي.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#collection"
                  className="inline-block px-7 py-3.5 bg-card text-noir text-xs font-bold rounded-md hover:bg-accent hover:text-white transition-smooth shadow-sm"
                >
                  استعراض التشكيلة كاملة
                </Link>
              </motion.div>
            </div>

            <div className="w-full md:w-auto flex items-center justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                <Layers size={42} className="text-accent stroke-1" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* About & Heritage Section */}
        <section id="about" className="py-20 sm:py-24 bg-card border-t border-border-subtle">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 text-center space-y-6 sm:space-y-8">
            <span className="text-xs uppercase tracking-widest text-accent font-bold">
              قصة كنوز KOUNOZ
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-noir font-bold leading-tight">
              أصالة الماضي بدقة الحاضر
            </h2>
            <p className="text-muted text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              تأسست علامة كنوز KOUNOZ لتكون المرجع الأول للرجل العربي الباحث عن التميز والوقار.
              نجمع بين براعة الخياطة التراثية وأفخر الأقمشة الطبيعية، لنقدم لك قطعاً خالدة تدوم لأجيال.
            </p>
          </div>
        </section>
      </main>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
