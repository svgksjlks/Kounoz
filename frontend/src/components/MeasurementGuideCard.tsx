'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Sparkles, Maximize2, X, Check, HelpCircle } from 'lucide-react';

interface MeasurementStep {
  id: number;
  label: string;
  instruction: string;
  tip: string;
}

const MEASUREMENT_STEPS: MeasurementStep[] = [
  {
    id: 1,
    label: 'طول الثوب الكامل',
    instruction: 'قِس من أعلى نقطة في الكتف (بجوار الرقبة) نزولاً باستقامة تامة حتى عظمة الكاحل أو أعلى الحذاء مباشرة.',
    tip: 'قف باستقامة تامة وانظر للأمام دون انحناء للحصول على القياس المثالي.',
  },
  {
    id: 2,
    label: 'محيط الصدر',
    instruction: 'مرر شريط القياس حول أوسع منطقة في الصدر تحت الإبطين بشكل أفقي متناسق تماماً.',
    tip: 'ضع إصبعين داخل شريط القياس لضمان حرية التنفس وراحة الحركة عند ارتداء الثوب.',
  },
  {
    id: 3,
    label: 'طول الكُم',
    instruction: 'قِس من نقطة التقاء الكتف بالذراع نزولاً على امتداد الذراع حتى عظمة معصم اليد.',
    tip: 'اثنِ ذراعك بزاوية خفيفة حتى لا يقصر الكم عند ثني اليد أو ارتداء الساعة.',
  },
  {
    id: 4,
    label: 'عرض الكتفين',
    instruction: 'قِس المسافة الأفقية من عظمة الكتف الأيمن إلى عظمة الكتف الأيسر من جهة الظهر.',
    tip: 'احرص على ألا يكون الشريط مشدوداً بقوة أو مرتخياً لضمان جلسة الكتف المثالية.',
  },
];

/**
 * رسم توضيحي باللغة العربية بالكامل 100% لطريقة قياس الثوب والجلابية
 * يعتمد على فيكتور SVG عالي الدقة بدون أي كلمات إنجليزية
 */
