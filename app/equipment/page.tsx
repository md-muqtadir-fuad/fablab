"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockEquipment, equipmentCategories, facilities } from "@/data/fixtures/equipment";
import { Search, Filter, MapPin, AlertCircle, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EquipmentCatalogue() {
  const [sort, setSort] = useState("name-asc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const filteredEquipment = useMemo(() => mockEquipment.filter((equipment) => {
    const searchText = `${equipment.name} ${equipment.category} ${equipment.manufacturer}`.toLowerCase();
    return searchText.includes(query.trim().toLowerCase())
      && (!categories.length || categories.includes(equipment.category))
      && (!selectedFacilities.length || selectedFacilities.includes(equipment.facility))
      && (!statuses.length || statuses.includes(equipment.status));
  }).sort((a,b) => sort === "name-desc" ? b.name.localeCompare(a.name) : sort === "rate" ? a.externalRate - b.externalRate : a.name.localeCompare(b.name)), [query, categories, selectedFacilities, statuses, sort]);

  const toggle = (value: string, values: string[], setValues: (values: string[]) => void) =>
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  const clearFilters = () => {
    setQuery("");
    setCategories([]);
    setSelectedFacilities([]);
    setStatuses([]);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] pb-24">
      <div className="relative overflow-hidden bg-[#2b060d] px-4 pb-28 pt-16 text-white sm:px-6 lg:px-8">
        <div className="absolute -right-24 -top-56 h-[560px] w-[560px] rounded-full border-[110px] border-white/[.04]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#f1c77a]">Machine access</p>
          <h1 className="mb-5 text-5xl font-bold tracking-tight md:text-7xl">Equipment catalogue</h1>
          <p className="max-w-2xl text-lg leading-8 text-white/70">
            Compare machines, check training requirements, and request a fabrication session.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <button type="button" aria-expanded={filtersOpen} aria-controls="equipment-filters" onClick={() => setFiltersOpen(!filtersOpen)} className="mb-4 flex min-h-12 w-full items-center justify-between border border-neutral-200 border-t-4 border-t-buet-red bg-white px-4 text-left font-bold text-buet-red-dark lg:hidden">
          <span className="flex items-center gap-2"><Filter className="h-4 w-4" /> Filter equipment</span>
          <span className="text-xs font-semibold text-neutral-500">{filtersOpen ? "Close" : `${categories.length + selectedFacilities.length + statuses.length} selected`}</span>
        </button>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside id="equipment-filters" className={`${filtersOpen ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-72`}>
            <Card className="sticky top-28 overflow-hidden shadow-[0_18px_50px_rgba(60,34,25,.10)]">
              <div className="flex items-center justify-between border-b bg-[#f4efe7] p-5">
                <h2 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h2>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-neutral-500" onClick={clearFilters}>Clear all</Button>
              </div>
              <CardContent className="p-5 space-y-6">
                {/* Search */}
                <div className="space-y-3">
                  <label htmlFor="equipment-search" className="text-sm font-medium text-buet-red-dark">Search Equipment</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input 
                      id="equipment-search" type="search"
                      placeholder="e.g. 3D Printer..." 
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    className="w-full rounded-xl border border-neutral-300 py-2.5 pl-9 pr-4 text-sm focus:border-buet-red focus:outline-none focus:ring-4 focus:ring-red-100"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-buet-red-dark">Category</label>
                  <div className="space-y-2">
                    {equipmentCategories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 text-sm text-neutral-600 hover:text-buet-red cursor-pointer">
                        <input type="checkbox" checked={categories.includes(cat)} onChange={() => toggle(cat, categories, setCategories)} className="rounded border-neutral-300 text-buet-red focus:ring-buet-red" />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-buet-red-dark">Facility</label>
                  <div className="space-y-2">
                    {facilities.map(fac => (
                      <label key={fac} className="flex items-center gap-2 text-sm text-neutral-600 hover:text-buet-red cursor-pointer">
                        <input type="checkbox" checked={selectedFacilities.includes(fac)} onChange={() => toggle(fac, selectedFacilities, setSelectedFacilities)} className="rounded border-neutral-300 text-buet-red focus:ring-buet-red" />
                        {fac}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-buet-red-dark">Availability</label>
                  <div className="space-y-2">
                    {[['Available', 'available'], ['In Use', 'in-use'], ['Maintenance', 'maintenance'], ['Training', 'training']].map(([label, status]) => (
                      <label key={status} className="flex items-center gap-2 text-sm text-neutral-600 hover:text-buet-red cursor-pointer">
                        <input type="checkbox" checked={statuses.includes(status)} onChange={() => toggle(status, statuses, setStatuses)} className="rounded border-neutral-300 text-buet-red focus:ring-buet-red" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results Area */}
          <div className="min-w-0 flex-grow space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <p className="text-sm font-medium text-neutral-500">Showing <span className="font-bold text-buet-red">{filteredEquipment.length}</span> machines</p>
              <div className="flex items-center gap-2">
                <label className="text-sm"><span className="sr-only">Sort equipment</span><select aria-label="Sort equipment" value={sort} onChange={e => setSort(e.target.value)} className="rounded-full border bg-white px-4 py-2.5"><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option><option value="rate">Hourly rate: low to high</option></select></label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEquipment.map((eq) => (
                <Card key={eq.id} className="group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-buet-red/30 hover:shadow-[0_20px_55px_rgba(66,39,28,.12)]">
                  <div className="relative h-56 overflow-hidden bg-neutral-200">
                    <Image src={eq.image} alt={eq.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3">
                      <Badge variant={
                        eq.status === 'available' ? 'success' : 
                        eq.status === 'in-use' ? 'info' : 
                        eq.status === 'maintenance' ? 'destructive' : 
                        eq.status === 'training' ? 'warning' : 'default'
                      } className="capitalize shadow-sm">
                        {eq.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-grow flex flex-col">
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">{eq.category}</span>
                      <h3 className="text-lg font-bold text-buet-red-dark leading-tight mb-2">
                        <Link href={`/equipment/${eq.id}`} className="hover:text-buet-red ">
                          {eq.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-neutral-600 line-clamp-2" title={eq.shortDescription}>
                        {eq.shortDescription}
                      </p>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-neutral-500 mb-0.5">Facility</p>
                          <p className="font-medium text-buet-red flex items-start gap-1">
                            <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                            <span className="line-clamp-1" title={eq.facility}>{eq.facility}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500 mb-0.5">Next Available</p>
                          <p className="font-medium text-buet-red flex items-center gap-1">
                            <Calendar className="w-3 h-3 shrink-0" />
                            {eq.nextAvailable}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 rounded-xl border border-neutral-100 bg-[#f7f4ef] p-3 text-xs">
                        <AlertCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                        <div>
                          <span className="text-neutral-500 block">Requirement</span>
                          <span className="font-medium text-buet-red">{eq.trainingRequired}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button className="w-full relative z-10" variant={eq.status === 'available' ? 'default' : 'secondary'} asChild>
                          <Link href={`/equipment/${eq.id}/book`}>
                            {eq.status === 'available' ? 'Book Machine' : 'View Schedule'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredEquipment.length === 0 && (
              <div className="rounded-xl border bg-white p-10 text-center">
                <h2 className="font-semibold text-buet-red-dark">No equipment matches those filters</h2>
                <Button variant="link" onClick={clearFilters}>Clear filters</Button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
