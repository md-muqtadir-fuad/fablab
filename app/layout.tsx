import type {Metadata} from 'next';
import './globals.css';
// Self-hosted Bangla fonts. They only download on pages that contain Bangla text.
import '@fontsource/noto-sans-bengali/bengali-400.css';
import '@fontsource/noto-sans-bengali/bengali-600.css';
import '@fontsource/noto-sans-bengali/bengali-700.css';
import '@fontsource/noto-serif-bengali/bengali-700.css';
import MainHeader from '@/components/layout/MainHeader';
import Footer from '@/components/layout/Footer';
import { contentEnabled } from '@/lib/features';

export const metadata: Metadata = {
  title: {
    default: 'Advanced Fabrication Lab',
    template: '%s | Advanced Fabrication Lab',
  },
  description: 'Advanced Fabrication Lab at BUET: digital fabrication, research, and engineering support.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-4 focus:text-buet-red">Skip to main content</a>
        <MainHeader showNotices={contentEnabled()} />
        <main id="main-content" tabIndex={-1} className="flex-grow flex flex-col min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
