'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Home,
  Sparkles,
  Layers,
  Percent,
  Info,
  Search,
  User,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { getAdminUser, isAdminEmail, getStoreSettings } from '../lib/api';
import { useSession } from 'next-auth/react';
import { useLanguage } from '../context/LanguageContext';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenSearch?: () => void;
  onOpenAuth?: () => void;
}

export function SideNav({
  isOpen,
  onClose,
  onSelectCategory,
  onOpenSearch,
  onOpenAuth,
}: SideNavProps) {
  const { data: session } = useSession();
  const { language, toggleLanguage, dir, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [storeSettings, setStoreSettings] = useState(() => getStoreSettings());

  useEffect(() => {
    const user = getAdminUser();
    setAdminUser(user);
    setStoreSettings(getStoreSettings());

    const handleAuth = () => {
      setAdminUser(getAdminUser());
    };
    const handleSettings = () => {
      setStoreSettings(getStoreSettings());
    };

    window.addEventListener('kounoz_auth_changed', handleAuth);
    window.addEventListener('kounoz_settings_updated', handleSettings);
    return () => {
      window.removeEventListener('kounoz_auth_changed', handleAuth);
      window.removeEventListener('kounoz_settings_updated', handleSettings);
    };
  }, []);

  const isCurrentAdmin = !!(
    (session?.user?.email && isAdminEmail(session.user.email)) ||
    (adminUser?.email && isAdminEmail(adminUser.email))
  );

  // Lock body scroll & listen for ESC key on desktop
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const menuItems = [
    { label: t('home'), href: '/', icon: Home, category: 'جميع القطع' },
    { label: t('discounts'), href: '/#collection', icon: Tag, category: 'تخفيضات' },
    { label: t('new_arrivals'), href: '/#collection', icon: Sparkles, category: 'وصل حديثاً' },
    { label: t('winter_collection'), href: '/#collection', icon: Layers, category: 'كولكشن الشتوي' },
    { label: t('summer_collection'), href: '/#collection', icon: Percent, category: 'كولكشن الصيفي' },
    { label: t('about_us'), href: '/#about', icon: Info },
  ];

  const handleNavClick = (category?: string) => {
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`البحث عن: ${searchQuery}`);
      onClose();
    }
  };

  // Handle touch swipe to close (Swipe right in RTL)
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 80 || info.velocity.x > 400) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" dir={dir}>
          {/* Subtle Desktop & Mobile Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-noir/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            {/* Non-intrusive Desktop Slide-over Drawer with fixed elegant width */}
            <motion.div
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ right: 0.6, left: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="w-screen max-w-full sm:max-w-md bg-card shadow-2xl flex flex-col border-l border-border-subtle overflow-y-auto overscroll-contain z-10"
            >
              {/* Mobile Drag Indicator */}
              <div className="sm:hidden w-full flex justify-center pt-2 pb-1 bg-main">
                <div className="w-10 h-1 rounded-full bg-border-focus/20" />
              </div>

              {/* Header with Esc shortcut info on desktop and clear close button */}
              <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-main">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-[#FAF6EE] p-1 border border-[#D4AF37]/50 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                    <Image
                      src="/kounoz-logo.png"
                      alt="شعار كنوز"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-2xl font-bold text-noir leading-none">كنوز</span>
                    <span className="text-[10px] text-muted tracking-widest uppercase font-semibold mt-0.5">
                      KOUNOZ
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-[10px] text-muted px-2 py-1 rounded bg-card border border-border-subtle">
                    ESC
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-border-subtle hover:border-noir text-noir text-xs font-bold transition-smooth shadow-sm"
                    aria-label="إغلاق القائمة"
                  >
                    <span>إغلاق</span>
                    <X size={15} />
                  </motion.button>
                </div>
              </div>

              {/* Quick Search Bar */}
              <div className="p-6 border-b border-border-subtle">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن جلابية، ثوب، خامة..."
                    className="w-full pl-10 pr-4 py-3 bg-surface text-noir placeholder-muted text-xs rounded-md border border-border-subtle focus:border-noir focus:outline-none transition-smooth"
                  />
                  <button
                    type="submit"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-noir transition-smooth p-1"
                    aria-label="بحث"
                  >
                    <Search size={16} />
                  </button>
                </form>
              </div>

              {/* Main Navigation Links */}
              <nav className="p-6 space-y-1 border-b border-border-subtle">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={item.label} whileTap={{ scale: 0.98 }}>
                      <Link
                        href={item.href}
                        onClick={() => handleNavClick(item.category)}
                        className="flex items-center justify-between p-3.5 rounded-md hover:bg-surface text-noir text-sm font-semibold transition-smooth group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={17} className="text-muted group-hover:text-accent transition-smooth" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronLeft size={15} className="text-muted group-hover:text-noir transition-smooth opacity-50 group-hover:opacity-100" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Admin Access Link */}
              <div className="p-6 border-b border-border-subtle space-y-2.5">
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="w-full flex items-center justify-between p-3.5 rounded-md bg-[#1C1610] hover:bg-[#7A0C28] text-white text-xs font-bold transition-smooth shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={16} className="text-[#D4AF37]" />
                    <span>{isCurrentAdmin ? '👑 لوحة تحكم الإدارة (Admin)' : 'تسجيل دخول الإدارة (Admin Login)'}</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">
                    {isCurrentAdmin ? 'المدير' : 'دخول الأدمن'}
                  </span>
                </Link>
              </div>

              {/* Need Help Section (تحتاج للمساعدة؟) */}
              <div className="p-6 border-b border-border-subtle space-y-3 bg-main/40">
                <p className="text-xs font-bold text-noir tracking-wider">
                  {language === 'ar' ? 'تحتاج للمساعدة؟' : 'Need Help?'}
                </p>
                <div className="space-y-2.5 text-xs text-muted">
                  <a
                    href={`tel:${storeSettings.store_phone || storeSettings.whatsapp_number || '01022822123'}`}
                    className="flex items-center gap-3 hover:text-noir transition-smooth py-1"
                  >
                    <div className="p-1.5 rounded bg-card border border-border-subtle text-accent">
                      <Phone size={13} />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-semibold text-noir">
                        {language === 'ar' ? 'الاتصال المباشر' : 'Direct Call'}
                      </span>
                      <span dir="ltr" className="text-muted text-[11px] font-mono">
                        {storeSettings.store_phone || storeSettings.whatsapp_number || '01022822123'}
                      </span>
                    </div>
                  </a>
                  <a
                    href={`mailto:${storeSettings.store_email || 'Kounozthobe@gmail.com'}`}
                    className="flex items-center gap-3 hover:text-noir transition-smooth py-1"
                  >
                    <div className="p-1.5 rounded bg-card border border-border-subtle text-accent">
                      <Mail size={13} />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-semibold text-noir">
                        {language === 'ar' ? 'التواصل بالبريد' : 'Email Support'}
                      </span>
                      <span className="text-muted text-[11px] font-mono">
                        {storeSettings.store_email || 'Kounozthobe@gmail.com'}
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Language Selector (اللغة العربية) */}
              <div className="p-6 mt-auto flex items-center justify-between text-xs text-muted bg-main/20">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-accent" />
                  <span className="font-semibold text-noir">العربية (مصر)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-card border border-border-subtle text-[10px] font-bold text-noir shadow-sm">
                  EGP ج.م
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
