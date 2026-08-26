'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SideNav } from './SideNav';
import { AnnouncementBar } from './AnnouncementBar';
import { motion } from 'framer-motion';

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function Navbar({ activeCategory, onSelectCategory }: NavbarProps) {
  const { openCart, totalItems } = useCart();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', href: '/', category: 'جميع القطع' },
    { label: 'تخفيضات الصيفي', href: '/#collection', category: 'أثواب ملكية' },
    { label: 'وصل حديثاً', href: '/#collection', category: 'جميع القطع' },
    { label: 'عبايات', href: '/#collection', category: 'جلابيب كلاسيكية' },
    { label: 'من نحن', href: '/#about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-main/95 backdrop-blur-md border-b border-border-subtle transition-smooth">
        {/* Top Scrolling Announcement Ticker */}
        <AnnouncementBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-20 sm:h-24 flex items-center justify-between">
          {/* Right side: Hamburger Menu & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-5">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsSideNavOpen(true)}
              className="p-2 sm:p-2.5 rounded-md text-noir hover:bg-surface border border-border-subtle transition-smooth flex items-center gap-2 text-xs font-bold"
              aria-label="فتح القائمة الجانبية"
            >
              <Menu size={18} />
              <span className="hidden sm:inline">القائمة</span>
            </motion.button>

            {/* Brand Logo & Name */}
            <Link href="/" className="group flex items-center gap-2.5 transition-smooth">
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex-shrink-0">
                <Image
                  src="/kounoz-logo.png"
                  alt="شعار كنوز KOUNOZ"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-noir tracking-wide group-hover:text-accent transition-smooth leading-none">
                  كنوز
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-muted font-bold uppercase mt-0.5">
                  KOUNOZ
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Main Navigation Links matching requested design */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse text-sm font-semibold text-muted">
            {navLinks.map((item) => {
              const isActive = item.category ? activeCategory === item.category : false;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    if (item.category && onSelectCategory) {
                      onSelectCategory(item.category);
                    }
                  }}
                  className={`hover:text-noir transition-smooth relative py-2 tracking-wide text-sm font-bold ${
                    isActive ? 'text-noir' : 'text-muted'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-noir rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Left side: Actions (Cart, User, Search, 3D Studio) */}
          <div className="flex items-center space-x-3 sm:space-x-4 space-x-reverse">
            {/* Search Button */}
            <button
              onClick={() => setIsSideNavOpen(true)}
              className="p-2 sm:p-2.5 rounded-md text-muted hover:text-noir hover:bg-surface transition-smooth"
              aria-label="البحث"
            >
              <Search size={18} />
            </button>

            {/* User Profile / Login Button */}
            <Link
              href="/login"
              className="p-2 sm:p-2.5 rounded-md text-muted hover:text-noir hover:bg-surface transition-smooth"
              aria-label="تسجيل الدخول / حسابي"
              title="تسجيل الدخول / حسابي"
            >
              <User size={18} />
            </Link>

            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={openCart}
              className="relative p-2 sm:p-2.5 rounded-md text-noir hover:bg-surface border border-border-subtle transition-smooth group"
              aria-label="حقيبة المشتريات"
            >
              <ShoppingBag size={18} className="group-hover:scale-105 transition-smooth" />
              {mounted && totalItems > 0 ? (
                <span className="absolute -top-1.5 -left-1.5 bg-noir text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in">
                  {totalItems}
                </span>
              ) : (
                <span className="absolute -top-1.5 -left-1.5 bg-surface text-noir text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-border-subtle">
                  0
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Slide-out SideNav */}
      <SideNav
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
        onSelectCategory={onSelectCategory}
      />
    </>
  );
}
