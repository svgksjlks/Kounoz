'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHeroImages, getHeroBadge, getHeroVideo, DEFAULT_HERO_VIDEO } from '../lib/api';

const DEFAULT_IMAGE = '/products/1/1.png';

export function HeroSection() {
  // ── Hydration-safe: render defaults first, then hydrate from localStorage ──
  const [mounted, setMounted]         = useState(false);
  const [images, setImages]           = useState<string[]>([
    '/products/1/1.png',
    '/products/1/2.png',
    '/products/1/3.png',
    '/products/1/4.png',
  ]);
  const [badge, setBadge]             = useState({ name: 'جلابية كنوز الملكية', material: 'قطن مصري 100% نقي' });
  const [activeIdx, setActiveIdx]     = useState(0);
  const [videoUrl, setVideoUrl]       = useState(DEFAULT_HERO_VIDEO);

  useEffect(() => {
    setMounted(true);
    // Read from localStorage only on client
    const savedImages = getHeroImages();
    if (savedImages?.length) setImages(savedImages);
    const savedBadge = getHeroBadge();
    if (savedBadge) setBadge(savedBadge);
    const savedVideo = getHeroVideo();
    if (savedVideo) setVideoUrl(savedVideo);

    const handleUpdate = () => {
      const imgs = getHeroImages();
      if (imgs?.length) setImages(imgs);
      const b = getHeroBadge();
      if (b) setBadge(b);
      const v = getHeroVideo();
      if (v) setVideoUrl(v);
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
                className="px-9 py-4 bg-accent text-white text-xs font-bold rounded-md hover:bg-accent-hover transition-smooth shadow-lg shadow-accent/30 border border-accent-hover/40 flex items-center gap-2.5"
              >
                اكتشف المجموعة
                <ArrowDown size={14} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#collection"
                className="px-9 py-4 bg-card border border-border-subtle text-noir text-xs font-bold rounded-md hover:border-accent hover:text-accent hover:bg-surface transition-smooth shadow-sm flex items-center gap-2"
              >
                <Sparkles size={13} className="text-accent" />
                وصل حديثًا
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Left: Luxury Video Showcase (Loop + Autoplay) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="lg:col-span-5 flex flex-col gap-3"
        >
          {/* Main Video Frame */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border-subtle bg-surface shadow-2xl group">
            <video
              key={mounted ? videoUrl : 'default-hero'}
              src={mounted ? videoUrl : DEFAULT_HERO_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Floating Bottom Card */}
            <div className="absolute bottom-5 right-5 left-5 p-4 rounded-xl bg-card/95 backdrop-blur-md border border-border-subtle flex items-center justify-between text-noir shadow-2xl z-10">
              <div className="flex flex-col text-right">
                <span className="text-xs sm:text-sm font-bold text-noir tracking-wide">
                  {mounted ? badge.name : 'جلابية كنوز الملكية'}
                </span>
                <span className="text-[11px] text-muted font-medium">
                  {mounted ? badge.material : 'قطن مصري 100% نقي'}
                </span>
              </div>
              <Link
                href="/products/1"
                className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-bold transition-all shadow-md shadow-accent/20"
              >
                عرض التفاصيل
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
