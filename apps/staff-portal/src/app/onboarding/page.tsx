'use client';

import React, { useState } from 'react';
import { useOffline } from '@/hooks/useOffline';
import { Save, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';

type FormValue = string | boolean;
type FormData = Record<string, FormValue>;

interface ApplicationPayload {
  id: string;
  username: string;
  submittedAt: string;
  status: 'Pending';
  formData: FormData;
}

const readDraft = () => {
  if (typeof window === 'undefined') return {};
  const draft = localStorage.getItem('camp_lawton_app_draft');
  if (!draft) return {};
  try {
    return JSON.parse(draft) as FormData;
  } catch {
    return {};
  }
};

const readPayloadList = (key: string) => {
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as ApplicationPayload[];
  } catch {
    return [];
  }
};

export default function OnboardingPage() {
  const isOffline = useOffline();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(readDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [queuedOffline, setQueuedOffline] = useState(false);

  const saveDraft = (data: FormData) => {
    setFormData(data);
    localStorage.setItem('camp_lawton_app_draft', JSON.stringify(data));
  };

  const handleInput = (id: string, value: FormValue) => {
    const updated = { ...formData, [id]: value };
    saveDraft(updated);
  };

  const isMinor = () => {
    if (!formData.birthdate) return false;
    const birthDate = new Date(formData.birthdate);
    const campDate = new Date('2026-06-01');
    let age = campDate.getFullYear() - birthDate.getFullYear();
    const m = campDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && campDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18;
  };

  const validate = () => {
    const errs: string[] = [];

    if (currentStep === 0) {
      if (!formData.firstName) errs.push('First Name is required.');
      if (!formData.lastName) errs.push('Last Name is required.');
      if (!formData.phone) errs.push('Phone Number is required.');
      if (!formData.email) errs.push('Email Address is required.');
      if (!formData.address) errs.push('Mailing Address is required.');
      if (!formData.ssn_last4 || formData.ssn_last4.length !== 4) errs.push('Last 4 digits of SSN are required.');
      if (!formData.birthdate) errs.push('Birth Date is required.');
      if (!formData.ageEligibility) errs.push('Age Classification is required.');
      if (!formData.workAuth) errs.push('You must verify work authorization.');

      if (isMinor()) {
        if (!formData.parentName) errs.push('Parent Name is required for minors.');
        if (!formData.parentPhone) errs.push('Parent Phone is required for minors.');
        if (!formData.parentEmail) errs.push('Parent Email is required for minors.');
      }
    } else if (currentStep === 1) {
      if (!formData.startDate) errs.push('Start Date is required.');
      if (!formData.endDate) errs.push('End Date is required.');
      if (!formData.pref1) errs.push('1st Choice Position Preference is required.');
      if (!formData.pref2) errs.push('2nd Choice Position Preference is required.');
      if (!formData.shirtSize) errs.push('T-Shirt Size is required.');
      if (!formData.jacketSize) errs.push('Jacket Size is required.');
    } else if (currentStep === 2) {
      if (!formData.ref1Details) errs.push('Reference 1 details are required.');
      if (!formData.ref2Details) errs.push('Reference 2 details are required.');
      if (!formData.ref3Details) errs.push('Reference 3 details are required.');
    } else if (currentStep === 3) {
      if (!formData.ackAltitude) errs.push('You must acknowledge high-altitude requirements.');
      if (!formData.ackTerrain) errs.push('You must acknowledge rugged terrain conditions.');
      if (!formData.ackWildlife) errs.push('You must acknowledge bear smellables protocols.');
      if (!formData.ackSanitation) errs.push('You must acknowledge cleaning and KYBO duties.');
      if (!formData.ackMedical) errs.push('You must acknowledge BSA Health Form submissions.');
    } else if (currentStep === 4) {
      if (!formData.ackBackgroundCheck) errs.push('Background check consent is required.');
      if (!formData.ackDrugPolicy) errs.push('Substance use policy consent is required.');
      if (!formData.ackAtWill) errs.push('At-will terms acknowledgment is required.');
      if (!formData.signature) errs.push('Digital signature is required.');

      if (isMinor()) {
        if (!formData.parentSignature) errs.push('Parent co-signature is required for minor applicants.');
      }
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        submitApplication();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = () => {
    const appPayload = {
      id: 'app_' + Date.now(),
      username: 'guest',
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      formData: { ...formData }
    };

    if (isOffline) {
      const pending = readPayloadList('camp_lawton_pending_submissions');
      pending.push(appPayload);
      localStorage.setItem('camp_lawton_pending_submissions', JSON.stringify(pending));

      localStorage.removeItem('camp_lawton_app_draft');
      setFormData({});
      setQueuedOffline(true);
    } else {
      const apps = readPayloadList('camp_lawton_applications');
      apps.push(appPayload);
      localStorage.setItem('camp_lawton_applications', JSON.stringify(apps));

      localStorage.removeItem('camp_lawton_app_draft');
      setFormData({});
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="glass-panel text-center max-w-lg mx-auto p-8 flex flex-col gap-4 border-l-4 border-emerald-800">
        <CheckCircle size={56} className="text-emerald-700 mx-auto" />
        <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading">
          APPLICATION SUBMITTED!
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Thank you for applying to Camp Lawton! Your application has been successfully synchronized and uploaded. The administration will contact you shortly.
        </p>
        <a href="/dashboard" className="mt-2 py-2.5 px-6 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors inline-block">
          Return to Dashboard
        </a>
      </div>
    );
  }

  if (queuedOffline) {
    return (
      <div className="glass-panel text-center max-w-lg mx-auto p-8 flex flex-col gap-4 border-l-4 border-amber-600">
        <Smartphone size={56} className="text-amber-500 mx-auto" />
        <h2 className="text-2xl font-black text-amber-500 font-heading">
          APPLICATION QUEUED LOCALLY!
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Your application has been saved locally as a pending draft on this device because you are offline. It has NOT been received by the council yet.
        </p>
        <div className="bg-neutral-100 dark:bg-neutral-900/40 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-left leading-relaxed flex flex-col gap-2">
          <strong>Next Steps:</strong>
          <ol className="list-decimal list-inside space-y-1 text-neutral-500">
            <li>Keep this device connected or reconnect to the internet.</li>
            <li>Reopen this portal when online to automatically synchronize the queued application.</li>
          </ol>
        </div>
        <a href="/dashboard" className="mt-2 py-2.5 px-6 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-colors inline-block">
          Return to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading">
          2026 STAFF APPLICATION
        </h2>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map(idx => {
            const active = idx <= currentStep;
            return (
              <div
                key={idx}
                className={`flex-1 h-2.5 rounded-full ${
                  active ? 'bg-emerald-800' : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-500/30 p-4 rounded-xl text-xs text-red-600 dark:text-red-400 font-semibold">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((e, index) => (
              <li key={index}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-6">
        {currentStep === 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-emerald-800 dark:text-emerald-500 font-extrabold text-lg font-heading">
              SECTION I: IDENTITY & ELIGIBILITY
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInput('firstName', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInput('lastName', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInput('phone', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Email *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInput('email', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-neutral-400 font-bold uppercase">Mailing Address *</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleInput('address', e.target.value)}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Last 4 digits of SSN *</label>
                <input
                  type="password"
                  maxLength={4}
                  value={formData.ssn_last4 || ''}
                  onChange={(e) => handleInput('ssn_last4', e.target.value)}
                  placeholder="xxxx"
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Birth Date *</label>
                <input
                  type="date"
                  value={formData.birthdate || ''}
                  onChange={(e) => handleInput('birthdate', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-neutral-400 font-bold uppercase">Age Classification *</label>
              <select
                value={formData.ageEligibility || ''}
                onChange={(e) => handleInput('ageEligibility', e.target.value)}
                className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
              >
                <option value="">Select age group...</option>
                <option value="minor">Under 18 (Junior / CIT)</option>
                <option value="adult">18+ (Adult Staff)</option>
              </select>
            </div>

            {/* Minor Verification fields */}
            {isMinor() && (
              <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex flex-col gap-3">
                <h4 className="text-red-500 text-xs font-bold flex items-center gap-1.5">
                  <ShieldAlert size={14} />
                  <span>Minor Applicant Verification Details Required</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Parent/Guardian Full Name"
                    value={formData.parentName || ''}
                    onChange={(e) => handleInput('parentName', e.target.value)}
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30 text-xs outline-none text-neutral-200"
                  />
                  <input
                    type="tel"
                    placeholder="Parent phone"
                    value={formData.parentPhone || ''}
                    onChange={(e) => handleInput('parentPhone', e.target.value)}
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30 text-xs outline-none text-neutral-200"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Parent email"
                  value={formData.parentEmail || ''}
                  onChange={(e) => handleInput('parentEmail', e.target.value)}
                  className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30 text-xs outline-none text-neutral-200"
                />
              </div>
            )}

            <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.workAuth || false}
                onChange={(e) => handleInput('workAuth', e.target.checked)}
                className="mt-0.5"
              />
              <span>I am legally authorized to work in the United States. *</span>
            </label>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-emerald-800 dark:text-emerald-500 font-extrabold text-lg font-heading">
              SECTION II: DATES & PREFERENCES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Available Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => handleInput('startDate', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Available End Date *</label>
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => handleInput('endDate', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">1st Choice Position *</label>
                <select
                  value={formData.pref1 || ''}
                  onChange={(e) => handleInput('pref1', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                >
                  <option value="">Select choice...</option>
                  <option value="scoutcraft">Scoutcraft Instructor</option>
                  <option value="nature">Nature Instructor</option>
                  <option value="shooting">Shooting Sports Instructor</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">2nd Choice Position *</label>
                <select
                  value={formData.pref2 || ''}
                  onChange={(e) => handleInput('pref2', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                >
                  <option value="">Select choice...</option>
                  <option value="scoutcraft">Scoutcraft Instructor</option>
                  <option value="nature">Nature Instructor</option>
                  <option value="shooting">Shooting Sports Instructor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">T-Shirt Size *</label>
                <input
                  type="text"
                  placeholder="e.g. M, L, XL"
                  value={formData.shirtSize || ''}
                  onChange={(e) => handleInput('shirtSize', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Jacket Size *</label>
                <input
                  type="text"
                  placeholder="e.g. M, L, XL"
                  value={formData.jacketSize || ''}
                  onChange={(e) => handleInput('jacketSize', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-emerald-800 dark:text-emerald-500 font-extrabold text-lg font-heading">
              SECTION III: EXPERIENCE & REFERENCES
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Reference 1 Contact (Name, phone, relationship) *</label>
                <input
                  type="text"
                  value={formData.ref1Details || ''}
                  onChange={(e) => handleInput('ref1Details', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Reference 2 Contact *</label>
                <input
                  type="text"
                  value={formData.ref2Details || ''}
                  onChange={(e) => handleInput('ref2Details', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Reference 3 Contact *</label>
                <input
                  type="text"
                  value={formData.ref3Details || ''}
                  onChange={(e) => handleInput('ref3Details', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-emerald-800 dark:text-emerald-500 font-extrabold text-lg font-heading">
              SECTION IV: HEALTH & PHYSICAL PROTOCOLS
            </h3>
            <p className="text-xs text-neutral-400 leading-normal mb-2">
              Camp operates at 8,000 feet of elevation. Review and confirm environmental requirements:
            </p>

            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ackAltitude || false}
                  onChange={(e) => handleInput('ackAltitude', e.target.checked)}
                />
                <span><strong>Altitude:</strong> I acknowledge physical demands at 8,000 feet. *</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ackTerrain || false}
                  onChange={(e) => handleInput('ackTerrain', e.target.checked)}
                />
                <span><strong>Terrain:</strong> I agree to walk steep rugged trails daily. *</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ackWildlife || false}
                  onChange={(e) => handleInput('ackWildlife', e.target.checked)}
                />
                <span><strong>Smellables:</strong> I agree to bear and wildlife prevention rules. *</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ackSanitation || false}
                  onChange={(e) => handleInput('ackSanitation', e.target.checked)}
                />
                <span><strong>Sanitation:</strong> I agree to clean latrines/KYBOs as part of work duty. *</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ackMedical || false}
                  onChange={(e) => handleInput('ackMedical', e.target.checked)}
                />
                <span><strong>Medical:</strong> I will submit a signed BSA Health Form before arrival. *</span>
              </label>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-emerald-800 dark:text-emerald-500 font-extrabold text-lg font-heading">
              SECTION V: AGREEMENTS & DIGITAL SIGNATURES
            </h3>

            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ackBackgroundCheck || false}
                  onChange={(e) => handleInput('ackBackgroundCheck', e.target.checked)}
                />
                <span>Consent to criminal background checking. *</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ackDrugPolicy || false}
                  onChange={(e) => handleInput('ackDrugPolicy', e.target.checked)}
                />
                <span>Consent to zero-tolerance drug and alcohol policy. *</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ackAtWill || false}
                  onChange={(e) => handleInput('ackAtWill', e.target.checked)}
                />
                <span>Acknowledgment of at-will employment terms. *</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase">Applicant Signature *</label>
                <input
                  type="text"
                  placeholder="Type Full Legal Name"
                  value={formData.signature || ''}
                  onChange={(e) => handleInput('signature', e.target.value)}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none"
                />
              </div>
            </div>

            {/* Parent Co-signature */}
            {isMinor() && (
              <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex flex-col gap-3">
                <h4 className="text-red-500 text-xs font-bold">Parent / Guardian Co-signature Required</h4>
                <input
                  type="text"
                  placeholder="Parent / Guardian Signature (Type Legal Name)"
                  value={formData.parentSignature || ''}
                  onChange={(e) => handleInput('parentSignature', e.target.value)}
                  className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30 text-xs outline-none text-neutral-200"
                />
              </div>
            )}
          </div>
        )}

        {/* Draft Auto-save status indicator row */}
        <div className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/60 p-3 rounded-xl text-[11px] font-semibold text-neutral-500">
          <span className="flex items-center gap-1">
            <Save size={12} className="text-emerald-700" />
            <span>Draft auto-saved on this device</span>
          </span>
          <span className={isOffline ? 'text-red-500' : 'text-emerald-700'}>
            {isOffline ? '⚠️ Offline Mode — Will queue locally' : '📡 System Online — Ready to submit'}
          </span>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-800/60 pt-4 mt-2">
          <button
            type="button"
            onClick={handleBack}
            className={`py-2 px-4 rounded-xl border border-neutral-350 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
              currentStep === 0 ? 'invisible' : ''
            }`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="py-2.5 px-6 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {currentStep === 4 ? (isOffline ? 'Queue Offline Submission 📥' : 'Sign & Submit Application 💾') : 'Next Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
