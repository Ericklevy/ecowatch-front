import React, { useState } from 'react';
import { Map, AlertTriangle, TrendingUp, FileText, RefreshCw, Bell, Radio, MapPin, Menu, X, ChevronRight, Newspaper, Info, BookOpen } from 'lucide-react';
import { triggerManualSync } from '../../services/api';
import { CityInfo } from '../../types';
import { MONITORED_CITIES } from '../../data/mockData';

export type ActiveTab = 'map' | 'alerts' | 'forecast' | 'reports' | 'news' | 'about' | 'glossary';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      <header className="h-14 bg-surface-panel border-b border-border-subtle px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none relative">
        {/* ── Esquerda: Hamburger Menu (Mobile) + Logo ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão de Menu Hambúrguer (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-surface-card border border-border-subtle text-zinc-300 hover:text-white active:scale-95 transition-transform"
            aria-label="Abrir menu de navegação"
            title="Menu de Páginas"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-hydro" /> : <Menu className="w-4 h-4" />}
          </button>

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

        <button
          onClick={() => onTabChange('news')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            activeTab === 'news'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Notícias</span>
        </button>

        <button
          onClick={() => onTabChange('glossary')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            activeTab === 'glossary'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Glossário</span>
        </button>

        <button
          onClick={() => onTabChange('about')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            activeTab === 'about'
              ? 'bg-hydro/15 text-hydro border border-hydro/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-card'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Sobre</span>
        </button>
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

    {/* ── Menu Suspenso de Navegação Mobile ── */}
    {isMobileMenuOpen && (
      <div className="md:hidden fixed inset-x-0 top-14 bg-surface-panel/98 backdrop-blur border-b border-border-subtle z-50 p-4 shadow-2xl animate-fade-in space-y-3">
        <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
          Navegação do Centro de Operações
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { onTabChange('map'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
              activeTab === 'map'
                ? 'bg-hydro/15 text-hydro border-hydro/40 font-bold'
                : 'bg-surface-card border-border-subtle text-zinc-300 hover:text-white'
            }`}
          >
            <Map className="w-4 h-4 text-hydro" />
            <div>
              <div className="text-xs font-mono">Mapa</div>
              <div className="text-[10px] text-zinc-400">Ao vivo</div>
            </div>
          </button>

          <button
            onClick={() => { onTabChange('alerts'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all relative ${
              activeTab === 'alerts'
                ? 'bg-hydro/15 text-hydro border-hydro/40 font-bold'
                : 'bg-surface-card border-border-subtle text-zinc-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-critical" />
            <div>
              <div className="text-xs font-mono">Alertas</div>
              <div className="text-[10px] text-zinc-400">{unreadAlertsCount} ativos</div>
            </div>
          </button>

          <button
            onClick={() => { onTabChange('forecast'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
              activeTab === 'forecast'
                ? 'bg-hydro/15 text-hydro border-hydro/40 font-bold'
                : 'bg-surface-card border-border-subtle text-zinc-300 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-hydro" />
            <div>
              <div className="text-xs font-mono">Previsões</div>
              <div className="text-[10px] text-zinc-400">D+3 riscos</div>
            </div>
          </button>

          <button
            onClick={() => { onTabChange('reports'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
              activeTab === 'reports'
                ? 'bg-hydro/15 text-hydro border-hydro/40 font-bold'
                : 'bg-surface-card border-border-subtle text-zinc-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-hydro" />
            <div>
              <div className="text-xs font-mono">Relatórios</div>
              <div className="text-[10px] text-zinc-400">PDF & CSV</div>
            </div>
          </button>

          <button
            onClick={() => { onTabChange('news'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
              activeTab === 'news'
                ? 'bg-hydro/15 text-hydro border-hydro/40 font-bold'
                : 'bg-surface-card border-border-subtle text-zinc-300 hover:text-white'
            }`}
          >
            <Newspaper className="w-4 h-4 text-hydro" />
            <div>
              <div className="text-xs font-mono">Notícias</div>
              <div className="text-[10px] text-zinc-400">Tempo real</div>
            </div>
          </button>

          <button
            onClick={() => { onTabChange('glossary'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
              activeTab === 'glossary'
                ? 'bg-hydro/15 text-hydro border-hydro/40 font-bold'
                : 'bg-surface-card border-border-subtle text-zinc-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-hydro" />
            <div>
              <div className="text-xs font-mono">Glossário</div>
              <div className="text-[10px] text-zinc-400">Termos simples</div>
            </div>
          </button>

          <button
            onClick={() => { onTabChange('about'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
              activeTab === 'about'
                ? 'bg-hydro/15 text-hydro border-hydro/40 font-bold'
                : 'bg-surface-card border-border-subtle text-zinc-300 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4 text-hydro" />
            <div>
              <div className="text-xs font-mono">Sobre</div>
              <div className="text-[10px] text-zinc-400">Projeto & Autoria</div>
            </div>
          </button>
        </div>

        {onOpenLanding && (
          <button
            onClick={() => { onOpenLanding(); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-surface-card/60 border border-border-subtle text-xs font-mono text-zinc-300 hover:text-white"
          >
            <span>Ver Manifesto Inicial (Landing Page)</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        )}

        {/* Sincronização e status */}
        <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-card border border-border-subtle text-xs font-mono text-zinc-300 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-hydro ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Sincronizando...' : 'Atualizar Telemetria'}</span>
          </button>
          <span className="text-[10px] font-mono text-nominal flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-nominal animate-ping" />
            27 capitais ativas
          </span>
        </div>
      </div>
    )}
  </>
  );
};
