import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PageTemplateProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  sections: Array<{
    title: string;
    text: string;
    items?: string[];
    link?: { label: string; href: string };
  }>;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function PageTemplate({
  eyebrow = "Advanced Fabrication Lab",
  title,
  intro,
  sections,
  primary,
  secondary,
}: PageTemplateProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#2b060d] text-white">
        <div className="absolute -right-28 -top-40 h-[520px] w-[520px] rounded-full border-[100px] border-white/[.035]" />
        <div className="absolute bottom-0 right-0 h-20 w-1/3 bg-buet-red [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)]" />
        <div className="section-shell relative py-14 sm:py-20 lg:py-28">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#f1c77a]">{eyebrow}</p>
          <h1 className="max-w-5xl text-4xl font-bold leading-[1.05] tracking-[-.03em] sm:text-5xl md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/75 sm:mt-7 sm:text-xl sm:leading-8">{intro}</p>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primary && (
                <Button size="lg" className="bg-white text-buet-red shadow-none hover:bg-[#f5e9d5]" asChild>
                  <Link href={primary.href}>{primary.label}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              )}
              {secondary && (
                <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white" asChild>
                  <Link href={secondary.href}>{secondary.label}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="section-shell">
          <div className="border-y border-neutral-300">
          {sections.map((section, index) => (
            <article key={section.title} className="grid gap-4 border-b border-neutral-300 py-8 last:border-b-0 md:grid-cols-[90px_.8fr_1.2fr] md:gap-10 md:py-12">
              <span className="font-serif text-3xl text-buet-red/35">0{index + 1}</span>
              <h2 className="text-2xl font-bold leading-tight text-buet-red-dark">{section.title}</h2>
              <div><p className="leading-7 text-neutral-600">{section.text}</p>
              {section.items && (
                <ul className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-buet-red" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.link && (
                <a href={section.link.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-buet-red hover:underline">
                  {section.link.label}<ArrowRight className="h-4 w-4" />
                </a>
              )}</div>
            </article>
          ))}
          </div>
        </div>
      </section>
    </>
  );
}
