import React, { useState } from 'react';
import { ComplianceRequirement } from '@/types/compliance';
import { ExternalLink, CheckCircle2, AlertCircle, Clock, Upload, XCircle } from 'lucide-react';

export function ExternalRequirementCard({ requirement }: { requirement: ComplianceRequirement }) {
  const [reportedComplete, setReportedComplete] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const mainTrainingLink = requirement.officialLinks.find(l => l.purpose === 'official_training' || l.purpose === 'form') || requirement.officialLinks[0];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col relative group">
      {/* Status Header */}
      <div className={`px-4 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider ${
        reportedComplete ? 'bg-emerald-500/10 text-emerald-500 border-b border-emerald-500/20' : 'bg-neutral-800 text-neutral-400 border-b border-neutral-700/50'
      }`}>
        <span className="flex items-center gap-1.5">
          {reportedComplete ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {reportedComplete ? 'Pending Admin Review' : 'Action Required'}
        </span>
        <span className="text-[10px] bg-neutral-950 px-2 py-0.5 rounded-full text-neutral-500 border border-neutral-800">
          {requirement.authority.join(', ')}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-neutral-100 mb-1">{requirement.title}</h3>
        <p className="text-sm text-neutral-400 mb-4">{requirement.timing}</p>
        
        {!requirement.appCanCertify && (
          <div className="mb-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-md">
            <p className="text-xs text-blue-400/90 leading-relaxed">
              <strong>Note:</strong> Camp Lawton cannot certify this requirement inside this app. Complete it through the official authority, then upload or show your evidence for verification.
            </p>
          </div>
        )}

        <div className="mt-auto space-y-3">
          {mainTrainingLink && (
            <a 
              href={mainTrainingLink.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-neutral-100 text-neutral-900 font-bold py-2.5 px-4 rounded-md hover:bg-white transition-colors"
            >
              Go to official {mainTrainingLink.purpose === 'form' ? 'form' : 'training'}
              <ExternalLink size={16} />
            </a>
          )}

          {!reportedComplete ? (
            <button 
              onClick={() => setReportedComplete(true)}
              className="w-full bg-transparent border border-neutral-700 text-neutral-300 font-semibold py-2.5 px-4 rounded-md hover:bg-neutral-800 hover:text-white transition-colors"
            >
              I completed this
            </button>
          ) : (
            <div className="space-y-2">
              <button 
                onClick={() => setShowUpload(!showUpload)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold py-2.5 px-4 rounded-md hover:bg-emerald-500/30 transition-colors"
              >
                <Upload size={16} />
                Upload Evidence
              </button>
              
              {showUpload && (
                <div className="p-4 border border-neutral-800 rounded-md bg-neutral-950 flex flex-col items-center justify-center gap-2">
                  <Upload size={24} className="text-neutral-600 mb-1" />
                  <p className="text-xs text-neutral-500 text-center">
                    Drag and drop your certificate or form here,<br/>or click to browse.
                  </p>
                  <p className="text-[10px] text-neutral-600 mt-2 text-center">
                    Required: {requirement.requiredEvidence.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Meta Footer */}
      <div className="px-4 py-2.5 bg-neutral-950 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-500">
        <div className="flex items-center gap-1.5" title="Blocking Rule">
          {requirement.blockingRule?.includes('hard_block') ? (
            <XCircle size={12} className="text-red-500/70" />
          ) : (
            <AlertCircle size={12} className="text-amber-500/70" />
          )}
          <span className="truncate max-w-[150px]">{requirement.blockingRule?.split(' ')[0].replace('_', ' ')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          {requirement.seasonalReviewRequired ? 'Seasonal review' : 'Valid indefinitely'}
        </div>
      </div>
    </div>
  );
}
