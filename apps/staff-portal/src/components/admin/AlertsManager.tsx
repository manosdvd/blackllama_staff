'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
import { AlertOctagon, Plus, Trash2, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export interface SystemAlert {
  id: string;
  title: string;
  description: string | null;
  severity: 'Info' | 'Warning' | 'Severe';
  is_active: boolean;
  created_at: string;
}

export function AlertsManager() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New alert form state
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState<'Info' | 'Warning' | 'Severe'>('Info');
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('camp_alerts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error && error.code !== '42P01') {
          console.error('Error fetching alerts', error);
        }
        
        if (!mounted) return;
        
        if (data) {
          setAlerts(data as SystemAlert[]);
        } else {
          setAlerts([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAlerts();
    return () => { mounted = false; };
  }, []);

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setError(null);
    try {
      const { data, error } = await supabase
        .from('camp_alerts')
        .insert({
          title: newTitle.trim(),
          severity: newSeverity,
          is_active: true
        })
        .select()
        .single();
        
      if (error) {
        setError('Failed to create alert.');
        console.error(error);
      } else if (data) {
        setAlerts([data as SystemAlert, ...alerts]);
        setNewTitle('');
        setNewSeverity('Info');
      }
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred.');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('camp_alerts')
        .update({ is_active: !currentActive })
        .eq('id', id);
        
      if (!error) {
        setAlerts(alerts.map(a => 
          a.id === id ? { ...a, is_active: !currentActive } : a
        ));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('camp_alerts')
        .delete()
        .eq('id', id);
        
      if (!error) {
        setAlerts(alerts.filter(a => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-48">
        <RefreshCw className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6">
        <h2 className="text-xl font-black font-heading text-emerald-800 dark:text-emerald-500 flex items-center gap-2 mb-4">
          <ShieldAlert size={24} />
          Create Camp Alert
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Broadcast internal alerts to the Global HUD. Severe alerts will trigger an emergency visual state for all active sessions.
        </p>

        <form onSubmit={handleAddAlert} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Alert Message</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Bear spotted near campsite 4"
              className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Severity Level</label>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as 'Info' | 'Warning' | 'Severe')}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Info">Info (Neutral)</option>
                <option value="Warning">Warning (Amber)</option>
                <option value="Severe">Severe (Red Emergency)</option>
              </select>
            </div>
            <div className="flex-none pt-6">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2 transition-colors"
              >
                <Plus size={16} /> Publish Alert
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm font-bold mt-2">{error}</div>}
        </form>
      </div>

      <div className="glass-panel bg-white/70 dark:bg-neutral-900/60 p-6">
        <h3 className="text-lg font-black font-heading text-neutral-800 dark:text-neutral-200 mb-4">Active & Past Alerts</h3>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 font-bold text-sm">No internal alerts found in database.</div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                  !alert.is_active 
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 opacity-70'
                    : alert.severity === 'Severe'  
                      ? 'bg-red-500/10 border-red-500/30' 
                      : alert.severity === 'Warning' 
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-sky-500/10 border-sky-500/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    alert.severity === 'Severe' ? 'bg-red-500/20 text-red-500' :
                    alert.severity === 'Warning' ? 'bg-amber-500/20 text-amber-500' : 'bg-sky-500/20 text-sky-500'
                  }`}>
                    <AlertOctagon size={20} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${!alert.is_active ? 'line-through text-neutral-500' : ''}`}>{alert.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      <span>{alert.severity}</span>
                      <span>•</span>
                      <span>{new Date(alert.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span className={alert.is_active ? 'text-emerald-500' : 'text-neutral-400'}>
                        {alert.is_active ? 'Broadcasting' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleActive(alert.id, alert.is_active)}
                    className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-500 transition-colors"
                    title={alert.is_active ? 'Deactivate Alert' : 'Reactivate Alert'}
                  >
                    <CheckCircle size={18} className={alert.is_active ? 'text-emerald-500' : ''} />
                  </button>
                  <button 
                    onClick={() => handleDelete(alert.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                    title="Permanently Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
