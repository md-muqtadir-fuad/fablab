import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Cpu, Layers3, Microscope, PenTool, Settings, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { equipmentPreview, featuredProjects } from "@/data/fixtures/homepage";

const quickLinks = [
  { icon: Settings, label: "Book equipment", href: "/equipment" },
  { icon: BookOpen, label: "Join a training", href: "/training/register" },
  { icon: Wrench, label: "Request fabrication", href: "/services/fabrication" },
  { icon: CalendarDays, label: "Visit the lab", href: "/visit" },
];

const capabilities = [
  { icon: Layers3, title: "Additive manufacturing", text: "FDM and SLA printing for models, fixtures, enclosures, and functional parts." },
  { icon: PenTool, title: "Digital machining", text: "Laser cutting and CNC workflows for sheet, timber, composites, and precision components." },
  { icon: Cpu, title: "Electronics and robotics", text: "PCB fabrication, assembly, embedded systems, sensing, and mechatronic development." },
  { icon: Microscope, title: "Research support", text: "Technical guidance, measurement, testing, and iterative development for research teams." },
];

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <section className="relative min-h-[570px] bg-[#26050b] text-white lg:min-h-[610px]">
        <Image src="/images/home-bg.webp" alt="Industrial robotic arm in an advanced manufacturing laboratory" fill priority sizes="100vw" className="object-cover object-center opacity-65" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#26050b_0%,rgba(38,5,11,.92)_42%,rgba(38,5,11,.32)_76%,rgba(38,5,11,.5)_100%)]" />
        <div className="absolute inset-y-0 right-[9%] hidden w-px bg-white/25 lg:block" />
        <div className="absolute bottom-0 right-0 h-32 w-[42%] bg-buet-red/90 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]" />
        <div className="section-shell relative flex min-h-[570px] items-start pb-24 pt-16 sm:pt-20 lg:min-h-[610px] lg:pt-20">
          <div className="max-w-4xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-white/75"><span className="h-px w-10 bg-[#d9b36c]" /> Bangladesh University of Engineering and Technology</p>
            <h1 className="max-w-[850px] text-5xl font-bold leading-[.98] tracking-[-.04em] sm:text-6xl lg:text-[88px]">Where engineering<br /><span className="text-[#f1c77a]">takes shape.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">A shared laboratory for students, researchers, and industry teams to design, fabricate, test, and improve physical ideas.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="bg-white text-buet-red shadow-none hover:bg-[#f5e9d5]" asChild><Link href="/equipment">Explore the lab <ArrowRight /></Link></Button>
              <Button size="lg" variant="outline" className="border-white/50 bg-white/5 text-white backdrop-blur hover:border-white hover:bg-white/10 hover:text-white" asChild><Link href="/projects/start">Start a project</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-12 pb-6"><div className="section-shell"><div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(54,21,16,.18)] sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((item) => <Link key={item.href} href={item.href} className="group flex items-center gap-4 border-b border-neutral-200 p-5 transition hover:bg-[#fff9f0] sm:p-6 lg:border-b-0 lg:border-r last:border-0"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-buet-red transition group-hover:bg-buet-red group-hover:text-white"><item.icon className="h-5 w-5" /></span><span className="min-w-0 flex-1 text-sm font-bold text-buet-red-dark">{item.label}</span><ArrowRight className="h-4 w-4 shrink-0 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-buet-red" /></Link>)}
      </div></div></section>

      <section className="py-24 lg:py-32"><div className="section-shell grid gap-14 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start"><p className="eyebrow">Capabilities</p><h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-buet-red-dark sm:text-5xl">One lab. Many ways to make.</h2><p className="mt-6 max-w-md text-lg leading-8 text-neutral-600">Move from CAD to a tested part with equipment, training, and practical support in one place.</p><Button variant="link" className="mt-5 h-auto p-0" asChild><Link href="/facilities">See all facilities <ArrowRight /></Link></Button></div>
        <div className="divide-y divide-neutral-300 border-y border-neutral-300">{capabilities.map((item, index) => <article key={item.title} className="group grid gap-5 py-8 sm:grid-cols-[72px_1fr_auto] sm:items-start sm:py-10"><span className="font-serif text-3xl text-buet-red/35">0{index + 1}</span><div><h3 className="text-2xl font-bold text-buet-red-dark">{item.title}</h3><p className="mt-3 max-w-xl leading-7 text-neutral-600">{item.text}</p></div><span className="hidden h-12 w-12 items-center justify-center rounded-full border border-neutral-300 text-buet-red transition group-hover:border-buet-red group-hover:bg-buet-red group-hover:text-white sm:flex"><item.icon className="h-5 w-5" /></span></article>)}</div>
      </div></section>

      <section className="bg-[#2b060d] py-24 text-white lg:py-28"><div className="section-shell">
        <div className="flex flex-col justify-between gap-7 border-b border-white/20 pb-9 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#f1c77a]">Equipment</p><h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Tools ready for serious work.</h2></div><Button variant="outline" className="w-fit border-white/35 bg-transparent text-white hover:border-white hover:bg-white hover:text-buet-red" asChild><Link href="/equipment">View catalogue <ArrowRight /></Link></Button></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{equipmentPreview.map((equipment) => <Link href={`/equipment/${equipment.id}`} key={equipment.id} className="group relative min-h-[400px] overflow-hidden rounded-2xl"><Image src={equipment.image} alt={equipment.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" /><div className="absolute left-5 top-5"><Badge variant={equipment.status === "available" ? "success" : equipment.status === "in-use" ? "info" : equipment.status === "maintenance" ? "destructive" : "warning"}>{equipment.status.replace("-", " ")}</Badge></div><div className="absolute inset-x-0 bottom-0 p-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-white/65">{equipment.category}</p><h3 className="mt-2 text-2xl font-bold text-white">{equipment.name}</h3><p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#f1c77a]">View machine <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p></div></Link>)}</div>
      </div></section>

      <section className="bg-white py-24 lg:py-32"><div className="section-shell">
        <div className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end"><div><p className="eyebrow">Built at BUET</p><h2 className="mt-4 text-4xl font-bold tracking-tight text-buet-red-dark sm:text-5xl">Ideas made tangible.</h2><p className="mt-4 max-w-2xl text-lg text-neutral-600">Selected work from student, research, and startup teams across the university.</p></div><Button variant="outline" asChild><Link href="/projects">Browse all projects <ArrowRight /></Link></Button></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5 lg:grid-rows-2">{featuredProjects.map((project, index) => <Link href={`/projects/${project.id}`} key={project.id} className={`group relative min-h-[320px] overflow-hidden rounded-2xl ${index === 0 ? "lg:col-span-3 lg:row-span-2 lg:min-h-[665px]" : "lg:col-span-2"}`}><Image src={project.image} alt={project.title} fill sizes={index === 0 ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 100vw, 40vw"} className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#26050b]/95 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#f1c77a]">{project.type} · {project.year}</p><h3 className={`${index === 0 ? "text-3xl sm:text-4xl" : "text-2xl"} mt-3 font-bold text-white`}>{project.title}</h3><p className="mt-3 text-sm text-white/70">{project.team}</p></div></Link>)}</div>
      </div></section>

      <section className="bg-[#eee8df] py-20 lg:py-28"><div className="section-shell"><div className="grid overflow-hidden rounded-[28px] bg-buet-red shadow-[0_30px_80px_rgba(80,12,24,.2)] lg:grid-cols-[1.05fr_.95fr]">
        <div className="order-2 p-8 text-white sm:p-12 lg:order-1 lg:p-16"><p className="text-xs font-bold uppercase tracking-[.2em] text-white/70">Industry collaboration</p><h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Bring a difficult hardware problem.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-white/80">Work with BUET researchers and fabrication specialists on design review, prototyping, testing, and applied technical training.</p><div className="mt-9 flex flex-wrap gap-3"><Button size="lg" className="bg-white text-buet-red shadow-none hover:bg-[#f5e9d5]" asChild><Link href="/collaborate/industry">Work with us <ArrowRight /></Link></Button><Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white" asChild><Link href="/research">Explore research</Link></Button></div></div>
        <div className="relative order-1 min-h-[380px] lg:order-2 lg:min-h-full"><Image src="/images/industry.webp" alt="Industry partners working with a fabrication team" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
      </div></div></section>
    </div>
  );
}
