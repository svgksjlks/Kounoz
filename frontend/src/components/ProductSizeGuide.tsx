'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Sparkles, Check, ChevronDown, ChevronUp, UserCheck, HelpCircle } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductSizeGuideProps {
  product: Product;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  defaultOpen?: boolean;
}

// تحويل الطول بالسنتيمتر إلى مقاس طول الثوب المعتمد (52 إلى 64)
export function heightToThobeLength(h: number): string {
  if (h < 160) return '52';
  if (h < 165) return '54';
  if (h < 170) return '56';
  if (h < 175) return '58';
  if (h < 180) return '60';
  if (h < 185) return '62';
  return '64';
}

// تحويل محيط الصدر/العرض بالسنتيمتر إلى رمز عرض الثوب (XS إلى XXL)
export function chestWidthToLetter(w: number): string {
  if (w < 96) return 'XS';
  if (w < 103) return 'S';
  if (w < 111) return 'M';
  if (w < 121) return 'L';
  if (w < 131) return 'XL';
  return 'XXL';
}

// أعمدة العرض المعتمدة وفق مصفوفة كنوز
export const KOUNOZ_WIDTH_COLUMNS = [
  { label: 'XS', sub: '92-96 سم', weight: '55-60 kg' },
  { label: 'S', sub: '96-102 سم', weight: '60-65 kg' },
  { label: 'M', sub: '102-108 سم', weight: '65-70 kg' },
  { label: 'L', sub: '108-114 سم', weight: '70-75 kg' },
  { label: 'L', sub: '114-120 سم', weight: '75-80 kg' },
  { label: 'XL', sub: '120-126 سم', weight: '80-85 kg' },
  { label: 'XL', sub: '126-132 سم', weight: '85-90 kg' },
  { label: 'XXL', sub: '132-138 سم', weight: '90-95 kg' },
  { label: 'XXL', sub: '138-144 سم', weight: '95-100 kg' },
  { label: 'XXL+', sub: '144+ سم', weight: '100-105 kg' },
];

export const KOUNOZ_HEIGHT_ROWS = [
  {
    heightLabel: '155-160 سم (طول 52)',
    minH: 155,
    maxH: 160,
    cells: ['52L', '52L', '52XL', '52XXL', '-', '-', '-', '-', '-', '-'],
  },
  {
    heightLabel: '160-165 سم (طول 54)',
    minH: 160,
    maxH: 165,
    cells: ['54M', '54L', '54L', '54XL', '54XXL', '-', '-', '-', '-', '-'],
  },
  {
    heightLabel: '165-170 سم (طول 56)',
    minH: 165,
    maxH: 170,
    cells: ['56S', '56M', '56L', '56L', '56XL', '56XXL', '-', '-', '-', '-'],
  },
  {
    heightLabel: '170-175 سم (طول 58)',
    minH: 170,
    maxH: 175,
    cells: ['58S', '58S', '58M', '58L', '58L', '58XL', '58XXL', '-', '-', '-'],
  },
  {
    heightLabel: '175-180 سم (طول 60)',
    minH: 175,
    maxH: 180,
    cells: ['-', '60XS', '60S', '60M', '60L', '60L', '60XL', '60XXL', '-', '-'],
  },
  {
    heightLabel: '180-185 سم (طول 62)',
    minH: 180,
    maxH: 185,
    cells: ['-', '-', '62XS', '62S', '62M', '62L', '62L', '62XL', '62XXL', '-'],
  },
  {
    heightLabel: '185-190 سم (طول 64)',
    minH: 185,
    maxH: 190,
    cells: ['-', '-', '-', '64XS', '64S', '64M', '64L', '64L', '64XL', '64XXL'],
  },
];

