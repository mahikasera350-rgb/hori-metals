'use client';

import { Check } from 'lucide-react';
import { useStore } from './store';

export function Toast() {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-[80] -translate-x-1/2 animate-toast-in">
      <div className="flex items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-sm font-medium text-white shadow-xl">
        <Check size={15} className="text-emerald-400" />
        <span>{toast}</span>
      </div>
    </div>
  );
}
