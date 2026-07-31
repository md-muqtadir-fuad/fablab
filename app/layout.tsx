import type {Metadata} from 'next';
import './globals.css';
import InstitutionalUtilityBar from '@/components/layout/InstitutionalUtilityBar';
import MainHeader from '@/components/layout/MainHeader';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'BUET FabLab',
    template: '%s | BUET FabLab',
  },
  description: 'BUET FabLab: Advanced digital fabrication, research, and innovation platform.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <InstitutionalUtilityBar />
        <MainHeader />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