// دالة احتساب المقاس حسب الطول والعرض (محيط الصدر)
export function calculateRecommendedSize(
  product: Product,
  height: number,
  width: number,
  fit: 'slim' | 'regular' | 'wide'
): { size: string; note: string } {
  // تحديد صف الطول (0 إلى 6)
  let rowIdx = 3; // افتراضي 170-175 سم (طول 58)
  if (height < 160) rowIdx = 0;
  else if (height < 165) rowIdx = 1;
  else if (height < 170) rowIdx = 2;
  else if (height < 175) rowIdx = 3;
  else if (height < 180) rowIdx = 4;
  else if (height < 185) rowIdx = 5;
  else rowIdx = 6;

  // تحديد عمود العرض (0 إلى 9) حسب محيط الصدر بالسنتيمتر
  let colIdx = 4; // افتراضي ~114 سم (L)
  if (width < 96) colIdx = 0;
  else if (width < 101) colIdx = 1;
  else if (width < 107) colIdx = 2;
  else if (width < 114) colIdx = 3;
  else if (width < 120) colIdx = 4;
  else if (width < 126) colIdx = 5;
  else if (width < 132) colIdx = 6;
  else if (width < 138) colIdx = 7;
  else if (width < 144) colIdx = 8;
  else colIdx = 9;

  // ضبط التفضيل (سليم / معتدل / واسع)
  if (fit === 'slim' && colIdx > 0) colIdx -= 1;
  if (fit === 'wide' && colIdx < 9) colIdx += 1;

  // قراءة المقاس من جدول كنوز المعتمد
  const targetRow = KOUNOZ_HEIGHT_ROWS[rowIdx];
  let sizeFound = targetRow.cells[colIdx];

  // إذا كانت الخلية '-'، نأخذ أقرب مقاس صالح في نفس الصف
  if (sizeFound === '-') {
    const validCells = targetRow.cells
      .map((val, idx) => ({ val, idx }))
      .filter((c) => c.val !== '-');
    if (validCells.length > 0) {
      validCells.sort((a, b) => Math.abs(a.idx - colIdx) - Math.abs(b.idx - colIdx));
      sizeFound = validCells[0].val;
    } else {
      sizeFound = '58L';
    }
  }

  const lengthCode = heightToThobeLength(height);
  const widthCode = chestWidthToLetter(width);

  return {
    size: sizeFound,
    note: `المقاس المعتمد وفق جدول كنوز لطول قامة ${height} سم (طول ${lengthCode}) وعرض صدر ${width} سم (عرض ${widthCode}) هو (${sizeFound}).`,
  };
}

