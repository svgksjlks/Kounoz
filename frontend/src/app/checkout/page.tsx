'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import {
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ChevronDown,
  Mail,
  MapPin,
  User,
  Package,
  Loader2,
  Sparkles,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getStoreSettings, formatWhatsAppUrl, getCurrentCustomer, isValidEmail } from '../../lib/api';

// ─── Country List ────────────────────────────────────────────────────────────
const COUNTRIES = [
  'مصر', 'المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'الكويت',
  'قطر', 'البحرين', 'عُمان', 'الأردن', 'لبنان', 'العراق', 'سوريا',
  'اليمن', 'ليبيا', 'تونس', 'الجزائر', 'المغرب', 'السودان', 'أخرى',
];

type PaymentMethod = 'cod' | 'visa';
type Step = 'info' | 'payment' | 'confirm';

interface CheckoutForm {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  address: string;
  apartment: string;
  payment: PaymentMethod;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

// ─── InputField defined OUTSIDE the page component to keep stable identity ───
interface InputFieldProps {
  label: string;
  fieldKey: keyof CheckoutForm;
  type?: string;
  placeholder?: string;
  half?: boolean;
  value: string;
  error?: string;
  onChange: (key: keyof CheckoutForm, val: string) => void;
}

function InputField({ label, fieldKey, type = 'text', placeholder, half = false, value, error, onChange }: InputFieldProps) {
  return (
    <div className={half ? 'flex-1 min-w-0' : 'w-full'}>
      <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300 ${
          error
            ? 'border-red-300 focus:ring-red-100'
            : 'border-gray-200 focus:ring-[#C5A059]/20 focus:border-[#C5A059]'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, totalAmount, clearCart, isCartLoaded } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('info');
  const [submitting, setSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orderNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));

  const [form, setForm] = useState<CheckoutForm>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    country: 'مصر',
    city: '',
    address: '',
    apartment: '',
    payment: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});

  const shipping = totalAmount >= 500 ? 0 : 35;
  const total = totalAmount + shipping;

  // Stable update callback — won't change on re-render
  const update = useCallback((field: keyof CheckoutForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }, []);

  const validateInfo = (): boolean => {
    const e: Partial<Record<keyof CheckoutForm, string>> = {};
    if (!form.firstName.trim()) e.firstName = 'الاسم الأول مطلوب';
    if (!form.lastName.trim()) e.lastName = 'الاسم الأخير مطلوب';
    if (!form.email.trim() || !isValidEmail(form.email)) e.email = 'يرجى إدخال بريد إلكتروني صالح (مثال: name@gmail.com)';
    if (!form.phone.trim() || form.phone.length < 8) e.phone = 'رقم هاتف غير صحيح';
    if (!form.country) e.country = 'اختر الدولة';
    if (!form.city.trim()) e.city = 'المدينة مطلوبة';
    if (!form.address.trim()) e.address = 'العنوان مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = (): boolean => {
    if (form.payment === 'cod') return true;
    const e: Partial<Record<keyof CheckoutForm, string>> = {};
    if (!form.cardName.trim()) e.cardName = 'اسم حامل البطاقة مطلوب';
    if (form.cardNumber.replace(/\s/g, '').length !== 16) e.cardNumber = 'رقم البطاقة غير صحيح';
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = 'صيغة غير صحيحة (MM/YY)';
    if (form.cardCvc.length < 3) e.cardCvc = 'CVV غير صحيح';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = () => {
    if (step === 'info' && validateInfo()) setStep('payment');
    else if (step === 'payment' && validatePayment()) setStep('confirm');
  };

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));

    const settings = getStoreSettings();
    const itemsList = items
      .map((i) => `• ${i.name} (${i.size || ''} ${i.color || ''}) × ${i.quantity} — ${(i.price * i.quantity).toFixed(0)} ج.م`)
      .join('\n');

    const msg = `🛍️ *طلب جديد من موقع كنوز — رقم #${orderNumber}*

👤 *بيانات العميل:*
الاسم: ${form.firstName} ${form.lastName}
الإيميل: ${form.email}
الهاتف: ${form.phone}

📦 *عنوان الشحن:*
${form.address}${form.apartment ? `، شقة ${form.apartment}` : ''}
${form.city}، ${form.country}

🛒 *المنتجات:*
${itemsList}

💰 *الإجمالي:* ${total.toFixed(0)} ج.م
🚚 *الشحن:* ${shipping === 0 ? 'مجاني' : `${shipping} ج.م`}
💳 *طريقة الدفع:* ${form.payment === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان / Visa'}

شكراً لاختياركم كنوز! ✨`;

    const waUrl = formatWhatsAppUrl(settings.whatsapp_number || '201000943197', msg);

    clearCart();
    setOrderDone(true);
    setSubmitting(false);
    setTimeout(() => window.open(waUrl, '_blank'), 600);
  };

  // Format card helpers
  const fmtCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const local = getCurrentCustomer();
    if (session?.user) {
      const parts = (session.user.name || '').trim().split(' ');
      setForm((f) => ({
        ...f,
        email: f.email || session.user?.email || '',
        firstName: f.firstName || parts[0] || '',
        lastName: f.lastName || parts.slice(1).join(' ') || '',
      }));
    } else if (local) {
      const parts = (local.name || '').trim().split(' ');
      setForm((f) => ({
        ...f,
        email: f.email || local.email || '',
        firstName: f.firstName || parts[0] || '',
        lastName: f.lastName || parts.slice(1).join(' ') || '',
        phone: f.phone || local.phone || '',
      }));
    }
  }, [session]);

  useEffect(() => {
    if (mounted && isCartLoaded && items.length === 0 && !orderDone) {
      router.replace('/');
    }
  }, [items, orderDone, router, mounted, isCartLoaded]);

  // ── MANDATORY LOGIN GATE ──────────────────────────────────────────────────
  const isLoggedIn = !!(session?.user || getCurrentCustomer());

  if (mounted && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between" dir="rtl">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1C1C1E] transition-all">
              <ArrowRight size={16} />
              <span>العودة للمتجر</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image src="/kounoz-logo.png" alt="كنوز" fill className="object-contain" />
              </div>
              <span className="font-serif text-lg font-bold text-[#1C1C1E]">إتمام الطلب</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#AD8A55] font-bold">
              <ShieldCheck size={14} />
              <span>طلب محمي</span>
            </div>
          </div>
        </header>

        <main className="max-w-md w-full mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center">
          <div className="bg-white rounded-2xl border border-[#E2D7C3] p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#AD8A55]/10 border-2 border-[#AD8A55]/30 flex items-center justify-center mx-auto text-[#AD8A55]">
              <LogIn size={36} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F2E9] text-[#AD8A55] text-xs font-bold border border-[#E2D7C3]">
                <Sparkles size={12} />
                <span>خطوة واحدة لتأكيد طلبك</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1610]">تسجيل الدخول مطلوب</h2>
              <p className="text-xs text-[#705F4E] leading-relaxed">
                يرجى تسجيل الدخول أو إنشاء حساب لمتابعة شحن طلبك وحفظ بيانات التوصيل بأمان.
              </p>
            </div>

            {/* Google 1-Click Button */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: `${window.location.origin}/checkout` })}
              className="w-full py-3.5 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>المتابعة بحساب Google مباشرة</span>
            </button>

            {/* Email Login / Register Link */}
            <Link
              href="/login?callbackUrl=/checkout"
              className="block w-full py-3.5 bg-[#1C1610] hover:bg-[#AD8A55] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md text-center"
            >
              تسجيل الدخول بالبريد أو إنشاء حساب جديد
            </Link>
          </div>
        </main>

        <footer className="py-6 text-center text-[11px] text-[#705F4E] border-t border-gray-100">
          <p>© 2026 دار كنوز للأزياء التراثية والملكية — جميع الحقوق محفوظة</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1C1C1E] transition-all">
            <ArrowRight size={16} />
            <span>العودة للمتجر</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image src="/kounoz-logo.png" alt="كنوز" fill className="object-contain" />
            </div>
            <span className="font-serif text-lg font-bold text-[#1C1C1E]">إتمام الطلب</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Lock size={12} />
            <span>آمن ومشفر</span>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-xs">
            {(['info', 'payment', 'confirm'] as Step[]).map((s, i) => {
              const labels = ['بيانات الشحن', 'طريقة الدفع', 'تأكيد الطلب'];
              const active = step === s;
              const done = (step === 'payment' && s === 'info') || (step === 'confirm' && (s === 'info' || s === 'payment'));
              return (
                <React.Fragment key={s}>
                  {i > 0 && <div className={`w-12 h-px ${done ? 'bg-[#C5A059]' : 'bg-gray-200'}`} />}
                  <div className={`flex items-center gap-1.5 font-medium transition-all ${active ? 'text-[#C5A059]' : done ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? 'bg-emerald-100 text-emerald-600' : active ? 'bg-[#C5A059] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className="hidden sm:inline">{labels[i]}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── Main Form ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* STEP 1: Shipping Info */}
          {step === 'info' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={16} className="text-[#C5A059]" />
                <h2 className="font-semibold text-[#1C1C1E] text-sm">بيانات التواصل والشحن</h2>
              </div>
              <div className="p-6 space-y-5">
                {/* Contact */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Mail size={12} />
                    معلومات التواصل
                  </p>
                  <div className="space-y-3">
                    <InputField label="البريد الإلكتروني" fieldKey="email" type="email" placeholder="example@gmail.com" value={form.email} error={errors.email} onChange={update} />
                    <InputField label="رقم الهاتف / الجوال" fieldKey="phone" type="tel" placeholder="01000000000" value={form.phone} error={errors.phone} onChange={update} />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <User size={12} />
                    بيانات المستلم
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <InputField label="الاسم الأول" fieldKey="firstName" placeholder="محمد" half value={form.firstName} error={errors.firstName} onChange={update} />
                      <InputField label="الاسم الأخير" fieldKey="lastName" placeholder="أحمد" half value={form.lastName} error={errors.lastName} onChange={update} />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">الدولة</label>
                      <div className="relative">
                        <select
                          value={form.country}
                          onChange={(e) => update('country', e.target.value)}
                          className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] transition-all pr-4 pl-10"
                        >
                          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <InputField label="المدينة" fieldKey="city" placeholder="القاهرة" value={form.city} error={errors.city} onChange={update} />
                    <InputField label="العنوان بالتفصيل (الشارع، الحي)" fieldKey="address" placeholder="شارع النيل، مدينة نصر" value={form.address} error={errors.address} onChange={update} />
                    <InputField label="رقم الشقة / الدور / إضافة (اختياري)" fieldKey="apartment" placeholder="الدور الثالث، شقة 12" value={form.apartment} error={errors.apartment} onChange={update} />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={handleNextStep}
                  className="w-full py-3.5 bg-[#1C1C1E] hover:bg-[#C5A059] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  المتابعة لطريقة الدفع
                  <ArrowRight size={15} className="rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 'payment' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <CreditCard size={16} className="text-[#C5A059]" />
                <h2 className="font-semibold text-[#1C1C1E] text-sm">طريقة الدفع</h2>
              </div>
              <div className="p-6 space-y-4">
                {/* COD */}
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.payment === 'cod' ? 'border-[#C5A059] bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={() => update('payment', 'cod')} className="w-4 h-4 accent-[#C5A059]" />
                  <Banknote size={22} className={form.payment === 'cod' ? 'text-[#C5A059]' : 'text-gray-400'} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#1C1C1E]">الدفع عند الاستلام (Cash on Delivery)</p>
                    <p className="text-xs text-gray-500 mt-0.5">ادفع نقداً عند وصول الطلب لباب منزلك</p>
                  </div>
                </label>

                {/* Visa */}
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.payment === 'visa' ? 'border-[#C5A059] bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="visa" checked={form.payment === 'visa'} onChange={() => update('payment', 'visa')} className="w-4 h-4 accent-[#C5A059]" />
                  <CreditCard size={22} className={form.payment === 'visa' ? 'text-[#C5A059]' : 'text-gray-400'} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#1C1C1E]">بطاقة ائتمان / Visa / MasterCard</p>
                    <p className="text-xs text-gray-500 mt-0.5">دفع إلكتروني آمن ومشفر</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>
                    <div className="w-8 h-5 bg-red-500 rounded text-white text-[8px] font-bold flex items-center justify-center">MC</div>
                  </div>
                </label>

                {/* Card Fields */}
                {form.payment === 'visa' && (
                  <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
                    <InputField label="الاسم على البطاقة" fieldKey="cardName" placeholder="MOHAMED AHMED" value={form.cardName} error={errors.cardName} onChange={update} />

                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">رقم البطاقة</label>
                      <input
                        type="text"
                        value={form.cardNumber}
                        onChange={(e) => update('cardNumber', fmtCard(e.target.value))}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300 tracking-widest ${errors.cardNumber ? 'border-red-300' : 'border-gray-200 focus:ring-[#C5A059]/20 focus:border-[#C5A059]'}`}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">تاريخ الانتهاء</label>
                        <input
                          type="text"
                          value={form.cardExpiry}
                          onChange={(e) => update('cardExpiry', fmtExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300 ${errors.cardExpiry ? 'border-red-300' : 'border-gray-200 focus:ring-[#C5A059]/20 focus:border-[#C5A059]'}`}
                        />
                        {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-[#1C1C1E] mb-1.5">CVV / CVC</label>
                        <input
                          type="text"
                          value={form.cardCvc}
                          onChange={(e) => update('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="000"
                          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#1C1C1E] focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300 ${errors.cardCvc ? 'border-red-300' : 'border-gray-200 focus:ring-[#C5A059]/20 focus:border-[#C5A059]'}`}
                        />
                        {errors.cardCvc && <p className="text-red-500 text-xs mt-1">{errors.cardCvc}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                      <Lock size={11} />
                      <span>بياناتك مشفرة بتقنية SSL 256-bit</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <button onClick={() => setStep('info')} className="flex-none px-4 py-3.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-gray-400 transition-all">
                  رجوع
                </button>
                <button onClick={handleNextStep} className="flex-1 py-3.5 bg-[#1C1C1E] hover:bg-[#C5A059] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2">
                  مراجعة الطلب
                  <ArrowRight size={15} className="rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[#1C1C1E] text-sm">مراجعة بيانات الطلب</h2>
                </div>
                <div className="px-6 py-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">الاسم</p>
                    <p className="font-semibold text-[#1C1C1E]">{form.firstName} {form.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">الهاتف</p>
                    <p className="font-semibold text-[#1C1C1E]">{form.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">الإيميل</p>
                    <p className="font-semibold text-[#1C1C1E] text-xs break-all">{form.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">طريقة الدفع</p>
                    <p className="font-semibold text-[#1C1C1E]">{form.payment === 'cod' ? '💵 عند الاستلام' : '💳 Visa / بطاقة'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-1">عنوان التسليم</p>
                    <p className="font-semibold text-[#1C1C1E]">
                      {form.address}{form.apartment ? `، شقة ${form.apartment}` : ''} — {form.city}، {form.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('payment')} className="flex-none px-4 py-3.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-gray-400 transition-all">
                  رجوع
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="flex-1 py-4 bg-[#C5A059] hover:bg-[#b8934e] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" />جاري إرسال الطلب...</>
                  ) : (
                    <><Package size={16} />تأكيد وإرسال الطلب</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Order Summary ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <ShoppingBag size={15} className="text-[#C5A059]" />
              <h3 className="font-semibold text-[#1C1C1E] text-sm">ملخص الطلب</h3>
              <span className="mr-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'منتج' : 'منتجات'}
              </span>
            </div>

            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-1 -left-1 w-4 h-4 bg-[#1C1C1E] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1C1C1E] truncate">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {item.size && <span className="bg-gray-100 px-1.5 py-0.5 rounded ml-1">{item.size}</span>}
                        {item.color && <span>{item.color}</span>}
                      </p>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#1C1C1E] flex-shrink-0">{(item.price * item.quantity).toFixed(0)} ج.م</p>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 space-y-3 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>المجموع الجزئي</span>
                <span>{totalAmount.toFixed(0)} ج.م</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>الشحن</span>
                {shipping === 0
                  ? <span className="text-emerald-600 font-semibold">مجاني ✨</span>
                  : <span>{shipping} ج.م</span>
                }
              </div>
              {shipping > 0 && <p className="text-[10px] text-gray-400">الشحن مجاني للطلبات فوق 500 ج.م</p>}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-[#1C1C1E]">
                <span>الإجمالي</span>
                <span className="text-[#C5A059] text-lg">{total.toFixed(0)} ج.م</span>
              </div>
            </div>

            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                <Lock size={12} className="text-emerald-500 flex-shrink-0" />
                <span>جميع بياناتك محمية ومشفرة بالكامل</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
