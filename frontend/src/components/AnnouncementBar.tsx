'use client';

import React from 'react';

export function AnnouncementBar() {
  const announcements = [
    'نهاية الصيف بدأت',
    'خصم 30% عالقطعة الثانية ( منتجات مختارة )',
    'شحن مجاني للطلبات فوق 450 جنيه',
    'Golden guarantee of customer satisfaction',
    'End-of-summer sales have begun',
  ];

  return (
    <div 
      suppressHydrationWarning
      className="w-full bg-gradient-to-r from-[#22060E] via-[#4A0A19] to-[#22060E] text-slate-200 text-xs font-medium py-2.5 overflow-hidden border-b border-[#7A0C28]/40 select-none shadow-sm relative z-50 notranslate"
    >
      <div className="animate-ticker cursor-pointer" suppressHydrationWarning>
        {/* We repeat the announcements multiple times for a seamless infinite loop */}
        {[...Array(4)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex items-center gap-6 shrink-0 px-4" suppressHydrationWarning>
            {announcements.map((item, idx) => (
              <div key={`${groupIndex}-${idx}`} className="flex items-center gap-6 shrink-0" suppressHydrationWarning>
                <span className="whitespace-nowrap font-medium text-xs tracking-wide text-slate-200" suppressHydrationWarning>
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80 shadow-[0_0_6px_rgba(244,63,94,0.6)] shrink-0 inline-block" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
