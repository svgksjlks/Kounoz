import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { LanguageProvider } from '../context/LanguageContext';
import { CartDrawer } from '../components/CartDrawer';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { BottomNavBar } from '../components/BottomNavBar';
import { SessionWrapper } from '../components/SessionWrapper';

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
      <body className="antialiased min-h-screen flex flex-col justify-between font-sans bg-main text-noir pb-16 sm:pb-20 lg:pb-0" suppressHydrationWarning>
        <div id="google_translate_element" style={{ display: 'none' }} aria-hidden="true" />
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.googleTranslateElementInit = function() {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'ar',
                    includedLanguages: 'ar,en',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              };
            `,
          }}
        />
        <Script
          id="google-translate-script"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <SessionWrapper>
          <LanguageProvider>
            <CartProvider>
              <div className="flex-1">
                {children}
              </div>
              <CartDrawer />
              <WhatsAppButton />
              <BottomNavBar />
              <Footer />
            </CartProvider>
          </LanguageProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
