import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <footer className="h-8 bg-surface-dim border-t border-border-subtle px-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 shrink-0 select-none z-20">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-nominal" />
          <span>Pipeline Operacional // Ciclo: 1h</span>
        </span>
        <span className="hidden sm:inline-block">·</span>
        <span className="hidden sm:inline-block">Fuso: BRT (UTC-3)</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-zinc-400">
          <Database className="w-3 h-3 text-hydro" />
          <span className="hidden md:inline">Fontes:</span>
          <span>NASA · Open-Meteo · INPE · ANA · CEMADEN</span>
        </span>
      </div>
    </footer>
  );
};
