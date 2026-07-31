import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Settings, 
  Microscope, 
  Lightbulb, 
  BookOpen, 
  CalendarDays,
  FileText,
  Wrench,
  PenTool,
  Cpu,
  Layers,
  Ruler
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { equipmentPreview, featuredProjects, impactMetrics } from "@/data/fixtures/homepage";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 8.3 Hero Section */}
      <section className="relative bg-neutral-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/buetlab/1920/1080')] bg-cover bg-center opacity-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 via-neutral-50/90 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-buet-red-dark leading-[1.1]">
              Design, fabricate, and test the <span className="text-buet-red">future.</span>
            </h1>
            <p className="text-xl text-buet-red/80 leading-relaxed max-w-2xl">
              BUET FabLab is the premier national centre for digital fabrication, advanced manufacturing, and engineering innovation. We provide the tools, expertise, and community to turn complex ideas into tangible realities.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="text-base font-semibold" asChild>
                <Link href="/equipment">Book Equipment</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold" asChild>
                <Link href="/projects/start">Start a Research Project</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8.4 Quick Task Panel */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-white border border-neutral-300 border-t-4 border-t-buet-red overflow-hidden divide-x divide-y md:divide-y-0 divide-neutral-200">
            <Link href="/equipment" className="flex flex-col items-center justify-center p-6 text-center hover:bg-neutral-50 transition-colors group">
              <Settings className="w-6 h-6 text-buet-red mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-neutral-900">Book Equipment</span>
            </Link>
            <Link href="/training/register" className="flex flex-col items-center justify-center p-6 text-center hover:bg-neutral-50 transition-colors group">
              <BookOpen className="w-6 h-6 text-buet-red mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-neutral-900">Register Training</span>
            </Link>
            <Link href="/services/fabrication" className="flex flex-col items-center justify-center p-6 text-center hover:bg-neutral-50 transition-colors group">
              <Wrench className="w-6 h-6 text-buet-red mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-neutral-900">Fabrication Request</span>
            </Link>
            <Link href="/facilities" className="flex flex-col items-center justify-center p-6 text-center hover:bg-neutral-50 transition-colors group">
              <Layers className="w-6 h-6 text-buet-red mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-neutral-900">Explore Facilities</span>
            </Link>
            <Link href="/research/collaborate" className="flex flex-col items-center justify-center p-6 text-center hover:bg-neutral-50 transition-colors group">
              <Microscope className="w-6 h-6 text-buet-red mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-neutral-900">Research Collab</span>
            </Link>
            <Link href="/visit" className="flex flex-col items-center justify-center p-6 text-center hover:bg-neutral-50 transition-colors group">
              <CalendarDays className="w-6 h-6 text-buet-red mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-neutral-900">Visit the Lab</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8.5 Capability Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl font-bold text-buet-red-dark mb-4">Core Capabilities</h2>
            <p className="text-buet-red/80 text-lg">
              Our laboratory houses industrial-grade equipment across multiple domains, supporting everything from rapid prototyping to advanced material research.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Layers, title: "Additive Manufacturing", desc: "FDM, SLA, and SLS systems for high-resolution 3D printing in diverse materials." },
              { icon: PenTool, title: "CNC Machining", desc: "Precision subtractive manufacturing including milling, turning, and routing." },
              { icon: Cpu, title: "Electronics & PCB", desc: "In-house circuit board fabrication, surface mount assembly, and testing." },
              { icon: Ruler, title: "Metrology & Testing", desc: "3D scanning, material testing, and dimensional inspection capabilities." }
            ].map((cap, i) => (
              <div key={i} className="group border border-neutral-300 border-t-4 border-t-buet-red p-6 hover:bg-[#faf8f4] transition-colors bg-white">
                <cap.icon className="w-10 h-10 text-buet-red mb-6" />
                <h3 className="text-lg font-bold text-buet-red mb-3">{cap.title}</h3>
                <p className="text-buet-red/80 text-sm leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8.6 Equipment Availability Preview */}
      <section className="py-24 bg-neutral-100 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-4 bg-white">Live Status (Simulated)</Badge>
              <h2 className="text-3xl font-bold text-buet-red-dark mb-4">Equipment Availability</h2>
              <p className="text-buet-red/80">Check the real-time status of our most heavily utilized machines.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/equipment">
                View Full Catalogue <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipmentPreview.map((eq) => (
              <Card key={eq.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-neutral-200">
                  <Image src={eq.image} alt={eq.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={
                      eq.status === 'available' ? 'success' : 
                      eq.status === 'in-use' ? 'info' : 
                      eq.status === 'maintenance' ? 'destructive' : 'warning'
                    } className="capitalize">
                      {eq.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5 flex-grow flex flex-col">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">{eq.category}</span>
                  <h3 className="text-lg font-bold text-buet-red-dark mb-4">{eq.name}</h3>
                  
                  <div className="mt-auto space-y-3 text-sm">
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-neutral-500">Available:</span>
                      <span className="font-medium text-buet-red">{eq.nextAvailable}</span>
                    </div>
                    <div className="flex justify-between pb-4">
                      <span className="text-neutral-500">Training:</span>
                      <span className="font-medium text-buet-red text-right">{eq.trainingRequired}</span>
                    </div>
                    <Button className="w-full" variant={eq.status === 'available' ? 'default' : 'secondary'} asChild>
                      <Link href={`/equipment/${eq.id}/book`}>
                        {eq.status === 'available' ? 'Book Now' : 'Check Schedule'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8.11 Impact Metrics */}
      <section className="py-20 bg-buet-red-dark text-white border-y-4 border-buet-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-neutral-700">
            {impactMetrics.map((metric, i) => (
              <div key={i} className="text-center px-4">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-sm font-medium text-neutral-300 uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 text-xs text-neutral-500 uppercase tracking-widest">
            * Demonstration Data for Prototype
          </div>
        </div>
      </section>

      {/* 8.8 Featured Projects */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-buet-red-dark mb-4">Innovation in Action</h2>
              <p className="text-buet-red/80 max-w-2xl">Discover how researchers, students, and startups are using BUET FabLab to develop breakthrough hardware solutions.</p>
            </div>
            <Button variant="link" className="hidden md:flex" asChild>
              <Link href="/projects">View Project Gallery <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id} className="group flex flex-col rounded-xl overflow-hidden border bg-card hover:border-buet-red transition-colors shadow-sm">
                <div className="relative h-64 overflow-hidden">
                  <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-buet-red hover:bg-white backdrop-blur-sm shadow-sm">{project.type}</Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-buet-red-dark mb-2 group-hover:text-buet-red transition-colors">{project.title}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{project.team} • {project.year}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map(tech => (
                      <Badge key={tech} variant="secondary" className="bg-neutral-100 text-neutral-600 font-medium">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t">
                    <p className="text-sm font-medium text-buet-red">
                      <span className="text-neutral-500 mr-2">Outcome:</span>
                      {project.outcome}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8.10 Industry and Partnership */}
      <section className="py-24 bg-neutral-100 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="bg-white border-buet-red text-buet-red">Industry Collaboration</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-buet-red-dark">Accelerate Your Hardware Development</h2>
              <p className="text-lg text-buet-red/80 leading-relaxed">
                BUET FabLab partners with startups, established industries, and research institutes to provide access to advanced manufacturing capabilities, expert design consultation, and rapid prototyping services.
              </p>
              <ul className="space-y-3 pt-4">
                {['Prototype development and testing', 'Design-for-manufacturing review', 'Sponsored research opportunities', 'Workforce training programs'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-buet-red/10 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-buet-red" />
                    </div>
                    <span className="text-buet-red font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Button size="lg" asChild>
                  <Link href="/collaborate/industry">Discuss an Industry Project</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[500px] overflow-hidden border-4 border-white outline outline-1 outline-neutral-300">
              <Image src="https://picsum.photos/seed/industry/800/1000" alt="Industry Collaboration" fill className="object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-lg font-medium">&ldquo;The facilities at BUET FabLab allowed us to iterate our prototype 3x faster than traditional outsourcing.&rdquo;</p>
                <p className="text-neutral-300 mt-2 text-sm">— Demonstration Startup Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
