import React, { useState } from 'react';
import { Map, AlertTriangle, TrendingUp, RefreshCw, Bell, Radio } from 'lucide-react';
import { triggerManualSync } from '../../services/api';

export type ActiveTab = 'map' | 'alerts' | 'forecast';

interface TopBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenLanding?: () => void;
  unreadAlertsCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onOpenLanding,
  unreadAlertsCount = 3
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const res = await triggerManualSync();
      setSyncStatus(res.message);
      setTimeout(() => setSyncStatus(null), 3500);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header className="h-14 bg-surface-panel border-b border-border-subtle px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Esquerda: Logo e Identificador */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          onClick={onOpenLanding}
          className="flex items-center gap-2 hover:opacity-85 transition-opacity text-left cursor-pointer"
          title="Ver Apresentação Técnica / Manifesto"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-hydro/10 border border-hydro/30 flex items-center justify-center text-hydro shrink-0">
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-hydro animate-pulse" />
          </div>
          <span className="font-semibold text-base sm:text-lg tracking-tight text-white">EcoWatch</span>
        </button>
        <div className="h-4 w-px bg-border-subtle hidden sm:block" />
        <span className="text-xs font-mono text-zinc-400 hidden lg:inline-block">
          Centro de Operações Ambientais
        </span>
      </div>

      {/* Centro: Navegação entre as 3 Abas + Sobre */}
      <nav className="flex items-center gap-0.5 sm:gap-1 bg-surface-base/80 p-1 rounded-md border border-border-subtle">
        <button
          onClick={() => onTabChange('map')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
            activeTab === 'map'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Mapa</span>
        </button>

        <button
          onClick={() => onTabChange('alerts')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded text-xs font-medium transition-all relative ${
            activeTab === 'alerts'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Alertas</span>
          {unreadAlertsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-critical text-[10px] text-white flex items-center justify-center font-mono font-bold leading-none">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('forecast')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded text-xs font-medium transition-all ${
            activeTab === 'forecast'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Previsões</span>
        </button>

        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="px-2 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-surface-card transition-colors hidden sm:inline-block ml-1 border-l border-border-subtle pl-2.5"
            title="Apresentação e Arquitetura do Sistema"
          >
            Sobre
          </button>
        )}
      </nav>

      {/* Direita: Status dos Nós e Ações */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {syncStatus && (
          <span className="text-[11px] font-mono text-hydro bg-hydro/10 px-2 py-0.5 rounded border border-hydro/20 hidden md:inline-block">
            {syncStatus}
          </span>
        )}

        <button
          onClick={handleSync}
          disabled={syncing}
          title="Forçar sincronização de telemetria"
          className="p-1.5 rounded border border-border-subtle bg-surface-card text-zinc-400 hover:text-hydro hover:border-hydro/40 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-hydro' : ''}`} />
        </button>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-border-subtle bg-surface-card" title="10 capitais com telemetria ativa">
          <span className="w-2 h-2 rounded-full bg-nominal animate-ping" />
          <span className="text-[11px] font-mono text-zinc-300 hidden md:inline-block">10 capitais</span>
        </div>

        <button 
          onClick={() => onTabChange('alerts')}
          className="relative p-1.5 rounded border border-border-subtle bg-surface-card text-zinc-400 hover:text-zinc-200"
          title="Central de Alertas"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-critical" />
          )}
        </button>
      </div>
    </header>
  );
};
