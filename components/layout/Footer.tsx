import Image from "next/image";
import Link from "next/link";

const partners = [
  { name: "BUET", full: "Bangladesh University of Engineering and Technology", src: "/logos/buet.png", href: "https://www.buet.ac.bd/" },
  { name: "UGC", full: "University Grants Commission of Bangladesh", src: "/logos/ugc.svg", href: "https://ugc.gov.bd/" },
  { name: "World Bank", full: "World Bank", src: "/logos/world-bank.svg", href: "https://www.worldbank.org/" },
  { name: "HEAT", full: "Higher Education Acceleration and Transformation", src: "/logos/heat.svg", href: "https://heat.ugc.gov.bd/" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-buet-red bg-[#2b060d] pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3" aria-label="Advanced Fabrication Lab home">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1.5"><Image src="/logos/advanced-fabrication-lab.png" alt="" width={36} height={44} className="h-10 w-auto object-contain" /></span>
              <span className="font-bold">Advanced Fabrication Lab</span>
            </Link>
            <p className="text-sm leading-6 text-white/85">Digital fabrication, research and engineering support at Bangladesh University of Engineering and Technology.</p>
            <address className="space-y-1 text-sm not-italic text-white/85">
              <p>BUET Campus, Palashi</p>
              <p>Dhaka 1000, Bangladesh</p>
            </address>
            <Link href="/consultation" className="inline-block text-sm font-semibold underline underline-offset-4">Contact the FabLab team</Link>
          </div>

          <FooterLinks title="Explore" links={[
            ["Equipment catalogue", "/equipment"], ["Facilities", "/facilities"], ["Research themes", "/research/themes"], ["Project gallery", "/projects"], ["Training courses", "/training"],
          ]} />
          <FooterLinks title="Services" links={[
            ["Book a machine", "/equipment"], ["Start a project", "/projects/start"], ["Fabrication services", "/services/fabrication"], ["Design consultation", "/consultation"], ["Industry partnerships", "/collaborate/industry"],
          ]} />

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">Operating hours</h2>
            <dl className="space-y-3 text-sm text-white/85">
              <div className="flex flex-wrap justify-between gap-2"><dt>Sunday–Wednesday</dt><dd>9:00–17:00</dd></div>
              <div className="flex flex-wrap justify-between gap-2"><dt>Thursday</dt><dd>9:00–13:00</dd></div>
              <div className="flex flex-wrap justify-between gap-2"><dt>Friday–Saturday</dt><dd>Closed</dd></div>
            </dl>
            <Link href="/visit" className="mt-6 inline-block text-sm font-semibold underline underline-offset-4">Request a visit</Link>
          </div>
        </div>

        <section aria-label="Institutional partners" className="border-t border-white/20 py-12">
          <div className="mb-8 flex items-center gap-5">
            <span className="h-px flex-1 bg-white/15" />
            <h2 className="text-center text-xs font-bold uppercase tracking-[.2em] text-white/65">Institutions &amp; programme partners</h2>
            <span className="h-px flex-1 bg-white/15" />
          </div>
          <div className="grid grid-cols-2 border-y border-white/15 sm:grid-cols-4">
            {partners.map((partner) => (
              <a key={partner.name} href={partner.href} target="_blank" rel="noopener noreferrer" className="group flex min-w-0 flex-col items-center justify-center gap-5 border-b border-r border-white/15 px-3 py-8 transition-colors hover:bg-white/[.06] sm:border-b-0 sm:py-10 last:border-r-0" aria-label={`${partner.full} (opens in a new tab)`}>
                <span className="relative h-16 w-full max-w-44 transition duration-300 group-hover:-translate-y-1 sm:h-20"><Image src={partner.src} alt={`${partner.name} logo`} fill sizes="(max-width: 640px) 40vw, 176px" className="object-contain brightness-0 invert opacity-80 transition group-hover:opacity-100" /></span>
                <span className="text-center text-xs font-bold uppercase tracking-[.14em] text-white/60 transition group-hover:text-white">{partner.name}</span>
              </a>
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/25 pt-8 text-xs text-white/85 md:flex-row">
          <p>© {new Date().getFullYear()} Advanced Fabrication Lab. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/policies/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/policies/terms" className="hover:text-white">Terms</Link>
            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: [string, string][] }) {
  return <div><h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">{title}</h2><ul className="space-y-3 text-sm text-white/85">{links.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-white hover:underline">{label}</Link></li>)}</ul></div>;
}
