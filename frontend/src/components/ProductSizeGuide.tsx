'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Sparkles, Check, ChevronDown, ChevronUp, Info, UserCheck, HelpCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductSizeGuideProps {
  product: Product;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  defaultOpen?: boolean;
}

// Sizing logic helper based on product category, sizes, height, weight, and body build
export function calculateRecommendedSize(
  product: Product,
  height: number,
  weight: number,
  fit: 'slim' | 'regular' | 'wide'
): { size: string; note: string } {
  const sizes = product.sizes || [];
  const category = product.category;

  // 1. Thobes and Jalabiyas (50L, 52L, 54L, 56L, 58L, 60L, 62L)
  const isInchLengthSizing = sizes.some((s) => /^\d{2}L?$/i.test(s.trim()));
  if (isInchLengthSizing) {
    let targetInch = 56;
    if (height < 160) targetInch = 50;
    else if (height < 167) targetInch = 52;
    else if (height < 173) targetInch = 54;
    else if (height < 179) targetInch = 56;
    else if (height < 185) targetInch = 58;
    else if (height < 192) targetInch = 60;
    else targetInch = 62;

    // Weight/Fit adjustment: if wide or heavy weight, suggest standard or wide cut
    const sizeSuffix = sizes.some((s) => s.includes('L')) ? 'L' : '';
    let chosen = `${targetInch}${sizeSuffix}`;

    // Find nearest matching size from product's actual available sizes
    if (!sizes.includes(chosen)) {
      const numericSizes = sizes
        .map((s) => ({ raw: s, num: parseInt(s.replace(/\D/g, '')) }))
        .filter((s) => !isNaN(s.num));
      if (numericSizes.length > 0) {
        numericSizes.sort((a, b) => Math.abs(a.num - targetInch) - Math.abs(b.num - targetInch));
        chosen = numericSizes[0].raw;
      } else {
        chosen = sizes[0] || '56L';
      }
    }

    let fitComment = 'طول مثالي يصل حتى أعلى الكعبين مع وسع مريح.';
    if (fit === 'slim') fitComment = 'قصة رشيقة ملائمة لطولك ووزنك.';
    if (fit === 'wide' || weight > 95) fitComment = 'مقاس يوفر رحابة وسعة ممتازة لحرية الحركة والراحة.';

    return { size: chosen, note: fitComment };
  }

  // 2. Bisht sizes (27, 28, 29, 30)
  const isBishtSizing = sizes.some((s) => ['27', '28', '29', '30'].includes(s.trim()));
  if (isBishtSizing) {
    let bishtSize = '28';
    if (height < 167) bishtSize = '27';
    else if (height < 174) bishtSize = '28';
    else if (height < 182) bishtSize = '29';
    else bishtSize = '30';

    if (!sizes.includes(bishtSize)) bishtSize = sizes[0] || '28';
    return {
      size: bishtSize,
      note: `قياس البشت الملكي ${bishtSize} ملائم تماماً لقامة طولها ${height} سم ليمنحك هيبة وانسدالاً متناسقاً.`,
    };
  }

  // 3. Shemagh / Accessories (52, 55, 58, 60)
  const isShemaghSizing = sizes.some((s) => ['52', '55', '58', '60'].includes(s.trim()));
  if (isShemaghSizing) {
    let shSize = '58';
    if (height < 163) shSize = '52';
    else if (height < 172) shSize = '55';
    else if (height < 182) shSize = '58';
    else shSize = '60';

    if (!sizes.includes(shSize)) shSize = sizes[0] || '58';
    return {
      size: shSize,
      note: `مقاس الشماغ ${shSize} متناسق تماماً لترسيم وتطابق الأطراف على الرأس.`,
    };
  }

  // 4. Standard S / M / L / XL / 2XL / 3XL
  const standardOrder = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
  const hasStandard = sizes.some((s) => standardOrder.includes(s.toUpperCase()));
  if (hasStandard) {
    let std = 'L';
    if (weight < 65) std = 'S';
    else if (weight < 76) std = 'M';
    else if (weight < 88) std = 'L';
    else if (weight < 100) std = 'XL';
    else if (weight < 115) std = '2XL';
    else std = '3XL';

    if (fit === 'wide' && std !== '3XL') {
      const idx = standardOrder.indexOf(std);
      if (idx !== -1 && idx < standardOrder.length - 1) std = standardOrder[idx + 1];
    }

    if (!sizes.includes(std)) {
      const match = sizes.find((s) => s.toUpperCase() === std);
      if (match) std = match;
      else std = sizes[0] || 'L';
    }

    return { size: std, note: `المقاس ${std} مناسب لوزنك (${weight} كجم) وطولك (${height} سم).` };
  }

  // 5. One Size
  if (sizes.includes('مقاس موحد (One Size)') || sizes.includes('مقاس موحد')) {
    return { size: 'مقاس موحد', note: 'هذه القطعة مصممة بقصة حرة ومرنة تلائم جميع المقاسات والأجسام.' };
  }

  return { size: sizes[0] || '58L', note: 'المقاس المعتمد للقطعة' };
}

