import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F2E9] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <div className="max-w-md bg-white p-8 rounded-2xl border border-[#E2D7C3] shadow-lg space-y-4">
        <h1 className="font-serif text-4xl font-extrabold text-[#1C1610]">404</h1>
        <h2 className="font-serif text-xl font-bold text-[#8C6B4F]">الصفحة غير موجودة</h2>
        <p className="text-xs text-[#705F4E]">
          عذراً، القطعة أو الصفحة التي تبحث عنها غير متوفرة حالياً أو تم نقلها.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1610] hover:bg-[#AD8A55] text-white text-xs font-bold rounded-lg transition-smooth shadow-md"
          >
            <span>العودة لمتجر كنوز</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
