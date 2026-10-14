import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Map,
  AlertTriangle,
  TrendingUp,
  FileText,
  Newspaper,
  BookOpen,
  Info,
  MapPin,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../layout/TopBar';
import { MONITORED_CITIES } from '../../data/mockData';
import { CityInfo } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: ActiveTab) => void;
  onSelectCity?: (city: CityInfo) => void;
  onSync?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onTabChange,
  onSelectCity,
  onSync
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Ações e itens disponíveis no menu de comandos
  const items = [
    // ── Páginas ──
    {
      id: 'tab-map',
      group: 'Navegação',
      title: 'Ir para Mapa em Tempo Real',
      subtitle: 'Visualização geoespacial com camadas de rios e satélite',
      icon: Map,
      action: () => { onTabChange('map'); onClose(); }
    },
    {
      id: 'tab-alerts',
      group: 'Navegação',
      title: 'Ver Alertas Críticos',
      subtitle: 'Centro de resposta a incidentes e notificações',
      icon: AlertTriangle,
      action: () => { onTabChange('alerts'); onClose(); }
    },
    {
      id: 'tab-forecast',
      group: 'Navegação',
      title: 'Abrir Previsões e Riscos',
      subtitle: 'Modelos de 3 dias para fogo, dengue e precipitação',
      icon: TrendingUp,
      action: () => { onTabChange('forecast'); onClose(); }
    },
    {
      id: 'tab-reports',
      group: 'Navegação',
      title: 'Central de Relatórios & Auditoria',
      subtitle: 'Boletins técnicos oficiais consolidados',
      icon: FileText,
      action: () => { onTabChange('reports'); onClose(); }
    },
    {
      id: 'tab-news',
      group: 'Navegação',
      title: 'Notícias & Cobertura Factual',
      subtitle: 'Feed de agências oficiais e imprensa',
      icon: Newspaper,
      action: () => { onTabChange('news'); onClose(); }
    },
    {
      id: 'tab-glossary',
      group: 'Navegação',
      title: 'Glossário Cidadão',
      subtitle: 'Tradução de termos técnicos (chuva, cotas e PM2.5)',
      icon: BookOpen,
      action: () => { onTabChange('glossary'); onClose(); }
    },
    {
      id: 'tab-about',
      group: 'Navegação',
      title: 'Sobre o Projeto & Autoria',
      subtitle: 'Idealização por Erick Levy e arquitetura técnica',
      icon: Info,
      action: () => { onTabChange('about'); onClose(); }
    },
    // ── Ações Rápidas ──
    {
      id: 'act-sync',
      group: 'Ações Rápidas',
      title: 'Sincronizar Telemetria Agora',
      subtitle: 'Requisitar nova varredura de dados na Azure',
      icon: RefreshCw,
      action: () => { if (onSync) onSync(); onClose(); }
    },
    // ── Capitais Monitoradas ──
    ...MONITORED_CITIES.map(city => ({
      id: `city-${city.slug}`,
      group: 'Capitais Monitoradas',
      title: `${city.nome} (${city.estado})`,
      subtitle: `Bioma ${city.bioma} ${city.rioNome ? `· Rio ${city.rioNome}` : ''}`,
      icon: MapPin,
      action: () => {
        if (onSelectCity) onSelectCity(city);
        onTabChange('map');
        onClose();
      }
    }))
  ];

  // Filtra itens com base na busca
  const filtered = items.filter(i => {
    const q = query.toLowerCase();
    return i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q) || i.group.toLowerCase().includes(q);
  });

  // Controle de navegação por teclado (Setas, Enter e Esc)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bento-card rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/10 animate-scale-up"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Campo de Entrada estilo Raycast */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-border-subtle/80 bg-surface-panel/90">
          <Search className="w-5 h-5 text-hydro mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar páginas, cidades (Brasília, Manaus...), alertas..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-zinc-500 outline-none font-sans"
          />
          <div className="flex items-center gap-1.5 ml-2">
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-400 bg-surface-base border border-border-subtle rounded shadow-sm">
              ESC
            </kbd>
          </div>
        </div>

        {/* Lista de Resultados */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-transparent">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-hydro/15 text-white border border-hydro/30 shadow-sm'
                      : 'text-zinc-300 hover:bg-surface-card/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-hydro/20 text-hydro border border-hydro/40'
                          : 'bg-surface-base border border-border-subtle text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-semibold truncate font-sans text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate font-sans">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
                      {item.group}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 ${isSelected ? 'text-hydro' : ''}`} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-zinc-500 font-sans text-xs">
              Nenhum resultado encontrado para "{query}".
            </div>
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="px-4 py-2 border-t border-border-subtle/60 bg-surface-dim/80 flex items-center justify-between text-[11px] font-sans text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ para navegar</span>
            <span>↵ para selecionar</span>
          </div>
          <span className="text-hydro font-mono">EcoWatch Command Hub</span>
        </div>
      </div>
    </div>
  );
};
