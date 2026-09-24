import React, { useState } from 'react';
import { Map, AlertTriangle, TrendingUp, FileText, RefreshCw, Bell, Radio, MapPin } from 'lucide-react';
import { triggerManualSync } from '../../services/api';
import { CityInfo } from '../../types';
import { MONITORED_CITIES } from '../../data/mockData';

export type ActiveTab = 'map' | 'alerts' | 'forecast' | 'reports';

interface TopBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenLanding?: () => void;
  unreadAlertsCount?: number;
  selectedCity?: CityInfo;
  onSelectCity?: (city: CityInfo) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onOpenLanding,
  unreadAlertsCount = 3,
  selectedCity,
  onSelectCity
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

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = MONITORED_CITIES.find(c => c.slug === e.target.value);
    if (city && onSelectCity) {
      onSelectCity(city);
      // Garante que a aba do mapa fique ativa ao selecionar cidade
      if (activeTab !== 'map') onTabChange('map');
    }
  };

  return (
    <header className="h-14 bg-surface-panel border-b border-border-subtle px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* ── Esquerda: Logo ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenLanding}
          className="flex items-center gap-2 hover:opacity-85 transition-opacity text-left cursor-pointer"
          title="Ver Apresentação Técnica / Manifesto"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-hydro/10 border border-hydro/30 flex items-center justify-center text-hydro shrink-0">
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-hydro animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base font-mono tracking-wider text-zinc-100">
                EcoWatch
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-hydro/10 text-hydro border border-hydro/20">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono hidden sm:block">
              Centro de Operações Ambientais
            </p>
          </div>
        </button>
      </div>

      {/* ── Centro: Navegação de Abas (Visível em Telas Médias e Grandes) ── */}
      <nav className="hidden md:flex items-center gap-1 bg-surface-base border border-border-subtle rounded-md p-1">
        <button
          onClick={() => onTabChange('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            activeTab === 'map'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Mapa</span>
        </button>

        <button
          onClick={() => onTabChange('alerts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all relative ${
            activeTab === 'alerts'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Alertas</span>
          {unreadAlertsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-critical text-[10px] text-white flex items-center justify-center font-mono font-bold leading-none">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('forecast')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            activeTab === 'forecast'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Previsões</span>
        </button>

        <button
          onClick={() => onTabChange('reports')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            activeTab === 'reports'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Relatórios</span>
        </button>

        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="px-2 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-surface-card transition-colors ml-1 border-l border-border-subtle pl-2.5"
            title="Apresentação e Arquitetura do Sistema"
          >
            Sobre
          </button>
        )}
      </nav>

      {/* ── Direita: Seletor de Cidade + Status + Ações ── */}
      <div className="flex items-center gap-1.5 sm:gap-2">

        {/* Seletor de Cidade (Acessível no Mobile e Desktop) */}
        {selectedCity && onSelectCity && (
          <div className="flex items-center gap-1 sm:gap-1.5 bg-surface-card border border-border-subtle rounded px-1.5 sm:px-2 py-1 text-xs font-mono">
            <MapPin className="w-3 h-3 text-hydro shrink-0" />
            <select
              value={selectedCity.slug}
              onChange={handleCityChange}
              className="bg-transparent text-zinc-200 cursor-pointer outline-none text-xs font-mono max-w-[105px] sm:max-w-[130px] truncate"
              title="Selecionar capital monitorada"
            >
              {MONITORED_CITIES.map(city => (
                <option
                  key={city.slug}
                  value={city.slug}
                  className="bg-surface-panel text-zinc-200"
                >
                  {city.nome} ({city.estado})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status de sync */}
        {syncStatus && (
          <span className="text-[11px] font-mono text-hydro bg-hydro/10 px-2 py-0.5 rounded border border-hydro/20 hidden md:inline-block">
            {syncStatus}
          </span>
        )}

        {/* Botão de sincronização */}
        <button
          onClick={handleSync}
          disabled={syncing}
          title="Forçar sincronização de telemetria"
          className="p-1.5 rounded border border-border-subtle bg-surface-card text-zinc-400 hover:text-hydro hover:border-hydro/40 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-hydro' : ''}`} />
        </button>

        {/* Indicador de nós ativos */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded border border-border-subtle bg-surface-card"
          title={`${MONITORED_CITIES.length} capitais com telemetria ativa`}
        >
          <span className="w-2 h-2 rounded-full bg-nominal animate-ping" />
          <span className="text-[11px] font-mono text-zinc-300 hidden md:inline-block">
            {MONITORED_CITIES.length} capitais
          </span>
        </div>

        {/* Sino de alertas */}
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
