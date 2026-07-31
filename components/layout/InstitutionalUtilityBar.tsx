import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function InstitutionalUtilityBar() {
  return (
    <div className="bg-buet-red-dark text-white text-xs py-2 px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2 border-b border-white/10">
      <div className="flex items-center gap-4">
        <Link href="https://www.buet.ac.bd" className="font-semibold hover:text-white/80 transition-colors">
          Bangladesh University of Engineering and Technology
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-l border-white/20 pl-4 ml-2">
          <button className="flex items-center gap-1 hover:text-white/80 transition-colors" aria-label="Switch to Bangla">
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">English / বাংলা</span>
          </button>
          <span className="text-white/40">|</span>
          <Link href="/login" className="font-medium hover:text-white/80 transition-colors">
            Member Login
          </Link>
        </div>
      </div>
    </div>
  );
}
