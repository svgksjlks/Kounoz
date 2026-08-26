'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHeroImages, getHeroBadge } from '../lib/api';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=1000&q=85';

export function HeroSection() {
  // ── Hydration-safe: render defaults first, then hydrate from localStorage ──
  const [mounted, setMounted]         = useState(false);
  const [images, setImages]           = useState<string[]>([DEFAULT_IMAGE, '', '', '']);
  const [badge, setBadge]             = useState({ name: 'جلابية كنوز الملكية', material: 'قطن مصري 100% نقي' });
  const [activeIdx, setActiveIdx]     = useState(0);

  useEffect(() => {
    setMounted(true);
    // Read from localStorage only on client
    const savedImages = getHeroImages();
    if (savedImages?.length) setImages(savedImages);
    const savedBadge = getHeroBadge();
    if (savedBadge) setBadge(savedBadge);

    const handleUpdate = () => {
      const imgs = getHeroImages();
      if (imgs?.length) setImages(imgs);
      const b = getHeroBadge();
      if (b) setBadge(b);
      setActiveIdx(0);
    };
    window.addEventListener('kounoz_hero_updated', handleUpdate);
    return () => window.removeEventListener('kounoz_hero_updated', handleUpdate);
  }, []);

  // Filled images only (non-empty strings)
  const filledImages = images.filter(Boolean);
  // Displayed main image: before mount use default to avoid hydration mismatch
  const mainImage = mounted
    ? (filledImages[activeIdx] || filledImages[0] || DEFAULT_IMAGE)
    : DEFAULT_IMAGE;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-main border-b border-border-subtle">
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* ── Right: Text & CTAs ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 text-right space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border-subtle text-noir text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              كنوز KOUNOZ — الموسم الجديد
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl sm:text-6xl md:text-7xl text-noir font-bold tracking-tight leading-[1.2]"
          >
            أصالة المظهر، <br />
            <span className="italic font-normal text-accent">وهيبة الحضور.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-lg text-base sm:text-lg text-muted leading-relaxed font-normal"
          >
            جلابيب وأثواب عربية فاخرة محاكة يدوياً من أنقى خيوط القطن وصوف الجوخ لتعكس وقار الرجل العربي.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#collection"
                className="px-9 py-4 bg-noir text-white text-xs font-bold rounded-md hover:bg-accent transition-smooth shadow-sm flex items-center gap-2.5"
              >
                اكتشف المجموعة
                <ArrowDown size={14} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#collection"
                className="px-9 py-4 bg-card border border-border-subtle text-noir text-xs font-bold rounded-md hover:border-noir hover:bg-surface transition-smooth shadow-sm flex items-center gap-2"
              >
                <Sparkles size={13} className="text-accent" />
                وصل حديثًا
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Left: 4-Image Gallery ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="lg:col-span-5 flex flex-col gap-3"
        >
          {/* Main image frame */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border-subtle bg-surface shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={mainImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <Image
                  src={mainImage}
                  alt="جلابية عربية فاخرة مطرزة"
                  fill
                  priority
                  unoptimized={mainImage.startsWith('data:')}
                  className="object-cover object-top hover:scale-105 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-transparent pointer-events-none" />

            {/* Floating badge */}
            <div className="absolute bottom-5 right-5 left-5 p-4 rounded-md bg-card/90 backdrop-blur-md border border-border-subtle flex items-center justify-between text-noir shadow-sm">
              <div className="flex flex-col">
                <span className="text-xs font-bold">{mounted ? badge.name : 'جلابية كنوز الملكية'}</span>
                <span className="text-[11px] text-muted">{mounted ? badge.material : 'قطن مصري 100% نقي'}</span>
              </div>
              <Link
                href="/products/1"
                className="px-3.5 py-1.5 rounded bg-noir text-white text-[11px] font-bold hover:bg-accent transition-smooth"
              >
                عرض التفاصيل
              </Link>
            </div>
          </div>

          {/* Thumbnails row — only show if there are ≥ 2 filled images */}
          {mounted && filledImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((idx) => {
                const url = images[idx] || '';
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!url}
                    onClick={() => url && setActiveIdx(idx)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${
                      !url
                        ? 'border-border-subtle opacity-25 cursor-default bg-surface'
                        : isActive
                        ? 'border-accent ring-2 ring-accent/40 scale-105 shadow-sm'
                        : 'border-border-subtle opacity-70 hover:opacity-100 hover:border-noir'
                    }`}
                  >
                    {url ? (
                      <Image
                        src={url}
                        alt={`زاوية ${idx + 1}`}
                        fill
                        unoptimized={url.startsWith('data:')}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted text-[10px] font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
