import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { featuredProjects } from "@/data/fixtures/homepage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return featuredProjects.map(({ id }) => ({ id }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = featuredProjects.find((item) => item.id === id);
  if (!project) notFound();
  return (
    <article className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
      <Link href="/projects" className="text-sm font-medium text-buet-red hover:underline">← Project gallery</Link>
      <div className="relative mt-6 aspect-[16/8] overflow-hidden border border-neutral-300 bg-neutral-200"><Image src={project.image} alt={project.title} fill className="object-cover" /></div>
      <div className="mx-auto max-w-3xl py-10">
        <Badge>{project.type}</Badge>
        <h1 className="mt-4 text-4xl font-bold text-buet-red-dark md:text-5xl">{project.title}</h1>
        <p className="mt-4 text-neutral-500">{project.team} · {project.year}</p>
        <p className="mt-8 text-lg leading-8 text-neutral-700">This project used BUET FabLab facilities to move from early design to a tested physical prototype. The team combined {project.technologies.join(", ")} in an iterative build-and-test workflow.</p>
        <div className="mt-8 rounded-xl bg-neutral-100 p-6"><h2 className="font-bold">Outcome</h2><p className="mt-2 text-neutral-700">{project.outcome}</p></div>
        <Button className="mt-8" asChild><Link href="/projects/start">Start a similar project</Link></Button>
      </div>
    </article>
  );
}
