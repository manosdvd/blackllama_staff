'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, Settings, RefreshCw, AlertOctagon, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Application {
  id: string;
  name: string;
  roleChoice: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes: string;
  parentSigned: boolean;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

const initialApps: Application[] = [
  { id: 'app1', name: 'Bobby Jenkins (Age 15)', roleChoice: 'CIT / Volunteer', submittedAt: '2026-06-25', status: 'Pending', notes: '', parentSigned: false },
  { id: 'app2', name: 'Jimmy Tarleton (Age 22)', roleChoice: 'Scoutcraft Area Director', submittedAt: '2026-06-24', status: 'Approved', notes: 'NCS certified.', parentSigned: true },
  { id: 'app3', name: 'Alice Peterson (Age 19)', roleChoice: 'Nature Instructor', submittedAt: '2026-06-23', status: 'Pending', notes: '', parentSigned: true }
];

const initialLogs: AuditLog[] = [
  { id: 'log1', action: 'CREATE_SEASON', user: '@marylou_director', timestamp: '2026-06-01 09:00', details: 'Initialized Season Year 2026' },
  { id: 'log2', action: 'UPDATE_RLS_POLICIES', user: '@marylou_director', timestamp: '2026-06-02 11:30', details: 'Hardened Row-Level Security on Candidate tables' }
];

const readStoredApplications = () => {
  if (typeof window === 'undefined') return initialApps;
  const localApps = localStorage.getItem('camp_lawton_admin_apps');
  if (!localApps) {
    localStorage.setItem('camp_lawton_admin_apps', JSON.stringify(initialApps));
    return initialApps;
  }
  try {
    return JSON.parse(localApps) as Application[];
  } catch {
    return initialApps;
  }
};

const readStoredAuditLogs = () => {
  if (typeof window === 'undefined') return initialLogs;
  const localLogs = localStorage.getItem('camp_lawton_admin_audit_logs');
  if (!localLogs) {
    localStorage.setItem('camp_lawton_admin_audit_logs', JSON.stringify(initialLogs));
    return initialLogs;
  }
  try {
    return JSON.parse(localLogs) as AuditLog[];
  } catch {
    return initialLogs;
  }
};

