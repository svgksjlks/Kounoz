import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-[#1C1610] text-[#F6F2E9] pt-20 pb-12 mt-28 border-t border-[#8C6B4F]/20" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-right">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white/10 p-1 rounded-full flex-shrink-0">
                <Image
                  src="/kounoz-logo.png"
                  alt="شعار كنوز"
                  fill
                  className="object-contain filter invert"
                />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-extrabold tracking-wide text-white leading-none">كنوز</h3>
                <span className="text-[11px] tracking-[0.25em] text-[#D8C6A3] font-bold uppercase block mt-0.5">KOUNOZ</span>
              </div>
            </div>
            <p className="text-sm text-[#D8C6A3] max-w-sm leading-relaxed font-normal pt-2">
              صناعة راقية للجلابيب والأثواب والملابس العربية التراثية بلمسة معاصرة وأقمشة طبيعية 100% لخلق إطلالة تعكس الفخامة والأصالة الملكية.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#AD8A55] mb-4">التشكيلات</h4>
            <ul className="space-y-3 text-sm text-[#D8C6A3] font-medium">
              <li><Link href="/#collection" className="hover:text-white transition-smooth">جلابيب كلاسيكية</Link></li>
              <li><Link href="/#collection" className="hover:text-white transition-smooth">أثواب ملكية</Link></li>
              <li><Link href="/#collection" className="hover:text-white transition-smooth">بشوت ومناسبات</Link></li>
              <li><Link href="/#collection" className="hover:text-white transition-smooth">إكسسوارات وشيل</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#AD8A55] mb-4">خدمة العملاء والإدارة</h4>
            <ul className="space-y-3 text-sm text-[#D8C6A3] font-medium">
              <li><a href="tel:+9668001234567" className="hover:text-white transition-smooth">الاتصال المباشر</a></li>
              <li><a href="mailto:concierge@kounoz.sa" className="hover:text-white transition-smooth">خدمة الكونسيرج</a></li>
              <li><Link href="/#about" className="hover:text-white transition-smooth">دليل المقاسات</Link></li>
              <li><Link href="/admin" className="text-white font-bold hover:text-[#AD8A55] transition-smooth">لوحة تحكم الإدارة (Admin)</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8C6A3] gap-4">
          <p>© {new Date().getFullYear()} كنوز KOUNOZ للملابس العربية الفاخرة. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-2">
            <span>فخامة وأصالة تدوم</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
