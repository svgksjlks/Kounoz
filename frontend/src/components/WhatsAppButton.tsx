'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, CheckCircle2, PhoneCall } from 'lucide-react';
import { getWhatsAppNumber, formatWhatsAppUrl, getStoreSettings } from '../lib/api';

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('01000943197');
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  const loadNumber = () => {
    const num = getWhatsAppNumber();
    setWhatsappNumber(num);
  };

  useEffect(() => {
    setMounted(true);
    loadNumber();

    const handleUpdate = () => loadNumber();
    window.addEventListener('kounoz_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kounoz_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (!mounted) return null;

  const handleDirectChat = (presetText?: string) => {
    const textToSend = presetText || customMsg || 'مرحباً، أود الاستفسار والطلب من تشكيلة كنوز الفاخرة.';
    const url = formatWhatsAppUrl(whatsappNumber, textToSend);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-20 sm:left-6 z-40 flex flex-col items-start" dir="rtl">
      {/* Quick Chat Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-80 sm:w-96 bg-card rounded-2xl border border-border-subtle shadow-2xl overflow-hidden text-right"
          >
            {/* Header */}
            <div className="bg-[#1C1610] text-[#F6F2E9] p-4 flex items-center justify-between border-b border-[#8C6B4F]/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                    <MessageCircle size={22} className="fill-current text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#1C1610] rounded-full animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                    <span>خدمة عملاء كنوز</span>
                    <Sparkles size={13} className="text-[#AD8A55]" />
                  </h4>
                  <p className="text-[11px] text-[#D8C6A3]">متصل الآن للطلب الفوري والمساعدة</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#D8C6A3] hover:text-white p-1 rounded-md transition-smooth"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 bg-[#FAF8F5]">
              <div className="p-3 bg-white rounded-xl border border-border-subtle shadow-xs text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 size={14} />
                  <span>الرقم المعتمد للطلب:</span>
                </div>
                <p className="text-[#1C1610] font-mono font-bold tracking-wider text-sm dir-ltr text-right">
                  {whatsappNumber}
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted block">خيارات سريعة للمحادثة:</span>
                <button
                  type="button"
                  onClick={() => handleDirectChat('السلام عليكم، أود المساعدة في اختيار المقاس المناسب وطريقة الطلب.')}
                  className="w-full text-right p-2.5 bg-white hover:bg-[#EFE9DB] rounded-lg border border-border-subtle text-xs text-[#1C1610] font-medium transition-smooth flex items-center justify-between"
                >
                  <span>استفسار عن المقاسات والخامات 📏</span>
                  <Send size={12} className="text-[#AD8A55] rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectChat('السلام عليكم، أود الاستفسار عن الشحن والتوصيل لعنواني.')}
                  className="w-full text-right p-2.5 bg-white hover:bg-[#EFE9DB] rounded-lg border border-border-subtle text-xs text-[#1C1610] font-medium transition-smooth flex items-center justify-between"
                >
                  <span>مدة الشحن والتوصيل السريع 🚚</span>
                  <Send size={12} className="text-[#AD8A55] rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectChat('السلام عليكم، أود معرفة العروض والخصومات المتاحة حالياً.')}
                  className="w-full text-right p-2.5 bg-white hover:bg-[#EFE9DB] rounded-lg border border-border-subtle text-xs text-[#1C1610] font-medium transition-smooth flex items-center justify-between"
                >
                  <span>الاستفسار عن العروض الخاصة ✨</span>
                  <Send size={12} className="text-[#AD8A55] rotate-180" />
                </button>
              </div>

              {/* Custom Input */}
              <div className="space-y-1.5 pt-1">
                <input
                  type="text"
                  placeholder="أو اكتب رسالتك هنا مباشرة..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleDirectChat();
                  }}
                  className="w-full px-3 py-2.5 bg-white text-xs text-[#1C1610] rounded-lg border border-border-subtle focus:border-emerald-600 focus:outline-none placeholder:text-muted"
                />
              </div>

              {/* Direct WhatsApp button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDirectChat()}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-smooth shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="fill-current" />
                <span>فتح المحادثة على واتساب الآن</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <div className="relative flex items-center group">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-white/80"
          aria-label="تواصل واطلب عبر واتساب"
        >
          {/* Subtle glow effect */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-sm animate-pulse pointer-events-none" />

          {/* Animated WhatsApp Icon */}
          <MessageCircle size={28} className="fill-current text-white relative z-10 transition-transform group-hover:rotate-6" />

          {/* Online status indicator */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-emerald-800 rounded-full shadow-sm" />
        </motion.button>

        {/* Hover Pill / Tooltip */}
        <div className="absolute right-full mr-3 hidden sm:flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#1C1610] text-[#F6F2E9] text-xs font-bold px-3.5 py-2 rounded-xl shadow-xl border border-[#8C6B4F]/30 whitespace-nowrap flex items-center gap-2">
            <span>اطلب عبر واتساب</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
}
