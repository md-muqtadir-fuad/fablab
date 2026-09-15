"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { featuredProjects } from "@/data/fixtures/homepage";
import { Button } from "@/components/ui/button";

export function ProjectGallery() {
  const [query, setQuery] = useState("");
  const projects = featuredProjects.filter((project) => `${project.title} ${project.team} ${project.technologies.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="bg-white pb-24">
      <section className="bg-[#2b060d] py-14 text-white sm:py-20 lg:py-24">
        <div className="section-shell flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#f1c77a]">Project gallery</p><h1 className="mt-4 text-4xl font-bold tracking-tight sm:mt-5 sm:text-6xl">Made by our community.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-white/70 sm:mt-5 sm:text-lg sm:leading-8">Work by students, researchers, and industry teams built through the lab.</p></div>
          <Button className="w-fit bg-white text-buet-red shadow-none hover:bg-[#f5e9d5]" asChild><Link href="/projects/start">Start a project <ArrowRight /></Link></Button>
        </div>
      </section>

      <div className="section-shell pt-12">
        <div className="flex flex-col justify-between gap-5 border-b border-neutral-300 pb-8 sm:flex-row sm:items-end">
          <label className="form-label w-full max-w-lg">Search projects<div className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input type="search" className="form-field pl-11" placeholder="Title, team, or technology" value={query} onChange={(event) => setQuery(event.target.value)} /></div></label>
          <p role="status" className="text-sm font-semibold text-neutral-500">{projects.length} projects found</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => <Link href={`/projects/${project.id}`} key={project.id} className="group overflow-hidden rounded-2xl border border-neutral-200 bg-[#f8f5f0] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(66,39,28,.12)]"><div className="relative aspect-[4/3] overflow-hidden"><Image src={project.image} alt={project.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-7"><p className="text-xs font-bold uppercase tracking-[.14em] text-buet-red">{project.type}</p><h2 className="mt-3 text-2xl font-bold text-buet-red-dark">{project.title}</h2><p className="mt-2 text-sm text-neutral-500">{project.team} · {project.year}</p><p className="mt-5 leading-7 text-neutral-700">{project.outcome}</p><span className="mt-6 flex items-center gap-2 text-sm font-bold text-buet-red">View project <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></div></Link>)}
        </div>
        {!projects.length && <div className="surface mt-8 text-center"><p>No matching projects.</p><Button variant="link" onClick={() => setQuery("")}>Clear search</Button></div>}
      </div>
    </div>
  );
}
