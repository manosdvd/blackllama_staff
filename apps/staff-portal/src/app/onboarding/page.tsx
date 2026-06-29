'use client';

import React from 'react';
import { ShieldCheck, Stethoscope, BookOpen } from 'lucide-react';
import { complianceRequirementsSeed } from '@/data/compliance/seed';
import { ExternalRequirementCard } from '@/components/compliance/ExternalRequirementCard';

export default function OnboardingPage() {
  const ypRequirements = complianceRequirementsSeed.filter(r => r.category === 'youth_protection');
  const trainingRequirements = complianceRequirementsSeed.filter(r => r.category === 'training');
  const healthRequirements = complianceRequirementsSeed.filter(r => r.category === 'health_forms');

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full p-4 md:p-6">
      
      {/* Header section */}
      <div className="flex flex-col gap-2 border-b border-neutral-800 pb-6">
        <h1 className="text-3xl font-black text-emerald-500 font-heading tracking-tight">
          STAFF ONBOARDING & COMPLIANCE
        </h1>
        <p className="text-neutral-400 text-sm max-w-2xl leading-relaxed">
          Welcome to the Camp Lawton staff team. Before you can begin working, you must complete the following mandatory compliance requirements. Please complete each module and upload your verified evidence.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* Youth Protection Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-100">Safeguarding & Registration</h2>
              <p className="text-xs text-neutral-500">Scouting America Youth Protection and background screening.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ypRequirements.map(req => (
              <ExternalRequirementCard key={req.id} requirement={req} />
            ))}
          </div>
        </section>

        {/* Health Forms Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
              <Stethoscope size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-100">Medical Readiness</h2>
              <p className="text-xs text-neutral-500">Annual Health and Medical Records (AHMR).</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthRequirements.map(req => (
              <ExternalRequirementCard key={req.id} requirement={req} />
            ))}
          </div>
        </section>

        {/* Training Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-100">Staff Training Plan</h2>
              <p className="text-xs text-neutral-500">Required instructional hours and NCAP modules.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingRequirements.map(req => (
              <ExternalRequirementCard key={req.id} requirement={req} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
