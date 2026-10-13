'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  User as UserIcon,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAuthenticatedUser,
  loginCustomer,
  registerCustomer,
  loginAdmin,
  loginWithFacebook,
  isAdminEmail,
  isValidEmail,
  logoutCustomer,
} from '../lib/api';
import { User } from '../types';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  // Authentication State
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Active Role Tab: 'customer' or 'admin'
  const [activeRole, setActiveRole] = useState<'customer' | 'admin'>('customer');

  // Customer sub-tab: 'login' or 'register'
  const [customerTab, setCustomerTab] = useState<'login' | 'register'>('login');

  // Customer Login Form State
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [showCustPassword, setShowCustPassword] = useState(false);
  const [custError, setCustError] = useState('');

  // Customer Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('admin@kounoz.sa');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Facebook Modal State
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [fbCustomName, setFbCustomName] = useState('عميل كنوز عبر Facebook');
  const [fbCustomEmail, setFbCustomEmail] = useState('');

  // Global loading & success message
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check auth status on mount and listen to changes
  useEffect(() => {
    setMounted(true);

    const checkAuth = () => {
      const user = getAuthenticatedUser();
      if (user) {
        setAuthUser(user);
      } else if (session?.user) {
        setAuthUser({
          id: 1,
          name: session.user.name || 'عميل كنوز',
          email: session.user.email || '',
          avatar: session.user.image || '',
          is_admin: isAdminEmail(session.user.email || ''),
        });
      } else {
        setAuthUser(null);
      }
      setAuthChecking(false);
    };

    checkAuth();

    window.addEventListener('kounoz_auth_changed', checkAuth);
    return () => window.removeEventListener('kounoz_auth_changed', checkAuth);
  }, [session]);

  // Handle Customer Manual Login
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustError('');
    setSuccessMessage('');

    const cleanEmail = custEmail.trim().toLowerCase();
    if (!cleanEmail || !custPassword) {
      setCustError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setCustError('يرجى كتابة بريد إلكتروني صحيح ومكتمل');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginCustomer(cleanEmail, custPassword);
      if (res.success && res.user) {
        setAuthUser(res.user);
        setSuccessMessage('تم تسجيل الدخول بنجاح! مرحباً بك في كنوز 🌟');
      } else {
        setCustError(res.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch {
      setCustError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Customer Register (Create Account)
  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setSuccessMessage('');

    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanName = regName.trim();

    if (!cleanName || !cleanEmail || !regPassword) {
      setRegError('يرجى ملء جميع الحقول الإلزامية');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setRegError('يرجى كتابة بريد إلكتروني صحيح ومكتمل');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('كلمة المرور يجب أن تتكون من 6 خانات على الأقل');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerCustomer(cleanName, cleanEmail, regPassword, regPhone);
      if (res.success && res.user) {
        setAuthUser(res.user);
        setSuccessMessage('تم إنشاء حسابك بنجاح! مرحباً بك في عائلة كنوز 🛍️');
      } else {
        setRegError(res.error || 'تعذر إنشاء الحساب');
      }
    } catch {
      setRegError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Admin Login (Strict Password Check)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setSuccessMessage('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (!cleanEmail || !adminPassword.trim()) {
      setAdminError('يرجى إدخال بريد وكلمة مرور الإدارة');
      return;
    }

    const user = loginAdmin(cleanEmail, adminPassword);
    if (user) {
      setAuthUser(user);
      setSuccessMessage('مرحباً بك يا مدير المتجر 👑 جاري فتح النظام...');
      setTimeout(() => {
        router.push('/admin');
      }, 700);
    } else {
      setAdminError('كلمة المرور غير صحيحة، أو هذا البريد غير مصرح له كمدير');
    }
  };

  // Handle Facebook Login Confirmation
  const confirmFacebookLogin = () => {
    setIsLoading(true);
    try {
      const fbUser = loginWithFacebook(fbCustomName, fbCustomEmail);
      setAuthUser(fbUser);
      setShowFacebookModal(false);
      setSuccessMessage('تم تسجيل الدخول عبر Facebook بنجاح! مرحباً بك 🌟');
    } finally {
      setIsLoading(false);
    }
  };

  // Skip gatekeeper for API routes
  if (pathname.startsWith('/api')) {
    return <>{children}</>;
  }

  // Initial loader while checking localStorage or NextAuth session
  if (!mounted || authChecking || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto rounded-full bg-[#FAF6EE] p-2 border border-[#D4AF37]/50 shadow-md flex items-center justify-center overflow-hidden animate-pulse">
            <Image src="/kounoz-logo.png" alt="كنوز" fill className="object-contain p-1.5" />
          </div>
          <div className="flex items-center justify-center gap-2 text-accent">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-xs font-bold text-noir">جاري الدخول إلى دار كنوز...</span>
          </div>
        </div>
      </div>
    );
  }

  // If already authenticated: Unlock store and render content!
  if (authUser) {
    return <>{children}</>;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // MANDATORY LOGIN GATEKEEPER SCREEN (في البداية لازم يبقى في لوجين سواء ادمن او عميل)
  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden" dir="rtl">
      {/* Background Decorative Ambient */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#7A0C28]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-lg bg-card rounded-2xl border border-border-subtle shadow-[0_15px_40px_rgba(28,22,16,0.08)] overflow-hidden relative z-10"
      >
        {/* Brand Header */}
        <div className="p-6 sm:p-7 text-center border-b border-border-subtle bg-gradient-to-b from-[#FAF6EE] to-card relative">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 mx-auto mb-3 rounded-full bg-[#FAF6EE] p-2 border border-[#D4AF37]/60 shadow-[0_4px_16px_rgba(212,175,55,0.2)] flex items-center justify-center overflow-hidden">
            <Image src="/kounoz-logo.png" alt="كنوز KOUNOZ" fill priority className="object-contain p-1.5" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-noir tracking-wide">
            دار كـنـوز للأزياء الفاخرة
          </h1>
          <p className="text-xs text-muted mt-1 font-semibold">
            بوابة الدخول — يرجى تسجيل الدخول للبدء بالتسوق أو إدارة المتجر
          </p>
        </div>

        {/* Global Notifications */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fade-in font-bold">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Primary Role Selector: عميل (Customer) vs مدير المتجر (Admin) */}
        <div className="p-6 pb-2">
          <div className="grid grid-cols-2 p-1 bg-surface border border-border-subtle rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveRole('customer');
                setCustError('');
                setAdminError('');
              }}
              className={`py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeRole === 'customer'
                  ? 'bg-card text-accent shadow-sm border border-border-subtle font-extrabold'
                  : 'text-muted hover:text-noir'
              }`}
            >
              <UserIcon size={16} />
              <span>دخول كعميل (Client)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setCustError('');
                setAdminError('');
              }}
              className={`py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeRole === 'admin'
                  ? 'bg-noir text-white shadow-sm font-extrabold'
                  : 'text-muted hover:text-noir'
              }`}
            >
              <ShieldCheck size={16} />
              <span>مدير المتجر (Admin)</span>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ROLE 1: CUSTOMER VIEW (Google, Facebook, Create Account, or Login)   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeRole === 'customer' && (
          <div className="p-6 pt-3 space-y-5">
            {/* 1. Quick Social Logins: Google & Facebook */}
            <div className="space-y-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: window.location.href })}
                className="w-full py-3 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 shadow-sm transition-all flex items-center justify-center gap-3 hover:border-gray-400 group"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>المتابعة بحساب Google</span>
              </button>

              {/* Facebook Button (Official Blue Branding) */}
              <button
                type="button"
                onClick={() => setShowFacebookModal(true)}
                className="w-full py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 group"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0 group-hover:scale-105 transition-transform">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>المتابعة بحساب Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-muted">
              <div className="flex-1 h-px bg-border-subtle" />
              <span>أو بالبريد الإلكتروني</span>
              <div className="flex-1 h-px bg-border-subtle" />
            </div>

            {/* Sub-tabs: تسجيل الدخول vs إنشاء حساب جديد (Create Account) */}
            <div className="flex border-b border-border-subtle text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => {
                  setCustomerTab('login');
                  setCustError('');
                  setRegError('');
                }}
                className={`flex-1 py-2.5 transition-colors relative ${
                  customerTab === 'login' ? 'text-accent font-extrabold' : 'text-muted hover:text-noir'
                }`}
              >
                تسجيل الدخول
                {customerTab === 'login' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomerTab('register');
                  setCustError('');
                  setRegError('');
                }}
                className={`flex-1 py-2.5 transition-colors relative flex items-center justify-center gap-1.5 ${
                  customerTab === 'register' ? 'text-accent font-extrabold' : 'text-muted hover:text-noir'
                }`}
              >
                <Sparkles size={13} className="text-[#D4AF37]" />
                <span>إنشاء حساب جديد (Create Account)</span>
                {customerTab === 'register' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            </div>

            {/* Sub-Tab 1: Customer Login Form */}
            {customerTab === 'login' && (
              <form onSubmit={handleCustomerLogin} className="space-y-3.5">
                {custError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                    <span>{custError}</span>
                  </div>
                )}

                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-noir">البريد الإلكتروني</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none pl-9"
                    />
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-noir">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showCustPassword ? 'text' : 'password'}
                      value={custPassword}
                      onChange={(e) => setCustPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                      required
                      className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none pl-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustPassword(!showCustPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir transition-colors"
                    >
                      {showCustPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-noir hover:bg-accent text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
                  <span>تسجيل الدخول وبدء التسوق</span>
                </button>

                {/* 1-Click Demo Fill for Customer */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setCustEmail('customer@kounoz.sa');
                      setCustPassword('user123');
                      setCustError('');
                    }}
                    className="text-[11px] text-muted hover:text-accent font-semibold transition-colors underline"
                  >
                    تجربة سريعة بحساب العميل التجريبي (customer@kounoz.sa)
                  </button>
                </div>
              </form>
            )}

            {/* Sub-Tab 2: Create Account Form */}
            {customerTab === 'register' && (
              <form onSubmit={handleCustomerRegister} className="space-y-3">
                {regError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-noir">الاسم الكريم *</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: أحمد عبد الله"
                    required
                    className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-noir">البريد الإلكتروني *</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none pl-9"
                    />
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-noir">رقم الهاتف / الواتساب (اختياري)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none pl-9 font-mono text-right"
                    />
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-noir">كلمة المرور * (6 أحرف أو أكثر)</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="أنشئ كلمة مرور لحسابك"
                      required
                      className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none pl-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir transition-colors"
                    >
                      {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#7A0C28] hover:bg-noir text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>إنشاء الحساب وبدء التسوق فوراً</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ROLE 2: ADMIN VIEW (Strict password verification to /admin)          */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeRole === 'admin' && (
          <div className="p-6 pt-3 space-y-4">
            <div className="p-3.5 bg-[#FAF6EE] border border-[#D4AF37]/40 rounded-xl text-right">
              <span className="text-xs font-bold text-noir block flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#D4AF37]" />
                بوابة الإدارة المعتمدة
              </span>
              <span className="text-[11px] text-muted leading-relaxed block mt-0.5">
                لوحة تحكم المنتجات، الصور، والأسعار. يتطلب إدخال كلمة مرور المدير الصحيحة.
              </span>
            </div>

            {adminError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3.5">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-noir">البريد الإلكتروني للإدارة</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@kounoz.sa"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none font-mono text-right"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-noir">كلمة المرور الخاصة بالمدير</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="أدخل كلمة مرور الإدارة"
                    required
                    className="w-full px-3.5 py-2.5 bg-surface border border-border-subtle rounded-xl text-xs text-noir focus:border-accent focus:outline-none pl-9 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir transition-colors"
                  >
                    {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-noir hover:bg-[#7A0C28] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                <span>دخول لوحة التحكم (Admin)</span>
              </button>

              {/* 1-Click Fill Demo Credentials for Admin */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAdminEmail('admin@kounoz.sa');
                    setAdminPassword('admin123');
                    setAdminError('');
                  }}
                  className="text-[11px] text-muted hover:text-accent font-semibold transition-colors underline"
                >
                  تعبئة بيانات المدير التجريبي (admin@kounoz.sa / admin123)
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="p-4 bg-surface border-t border-border-subtle text-center text-[11px] text-muted">
          <span>🔒 تسجيل دخول آمن ومحمي بأعلى معايير التشفير — دار كنوز 2026</span>
        </div>
      </motion.div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* FACEBOOK AUTH FAST DIALOG MODAL                                      */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showFacebookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden text-right"
            >
              {/* Facebook Header */}
              <div className="p-4 bg-[#1877F2] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-bold text-sm">تسجيل الدخول عبر Facebook</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFacebookModal(false)}
                  className="text-white/80 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 text-xs">
                <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    f
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">متجر كنوز KOUNOZ</span>
                    <span className="text-[11px] text-gray-500">سيصل التطبيق إلى اسمك وصورتك الشخصية</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block text-xs">الاسم المستعار للحساب</label>
                  <input
                    type="text"
                    value={fbCustomName}
                    onChange={(e) => setFbCustomName(e.target.value)}
                    placeholder="اسمك على فيسبوك"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block text-xs">البريد الإلكتروني (اختياري)</label>
                  <input
                    type="email"
                    value={fbCustomEmail}
                    onChange={(e) => setFbCustomEmail(e.target.value)}
                    placeholder="name@facebook.com"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={confirmFacebookLogin}
                    className="flex-1 py-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Check size={14} />
                    <span>متابعة كـ {fbCustomName || 'عميل فيسبوك'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFacebookModal(false)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
