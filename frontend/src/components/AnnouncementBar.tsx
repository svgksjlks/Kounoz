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
      className="w-full bg-[#AD8A55] text-white text-xs font-semibold py-2.5 overflow-hidden border-b border-[#8C6B4F]/30 select-none shadow-sm relative z-50 notranslate"
    >
      <div className="animate-ticker cursor-pointer" suppressHydrationWarning>
        {/* We repeat the announcements multiple times for a seamless infinite loop */}
        {[...Array(4)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex items-center gap-6 shrink-0 px-4" suppressHydrationWarning>
            {announcements.map((item, idx) => (
              <div key={`${groupIndex}-${idx}`} className="flex items-center gap-6 shrink-0" suppressHydrationWarning>
                <span className="whitespace-nowrap font-semibold text-xs tracking-wide" suppressHydrationWarning>
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0 inline-block" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
