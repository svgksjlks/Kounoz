'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroBannerSlider } from '../components/HeroBannerSlider';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product, CATEGORIES } from '../types';
import { getProducts } from '../lib/api';
import { Sparkles, Layers, ShieldCheck, Feather, Truck, Award } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { dir } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('جميع القطع');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData(isInitial = false) {
      if (isInitial) setLoading(true);
      const data = await getProducts(selectedCategory);
      setProducts(data);
      setLoading(false);
    }
    loadData(products.length === 0);

    const handleUpdate = () => {
      loadData(false);
    };
    window.addEventListener('kounoz_products_updated', handleUpdate);
    return () => window.removeEventListener('kounoz_products_updated', handleUpdate);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-main" dir={dir}>
      {/* Navbar */}
      <Navbar
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main>
        {/* Luxury Promotional Banners Slider (قبل جزئية الفيديو) */}
        <HeroBannerSlider />

        {/* Grand Luxury Hero Section (جزئية الفيديو التعريفي) */}
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
                <h4 className="font-bold text-xs sm:text-sm text-noir">تصاميم مميزه</h4>
                <p className="text-[10px] sm:text-[11px] text-muted"> تشكيله كبيره</p>
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
              {['جميع القطع', 'تخفيضات', 'وصل حديثاً', 'كولكشن الشتوي', 'كولكشن الصيفي'].map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-xs font-semibold tracking-wide transition-smooth whitespace-nowrap ${selectedCategory === cat
                    ? 'bg-accent text-gray-200 shadow-md shadow-accent/30 border border-accent-hover/50'
                    : 'bg-card text-muted border border-border-subtle hover:text-noir hover:border-accent hover:bg-surface'
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
            <div
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
            </div>
          )}

          {/* Luxury Editorial Heritage Banner — لوحة بانل نبيتي فاخرة */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 sm:mt-28 p-8 sm:p-14 rounded-xl bg-gradient-to-r from-[#5A081D] via-[#7A0C28] to-[#5A081D] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 border border-[#9E193C]/40 shadow-2xl"
          >
            <div className="space-y-4 max-w-xl z-10 text-right">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/15 border border-white/30 text-xs text-rose-100 font-semibold tracking-wide">
                <Sparkles size={13} className="text-amber-300" />
                حرفية وخياطة متوارثة
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                فخامة التطريز اليدوي والأقمشة الطبيعية الأصيلة
              </h3>
              <p className="text-rose-100/90 text-xs sm:text-sm leading-relaxed font-normal">
                نختار بعناية فائقة أنقى خامات القطن والكتان وصوف الجوخ، ونحيكها بأيدي أمهر الحرفيين لنقدم لك قطعاً تليق بأرقى المناسبات وتعكس وقار الرجل العربي.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#collection"
                  className="inline-block px-7 py-3.5 bg-white text-[#7A0C28] hover:bg-rose-50 text-xs font-bold rounded-md shadow-lg transition-smooth"
                >
                  استعراض التشكيلة كاملة
                </Link>
              </motion.div>
            </div>

            <div className="w-full md:w-auto flex items-center justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-dashed border-white/30 flex items-center justify-center bg-white/10">
                <Layers size={42} className="text-white stroke-1" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* About & Heritage Section — كنوز للثوب العربي */}
        <section id="about" className="py-20 sm:py-28 bg-card/85 backdrop-blur-md border-t border-border-subtle relative overflow-hidden">
          {/* Subtle burgundy ambient glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7A0C28]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#7A0C28]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-6 sm:px-10 text-right space-y-8 relative z-10">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/20 border border-accent/40 text-rose-300 text-xs font-bold tracking-wider">
                <Sparkles size={12} />
                أكثر من 20 عاماً من الخبرة
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-noir font-bold leading-tight">
                كنوز للثوب العربي
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border-subtle space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-noir flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  أناقة عربية بروح عصرية
                </h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed font-normal">
                  كنوز علامة متخصصة في صناعة الثوب العربي، تستند إلى خبرة تمتد لأكثر من 20 عامًا في عالم الأقمشة والتفصيل وصناعة الأثواب، حيث تجتمع الخبرة الطويلة مع الاهتمام بأدق التفاصيل لتقديم ثوب يعكس الأناقة العربية بروح عصرية.
                </p>
                <p className="text-muted text-xs sm:text-sm leading-relaxed font-normal">
                  نؤمن في كنوز بأن الثوب ليس مجرد لباس، بل هو تعبير عن الهوية والذوق والحضور. لذلك نحرص على اختيار الأقمشة بعناية، ودقة القصّ والتفصيل، وجودة الخياطة والتشطيب، مع تطوير تصاميم تجمع بين أصالة الثوب العربي وأناقة التصميم الحديث.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border-subtle space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-noir flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    خبرة عالمية متعددة الأسواق
                  </h3>
                  <p className="text-muted text-xs sm:text-sm leading-relaxed font-normal">
                    على مدار أكثر من عقدين، اكتسبنا خبرة واسعة في فهم احتياجات عملائنا واختلاف الأذواق والأسواق، وهو ما نترجمه اليوم في كل قطعة تحمل اسم كنوز.
                  </p>
                </div>

                {/* Countries tags */}
                <div className="p-4 rounded-xl bg-surface/80 border border-border-subtle space-y-2">
                  <p className="text-xs font-bold text-noir">
                    كنوز — أكثر من 20 عامًا من الخبرة في:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-md bg-accent/25 border border-accent/40 text-rose-200 text-xs font-bold">
                      🇨🇳 الصين
                    </span>
                    <span className="px-3 py-1 rounded-md bg-accent/25 border border-accent/40 text-rose-200 text-xs font-bold">
                      🇹🇷 تركيا
                    </span>
                    <span className="px-3 py-1 rounded-md bg-accent/25 border border-accent/40 text-rose-200 text-xs font-bold">
                      🇪🇬 مصر
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-300/80 pt-1 font-medium">
                    نصنع فيها الأناقة ونحافظ على الأصالة.
                  </p>
                </div>
              </div>
            </div>
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