function ArabicThobeVectorIllustration({
  activeStep,
  onSelectStep,
}: {
  activeStep: number;
  onSelectStep?: (id: number) => void;
}) {
  return (
    <svg
      viewBox="0 0 940 580"
      className="w-full h-auto select-none font-sans"
    >
      <defs>
        {/* خلفية فاخرة */}
        <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0B0E" />
          <stop offset="50%" stopColor="#121318" />
          <stop offset="100%" stopColor="#08080A" />
        </linearGradient>

        {/* تدرج الثوب الفاخر */}
        <linearGradient id="thobeFabric" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#252D3F" />
          <stop offset="45%" stopColor="#181F2D" />
          <stop offset="100%" stopColor="#0F141E" />
        </linearGradient>

        <linearGradient id="mannequinHead" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A3F50" />
          <stop offset="100%" stopColor="#212530" />
        </linearGradient>

        {/* تدرج الذهب الخاص لكنوز */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C5A059" />
          <stop offset="50%" stopColor="#E5C378" />
          <stop offset="100%" stopColor="#B38A3F" />
        </linearGradient>

        {/* توهج ذهبي للخطوط المحددة */}
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
        </filter>

        {/* سهم ذهبي للنهايات */}
        <marker
          id="goldArrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#E5C378" />
        </marker>
      </defs>

      {/* خلفية الرسم مع إطار ذهبي ناعم */}
      <rect width="940" height="580" rx="16" fill="url(#cardBg)" />
      <rect
        x="6"
        y="6"
        width="928"
        height="568"
        rx="12"
        fill="none"
        stroke="#C5A059"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      {/* خطوط شبكية ناعمة للإحساس بالتفصيل الهندسي */}
      <g stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1">
        <line x1="40" y1="90" x2="900" y2="90" />
        <line x1="40" y1="520" x2="900" y2="520" />
        <line x1="330" y1="90" x2="330" y2="520" />
        <line x1="680" y1="90" x2="680" y2="520" />
      </g>

      {/* ── ترويسة الرسم (باللغة العربية بالكامل) ─────────────── */}
      <g transform="translate(440, 42)" textAnchor="middle">
        <text
          y="0"
          fill="#FAF6EE"
          fontSize="20"
          fontWeight="bold"
          letterSpacing="0.5"
        >
          طريقة أخذ قياسات الثوب والجلابية
        </text>
        <text
          y="24"
          fill="#C5A059"
          fontSize="12"
          fontWeight="500"
        >
          دليل الخياطة والتفصيل المعتمد لدى دار كنوز للأزياء الفاخرة
        </text>
      </g>

      {/* شارة السنتيمتر في الزاوية */}
      <g transform="translate(850, 40)" textAnchor="middle">
        <rect x="-65" y="-14" width="130" height="28" rx="6" fill="#1A1C24" stroke="#C5A059" strokeOpacity="0.3" strokeWidth="1" />
        <text y="5" fill="#E5C378" fontSize="11" fontWeight="bold">
          الوحدة: سنتيمتر (سم)
        </text>
      </g>

      {/* ── وسط الرسم: مانيكان وثوب بتفاصيل فاخرة متمركز في المنتصف ── */}
      <g id="mannequin" transform="translate(440, 95)">
        {/* رأس ورقبة المانيكان */}
        <ellipse cx="0" cy="22" rx="26" ry="32" fill="url(#mannequinHead)" />
        <path d="M -16 50 L -12 75 L 12 75 L 16 50 Z" fill="#2A2E3B" />

        {/* مجسم الثوب والجلابية الفاخرة */}
        <path
          d="
            M -18 72
            Q -55 82 -95 98
            L -80 235
            L -58 230
            L -64 150
            L -70 380
            L -90 410
            L 90 410
            L 70 380
            L 64 150
            L 58 230
            L 80 235
            L 95 98
            Q 55 82 18 72
            Z
          "
          fill="url(#thobeFabric)"
          stroke="#384358"
          strokeWidth="1.5"
          filter="url(#cardShadow)"
        />

        {/* طيات وثنايا الثوب لإعطاء لمسة واقعية فخمة */}
        <g stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.5" fill="none">
          <path d="M 0 110 L 0 410" />
          <path d="M -30 150 Q -38 280 -45 410" />
          <path d="M 30 150 Q 38 280 45 410" />
          <path d="M -90 100 L -62 155" />
          <path d="M 90 100 L 62 155" />
        </g>

        {/* ياقة الثوب الرسمية الفاخرة */}
        <path
          d="M -18 72 Q 0 82 18 72 L 20 86 Q 0 96 -20 86 Z"
          fill="#1C2433"
          stroke="#C5A059"
          strokeWidth="1.5"
        />

        {/* جيب الصدر والقلاب والأزرار */}
        <line x1="0" y1="88" x2="0" y2="175" stroke="#C5A059" strokeWidth="1.5" strokeOpacity="0.8" />
        <circle cx="0" cy="108" r="2.5" fill="#FAF6EE" />
        <circle cx="0" cy="128" r="2.5" fill="#FAF6EE" />
        <circle cx="0" cy="148" r="2.5" fill="#FAF6EE" />
        <circle cx="0" cy="168" r="2.5" fill="#FAF6EE" />

        {/* جيب الصدر على الجانب الأيمن */}
        <rect x="22" y="118" width="22" height="2" rx="1" fill="#C5A059" strokeOpacity="0.9" />

        {/* أسفل الثوب وحافة الحذاء */}
        <ellipse cx="0" cy="410" rx="90" ry="10" fill="#131822" stroke="#C5A059" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M -35 416 L -25 432 L -45 432 Z" fill="#252A36" />
        <path d="M 35 416 L 25 432 L 45 432 Z" fill="#252A36" />

        {/* ── 1. طول الثوب الكامل (Step 1) ── */}
        <g
          id="guide-length"
          className="cursor-pointer transition-all duration-300"
          onClick={() => onSelectStep && onSelectStep(1)}
          opacity={activeStep === 1 ? 1 : 0.8}
        >
          <line
            x1="-165"
            y1="72"
            x2="-100"
            y2="72"
            stroke={activeStep === 1 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 1 ? '2.5' : '1.5'}
          />
          <line
            x1="-165"
            y1="410"
            x2="-80"
            y2="410"
            stroke={activeStep === 1 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 1 ? '2.5' : '1.5'}
          />

          <line
            x1="-155"
            y1="74"
            x2="-155"
            y2="408"
            stroke={activeStep === 1 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 1 ? '3.5' : '2'}
            strokeDasharray={activeStep === 1 ? 'none' : '5,4'}
            markerStart="url(#goldArrow)"
            markerEnd="url(#goldArrow)"
            filter={activeStep === 1 ? 'url(#goldGlow)' : undefined}
          />

          {/* شارة طول الثوب */}
          <g transform="translate(-235, 240)">
            <rect
              x="-65"
              y="-18"
              width="130"
              height="36"
              rx="10"
              fill={activeStep === 1 ? '#C5A059' : '#14161F'}
              stroke="#E5C378"
              strokeWidth={activeStep === 1 ? '2' : '1'}
              filter="url(#cardShadow)"
            />
            <text
              x="0"
              y="5"
              fill={activeStep === 1 ? '#0B0B0E' : '#FAF6EE'}
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
            >
              ١. طول الثوب الكامل
            </text>
          </g>
        </g>

        {/* ── 2. محيط الصدر (Step 2) ── */}
        <g
          id="guide-chest"
          className="cursor-pointer transition-all duration-300"
          onClick={() => onSelectStep && onSelectStep(2)}
          opacity={activeStep === 2 ? 1 : 0.8}
        >
          <ellipse
            cx="0"
            cy="150"
            rx="75"
            ry="20"
            fill="none"
            stroke={activeStep === 2 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 2 ? '3.5' : '2'}
            strokeDasharray={activeStep === 2 ? '6,3' : '4,4'}
            filter={activeStep === 2 ? 'url(#goldGlow)' : undefined}
          />

          <g transform="translate(0, 150)">
            <rect
              x="-85"
              y="-17"
              width="170"
              height="34"
              rx="17"
              fill={activeStep === 2 ? '#C5A059' : '#14161F'}
              stroke="#E5C378"
              strokeWidth={activeStep === 2 ? '2' : '1'}
              filter="url(#cardShadow)"
            />
            <text
              x="0"
              y="5"
              fill={activeStep === 2 ? '#0B0B0E' : '#FAF6EE'}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              ٢. محيط الصدر (+ وسع إصبعين)
            </text>
          </g>
        </g>

        {/* ── 3. طول الكُم (Step 3) ── */}
        <g
          id="guide-sleeve"
          className="cursor-pointer transition-all duration-300"
          onClick={() => onSelectStep && onSelectStep(3)}
          opacity={activeStep === 3 ? 1 : 0.8}
        >
          <line
            x1="102"
            y1="96"
            x2="155"
            y2="96"
            stroke={activeStep === 3 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 3 ? '2.5' : '1.5'}
          />
          <line
            x1="85"
            y1="235"
            x2="155"
            y2="235"
            stroke={activeStep === 3 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 3 ? '2.5' : '1.5'}
          />

          <line
            x1="145"
            y1="98"
            x2="120"
            y2="233"
            stroke={activeStep === 3 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 3 ? '3.5' : '2'}
            strokeDasharray={activeStep === 3 ? 'none' : '5,4'}
            markerStart="url(#goldArrow)"
            markerEnd="url(#goldArrow)"
            filter={activeStep === 3 ? 'url(#goldGlow)' : undefined}
          />

          <g transform="translate(205, 165)">
            <rect
              x="-55"
              y="-18"
              width="110"
              height="36"
              rx="10"
              fill={activeStep === 3 ? '#C5A059' : '#14161F'}
              stroke="#E5C378"
              strokeWidth={activeStep === 3 ? '2' : '1'}
              filter="url(#cardShadow)"
            />
            <text
              x="0"
              y="5"
              fill={activeStep === 3 ? '#0B0B0E' : '#FAF6EE'}
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
            >
              ٣. طول الكُم
            </text>
          </g>
        </g>

        {/* ── 4. عرض الكتفين (Step 4) ── */}
        <g
          id="guide-shoulder"
          className="cursor-pointer transition-all duration-300"
          onClick={() => onSelectStep && onSelectStep(4)}
          opacity={activeStep === 4 ? 1 : 0.8}
        >
          <line
            x1="-95"
            y1="95"
            x2="-95"
            y2="50"
            stroke={activeStep === 4 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 4 ? '2' : '1.5'}
          />
          <line
            x1="95"
            y1="95"
            x2="95"
            y2="50"
            stroke={activeStep === 4 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 4 ? '2' : '1.5'}
          />

          <line
            x1="-93"
            y1="56"
            x2="93"
            y2="56"
            stroke={activeStep === 4 ? '#E5C378' : '#C5A059'}
            strokeWidth={activeStep === 4 ? '3.5' : '2'}
            strokeDasharray={activeStep === 4 ? 'none' : '5,4'}
            markerStart="url(#goldArrow)"
            markerEnd="url(#goldArrow)"
            filter={activeStep === 4 ? 'url(#goldGlow)' : undefined}
          />

          <g transform="translate(0, 56)">
            <rect
              x="-65"
              y="-17"
              width="130"
              height="34"
              rx="10"
              fill={activeStep === 4 ? '#C5A059' : '#14161F'}
              stroke="#E5C378"
              strokeWidth={activeStep === 4 ? '2' : '1'}
              filter="url(#cardShadow)"
            />
            <text
              x="0"
              y="5"
              fill={activeStep === 4 ? '#0B0B0E' : '#FAF6EE'}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              ٤. عرض الكتفين
            </text>
          </g>
        </g>
      </g>

      {/* ── الشريط السفلي التوضيحي ───────────────────────── */}
      <g transform="translate(440, 548)" textAnchor="middle">
        <text fill="#C5A059" fontSize="12" fontWeight="bold">
          ★ معتمد من خبراء التفصيل بدار كنوز ★ جميع المقاسات بالسنتيمتر (سم) بواسطة شريط قياس مرن
        </text>
      </g>
    </svg>
  );
}

export function MeasurementGuideCard() {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const activeStep = MEASUREMENT_STEPS.find((s) => s.id === selectedStep) || MEASUREMENT_STEPS[0];

  return (
    <div className="bg-card rounded-xl border border-border-subtle shadow-md overflow-hidden text-right">
      {/* الترويسة الرئيسية للكارت */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FAF6EE] text-noir border border-border-subtle shadow-xs">
            <Ruler size={16} className="text-[#C5A059]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-noir flex items-center gap-1.5">
              <span>طريقة أخذ المقاس الصحيح</span>
              <Sparkles size={12} className="text-[#C5A059]" />
            </h3>
            <p className="text-[11px] text-muted">رسم توضيحي دقيق لطريقة قياس الثوب والجلابية بالسنتيمتر</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-main hover:bg-card border border-border-subtle text-muted hover:text-noir text-xs font-semibold transition-smooth flex items-center gap-1.5"
          title="تكبير الرسم التوضيحي"
        >
          <Maximize2 size={13} />
          <span className="hidden sm:inline">تكبير الرسم</span>
        </button>
      </div>

      {/* منطقة الرسم التوضيحي الفيكتور باللغة العربية */}
      <div className="p-4 sm:p-5 space-y-4">
        <div
          onClick={() => setIsZoomOpen(true)}
          className="relative w-full rounded-xl overflow-hidden bg-[#0B0B0E] border border-border-subtle shadow-inner cursor-zoom-in group"
        >
          <ArabicThobeVectorIllustration
            activeStep={selectedStep}
            onSelectStep={(id) => setSelectedStep(id)}
          />

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1.5 rounded-md bg-black/80 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-white/20">
              <Maximize2 size={13} className="text-[#C5A059]" />
              انقر لتكبير الرسم بملء الشاشة
            </span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded bg-[#141416]/90 backdrop-blur-md text-[10px] font-bold text-slate-200 border border-white/10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span>رسم تفصيلي معتمد لمصانع كنوز</span>
          </div>
        </div>

        {/* أزرار اختيار خطوات القياس */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-bold text-noir flex items-center gap-1">
              <HelpCircle size={13} className="text-accent" />
              <span>خطوات القياس الأربعة (انقر على الخطوة لعرض الطريقة):</span>
            </span>
            <span className="text-[10px] text-[#C5A059] font-bold">القياسات الأربعة</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MEASUREMENT_STEPS.map((step) => {
              const isSelected = selectedStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setSelectedStep(step.id)}
                  className={`p-2.5 rounded-lg border text-right transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-noir text-white border-noir shadow-sm ring-1 ring-[#C5A059]/40'
                      : 'bg-surface hover:bg-card border-border-subtle text-muted hover:text-noir'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                        isSelected ? 'bg-[#C5A059] text-black font-bold' : 'bg-card text-muted border border-border-subtle'
                      }`}
                    >
                      {step.id}
                    </span>
                    {isSelected && <Check size={12} className="text-[#C5A059]" />}
                  </div>
                  <span className="text-xs font-bold leading-tight">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* صندوق تفاصيل الخطوة المحددة - عربي 100% بدون أي كلمة إنجليزية */}
        <motion.div
          key={activeStep.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-3.5 bg-surface rounded-lg border border-border-subtle text-xs space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-noir text-xs">
              الخطوة {activeStep.id}: {activeStep.label}
            </span>
            <span className="text-[10px] text-[#C5A059] font-bold">إرشادات الخياطة</span>
          </div>
          <p className="text-muted leading-relaxed font-normal">{activeStep.instruction}</p>
          <p className="text-[11px] text-[#C5A059] font-medium pt-1 border-t border-border-subtle/50">
            💡 نصيحة: {activeStep.tip}
          </p>
        </motion.div>
      </div>

      {/* نافذة التكبير بملء الشاشة (Fullscreen Modal) */}
      <AnimatePresence>
        {isZoomOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-4xl bg-[#0B0B0E] rounded-2xl border border-white/20 shadow-2xl overflow-hidden p-6 text-right space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-card text-[#C5A059] border border-white/10">
                    <Ruler size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">الرسم التوضيحي المعتمد لطريقة القياس</h3>
                    <p className="text-xs text-gray-400">دار كنوز للخياطة الراقية والأثواب العربية الفاخرة</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="p-2 rounded-lg bg-card hover:bg-surface text-gray-300 hover:text-white border border-white/10 transition-smooth"
                  aria-label="إغلاق"
                >
                  <X size={18} />
                </button>
              </div>

              {/* الرسم التوضيحي الفيكتور بدقة متناهية داخل النافذة المكبرة */}
              <div className="relative w-full rounded-xl overflow-hidden bg-black/60 border border-white/10 p-2">
                <ArabicThobeVectorIllustration
                  activeStep={selectedStep}
                  onSelectStep={(id) => setSelectedStep(id)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                {MEASUREMENT_STEPS.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStep(step.id)}
                    className={`p-3 rounded-lg border text-xs space-y-1 cursor-pointer transition-all ${
                      selectedStep === step.id
                        ? 'bg-[#181C28] border-[#C5A059] text-white'
                        : 'bg-card/60 border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-[#C5A059] block">
                      {step.id}. {step.label}
                    </span>
                    <p className="text-[11px] text-gray-300 leading-snug">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
