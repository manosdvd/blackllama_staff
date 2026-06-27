'use client';

import React from 'react';
import { useOffline } from '@/hooks/useOffline';

/**
 * Banner shown globally at the top of the viewport when the user loses network connectivity.
 */
export function OfflineStatusBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="bg-red-600 text-white font-semibold py-2.5 px-4 text-center text-sm shadow-md border-b border-red-700 flex items-center justify-center gap-2 z-50 sticky top-0 reduced-stimulation:animate-none reduced-stimulation:bg-red-800">
      <span className="text-base">⚠️</span>
      <span>Offline Mode — Active LocalStorage caching is active. Form submissions will be queued locally.</span>
    </div>
  );
}
export default OfflineStatusBanner;
