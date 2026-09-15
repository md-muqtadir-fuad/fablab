import Link from 'next/link';
export default function InstitutionalUtilityBar() {
  return <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-buet-red-dark px-4 py-2 text-xs text-white sm:px-6 lg:px-8"><a href="https://www.buet.ac.bd/" className="font-semibold hover:underline">Bangladesh University of Engineering and Technology</a><div className="flex items-center gap-4"><Link href="/bangla" lang="bn" className="hover:underline">বাংলা সহায়িকা</Link><Link href="/dashboard" className="font-medium hover:underline">Member dashboard / Sign in</Link></div></div>;
}