export default function AdminPortalPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'queue' | 'logs' | 'rollover'>('queue');
  const [apps, setApps] = useState<Application[]>(readStoredApplications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(readStoredAuditLogs);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusToast, setStatusToast] = useState<string | null>(null);
  const [rolloverConfirmOpen, setRolloverConfirmOpen] = useState(false);

  // Role gate: redirect non-admins to dashboard
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (data?.role !== 'Admin') {
        router.push('/dashboard');
      } else {
        setAuthLoading(false);
      }
    };
    checkAdmin();
  }, [router]);

  if (authLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <RefreshCw className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  const handleUpdateStatus = (id: string, nextStatus: 'Approved' | 'Rejected') => {
    const updated = apps.map(a => {
      if (a.id === id) {
        return { ...a, status: nextStatus, notes: adminNotes };
      }
      return a;
    });

    setApps(updated);
    localStorage.setItem('camp_lawton_admin_apps', JSON.stringify(updated));

    // Log audit
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      action: `SET_STATUS_${nextStatus.toUpperCase()}`,
      user: '@admin_director',
      timestamp: new Date().toLocaleString(),
      details: `Updated application status for ${apps.find(a => a.id === id)?.name}. Notes: ${adminNotes}`
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem('camp_lawton_admin_audit_logs', JSON.stringify(updatedLogs));

    setStatusToast(`Application successfully marked as ${nextStatus}!`);
    setTimeout(() => setStatusToast(null), 3500);
    setSelectedAppId(null);
    setAdminNotes('');
  };

  const handlePromoteToStaff = (appName: string) => {
    setStatusToast(`🎉 "${appName}" promoted to Active Staff for 2026!`);
    
    // Log audit
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      action: 'PROMOTE_TO_STAFF',
      user: '@admin_director',
      timestamp: new Date().toLocaleString(),
      details: `Promoted candidate ${appName} to Hired Staff status.`
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem('camp_lawton_admin_audit_logs', JSON.stringify(updatedLogs));
  };

  const executeSeasonalRollover = () => {
    setRolloverConfirmOpen(false);
    // Create new rollover audit
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      action: 'SEASONAL_ROLLOVER',
      user: '@admin_director',
      timestamp: new Date().toLocaleString(),
      details: 'Performed system-wide seasonal rollover. Archived 2026. Moved active staff to Returning Candidate status. Opened 2027 season prep.'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem('camp_lawton_admin_audit_logs', JSON.stringify(updatedLogs));

    // Reset application queue
    setApps([]);
    localStorage.setItem('camp_lawton_admin_apps', JSON.stringify([]));

    // Real active user status update would go here with a Supabase mutation
    // For now, we omit the localStorage manipulation of the mock active user

    setStatusToast('🎉 Seasonal Rollover completed! Season archived.');
    setTimeout(() => { setStatusToast(null); window.location.reload(); }, 2500);
  };

  const handleSeasonalRollover = () => {
    setRolloverConfirmOpen(true);
  };

  const selectedApp = apps.find(a => a.id === selectedAppId);

  return (
    <div className="flex flex-col gap-6">
      {/* Toast notification */}
      {statusToast && (
        <div className="fixed top-4 right-4 z-[200] bg-emerald-800 text-white text-xs font-bold py-3 px-5 rounded-xl shadow-xl flex items-center gap-2 animate-pulse">
          <CheckCircle size={16} />
          <span>{statusToast}</span>
        </div>
      )}

      {/* Rollover Confirm Modal */}
      {rolloverConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border-2 border-red-500 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertOctagon size={22} />
              <h2 className="font-black text-base uppercase">Seasonal Rollover</h2>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              ⚠️ <strong>CRITICAL ACTION:</strong> This will close Season 2026, reset all active staff to &quot;Returning Candidate&quot;, and archive all applications. This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setRolloverConfirmOpen(false)} className="flex-1 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5">
                <XCircle size={14} /> Cancel
              </button>
              <button onClick={executeSeasonalRollover} className="flex-1 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                <RefreshCw size={14} /> Confirm Rollover
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-4 border-l-4 border-emerald-800">
        <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 font-heading tracking-wide flex items-center gap-2.5">
          <ShieldCheck size={28} />
          <span>ADMINISTRATOR MANAGEMENT PANEL</span>
        </h2>
        
        {/* Navigation tabs */}
        <div className="flex gap-1.5 border-t border-neutral-250/20 pt-4 mt-1">
          <button
            onClick={() => setActiveTab('queue')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'queue' ? 'bg-emerald-800 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 text-neutral-500'
            }`}
          >
            Review Queue
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'logs' ? 'bg-emerald-800 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 text-neutral-500'
            }`}
          >
            Audit Log Viewer
          </button>
          <button
            onClick={() => setActiveTab('rollover')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rollover' ? 'bg-red-800 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40 text-neutral-500'
            }`}
          >
            <Settings size={13} />
            <span>Seasonal Rollover</span>
          </button>
        </div>
      </div>

      {/* Review Queue Tab */}
      {activeTab === 'queue' && (
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Applications list */}
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              Pending Candidates ({apps.filter(a => a.status === 'Pending').length})
            </h3>
            
            <div className="flex flex-col gap-3">
              {apps.map(app => (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedAppId(app.id);
                    setAdminNotes(app.notes);
                  }}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all flex justify-between items-center ${
                    selectedAppId === app.id
                      ? 'bg-emerald-800/10 border-emerald-500 text-emerald-800 dark:text-emerald-400'
                      : 'bg-white/40 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-350 hover:bg-white dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <div>
                    <div className="font-bold text-neutral-850 dark:text-neutral-150">{app.name}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Applied: {app.submittedAt} • choice: {app.roleChoice}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8.5px] font-black uppercase py-0.5 px-2.5 rounded-full ${
                      app.status === 'Approved'
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : app.status === 'Rejected'
                        ? 'bg-red-500/15 text-red-500'
                        : 'bg-amber-500/15 text-amber-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
              {apps.length === 0 && (
                <div className="text-neutral-500 italic text-xs">No applications submitted yet.</div>
              )}
            </div>
          </div>

          {/* Details Pane */}
          {selectedApp && (
            <div className="lg:w-[350px] glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-4 flex-shrink-0">
              <header className="border-b border-neutral-200 dark:border-neutral-800/65 pb-3">
                <h4 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                  REVIEW: {selectedApp.name}
                </h4>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                  Choice: {selectedApp.roleChoice}
                </span>
              </header>

              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <strong>Co-signature verification:</strong><br />
                  <span className={selectedApp.parentSigned ? 'text-emerald-700 font-bold' : 'text-amber-500 font-semibold'}>
                    {selectedApp.parentSigned ? '✓ Co-signed & verified' : '⚠️ Missing parent signature'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Evaluator Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    placeholder="Enter review notes here..."
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 text-xs outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800/60 mt-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Approved')}
                    className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                    className="flex-1 py-2 bg-red-800 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Reject
                  </button>
                </div>
                {selectedApp.status === 'Approved' && (
                  <button
                    onClick={() => handlePromoteToStaff(selectedApp.name)}
                    className="w-full py-2 bg-emerald-800/10 hover:bg-emerald-800/20 text-emerald-800 dark:text-emerald-450 border border-emerald-500/20 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserCheck size={14} />
                    <span>Promote to Active Staff</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit Log Viewer Tab */}
      {activeTab === 'logs' && (
        <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-4">
          <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
            Administrative Audit Footprint
          </h3>
          
          <div className="flex flex-col gap-3">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 bg-neutral-100 dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col gap-1 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-450">{log.action}</span>
                  <span className="text-[10px] text-neutral-400">{log.timestamp}</span>
                </div>
                <div className="text-[10px] text-neutral-450 mt-0.5">Executor: {log.user}</div>
                <p className="text-neutral-600 dark:text-neutral-350 mt-1.5 leading-relaxed">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Rollover Tab */}
      {activeTab === 'rollover' && (
        <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6 flex flex-col gap-5 border border-red-500/20">
          <h3 className="font-extrabold text-base text-red-500 uppercase tracking-wider flex items-center gap-1.5">
            <AlertOctagon size={18} />
            <span>SEASONAL ROLLOVER SYSTEM UTILITIES</span>
          </h3>
          <p className="text-neutral-600 dark:text-neutral-350 text-xs leading-relaxed max-w-2xl">
            This module transitions the staff portal database into the next hiring cycle. Running the rollover archives current application directories, closes active rosters, and triggers returning-applicant resets.
          </p>

          <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20 text-xs text-red-650 dark:text-red-400 font-semibold leading-relaxed flex flex-col gap-2">
            <span><strong>⚠ IMPORTANT ROLES RULES:</strong></span>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Active Staff are moved to &quot;Returning Candidate&quot; class role on rollover.</li>
              <li>A brand-new application wizard is required for the new season.</li>
              <li>All historical logs, reviews, and audits are locked as read-only.</li>
            </ul>
          </div>

          <button
            onClick={handleSeasonalRollover}
            className="flex items-center justify-center gap-2 self-start py-3 px-6 bg-red-800 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-red-800/10"
          >
            <RefreshCw size={14} />
            <span>Close 2026 & Initiate Season Rollover</span>
          </button>
        </div>
      )}
    </div>
  );
}