export function ProductSizeGuide({
  product,
  selectedSize,
  onSelectSize,
  defaultOpen = false,
}: ProductSizeGuideProps) {
  const { dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<'calculator' | 'table' | 'howto'>('calculator');

  // Interactive Calculator State (طول وعرض)
  const [height, setHeight] = useState<number>(175);
  const [width, setWidth] = useState<number>(112); // محيط الصدر بالسنتيمتر
  const [fitPreference, setFitPreference] = useState<'slim' | 'regular' | 'wide'>('regular');
  const [appliedToast, setAppliedToast] = useState(false);

  const recommendation = useMemo(() => {
    return calculateRecommendedSize(product, height, width, fitPreference);
  }, [product, height, width, fitPreference]);

  const handleApplySize = () => {
    onSelectSize(recommendation.size);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  return (
    <div className="bg-surface/60 rounded-xl border border-border-subtle overflow-hidden text-right" dir={dir}>
      {/* Header Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-surface transition-smooth focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-noir text-[#D8C6A3] flex items-center justify-center shadow-xs">
            <Ruler size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-noir">
                دليل وحاسبة المقاسات الذكية
              </span>
              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-rose-300 text-[10px] font-extrabold flex items-center gap-1 border border-accent/30">
                <Sparkles size={10} />
                <span>احسب مقاسك حسب الطول والعرض</span>
              </span>
            </div>
            <p className="text-[11px] text-muted">
              اضغط لتحديد قياسك المثالي بدقة أو استعراض جدول المقاسات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted">
          <span className="text-xs font-semibold hidden sm:inline">
            {isOpen ? 'إخفاء الدليل' : 'فتح الحاسبة والجدول'}
          </span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-border-subtle bg-card"
          >
            {/* Tabs */}
            <div className="flex border-b border-border-subtle bg-main text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-smooth border-b-2 ${
                  activeTab === 'calculator'
                    ? 'border-accent text-noir bg-card shadow-xs'
                    : 'border-transparent text-muted hover:text-noir'
                }`}
              >
                <Sparkles size={13} className="text-accent" />
                <span>حاسبة المقاس حسب الطول والعرض</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-smooth border-b-2 ${
                  activeTab === 'table'
                    ? 'border-accent text-noir bg-card shadow-xs'
                    : 'border-transparent text-muted hover:text-noir'
                }`}
              >
                <Ruler size={13} className="text-accent" />
                <span>جدول القياسات التفصيلي</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('howto')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-smooth border-b-2 ${
                  activeTab === 'howto'
                    ? 'border-accent text-noir bg-card shadow-xs'
                    : 'border-transparent text-muted hover:text-noir'
                }`}
              >
                <HelpCircle size={13} className="text-accent" />
                <span>كيف تأخذ مقاسك</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* ── TAB 1: CALCULATOR (طول وعرض) ───────────────────────── */}
              {activeTab === 'calculator' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Height Slider & Input (الطول) */}
                    <div className="p-4 bg-surface rounded-xl border border-border-subtle space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-noir flex items-center gap-1.5">
                          <Ruler size={14} className="text-accent" />
                          <span>طولك التقريبي:</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-card rounded-md font-mono font-extrabold text-xs text-noir border border-border-subtle">
                            {height} سم
                          </span>
                          <span className="px-2 py-0.5 rounded bg-accent/20 text-rose-300 text-[10px] font-bold">
                            طول {heightToThobeLength(height)}
                          </span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={150}
                        max={205}
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full accent-accent cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted font-mono">
                        <span>150 سم (طول 50)</span>
                        <span>175 سم (طول 58)</span>
                        <span>205 سم (طول 64)</span>
                      </div>

                      {/* اختصارات أطوال الثوب السريعة */}
                      <div className="grid grid-cols-6 gap-1 pt-1">
                        {[
                          { h: 158, label: '52' },
                          { h: 163, label: '54' },
                          { h: 168, label: '56' },
                          { h: 173, label: '58' },
                          { h: 178, label: '60' },
                          { h: 183, label: '62' },
                        ].map((item) => {
                          const active = heightToThobeLength(height) === item.label;
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => setHeight(item.h)}
                              className={`py-1 text-[10px] font-bold rounded border transition-all text-center ${
                                active
                                  ? 'bg-noir text-[#D8C6A3] border-noir shadow-xs'
                                  : 'bg-card hover:bg-surface text-muted border-border-subtle'
                              }`}
                            >
                              طول {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Width Slider & Input (العرض / محيط الصدر) */}
                    <div className="p-4 bg-surface rounded-xl border border-border-subtle space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-noir flex items-center gap-1.5">
                          <UserCheck size={14} className="text-[#C5A059]" />
                          <span>عرضك التقريبي (محيط الصدر):</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-card rounded-md font-mono font-extrabold text-xs text-noir border border-border-subtle">
                            {width} سم
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#E5C378] text-[10px] font-bold">
                            عرض {chestWidthToLetter(width)}
                          </span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={90}
                        max={145}
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full accent-accent cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted font-mono">
                        <span>90 سم (عرض S)</span>
                        <span>112 سم (عرض L معتدل)</span>
                        <span>145 سم (عرض XXL)</span>
                      </div>

                      {/* اختصارات العرض السريعة (S, M, L, XL, XXL) */}
                      <div className="grid grid-cols-5 gap-1 pt-1">
                        {[
                          { label: 'S (رشيق)', cm: 99, key: 'S' },
                          { label: 'M (وسط)', cm: 106, key: 'M' },
                          { label: 'L (قياسي)', cm: 115, key: 'L' },
                          { label: 'XL (عريض)', cm: 125, key: 'XL' },
                          { label: 'XXL (واسع)', cm: 136, key: 'XXL' },
                        ].map((item) => {
                          const active = chestWidthToLetter(width) === item.key;
                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => setWidth(item.cm)}
                              className={`py-1 text-[10px] font-bold rounded border transition-all text-center ${
                                active
                                  ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-xs'
                                  : 'bg-card hover:bg-surface text-muted border-border-subtle'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Fit Preference Buttons */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-noir block">تفضيل القصة وبنية الجسم:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'slim', label: 'قصة رشيقة (سليم)' },
                        { key: 'regular', label: 'قصة كلاسيكية معتدلة' },
                        { key: 'wide', label: 'قصة فضفاضة واسعة' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setFitPreference(item.key as any)}
                          className={`py-2.5 px-2 text-xs font-bold rounded-lg border transition-smooth text-center ${
                            fitPreference === item.key
                              ? 'bg-accent text-slate-100 border-accent shadow-sm'
                              : 'bg-surface hover:bg-card border-border-subtle text-muted'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Result Box */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-[#20050D] via-[#4A0A19] to-[#20050D] rounded-xl border border-accent/40 text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                    <div className="space-y-1 text-center sm:text-right">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-[11px] text-rose-200 font-medium">المقاس المقترح الموصى به لقطعة {product.name}:</span>
                      </div>
                      <div className="flex items-baseline justify-center sm:justify-start gap-3">
                        <span className="font-serif text-3xl font-extrabold text-slate-100 tracking-wide">
                          {recommendation.size}
                        </span>
                        {selectedSize === recommendation.size && (
                          <span className="px-2 py-0.5 rounded bg-emerald-700/80 text-white text-[10px] font-bold">
                            المقاس محدد حالياً ✅
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300/80 max-w-md pt-1">
                        {recommendation.note}
                      </p>
                    </div>

                    <div className="w-full sm:w-auto flex flex-col items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={handleApplySize}
                        className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent-hover text-slate-100 text-xs font-bold rounded-lg transition-smooth shadow-md flex items-center justify-center gap-2"
                      >
                        <Check size={14} />
                        <span>اختيار مقاس {recommendation.size} للمنتج</span>
                      </motion.button>

                      {appliedToast && (
                        <span className="text-[11px] text-emerald-400 font-bold animate-pulse">
                          تم تطبيق المقاس في طلبك بنجاح!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: OFFICIAL SIZE TABLE ───────────────────────────────── */}
              {activeTab === 'table' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                    <div className="space-y-0.5">
                      <span className="font-bold text-noir text-sm block">جدول المقاسات المعتمد (كنوز للثوب العربي)</span>
                      <span className="text-muted text-[11px]">حدد طولك وعرضك لمعرفة رمز المقاس الدقيق (مثال: 58L أو 56M)</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#6E0D25]/20 border border-[#6E0D25]/40 text-rose-300 text-[11px] font-bold self-start sm:self-auto">
                      المصفوفة الرسمية المعتمدة
                    </span>
                  </div>

                  {/* Kounoz Matrix Grid */}
                  <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface/50 shadow-md">
                    <table className="w-full text-xs text-center border-collapse">
                      <thead>
                        <tr className="bg-[#6E0D25] text-white font-bold">
                          <th className="p-3 border-b border-white/20 whitespace-nowrap text-right">
                            الطول \ العرض
                          </th>
                          {KOUNOZ_WIDTH_COLUMNS.map((w, idx) => (
                            <th key={idx} className="p-2 border-b border-white/20 whitespace-nowrap text-[10px]">
                              <div>{w.label}</div>
                              <div className="text-[9px] opacity-80 font-normal">{w.sub}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle text-muted">
                        {KOUNOZ_HEIGHT_ROWS.map((row) => (
                          <tr key={row.heightLabel} className="hover:bg-card/70 transition-smooth">
                            <td className="p-2.5 font-bold text-white bg-card/80 whitespace-nowrap text-right border-l border-border-subtle">
                              {row.heightLabel}
                            </td>
                            {row.cells.map((sizeCell, cIdx) => {
                              const isSelected = selectedSize === sizeCell;
                              return (
                                <td
                                  key={cIdx}
                                  onClick={() => sizeCell !== '-' && onSelectSize(sizeCell)}
                                  className={`p-2 font-mono font-bold transition-all ${
                                    sizeCell === '-'
                                      ? 'text-muted/20 cursor-default'
                                      : isSelected
                                      ? 'bg-[#6E0D25] text-white ring-2 ring-rose-400 cursor-pointer shadow-sm'
                                      : 'text-white/90 hover:bg-[#6E0D25]/40 hover:text-white cursor-pointer'
                                  }`}
                                >
                                  {sizeCell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Official Card Reference Banner */}
                  <div className="p-4 rounded-xl bg-card border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#6E0D25]/20 border border-[#6E0D25]/40 flex items-center justify-center text-rose-300 flex-shrink-0">
                        <Ruler size={18} />
                      </div>
                      <div className="text-right">
                        <h5 className="font-bold text-xs text-white">بطاقة قياسات كنوز الأصلية</h5>
                        <p className="text-[11px] text-muted">تم استخراج القياسات ومطابقتها مباشرة من بطاقة المقاسات المعتمدة لمصانع كنوز.</p>
                      </div>
                    </div>
                    <a
                      href="/images/size-chart.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#6E0D25] hover:bg-[#8B1E3F] text-white text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-sm"
                    >
                      عرض صورة البطاقة الأصلية
                    </a>
                  </div>
                </div>
              )}

              {/* ── TAB 3: HOW TO MEASURE ────────────────────────────────────── */}
              {activeTab === 'howto' && (
                <div className="space-y-4 text-xs text-muted leading-relaxed">
                  <div className="p-4 bg-surface rounded-xl border border-border-subtle space-y-3">
                    <h4 className="font-bold text-noir text-sm flex items-center gap-2">
                      <Ruler size={15} className="text-accent" />
                      <span>طريقة أخذ القياسات بالمتر الشريطي:</span>
                    </h4>
                    <ul className="space-y-2 list-disc list-inside pr-1">
                      <li>
                        <strong className="text-noir">قياس الطول:</strong> قِس من أعلى نقطة في الكتف بمحاذاة الرقبة نزولاً حتى الكاحل، أو استخدم طول ثوب مناسب لديك.
                      </li>
                      <li>
                        <strong className="text-noir">قياس العرض (محيط الصدر):</strong> مرر شريط القياس أفقياً حول أوسع نقطة في الصدر تحت الإبطين مع ترك مسافة إصبعين للراحة.
                      </li>
                      <li>
                        <strong className="text-noir">طول الكُم:</strong> من عظمة بداية الكتف حتى معصم اليد أثناء ثني الذراع قليلاً.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
