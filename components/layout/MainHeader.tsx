'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const mainNavigation = [
  { name: 'Explore', href: '/explore' },
  { name: 'Make', href: '/make' },
  { name: 'Learn', href: '/learn' },
  { name: 'Research', href: '/research' },
  { name: 'Collaborate', href: '/collaborate' },
  { name: 'Community', href: '/community' },
  { name: 'About', href: '/about' },
];

export default function MainHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#68101f] border-b border-buet-red-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Area */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 border border-white/50 bg-white flex items-center justify-center text-buet-red-dark font-serif font-bold text-xl group-hover:bg-neutral-100 transition-colors">
                F
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight text-white">BUET FabLab</span>
                <span className="text-xs text-white/80 font-medium">Fabrication Laboratory</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors py-2 flex items-center gap-1"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/equipment" className="text-white/90 hover:text-white transition-colors" aria-label="Search equipment">
              <Search className="w-5 h-5" />
            </Link>
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/projects/start">Start a Project</Link>
            </Button>
            <Button className="bg-white text-buet-red hover:bg-neutral-100" asChild>
              <Link href="/equipment">Book a Machine</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4">
            <Link href="/equipment" className="text-white/90 hover:text-white transition-colors" aria-label="Search equipment">
              <Search className="w-5 h-5" />
            </Link>
            <button
              type="button"
              className="text-white/90 hover:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/15 bg-[#68101f]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-buet-red-dark"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-buet-red-dark flex flex-col gap-2 px-3">
              <Button variant="outline" className="w-full justify-center bg-transparent text-white border-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/projects/start" onClick={() => setMobileMenuOpen(false)}>Start a Project</Link>
              </Button>
              <Button className="w-full justify-center bg-white text-buet-red hover:bg-neutral-100" asChild>
                <Link href="/equipment" onClick={() => setMobileMenuOpen(false)}>Book a Machine</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
