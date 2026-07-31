'use client';

import { useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockEquipment } from '@/data/fixtures/equipment';
import { CheckCircle2, ChevronRight, AlertTriangle, Calendar as CalendarIcon, Clock, Upload, Check } from 'lucide-react';
import Link from 'next/link';

export default function BookingWorkflow({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [step, setStep] = useState(2);
  const equipment = mockEquipment.find(e => e.id === resolvedParams.id) || mockEquipment[0];

  const nextStep = () => setStep(s => Math.min(s + 1, 8));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const steps = [
    "Eligibility",
    "Schedule",
    "Project Info",
    "Estimate",
    "Agreement",
    "Review"
  ];

  if (step === 8) {
    return (
      <div className="min-h-screen bg-[#faf8f4] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-12 border-success shadow-lg">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-status-available/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-status-available" />
              </div>
              <h1 className="text-3xl font-bold text-buet-red-dark">Booking Confirmed!</h1>
              <p className="text-neutral-600 text-lg">
                Your reservation for <strong className="text-buet-red">{equipment.name}</strong> has been confirmed.
              </p>
              
              <div className="bg-neutral-50 rounded-lg p-6 max-w-sm mx-auto text-left border">
                <p className="text-sm text-neutral-500 mb-1">Booking Reference</p>
                <p className="font-mono font-bold text-lg text-buet-red mb-4">BUET-FAB-DEMO</p>
                
                <p className="text-sm text-neutral-500 mb-1">Date & Time</p>
                <p className="font-medium text-buet-red mb-4">Tomorrow, 10:00 AM - 12:00 PM</p>
                
                <p className="text-sm text-neutral-500 mb-1">Location</p>
                <p className="font-medium text-buet-red">{equipment.facility}, {equipment.room}</p>
              </div>

              <div className="pt-6 flex justify-center gap-4">
                <Button variant="outline" asChild><Link href="/equipment">Return to catalogue</Link></Button>
                <Button asChild><Link href="/equipment">Book Another Machine</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/equipment" className="text-sm text-neutral-500 hover:text-buet-red mb-4 inline-block">
            &larr; Back to Catalogue
          </Link>
          <h1 className="text-3xl font-bold text-buet-red-dark flex items-center gap-3">
            Book Equipment: <span className="text-buet-red font-medium">{equipment.name}</span>
          </h1>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Progress */}
          <div className="hidden md:block w-48 shrink-0">
            <div className="sticky top-24 space-y-6">
              {steps.map((s, i) => {
                const currentStepIndex = i + 2; // offset by 1 because step 1 is "Select Machine" (already done)
                const isActive = step === currentStepIndex;
                const isPast = step > currentStepIndex;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isActive ? 'bg-buet-red text-white' : 
                      isPast ? 'bg-status-available text-white' : 'bg-neutral-200 text-neutral-500'
                    }`}>
                      {isPast ? <Check className="w-3 h-3" /> : (i + 1)}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-buet-red-dark' : 'text-neutral-500'}`}>
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-white rounded-t-xl">
                <CardTitle>
                  {step === 2 && "Eligibility Check"}
                  {step === 3 && "Select Date and Time"}
                  {step === 4 && "Project Information"}
                  {step === 5 && "Cost Estimate"}
                  {step === 6 && "Safety & Policy Agreement"}
                  {step === 7 && "Review Booking"}
                </CardTitle>
                <CardDescription>
                  {step === 2 && "Verifying your certifications and permissions."}
                  {step === 3 && "Choose an available slot for your fabrication job."}
                  {step === 4 && "Provide details about what you are making."}
                  {step === 5 && "Review the estimated charges for this session."}
                  {step === 6 && "Acknowledge the laboratory rules."}
                  {step === 7 && "Confirm your details before submission."}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 md:p-8">
                {/* Step 2: Eligibility */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="bg-neutral-50 border rounded-lg p-4 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-status-available shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-buet-red">Active Membership</h4>
                        <p className="text-sm text-neutral-600">Your BUET Student Membership is active.</p>
                      </div>
                    </div>
                    <div className="bg-neutral-50 border rounded-lg p-4 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-status-available shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-buet-red">Required Training</h4>
                        <p className="text-sm text-neutral-600">You hold the required <strong className="text-buet-red">{equipment.trainingRequired}</strong> certification.</p>
                      </div>
                    </div>
                    <div className="bg-neutral-50 border rounded-lg p-4 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-status-available shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-buet-red">Account Standing</h4>
                        <p className="text-sm text-neutral-600">No overdue payments or restrictions.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Schedule */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm text-neutral-500 mb-4 flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> Select Date</h4>
                        {/* Mock Calendar UI */}
                        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="text-neutral-400 font-medium">{d.slice(0, 1)}</div>)}
                          {Array.from({length: 31}).map((_, i) => (
                            <div key={i} className={`p-2 rounded cursor-pointer ${i === 14 ? 'bg-buet-red text-white font-bold' : i < 14 ? 'text-neutral-300 pointer-events-none' : 'hover:bg-neutral-100 text-buet-red'}`}>
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm text-neutral-500 mb-4 flex items-center gap-2"><Clock className="w-4 h-4"/> Available Slots</h4>
                        <div className="space-y-2">
                          {['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM'].map((slot, i) => (
                            <label key={i} className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${i===0 ? 'border-buet-red bg-buet-red/5' : 'hover:bg-neutral-50 border-neutral-200'}`}>
                              <input type="radio" name="slot" className="text-buet-red focus:ring-buet-red" defaultChecked={i===0} />
                              <span className="text-sm font-medium text-buet-red">{slot}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-neutral-500 mt-4">* Minimum booking duration is 2 hours.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Project Info */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-buet-red mb-1">Project Title</label>
                      <input type="text" className="w-full border-neutral-300 rounded-md shadow-sm focus:border-buet-red focus:ring-buet-red sm:text-sm" placeholder="e.g., Drone Chassis Prototype" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-buet-red mb-1">Project Type</label>
                        <select className="w-full border-neutral-300 rounded-md shadow-sm focus:border-buet-red focus:ring-buet-red sm:text-sm">
                          <option>Student Course Project</option>
                          <option>Thesis / Dissertation</option>
                          <option>Faculty Research</option>
                          <option>Personal Maker Project</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-buet-red mb-1">Department</label>
                        <input type="text" className="w-full border-neutral-300 rounded-md shadow-sm focus:border-buet-red focus:ring-buet-red sm:text-sm" placeholder="e.g., Mechanical Engineering" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-buet-red mb-1">Primary Material</label>
                      <select className="w-full border-neutral-300 rounded-md shadow-sm focus:border-buet-red focus:ring-buet-red sm:text-sm">
                        <option>Select a material...</option>
                        {equipment.supportedMaterials.map(m => <option key={m}>{m}</option>)}
                        <option>Other (requires approval)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-buet-red mb-1">Design Files Upload</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-8 w-8 text-neutral-400" />
                          <div className="flex text-sm text-neutral-600 justify-center">
                            <span className="relative cursor-pointer rounded-md font-medium text-buet-red hover:text-buet-red-dark">
                              Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-neutral-500">STL, STEP, DXF up to 50MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Estimate */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="bg-neutral-50 p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold text-buet-red-dark border-b pb-4 mb-4">Estimated Cost Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Machine Time (2 hours @ ৳{equipment.internalRate}/hr)</span>
                          <span className="font-medium text-buet-red">৳{equipment.internalRate * 2}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Material Estimate (Standard)</span>
                          <span className="font-medium text-buet-red">৳150</span>
                        </div>
                        <div className="flex justify-between text-sm border-t pt-3 mt-3 font-bold text-base">
                          <span className="text-buet-red-dark">Total Estimated Cost</span>
                          <span className="text-buet-red">৳{(equipment.internalRate * 2) + 150}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-md text-sm border border-amber-200">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <p>This is an estimate. Final costs may vary based on exact material consumption and machine time. Departmental chargebacks require supervisor approval before the run begins.</p>
                    </div>
                  </div>
                )}

                {/* Step 6: Agreement */}
                {step === 6 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-buet-red mb-4">Please read and acknowledge the following:</h3>
                    {[
                      "I confirm I will clean the machine and work area after my session.",
                      "I understand the 24-hour cancellation policy; late cancellations may incur a fee.",
                      "I will only use approved materials on this machine.",
                      "I agree to follow all safety protocols and wear required PPE."
                    ].map((rule, i) => (
                      <label key={i} className="flex items-start gap-3 bg-white p-3 border rounded-md cursor-pointer hover:bg-neutral-50 transition-colors">
                        <input type="checkbox" className="mt-1 rounded text-buet-red focus:ring-buet-red" />
                        <span className="text-sm text-buet-red leading-relaxed">{rule}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Step 7: Review */}
                {step === 7 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Machine</h4>
                        <p className="font-medium text-buet-red">{equipment.name}</p>
                        <p className="text-sm text-neutral-600">{equipment.facility}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Schedule</h4>
                        <p className="font-medium text-buet-red">Oct 15, 2026</p>
                        <p className="text-sm text-neutral-600">09:00 AM - 11:00 AM</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Project Details</h4>
                        <p className="font-medium text-buet-red">Drone Chassis Prototype</p>
                        <p className="text-sm text-neutral-600">Student Course Project • Standard Material</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <p className="text-sm text-neutral-500 text-center">By clicking submit, you confirm this booking request. You will receive a confirmation email shortly.</p>
                    </div>
                  </div>
                )}

              </CardContent>
              <div className="p-6 bg-neutral-50/50 border-t flex justify-between rounded-b-xl">
                <Button variant="outline" onClick={prevStep} disabled={step === 2}>Back</Button>
                <Button onClick={nextStep} className="min-w-[120px]">
                  {step === 7 ? "Confirm Booking" : "Continue"} 
                  {step !== 7 && <ChevronRight className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
