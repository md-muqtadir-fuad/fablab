import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PageTemplateProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; text: string; items?: string[] }>;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function PageTemplate({
  eyebrow = "BUET FabLab",
  title,
  intro,
  sections,
  primary,
  secondary,
}: PageTemplateProps) {
  return (
    <>
      <section className="border-b-4 border-[#a98b59] bg-buet-red-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">{eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">{intro}</p>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primary && (
                <Button size="lg" className="bg-white text-buet-red hover:bg-neutral-100" asChild>
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
      <section className="bg-[#faf8f4] py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {sections.map((section) => (
            <article key={section.title} className="border border-neutral-300 border-t-4 border-t-buet-red bg-white p-7">
              <h2 className="text-xl font-bold text-buet-red-dark">{section.title}</h2>
              <p className="mt-3 leading-7 text-neutral-600">{section.text}</p>
              {section.items && (
                <ul className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-buet-red" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
