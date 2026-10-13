'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ShoppingBag,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  KeyRound,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { getCurrentCustomer, loginCustomer, registerCustomer, logoutCustomer, isValidEmail, isAdminEmail, loginWithFacebook } from '../../lib/api';
import { User } from '../../types';

function LoginContent() {
  const { dir } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Check current auth status on mount
  useEffect(() => {
    const user = getCurrentCustomer();
    setLocalUser(user);

    const handleAuthChange = () => {
      setLocalUser(getCurrentCustomer());
    };
    window.addEventListener('kounoz_auth_changed', handleAuthChange);
    return () => window.removeEventListener('kounoz_auth_changed', handleAuthChange);
  }, []);

  const currentUser = (session?.user ? {
    id: 1,
    name: session.user.name || 'عميل كنوز',
    email: session.user.email || '',
    avatar: session.user.image || '',
  } : localUser) as User | null;

  // Handle Google 1-Click Login
  const handleGoogleSignIn = () => {
    setLoading(true);
    signIn('google', {
      callbackUrl: `${window.location.origin}${callbackUrl === '/login' ? '/' : callbackUrl}`,
    });
  };

  // Quick fill helper for testing
  const fillCredentials = (email: string, pass: string) => {
    setActiveTab('login');
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Handle Manual Login
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = loginEmail.trim().toLowerCase();

    if (!cleanEmail || !loginPassword) {
      setErrorMsg('يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('يرجى كتابة بريد إلكتروني صحيح ومكتمل (مثال: name@gmail.com)');
      return;
    }

    setLoading(true);
    try {
      const res = await loginCustomer(cleanEmail, loginPassword);
      if (res.success && res.user) {
        setLocalUser(res.user);
        const isAdmin = isAdminEmail(res.user.email);
        setSuccessMsg(isAdmin ? 'مرحباً بك يا مدير المتجر 👑 جاري الدخول للوحة التحكم...' : 'تم تسجيل الدخول بنجاح! جاري التوجيه...');
        setTimeout(() => {
          if (isAdmin && (callbackUrl === '/login' || callbackUrl === '/')) {
            router.push('/admin');
          } else {
            router.push(callbackUrl === '/login' ? '/' : callbackUrl);
          }
        }, 600);
      } else {
        setErrorMsg(res.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  // Handle Manual Register
  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = regEmail.trim().toLowerCase();

    if (!regName.trim() || !cleanEmail || !regPassword) {
      setErrorMsg('يرجى ملء جميع الحقول الإلزامية');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('يرجى كتابة بريد إلكتروني صحيح (مثال: name@gmail.com)');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('كلمة المرور يجب أن تتكون من 6 أحرف أو أرقام على الأقل');
      return;
    }

    setLoading(true);
    try {
      const res = await registerCustomer(regName, cleanEmail, regPassword, regPhone);
      if (res.success && res.user) {
        setLocalUser(res.user);
        const isAdmin = isAdminEmail(res.user.email);
        setSuccessMsg('تم إنشاء حسابك بنجاح! أهلاً بك في كنوز ✨');
        setTimeout(() => {
          if (isAdmin && (callbackUrl === '/login' || callbackUrl === '/')) {
            router.push('/admin');
          } else {
            router.push(callbackUrl === '/login' ? '/' : callbackUrl);
          }
        }, 800);
      } else {
        setErrorMsg(res.error || 'تعذر إنشاء الحساب');
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    logoutCustomer();
    setLocalUser(null);
    if (session) {
      await signOut({ callbackUrl: '/' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F2E9] flex flex-col justify-between" dir={dir}>
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E2D7C3] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-[#705F4E] hover:text-[#1C1610] transition-colors group"
          >
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            <span>العودة للمتجر</span>
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-[#FAF6EE] p-1 border border-[#D4AF37]/50 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image src="/kounoz-logo.png" alt="كنوز" fill className="object-contain p-0.5" priority />
            </div>
            <div className="flex flex-col text-right">
              <span className="font-serif text-xl font-bold text-[#1C1610] tracking-wide">كنوز</span>
              <span className="text-[10px] text-[#AD8A55] font-semibold -mt-1">KOUNOZ LUXURY</span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-[#705F4E]">
            <ShieldCheck size={16} className="text-[#AD8A55]" />
            <span className="hidden sm:inline">حساب آمن ومحمي</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">
        {/* LOGGED IN STATE / PROFILE CARD */}
        {currentUser ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-[#E2D7C3] p-8 shadow-xl text-center space-y-6"
          >
            {/* User Avatar */}
            <div className="relative w-24 h-24 mx-auto">
              {currentUser.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#AD8A55]/30 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1C1610] to-[#AD8A55] text-white flex items-center justify-center text-3xl font-bold font-serif shadow-lg">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'ك'}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                ✓
              </div>
            </div>

            {isAdminEmail(currentUser.email) ? (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#1C1610] to-[#AD8A55] text-white text-xs font-bold mb-2 shadow-md">
                  <ShieldCheck size={13} className="text-[#F6F2E9]" />
                  <span>👑 حساب مدير المتجر المعتمد (Admin)</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#1C1610]">{currentUser.name}</h2>
                <p className="text-xs text-[#705F4E] font-medium mt-1 font-mono">{currentUser.email}</p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F2E9] text-[#AD8A55] text-xs font-bold mb-2 border border-[#E2D7C3]">
                  <Sparkles size={12} />
                  <span>عضو مميز في متجر كنوز</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#1C1610]">{currentUser.name}</h2>
                <p className="text-xs text-[#705F4E] font-medium mt-1 font-mono">{currentUser.email}</p>
                {currentUser.phone && (
                  <p className="text-xs text-[#705F4E] font-mono mt-0.5">{currentUser.phone}</p>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-[#E2D7C3] space-y-3">
              {isAdminEmail(currentUser.email) && (
                <Link
                  href="/admin"
                  className="w-full py-3.5 bg-gradient-to-r from-[#1C1610] to-[#AD8A55] hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} />
                  <span>الانتقال إلى لوحة تحكم الإدارة (Admin Dashboard)</span>
                </Link>
              )}

              <Link
                href="/"
                className="w-full py-3.5 bg-[#1C1610] hover:bg-[#AD8A55] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag size={15} />
                <span>تصفح تشكيلة كنوز ومتابعة التسوق</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={15} />
                <span>تسجيل الخروج من الحساب</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* AUTH FORMS (LOGIN / REGISTER) */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E2D7C3] shadow-xl overflow-hidden"
          >
            {/* Tabs Header */}
            <div className="grid grid-cols-2 border-b border-[#E2D7C3] bg-[#F6F2E9]/60">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-4 text-xs font-bold transition-all relative ${
                  activeTab === 'login'
                    ? 'text-[#1C1610] bg-white shadow-sm'
                    : 'text-[#705F4E] hover:text-[#1C1610]'
                }`}
              >
                تسجيل الدخول
                {activeTab === 'login' && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#AD8A55]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`py-4 text-xs font-bold transition-all relative ${
                  activeTab === 'register'
                    ? 'text-[#1C1610] bg-white shadow-sm'
                    : 'text-[#705F4E] hover:text-[#1C1610]'
                }`}
              >
                إنشاء حساب جديد
                {activeTab === 'register' && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#AD8A55]" />
                )}
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Google 1-Click Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>المتابعة بحساب Google</span>
              </button>

              {/* Facebook 1-Click Button */}
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  try {
                    const fbUser = loginWithFacebook('عميل كنوز عبر Facebook');
                    setLocalUser(fbUser);
                    setSuccessMsg('تم تسجيل الدخول عبر Facebook بنجاح! جاري التوجيه...');
                    setTimeout(() => {
                      router.push(callbackUrl === '/login' ? '/' : callbackUrl);
                    }, 600);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-3.5 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0 group-hover:scale-110 transition-transform">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>المتابعة بحساب Facebook</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-gray-200" />
                <span className="absolute px-3 bg-white text-[11px] text-[#705F4E] font-medium">
                  أو بالبريد الإلكتروني وكلمة المرور
                </span>
              </div>

              {/* Notifications */}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={15} className="flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ── LOGIN FORM ── */}
              {activeTab === 'login' && (
                <form onSubmit={handleManualLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1C1610]">البريد الإلكتروني</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full pr-10 pl-4 py-3 bg-[#F6F2E9]/40 border border-[#E2D7C3] rounded-xl text-xs text-[#1C1610] focus:bg-white focus:border-[#AD8A55] focus:outline-none transition-all font-mono"
                      />
                      <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#705F4E]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1C1610]">كلمة المرور</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pr-10 pl-10 py-3 bg-[#F6F2E9]/40 border border-[#E2D7C3] rounded-xl text-xs text-[#1C1610] focus:border-[#AD8A55] focus:bg-white focus:outline-none transition-all font-mono"
                      />
                      <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#705F4E]" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#705F4E] hover:text-[#1C1610]"
                        aria-label="إظهار / إخفاء كلمة المرور"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#1C1610] hover:bg-[#AD8A55] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>جاري التحقق والدخول...</span>
                      </>
                    ) : (
                      <span>تسجيل الدخول</span>
                    )}
                  </button>

                  {/* Quick Preset Credentials (Zero Friction) */}
                  <div className="pt-2 border-t border-[#E2D7C3]/60 space-y-2">
                    <span className="text-[10px] text-muted block text-center">دخول سريع بنقرة واحدة (حسابات تجريبية):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => fillCredentials('admin@kounoz.sa', 'admin123')}
                        className="p-2 rounded-lg bg-[#FAF6EE] hover:bg-[#F3ECE0] border border-[#D4AF37]/40 text-right transition-colors"
                      >
                        <span className="text-[10px] font-bold text-noir flex items-center gap-1">
                          <ShieldCheck size={11} className="text-[#AD8A55]" />
                          دخول كمدير (Admin)
                        </span>
                        <span className="text-[9px] text-muted block font-mono">admin@kounoz.sa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fillCredentials('customer@kounoz.sa', 'user123')}
                        className="p-2 rounded-lg bg-[#FAF6EE] hover:bg-[#F3ECE0] border border-[#D4AF37]/40 text-right transition-colors"
                      >
                        <span className="text-[10px] font-bold text-noir flex items-center gap-1">
                          <UserIcon size={11} className="text-[#AD8A55]" />
                          دخول كعميل (Client)
                        </span>
                        <span className="text-[9px] text-muted block font-mono">customer@kounoz.sa</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ── REGISTER FORM ── */}
              {activeTab === 'register' && (
                <form onSubmit={handleManualRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1C1610]">الاسم الكامل *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="محمد أحمد"
                        required
                        className="w-full pr-10 pl-4 py-3 bg-[#F6F2E9]/40 border border-[#E2D7C3] rounded-xl text-xs text-[#1C1610] focus:border-[#AD8A55] focus:bg-white focus:outline-none transition-all"
                      />
                      <UserIcon size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#705F4E]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1C1610]">البريد الإلكتروني *</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full pr-10 pl-4 py-3 bg-[#F6F2E9]/40 border border-[#E2D7C3] rounded-xl text-xs text-[#1C1610] focus:bg-white focus:border-[#AD8A55] focus:outline-none transition-all font-mono"
                      />
                      <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#705F4E]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1C1610]">
                      رقم الهاتف / الجوال <span className="text-[#705F4E] font-normal">(اختياري)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="01000000000"
                        className="w-full pr-10 pl-4 py-3 bg-[#F6F2E9]/40 border border-[#E2D7C3] rounded-xl text-xs text-[#1C1610] focus:border-[#AD8A55] focus:bg-white focus:outline-none transition-all font-mono"
                      />
                      <Phone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#705F4E]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1C1610]">كلمة المرور *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="6 أحرف أو أرقام على الأقل"
                        required
                        className="w-full pr-10 pl-10 py-3 bg-[#F6F2E9]/40 border border-[#E2D7C3] rounded-xl text-xs text-[#1C1610] focus:border-[#AD8A55] focus:bg-white focus:outline-none transition-all font-mono"
                      />
                      <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#705F4E]" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#705F4E] hover:text-[#1C1610]"
                        aria-label="إظهار / إخفاء كلمة المرور"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#AD8A55] hover:bg-[#8C6B4F] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>جاري إنشاء الحساب...</span>
                      </>
                    ) : (
                      <span>إنشاء الحساب الجديد</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-[11px] text-[#705F4E] border-t border-[#E2D7C3]">
        <p>© 2026 دار كنوز للأزياء التراثية والملكية — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center" dir="rtl">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#AD8A55] mx-auto" />
            <p className="text-xs text-[#705F4E]">جاري تحميل صفحة الدخول...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
