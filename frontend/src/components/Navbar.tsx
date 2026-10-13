'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, Search, User, Globe, LogOut, ShieldCheck } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { SideNav } from './SideNav';
import { AnnouncementBar } from './AnnouncementBar';
import { motion } from 'framer-motion';
import { getAuthenticatedUser, logoutCustomer, logoutAdmin } from '../lib/api';

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function Navbar({ activeCategory, onSelectCategory }: NavbarProps) {
  const { openCart, totalItems } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setCurrentUser(getAuthenticatedUser());
    };
    update();
    window.addEventListener('kounoz_auth_changed', update);
    return () => window.removeEventListener('kounoz_auth_changed', update);
  }, []);

  const navLinks = [
    { label: t('home'), href: '/', category: 'جميع القطع' },
    { label: t('discounts'), href: '/#collection', category: 'تخفيضات' },
    { label: t('new_arrivals'), href: '/#collection', category: 'وصل حديثاً' },
    { label: t('winter_collection'), href: '/#collection', category: 'كولكشن الشتوي' },
    { label: t('summer_collection'), href: '/#collection', category: 'كولكشن الصيفي' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-border-subtle transition-smooth">
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
            <Link href="/" className="group flex items-center gap-3 transition-smooth">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#FAF6EE] p-1.5 border border-[#D4AF37]/50 shadow-[0_2px_10px_rgba(212,175,55,0.15)] flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 group-hover:border-[#7A0C28] group-hover:shadow-[0_4px_16px_rgba(122,12,40,0.25)] transition-all duration-300">
                <Image
                  src="/kounoz-logo.png"
                  alt="شعار كنوز KOUNOZ"
                  fill
                  priority
                  className="object-contain p-1"
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
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-sm font-semibold text-muted">
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
                  className={`transition-smooth relative py-2 tracking-wide text-sm ${
                    isActive ? 'text-noir font-bold' : 'text-muted hover:text-accent font-semibold'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-accent rounded-full animate-fade-in shadow-[0_0_8px_rgba(122,12,40,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Left side: Actions (Language, Search, User, Cart) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Language Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs font-bold text-noir hover:text-accent hover:bg-surface border border-border-subtle hover:border-accent transition-smooth flex items-center gap-1.5 shadow-sm"
              aria-label={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
              title={language === 'ar' ? 'English' : 'العربية'}
            >
              <Globe size={15} className="text-accent" />
              <span className="font-bold text-[11px] tracking-wider uppercase">
                {language === 'ar' ? 'EN' : 'عربي'}
              </span>
            </motion.button>

            {/* Search Button */}
            <button
              onClick={() => setIsSideNavOpen(true)}
              className="p-2 sm:p-2.5 rounded-md text-muted hover:text-noir hover:bg-surface transition-smooth"
              aria-label={t('search')}
              title={t('search')}
            >
              <Search size={18} />
            </button>

            {/* Dedicated Admin Login Button */}
            {currentUser?.is_admin ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FAF6EE] text-[#7A0C28] hover:bg-[#7A0C28] hover:text-white rounded-md border border-[#D4AF37]/50 text-xs font-bold transition-all shadow-sm"
                  title="لوحة تحكم الإدارة"
                >
                  <ShieldCheck size={14} className="text-[#D4AF37]" />
                  <span>لوحة التحكم</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logoutAdmin();
                    logoutCustomer();
                    signOut({ redirect: false });
                  }}
                  className="p-1.5 sm:p-2 rounded-md text-red-600 hover:bg-red-50 transition-smooth"
                  aria-label="تسجيل خروج الأدمن"
                  title="تسجيل خروج الأدمن"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-surface hover:bg-card text-muted hover:text-noir rounded-md border border-border-subtle hover:border-[#D4AF37] text-xs font-bold transition-smooth shadow-sm"
                title="تسجيل دخول الأدمن"
              >
                <ShieldCheck size={14} className="text-[#D4AF37]" />
                <span className="hidden sm:inline">دخول الأدمن</span>
              </Link>
            )}

            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={openCart}
              className="relative p-2 sm:p-2.5 rounded-md text-noir hover:bg-surface border border-border-subtle transition-smooth group"
              aria-label={t('cart')}
              title={t('cart')}
            >
              <ShoppingBag size={18} className="group-hover:scale-105 group-hover:text-accent transition-smooth" />
              {mounted && totalItems > 0 ? (
                <span className="absolute -top-1.5 -left-1.5 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in shadow-sm shadow-accent/40">
                  {totalItems}
                </span>
              ) : (
                <span className="absolute -top-1.5 -left-1.5 bg-surface text-muted text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-border-subtle">
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
