'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft } from 'lucide-react';
import { getBannerSlides, DEFAULT_BANNER_SLIDES } from '../lib/api';

interface HeroBannerSliderProps {
  className?: string;
}

export function HeroBannerSlider({ className = '' }: HeroBannerSliderProps) {
  const [mounted, setMounted] = useState(false);
  const [slides, setSlides] = useState<string[]>(DEFAULT_BANNER_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = getBannerSlides();
    if (saved && saved.length > 0) {
      setSlides(saved);
    }

    const handleUpdate = () => {
      const updated = getBannerSlides();
      if (updated && updated.length > 0) {
        setSlides(updated);
        setCurrentIndex(0);
      }
    };
    window.addEventListener('kounoz_banners_updated', handleUpdate);
    return () => window.removeEventListener('kounoz_banners_updated', handleUpdate);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isHovered, currentIndex]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const nextIndex = prev + newDirection;
      if (nextIndex < 0) return slides.length - 1;
      if (nextIndex >= slides.length) return 0;
      return nextIndex;
    });
  };

  const currentSlide = slides[currentIndex] || slides[0] || DEFAULT_BANNER_SLIDES[0];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.45 },
        scale: { duration: 0.45 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  };

  return (
    <section
      aria-label="سلايدر العروض والبانرات الترويجية"
      className={`relative w-full overflow-hidden bg-main border-b border-border-subtle ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Banner Frame with 16:9 responsive aspect ratio */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[540px] rounded-2xl overflow-hidden bg-[#5A081D] border border-[#9E193C]/40 shadow-xl group">
          <Link href="#collection" className="block w-full h-full cursor-pointer">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={currentSlide}
                  alt={`بانر ترويجي كنوز ${currentIndex + 1}`}
                  fill
                  priority={currentIndex === 0}
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  unoptimized={currentSlide.startsWith('data:')}
                />
              </motion.div>
            </AnimatePresence>
          </Link>

          {/* Top Subtle Luxury Badge */}
          <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold shadow-lg">
              <Sparkles size={12} className="text-[#C5A059] animate-pulse" />
              <span>كنوز KOUNOZ</span>
            </div>
          </div>

          {/* Slide Indicator Badge (e.g., 01 / 02) */}
          <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-20 pointer-events-none">
            <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-[10px] sm:text-xs font-mono font-bold tracking-wider">
              {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
          </div>

          {/* Navigation Arrows (Prev / Next) */}
          {slides.length > 1 && (
            <>
              {/* Right Arrow (in RTL = Previous / back) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  paginate(-1);
                }}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md border border-white/25 flex items-center justify-center shadow-xl transition-all opacity-80 group-hover:opacity-100"
                aria-label="الشريحة السابقة"
              >
                <ChevronRight size={22} className="text-white" />
              </motion.button>

              {/* Left Arrow (in RTL = Next / forward) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  paginate(1);
                }}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md border border-white/25 flex items-center justify-center shadow-xl transition-all opacity-80 group-hover:opacity-100"
                aria-label="الشريحة التالية"
              >
                <ChevronLeft size={22} className="text-white" />
              </motion.button>
            </>
          )}

          {/* Bottom Indicators & Quick Shop CTA */}
          <div className="absolute bottom-3 sm:bottom-5 inset-x-0 z-20 px-4 sm:px-6 flex items-center justify-between pointer-events-none">
            {/* Dots Pagination */}
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'w-6 sm:w-8 bg-[#C5A059] shadow-md shadow-[#C5A059]/40'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`الانتقال للشريحة ${idx + 1}`}
                />
              ))}
            </div>

            {/* Quick Explore Link */}
            <Link
              href="#collection"
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#7A0C28] text-[11px] sm:text-xs font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>تسوق التشكيلة</span>
              <ArrowLeft size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
