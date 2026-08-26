'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  User,
  Compass,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  PackageCheck,
  Phone,
  Mail,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product, Category, CATEGORIES } from '../types';
import { getProducts, getAdminUser, isAdminEmail } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export function BottomNavBar() {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<string>('جميع القطع');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      const items = await getProducts();
      setAllProducts(items);
      const user = getAdminUser();
      setAdminUser(user);
    }
    loadData();

    // Listen for storage / login updates
    const handleUpdate = () => {
      setAdminUser(getAdminUser());
    };
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  // Filter products for Search Modal
  const filteredSearchResults = allProducts.filter((product) => {
    const matchesCategory =
      selectedSearchCategory === 'جميع القطع' || product.category === selectedSearchCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.material?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const isHome = pathname === '/';

  return (
    <>
      {/* ── Fixed Bottom Navigation Bar ───────────────────────────── */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border-subtle shadow-[0_-8px_30px_rgba(28,22,16,0.08)] transition-all duration-300"
        dir="rtl"
      >
        <div className="max-w-md mx-auto px-4 h-16 sm:h-18 flex items-center justify-around">
          {/* 1. التسوق (Shop / Home) */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-smooth group relative ${
              isHome && !isSearchOpen && !isAccountOpen ? 'text-[#AD8A55]' : 'text-muted hover:text-noir'
            }`}
          >
            <motion.div whileTap={{ scale: 0.85 }} className="relative flex flex-col items-center">
              <Compass
                size={22}
                className={`transition-transform duration-300 ${
                  isHome && !isSearchOpen && !isAccountOpen ? 'stroke-[2.5px] scale-110' : 'group-hover:scale-105'
                }`}
              />
              <span className="text-[10px] sm:text-[11px] font-bold mt-1 tracking-tight">
                التسوق
              </span>
              {isHome && !isSearchOpen && !isAccountOpen && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#AD8A55]" />
              )}
            </motion.div>
          </Link>

          {/* 2. البحث (Search) */}
          <button
            type="button"
            onClick={() => {
              setIsAccountOpen(false);
              setIsSearchOpen(true);
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-smooth group relative ${
              isSearchOpen ? 'text-[#AD8A55]' : 'text-muted hover:text-noir'
            }`}
            aria-label="البحث في المتجر"
          >
            <motion.div whileTap={{ scale: 0.85 }} className="relative flex flex-col items-center">
              <Search
                size={22}
                className={`transition-transform duration-300 ${
                  isSearchOpen ? 'stroke-[2.5px] scale-110' : 'group-hover:scale-105'
                }`}
              />
              <span className="text-[10px] sm:text-[11px] font-bold mt-1 tracking-tight">
                البحث
              </span>
              {isSearchOpen && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#AD8A55]" />
              )}
            </motion.div>
          </button>

          {/* 3. السلة (Cart with live counter badge) */}
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false);
              setIsAccountOpen(false);
              openCart();
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 text-center text-muted hover:text-noir transition-smooth group relative"
            aria-label="حقيبة المشتريات"
          >
            <motion.div whileTap={{ scale: 0.85 }} className="relative flex flex-col items-center">
              <div className="relative">
                <ShoppingBag size={22} className="group-hover:scale-105 transition-transform" />
                {mounted && totalItems > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-[#1C1610] text-[#F6F2E9] border border-[#AD8A55] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                    {totalItems}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#AD8A55]/40" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold mt-1 tracking-tight">
                السلة
              </span>
            </motion.div>
          </button>

          {/* 4. حسابي / الإدارة (Account) */}
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false);
              setIsAccountOpen(true);
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-smooth group relative ${
              isAccountOpen ? 'text-[#AD8A55]' : 'text-muted hover:text-noir'
            }`}
            aria-label="حسابي وإدارة المتجر"
          >
            <motion.div whileTap={{ scale: 0.85 }} className="relative flex flex-col items-center">
              <div className="relative">
                <User
                  size={22}
                  className={`transition-transform duration-300 ${
                    isAccountOpen ? 'stroke-[2.5px] scale-110' : 'group-hover:scale-105'
                  }`}
                />
                {adminUser && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold mt-1 tracking-tight">
                {adminUser ? 'الإدارة' : 'حسابي'}
              </span>
              {isAccountOpen && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#AD8A55]" />
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* ── Search Modal / Quick Search Overlay ───────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-2xl mx-auto mt-6 sm:mt-16 mx-4 sm:mx-auto bg-card rounded-2xl border border-border-subtle shadow-2xl overflow-hidden z-10 flex flex-col max-h-[82vh]"
            >
              {/* Search Header */}
              <div className="p-4 sm:p-5 border-b border-border-subtle bg-main flex items-center gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن جلابية، ثوب، بشت، خامة، أو مقاس..."
                    className="w-full pl-4 pr-11 py-3 bg-card border border-border-subtle rounded-xl text-xs sm:text-sm text-noir placeholder:text-muted focus:border-[#AD8A55] focus:outline-none shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2.5 rounded-xl bg-card border border-border-subtle hover:border-noir text-noir transition-smooth shadow-xs"
                  aria-label="إغلاق البحث"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="px-4 py-2.5 border-b border-border-subtle bg-surface/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedSearchCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-smooth ${
                      selectedSearchCategory === cat
                        ? 'bg-noir text-white shadow-xs'
                        : 'bg-card text-muted hover:text-noir border border-border-subtle'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Results List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {filteredSearchResults.length === 0 ? (
                  <div className="py-12 text-center space-y-2 text-muted">
                    <Search size={32} className="mx-auto stroke-1 opacity-40" />
                    <p className="text-xs font-semibold text-noir">لم نجد نتائج مطابقة لبحثك</p>
                    <p className="text-[11px]">جرب البحث باسم قطعة أخرى أو تصفح تشكيلة الأقسام أعلاه</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredSearchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-3 bg-surface/60 hover:bg-surface rounded-xl border border-border-subtle transition-smooth group"
                      >
                        <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-card flex-shrink-0 border border-border-subtle">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <span className="text-[10px] text-muted font-medium block">
                            {product.category}
                          </span>
                          <h4 className="font-bold text-xs text-noir line-clamp-1 group-hover:text-[#AD8A55] transition-smooth">
                            {product.name}
                          </h4>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xs font-extrabold text-noir">
                              {product.price} ج.م
                            </span>
                            {product.original_price && (
                              <span className="text-[10px] text-muted line-through">
                                {product.original_price} ج.م
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronLeft size={16} className="text-muted group-hover:text-noir group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Footer */}
              <div className="p-3 bg-main border-t border-border-subtle text-center text-[11px] text-muted">
                <span>عرض {filteredSearchResults.length} من أصل {allProducts.length} قطعة متوفرة</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Account / Profile Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {isAccountOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccountOpen(false)}
              className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-md mx-auto mt-12 sm:mt-24 mx-4 sm:mx-auto bg-card rounded-2xl border border-border-subtle shadow-2xl overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-border-subtle bg-[#1C1610] text-[#F6F2E9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#AD8A55]/20 border border-[#AD8A55]/40 flex items-center justify-center text-[#D8C6A3]">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">
                      {adminUser ? adminUser.name : 'حساب العميل المميز'}
                    </h3>
                    <p className="text-[11px] text-[#D8C6A3]">
                      {adminUser ? adminUser.email : 'كنوز KOUNOZ — للأصالة والفخامة'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAccountOpen(false)}
                  className="text-[#D8C6A3] hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3 text-right">
                {/* Customer Login / Account Action */}
                <Link
                  href="/login"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center justify-between p-3.5 bg-[#1C1610] hover:bg-[#AD8A55] rounded-xl text-white transition-smooth group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10 text-white">
                      <User size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">
                        تسجيل الدخول / حسابي الشخصي
                      </span>
                      <span className="text-[10px] text-[#D8C6A3]">
                        دخول بـ Google أو البريد وكلمة المرور
                      </span>
                    </div>
                  </div>
                  <ChevronLeft size={14} className="text-[#D8C6A3] group-hover:-translate-x-1 transition-transform" />
                </Link>

                {/* Admin Quick Action (Only for authorized admin) */}
                {adminUser && isAdminEmail(adminUser.email) && (
                  <Link
                    href="/admin"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center justify-between p-3.5 bg-surface hover:bg-[#EFE9DB] rounded-xl border border-border-subtle transition-smooth group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-noir text-white">
                        <ShieldCheck size={16} className="text-[#AD8A55]" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-noir block group-hover:text-[#AD8A55] transition-smooth">
                          لوحة تحكم الإدارة (Admin Dashboard)
                        </span>
                        <span className="text-[10px] text-muted">
                          إدارة المنتجات، الصور، ورقم الواتساب
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-muted group-hover:text-noir transition-smooth" />
                  </Link>
                )}

                {/* Direct Concierge Support */}
                <a
                  href="https://wa.me/201000943197?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B7%D9%84%D8%A8%D9%8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-emerald-50 hover:bg-emerald-100/70 rounded-xl border border-emerald-200 transition-smooth group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-700 text-white">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-emerald-900 block">
                        خدمة العملاء والطلب الفوري
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        محادثة واتساب مباشرة مع مستشار الأزياء
                      </span>
                    </div>
                  </div>
                  <ChevronLeft size={14} className="text-emerald-700 group-hover:-translate-x-1 transition-transform" />
                </a>

                {/* Email Support */}
                <a
                  href="mailto:omargamil37@gmail.com"
                  className="flex items-center justify-between p-3 bg-card hover:bg-surface rounded-xl border border-border-subtle text-xs text-muted transition-smooth"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail size={15} className="text-[#AD8A55]" />
                    <span className="font-medium text-noir">البريد الإلكتروني للتواصل:</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted">omargamil37@gmail.com</span>
                </a>
              </div>

              {/* Close Footer */}
              <div className="p-4 bg-main border-t border-border-subtle text-center">
                <button
                  type="button"
                  onClick={() => setIsAccountOpen(false)}
                  className="w-full py-2.5 bg-noir hover:bg-[#AD8A55] text-white text-xs font-bold rounded-xl transition-smooth shadow-xs"
                >
                  العودة للتسوق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
