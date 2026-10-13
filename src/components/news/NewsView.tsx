import React, { useState, useMemo } from 'react';
import { Newspaper, Search, ExternalLink, Flame, Waves, CloudRain, Bug, ShieldAlert, Radio } from 'lucide-react';
import { MOCK_NEWS } from '../../data/newsData';
import { NewsItem } from '../../types';

const CATEGORIES = [
  { key: 'ALL', label: 'Todas as Notícias' },
  { key: 'FIRE', label: 'Queimadas & Fogo', icon: Flame, color: 'text-critical' },
  { key: 'FLOOD', label: 'Rios & Enchentes', icon: Waves, color: 'text-hydro' },
  { key: 'RAIN', label: 'Chuvas Extremas', icon: CloudRain, color: 'text-nominal' },
  { key: 'DENGUE', label: 'Vigilância Dengue', icon: Bug, color: 'text-warning' },
  { key: 'GENERAL', label: 'Defesa Civil', icon: ShieldAlert, color: 'text-zinc-300' }
];

export const NewsView: React.FC = () => {
  const [news] = useState<NewsItem[]>(MOCK_NEWS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchCategory = selectedCategory === 'ALL' || item.categoria === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.resumo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.municipio && item.municipio.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.fonte.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [news, selectedCategory, searchQuery]);

  const getCategoryBadge = (categoria: string) => {
    switch (categoria) {
      case 'FIRE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-critical/15 text-critical border border-critical/30 uppercase">
            <Flame className="w-3 h-3" />
            <span>Incêndios & Queimadas</span>
          </span>
        );
      case 'FLOOD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-hydro/15 text-hydro border border-hydro/30 uppercase">
            <Waves className="w-3 h-3" />
            <span>Nível dos Rios</span>
          </span>
        );
      case 'RAIN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-nominal/15 text-nominal border border-nominal/30 uppercase">
            <CloudRain className="w-3 h-3" />
            <span>Chuva Torrencial</span>
          </span>
        );
      case 'DENGUE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/15 text-warning border border-warning/30 uppercase">
            <Bug className="w-3 h-3" />
            <span>Risco de Dengue</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-700/30 text-zinc-300 border border-border-subtle uppercase">
            <ShieldAlert className="w-3 h-3" />
            <span>Defesa Civil</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-hidden">
      {/* ── Barra Superior de Filtros & Busca ── */}
      <div className="p-4 border-b border-border-subtle bg-surface-panel/80 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold font-mono text-zinc-100 flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-hydro" />
              <span>Notícias & Eventos Climáticos em Tempo Real</span>
            </h1>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Cobertura factual da imprensa e boletins de Defesa Civil complementando a telemetria física
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-hydro/10 border border-hydro/20 text-xs font-mono text-hydro w-fit">
            <Radio className="w-3.5 h-3.5 animate-pulse text-hydro" />
            <span>Fontes: G1 · Agência Brasil · CEMADEN · InfoDengue</span>
          </div>
        </div>

        {/* Campo de Busca & Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por notícia, localidade (ex: Gama, Cuiabá, Guaíba) ou fonte..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface-base border border-border-subtle rounded py-1.5 pl-9 pr-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-hydro transition-colors"
            />
          </div>

          {/* Chips de Categorias */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-2.5 py-1 rounded whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-hydro/20 text-hydro border border-hydro/40 font-semibold shadow-sm'
                    : 'bg-surface-card text-zinc-400 hover:text-zinc-200 border border-border-subtle'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feed de Notícias (Grid Responsivo) ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6 space-y-4 max-w-6xl mx-auto w-full">
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNews.map(item => (
              <article
                key={item.id}
                className="p-4 sm:p-5 rounded-lg bg-surface-panel border border-border-subtle hover:border-hydro/30 transition-all flex flex-col justify-between space-y-3 group shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {getCategoryBadge(item.categoria)}
                    <span className="text-[11px] font-mono text-zinc-500">
                      {new Date(item.dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às{' '}
                      {new Date(item.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h2 className="text-sm sm:text-base font-bold text-white font-sans group-hover:text-hydro transition-colors leading-snug">
                    {item.titulo}
                  </h2>

                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {item.resumo}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle/60 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-zinc-500">Fonte:</span>
                    <span className="text-zinc-200 font-medium truncate max-w-[180px]">{item.fonte}</span>
                    {item.municipio && (
                      <span className="hidden sm:inline text-zinc-500">· {item.municipio}/{item.estado}</span>
                    )}
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-hydro hover:underline font-semibold text-[11px]"
                  >
                    <span>Ver Fonte</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-zinc-500 font-mono text-xs">
            <Newspaper className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            Nenhuma notícia encontrada para os termos ou categoria pesquisados.
          </div>
        )}
      </div>
    </div>
  );
};
