import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { CartDrawer } from '../components/CartDrawer';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'كنوز KOUNOZ — جلابيب وملابس عربية فاخرة',
  description: 'متجر كنوز الرائد في أرقى الجلابيب والأثواب والبشوت التراثية بأعلى معايير الجودة وخامات طبيعية 100%.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col justify-between font-sans bg-[#FAF8F5] text-[#1C1C1E]" suppressHydrationWarning>
        <CartProvider>
          <div className="flex-1">
            {children}
          </div>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
