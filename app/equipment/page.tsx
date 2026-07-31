"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockEquipment, equipmentCategories, facilities } from "@/data/fixtures/equipment";
import { Search, Filter, SlidersHorizontal, MapPin, AlertCircle, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EquipmentCatalogue() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const filteredEquipment = useMemo(() => mockEquipment.filter((equipment) => {
    const searchText = `${equipment.name} ${equipment.category} ${equipment.manufacturer}`.toLowerCase();
    return searchText.includes(query.toLowerCase())
      && (!categories.length || categories.includes(equipment.category))
      && (!selectedFacilities.length || selectedFacilities.includes(equipment.facility))
      && (!statuses.length || statuses.includes(equipment.status));
  }), [query, categories, selectedFacilities, statuses]);

  const toggle = (value: string, values: string[], setValues: (values: string[]) => void) =>
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  const clearFilters = () => {
    setQuery("");
    setCategories([]);
    setSelectedFacilities([]);
    setStatuses([]);
  };

  return (
    <div className="bg-[#faf8f4] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-buet-red-dark text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#a98b59]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Equipment Catalogue</h1>
          <p className="text-white/75 text-lg max-w-2xl">
            Browse and book the advanced fabrication machinery available at BUET FabLab. Ensure you have the required safety certifications before reserving restricted equipment.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <Card className="sticky top-24">
              <div className="p-4 border-b bg-neutral-50/50 flex justify-between items-center">
                <h2 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h2>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-neutral-500" onClick={clearFilters}>Clear all</Button>
              </div>
              <CardContent className="p-5 space-y-6">
                {/* Search */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-buet-red-dark">Search Equipment</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. 3D Printer..." 
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-buet-red/50"
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
                    {[['Available', 'available'], ['In Use', 'in-use'], ['Maintenance', 'maintenance']].map(([label, status]) => (
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
          <div className="flex-grow space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-neutral-500 font-medium">Showing <span className="text-buet-red font-bold">{filteredEquipment.length}</span> machines</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <SlidersHorizontal className="w-4 h-4 mr-2" /> Sort: Name A-Z
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEquipment.map((eq) => (
                <Card key={eq.id} className="overflow-hidden flex flex-col group hover:border-buet-red/30 transition-colors">
                  <div className="relative h-48 bg-neutral-200">
                    <Image src={eq.image} alt={eq.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
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
                        <Link href={`/equipment/${eq.id}`} className="hover:text-buet-red before:absolute before:inset-0">
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
                      
                      <div className="bg-neutral-50 rounded p-2.5 text-xs flex items-start gap-2 border border-neutral-100">
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
            
            <div className="text-center pt-8">
              <p className="text-xs text-neutral-400 uppercase tracking-widest">* Simulated Prototype Data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
