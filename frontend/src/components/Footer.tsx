'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { getStoreSettings, formatWhatsAppUrl } from '../lib/api';

export function Footer() {
  const { dir } = useLanguage();
  const [storeSettings, setStoreSettings] = useState(() => getStoreSettings());

  useEffect(() => {
    setStoreSettings(getStoreSettings());
    const handleUpdate = () => {
      setStoreSettings(getStoreSettings());
    };
    window.addEventListener('kounoz_settings_updated', handleUpdate);
    return () => window.removeEventListener('kounoz_settings_updated', handleUpdate);
  }, []);

  const phone = storeSettings.store_phone || storeSettings.whatsapp_number || '01022822123';
  const wholesalePhone = storeSettings.wholesale_phone || '01066583964';
  const email = storeSettings.store_email || 'Kounozthobe@gmail.com';

  return (
    <footer className="bg-[#0B0B0E] text-gray-300 pt-20 pb-12 mt-28 border-t border-[#6E0D25]/40" dir={dir}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-right">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-[#FAF6EE] p-1.5 border border-[#D4AF37]/50 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src="/kounoz-logo.png"
                  alt="شعار كنوز"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-extrabold tracking-wide text-noir leading-none">كنوز</h3>
                <span className="text-[11px] tracking-[0.25em] text-rose-300 font-bold uppercase block mt-0.5">KOUNOZ</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed font-normal pt-2">
              كنوز علامة متخصصة في صناعة الثوب العربي، تستند إلى خبرة تمتد لأكثر من 20 عامًا في الصين وتركيا ومصر، نصنع فيها الأناقة ونحافظ على الأصالة بأدق تفاصيل القص والتفصيل.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-4">التشكيلات</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li><Link href="/#collection" className="hover:text-gray-200 transition-smooth">تخفيضات</Link></li>
              <li><Link href="/#collection" className="hover:text-gray-200 transition-smooth">وصل حديثاً</Link></li>
              <li><Link href="/#collection" className="hover:text-gray-200 transition-smooth">كولكشن الشتوي</Link></li>
              <li><Link href="/#collection" className="hover:text-gray-200 transition-smooth">كولكشن الصيفي</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-4">خدمة العملاء والإدارة</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li>
                <a
                  href={formatWhatsAppUrl(storeSettings.whatsapp_number, 'مرحباً، أود الاستفسار والطلب من متجر كنوز')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-smooth text-emerald-400 font-semibold flex items-center gap-1.5"
                >
                  <span>💬 الطلب المباشر عبر واتساب</span>
                </a>
              </li>
              <li><a href={`tel:${phone}`} className="hover:text-gray-200 transition-smooth">الاتصال المباشر ({phone})</a></li>
              <li><a href={`mailto:${email}`} className="hover:text-gray-200 transition-smooth">التواصل: {email}</a></li>
              <li><Link href="/#about" className="hover:text-gray-200 transition-smooth">دليل المقاسات</Link></li>
              <li>
                <a href={`tel:${wholesalePhone}`} className="hover:text-gray-200 transition-smooth">
                  لطلب الجملة الاتصال على : <span dir="ltr">{wholesalePhone}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} كنوز KOUNOZ للملابس العربية الفاخرة. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-2">
            <span>فخامة وأصالة تدوم</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
