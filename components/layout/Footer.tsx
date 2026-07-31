import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-buet-red-dark text-white pt-16 pb-8 border-t-4 border-buet-red mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-buet-red rounded flex items-center justify-center text-white font-bold">
                F
              </div>
              <span className="font-bold text-lg">BUET FabLab</span>
            </div>
            <p className="text-sm text-neutral-400">
              Advanced digital fabrication, research, and innovation platform at the Bangladesh University of Engineering and Technology.
            </p>
            <div className="text-sm text-neutral-400 pt-2 space-y-1">
              <p>BUET Campus, Palashi</p>
              <p>Dhaka 1000, Bangladesh</p>
              <p className="mt-2">Email: info@fablab.buet.ac.bd</p>
              <p>Phone: +880 2 55167100</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-neutral-200 mb-4 tracking-wide uppercase text-sm">Explore</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/equipment" className="hover:text-white transition-colors">Equipment Catalogue</Link></li>
              <li><Link href="/facilities" className="hover:text-white transition-colors">Facilities</Link></li>
              <li><Link href="/research/themes" className="hover:text-white transition-colors">Research Themes</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Project Gallery</Link></li>
              <li><Link href="/training" className="hover:text-white transition-colors">Training Courses</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-neutral-200 mb-4 tracking-wide uppercase text-sm">Services</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/equipment" className="hover:text-white transition-colors">Book a Machine</Link></li>
              <li><Link href="/projects/start" className="hover:text-white transition-colors">Start a Project</Link></li>
              <li><Link href="/services/fabrication" className="hover:text-white transition-colors">Fabrication Services</Link></li>
              <li><Link href="/consultation" className="hover:text-white transition-colors">Design Consultation</Link></li>
              <li><Link href="/collaborate/industry" className="hover:text-white transition-colors">Industry Partnerships</Link></li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="font-semibold text-neutral-200 mb-4 tracking-wide uppercase text-sm">Operating Hours</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex justify-between"><span>Sunday - Wednesday:</span> <span>9:00 AM - 5:00 PM</span></li>
              <li className="flex justify-between"><span>Thursday:</span> <span>9:00 AM - 1:00 PM</span></li>
              <li className="flex justify-between text-neutral-500"><span>Friday - Saturday:</span> <span>Closed</span></li>
            </ul>
            <div className="mt-6">
              <Link href="/visit" className="text-sm text-white hover:text-white/75 transition-colors underline underline-offset-4">
                Request a Visit
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} BUET FabLab. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
