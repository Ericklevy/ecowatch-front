import React from 'react';
import { Database, ShieldCheck, WifiOff, Wifi } from 'lucide-react';

interface StatusBarProps {
  isBackendOnline: boolean;
  lastUpdate: Date | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({ isBackendOnline, lastUpdate }) => {
  const formatTime = (d: Date) =>
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <footer className="h-8 bg-surface-dim border-t border-border-subtle px-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 shrink-0 select-none z-20">
      <div className="flex items-center gap-3">
        {/* Indicador de conexão com o backend */}
        <span
          className={`flex items-center gap-1.5 font-semibold ${
            isBackendOnline ? 'text-nominal' : 'text-warning'
          }`}
          title={isBackendOnline ? 'Backend conectado — dados em tempo real' : 'Backend offline — exibindo dados de demonstração'}
        >
          {isBackendOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          <span>{isBackendOnline ? 'AO VIVO' : 'DEMONSTRAÇÃO'}</span>
        </span>

        <span className="text-zinc-600">·</span>

        <span className="flex items-center gap-1.5 text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-nominal" />
          <span>Pipeline // Ciclo: 1h</span>
        </span>

        {lastUpdate && (
          <>
            <span className="text-zinc-600 hidden sm:inline">·</span>
            <span className="hidden sm:inline text-zinc-500">
              Atualizado: <span className="text-zinc-300">{formatTime(lastUpdate)}</span>
            </span>
          </>
        )}

        <span className="hidden md:inline text-zinc-600">·</span>
        <span className="hidden md:inline">Fuso: BRT (UTC-3)</span>
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