export function ProductSizeGuide({
  product,
  selectedSize,
  onSelectSize,
  defaultOpen = false,
}: ProductSizeGuideProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<'calculator' | 'table' | 'howto'>('calculator');

  // Interactive Calculator State
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(75);
  const [fitPreference, setFitPreference] = useState<'slim' | 'regular' | 'wide'>('regular');
  const [appliedToast, setAppliedToast] = useState(false);

  const recommendation = useMemo(() => {
    return calculateRecommendedSize(product, height, weight, fitPreference);
  }, [product, height, weight, fitPreference]);

  const handleApplySize = () => {
    onSelectSize(recommendation.size);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  const isThobeCategory =
    product.category.includes('جلابيب') ||
    product.category.includes('أثواب') ||
    (product.sizes && product.sizes.some((s) => s.includes('L')));

  return (
    <div className="bg-surface/60 rounded-xl border border-border-subtle overflow-hidden text-right" dir="rtl">
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
              <span className="px-2 py-0.5 rounded-full bg-[#AD8A55]/15 text-[#AD8A55] text-[10px] font-extrabold flex items-center gap-1">
                <Sparkles size={10} />
                <span>احسب مقاسك حسب الطول والوزن</span>
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
                    ? 'border-[#AD8A55] text-noir bg-card'
                    : 'border-transparent text-muted hover:text-noir'
                }`}
              >
                <Sparkles size={13} className="text-[#AD8A55]" />
                <span>حاسبة المقاس حسب الطول والوزن</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-smooth border-b-2 ${
                  activeTab === 'table'
                    ? 'border-[#AD8A55] text-noir bg-card'
                    : 'border-transparent text-muted hover:text-noir'
                }`}
              >
                <Ruler size={13} className="text-[#AD8A55]" />
                <span>جدول القياسات التفصيلي</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('howto')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-smooth border-b-2 ${
                  activeTab === 'howto'
                    ? 'border-[#AD8A55] text-noir bg-card'
                    : 'border-transparent text-muted hover:text-noir'
                }`}
              >
                <HelpCircle size={13} className="text-[#AD8A55]" />
                <span>كيف تأخذ مقاسك</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* ── TAB 1: CALCULATOR ────────────────────────────────────────── */}
              {activeTab === 'calculator' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Height Slider & Input */}
                    <div className="p-4 bg-surface rounded-xl border border-border-subtle space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-noir flex items-center gap-1.5">
                          <Ruler size={14} className="text-[#AD8A55]" />
                          <span>طولك التقريبي:</span>
                        </label>
                        <span className="px-2.5 py-1 bg-card rounded-md font-mono font-extrabold text-xs text-noir border border-border-subtle">
                          {height} سم
                        </span>
                      </div>
                      <input
                        type="range"
                        min={150}
                        max={205}
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full accent-[#AD8A55] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted font-mono">
                        <span>150 سم</span>
                        <span>175 سم (متوسط)</span>
                        <span>205 سم</span>
                      </div>
                    </div>

                    {/* Weight Slider & Input */}
                    <div className="p-4 bg-surface rounded-xl border border-border-subtle space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-noir flex items-center gap-1.5">
                          <UserCheck size={14} className="text-[#AD8A55]" />
                          <span>وزنك التقريبي:</span>
                        </label>
                        <span className="px-2.5 py-1 bg-card rounded-md font-mono font-extrabold text-xs text-noir border border-border-subtle">
                          {weight} كجم
                        </span>
                      </div>
                      <input
                        type="range"
                        min={45}
                        max={140}
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full accent-[#AD8A55] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted font-mono">
                        <span>45 كجم</span>
                        <span>75 كجم</span>
                        <span>140 كجم</span>
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
                              ? 'bg-noir text-white border-noir shadow-sm'
                              : 'bg-surface hover:bg-card border-border-subtle text-muted'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Result Box */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1C1610] to-[#2C2218] rounded-xl border border-[#8C6B4F]/40 text-[#F6F2E9] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                    <div className="space-y-1 text-center sm:text-right">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-[11px] text-[#D8C6A3] font-medium">المقاس المقترح الموصى به لقطعة {product.name}:</span>
                      </div>
                      <div className="flex items-baseline justify-center sm:justify-start gap-3">
                        <span className="font-serif text-3xl font-extrabold text-[#D8C6A3] tracking-wide">
                          {recommendation.size}
                        </span>
                        {selectedSize === recommendation.size && (
                          <span className="px-2 py-0.5 rounded bg-emerald-700/80 text-white text-[10px] font-bold">
                            المقاس محدد حالياً ✅
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#EFE9DB]/80 max-w-md pt-1">
                        {recommendation.note}
                      </p>
                    </div>

                    <div className="w-full sm:w-auto flex flex-col items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={handleApplySize}
                        className="w-full sm:w-auto px-6 py-3 bg-[#AD8A55] hover:bg-white hover:text-noir text-white text-xs font-bold rounded-lg transition-smooth shadow-md flex items-center justify-center gap-2"
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

              {/* ── TAB 2: SIZE TABLE ───────────────────────────────────────── */}
              {activeTab === 'table' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="font-bold text-noir">جدول المقاسات المعتمد لتشكيلة ({product.category}):</span>
                    <span>القياسات بالإنش والسنتيمتر</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface/50">
                    {isThobeCategory ? (
                      <table className="w-full text-xs text-right border-collapse">
                        <thead>
                          <tr className="bg-main border-b border-border-subtle text-noir font-bold">
                            <th className="p-3">المقاس بالإنش</th>
                            <th className="p-3">طول الثوب (سم)</th>
                            <th className="p-3">محيط الصدر</th>
                            <th className="p-3">الطول الموصى به</th>
                            <th className="p-3">الوزن المناسب</th>
                            <th className="p-3 text-center">اختيار</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle text-muted">
                          {[
                            { size: '50L', lengthCm: '127 سم', chest: '52 سم', heightRange: '155 - 162 سم', weightRange: '50 - 68 كجم' },
                            { size: '52L', lengthCm: '132 سم', chest: '54 سم', heightRange: '160 - 168 سم', weightRange: '55 - 75 كجم' },
                            { size: '54L', lengthCm: '137 سم', chest: '56 سم', heightRange: '168 - 173 سم', weightRange: '60 - 85 كجم' },
                            { size: '56L', lengthCm: '142 سم', chest: '58 سم', heightRange: '173 - 178 سم', weightRange: '68 - 95 كجم' },
                            { size: '58L', lengthCm: '147 سم', chest: '60 سم', heightRange: '178 - 183 سم', weightRange: '75 - 105 كجم' },
                            { size: '60L', lengthCm: '152 سم', chest: '62 سم', heightRange: '183 - 189 سم', weightRange: '82 - 115 كجم' },
                            { size: '62L', lengthCm: '157 سم', chest: '65 سم', heightRange: '189 - 198 سم', weightRange: '90 - 130 كجم' },
                          ].map((row) => (
                            <tr
                              key={row.size}
                              className={`hover:bg-card transition-smooth ${
                                selectedSize === row.size ? 'bg-card font-bold text-noir' : ''
                              }`}
                            >
                              <td className="p-3 font-mono text-noir font-bold">{row.size}</td>
                              <td className="p-3 font-mono">{row.lengthCm}</td>
                              <td className="p-3 font-mono">{row.chest}</td>
                              <td className="p-3">{row.heightRange}</td>
                              <td className="p-3">{row.weightRange}</td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => onSelectSize(row.size)}
                                  className={`px-3 py-1 rounded text-[11px] font-bold transition-smooth ${
                                    selectedSize === row.size
                                      ? 'bg-noir text-white'
                                      : 'bg-surface hover:bg-noir hover:text-white text-noir border border-border-subtle'
                                  }`}
                                >
                                  {selectedSize === row.size ? 'المختار' : 'اختر'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-xs text-right border-collapse">
                        <thead>
                          <tr className="bg-main border-b border-border-subtle text-noir font-bold">
                            <th className="p-3">المقاس</th>
                            <th className="p-3">طول القامة الموصى به</th>
                            <th className="p-3">الوزن المناسب</th>
                            <th className="p-3">ملاحظات القياس</th>
                            <th className="p-3 text-center">اختيار</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle text-muted">
                          {[
                            { size: 'S', height: '160 - 168 سم', weight: '55 - 68 كجم', note: 'ملائم للأجسام الرشيقة' },
                            { size: 'M', height: '168 - 175 سم', weight: '68 - 78 كجم', note: 'المقاس المتوسط الأكثر طلباً' },
                            { size: 'L', height: '175 - 182 سم', weight: '78 - 90 كجم', note: 'راحة متكاملة ومظهر متناسق' },
                            { size: 'XL', height: '180 - 188 سم', weight: '90 - 102 كجم', note: 'قصة رحبة مريحة' },
                            { size: '2XL', height: '185 - 195 سم', weight: '102 - 118 كجم', note: 'مقاس خاص مريح' },
                            { size: 'مقاس موحد', height: 'جميع الأطوال', weight: 'جميع الأوزان', note: 'مرن وسهل الارتداء' },
                          ].map((row) => (
                            <tr
                              key={row.size}
                              className={`hover:bg-card transition-smooth ${
                                selectedSize === row.size ? 'bg-card font-bold text-noir' : ''
                              }`}
                            >
                              <td className="p-3 font-bold text-noir">{row.size}</td>
                              <td className="p-3">{row.height}</td>
                              <td className="p-3">{row.weight}</td>
                              <td className="p-3">{row.note}</td>
                              <td className="p-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => onSelectSize(row.size)}
                                  className={`px-3 py-1 rounded text-[11px] font-bold transition-smooth ${
                                    selectedSize === row.size
                                      ? 'bg-noir text-white'
                                      : 'bg-surface hover:bg-noir hover:text-white text-noir border border-border-subtle'
                                  }`}
                                >
                                  {selectedSize === row.size ? 'المختار' : 'اختر'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB 3: HOW TO MEASURE ────────────────────────────────────── */}
              {activeTab === 'howto' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-surface rounded-xl border border-border-subtle space-y-2 text-right">
                    <div className="w-7 h-7 rounded-full bg-noir text-white font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <h5 className="font-bold text-noir text-sm">قياس طول الثوب والجلابية</h5>
                    <p className="text-muted leading-relaxed">
                      قف باستقامة تامة، وقِس المسافة من أعلى الكتف (بجوار الرقبة) نزولاً حتى عظمة الكاحل أو أعلى الحذاء مباشرة.
                    </p>
                  </div>

                  <div className="p-4 bg-surface rounded-xl border border-border-subtle space-y-2 text-right">
                    <div className="w-7 h-7 rounded-full bg-noir text-white font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <h5 className="font-bold text-noir text-sm">قياس محيط الصدر</h5>
                    <p className="text-muted leading-relaxed">
                      مرر شريط القياس حول أوسع نقطة في الصدر تحت الإبطين مباشرة مع ترك مسافة إصبعين لضمان الراحة التامة وحرية التنفس.
                    </p>
                  </div>

                  <div className="p-4 bg-surface rounded-xl border border-border-subtle space-y-2 text-right">
                    <div className="w-7 h-7 rounded-full bg-noir text-white font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <h5 className="font-bold text-noir text-sm">قياس طول الكم</h5>
                    <p className="text-muted leading-relaxed">
                      قِس من نقطة التقاء الكتف بالذراع نزولاً حتى مفصل الرسغ لتصل حافة الكم بشكل ملكي أنيق مع الساعة.
                    </p>
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-900">
                <Info size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>نصيحة خبراء كنوز:</strong> إذا كنت محتاراً بين مقاسين، نوصي دائماً باختيار المقاس الأكبر لضمان الراحة وانسدال القماش الفاخر، أو يمكنك التواصل معنا عبر واتساب للمساعدة الفورية.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
