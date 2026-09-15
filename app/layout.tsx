import type {Metadata} from 'next';
import './globals.css';
import MainHeader from '@/components/layout/MainHeader';
import Footer from '@/components/layout/Footer';

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
        <MainHeader />
        <main id="main-content" tabIndex={-1} className="flex-grow flex flex-col min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
