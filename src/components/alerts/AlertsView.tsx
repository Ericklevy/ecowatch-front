import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, CheckCircle2 } from 'lucide-react';
import { MOCK_ALERTS, MONITORED_CITIES } from '../../data/mockData';
import { formatAlertTypeName, AlertDTO } from '../../types';
import { fetchAllAlerts } from '../../services/api';
import { normalizeCityName } from '../../utils/humanFormatters';

const ALERT_CATEGORIES = [
  { key: 'ALL', label: 'Todos os Alertas' },
  { key: 'RIVER_FLOOD', label: 'Enchentes (ANA)' },
  { key: 'FOREST_FIRE', label: 'Focos de Calor (INPE/NASA)' },
  { key: 'CRITICAL_FIRE_RISK', label: 'Chance Alta de Fogo' },
  { key: 'POOR_AIR_QUALITY', label: 'Qualidade do Ar' },
  { key: 'EXTREME_HEAT', label: 'Calor Extremo' },
  { key: 'EXTREME_RAIN', label: 'Chuva Extrema' },
  { key: 'FLASH_FLOOD', label: 'Enxurrada (CEMADEN)' },
  { key: 'DROUGHT_RISK', label: 'Risco de Seca' },
  { key: 'DENGUE_OUTBREAK_RISK', label: 'Surto de Dengue' }
];

export const AlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertDTO[]>(MOCK_ALERTS);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');

  useEffect(() => {
    fetchAllAlerts().then(data => {
      if (data && data.length > 0) {
        setAlerts(data);
      }
    });
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchCategory = selectedCategory === 'ALL' || alert.tipoAlerta === selectedCategory;
      const matchCity = selectedCity === 'ALL' || 
        normalizeCityName(alert.municipio) === normalizeCityName(selectedCity) ||
        normalizeCityName(alert.municipio).includes(normalizeCityName(selectedCity)) ||
        normalizeCityName(selectedCity).includes(normalizeCityName(alert.municipio));

      const queryNorm = normalizeCityName(searchQuery);
      const matchSearch = searchQuery === '' || 
        normalizeCityName(alert.municipio).includes(queryNorm) ||
        alert.mensagem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.tipoAlerta.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatAlertTypeName(alert.tipoAlerta).toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchCity && matchSearch;
    });
  }, [alerts, selectedCategory, selectedCity, searchQuery]);

  const getSeverityBadge = (tipoAlerta: string) => {
    if (tipoAlerta === 'RIVER_FLOOD' || tipoAlerta === 'FOREST_FIRE' || tipoAlerta === 'FLASH_FLOOD') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-critical/15 text-critical border border-critical/30 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-critical animate-ping" />
          <span>Crítico</span>
        </span>
      );
    }
    if (tipoAlerta === 'CRITICAL_FIRE_RISK' || tipoAlerta === 'POOR_AIR_QUALITY' || tipoAlerta === 'EXTREME_HEAT') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/15 text-warning border border-warning/30 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-warning" />
          <span>Alerta</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-hydro/15 text-hydro border border-hydro/30 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-hydro" />
        <span>Atenção</span>
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-hidden">
      {/* Barra de Filtros e Busca */}
      <div className="p-4 border-b border-border-subtle bg-surface-panel/80 space-y-3 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por capital, palavra-chave ou tipo de evento..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface-base border border-border-subtle rounded py-1.5 pl-9 pr-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-hydro transition-colors"
            />
          </div>

          {/* Filtro por Cidade */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="bg-surface-base border border-border-subtle rounded py-1.5 px-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-hydro cursor-pointer"
            >
              <option value="ALL">Todas as {MONITORED_CITIES.length} Capitais</option>
              {MONITORED_CITIES.map(c => (
                <option key={c.slug} value={c.nome}>{c.nome} ({c.estado})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chips de Categorias */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {ALERT_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-2.5 py-1 rounded whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-hydro/20 text-hydro border border-hydro/40 font-semibold'
                  : 'bg-surface-card text-zinc-400 hover:text-zinc-200 border border-border-subtle'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resumo da Filtragem Ativa e Contagem Dinâmica */}
        <div className="pt-1 flex items-center justify-between text-xs font-mono border-t border-border-subtle/40">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Exibindo:</span>
            <span className="px-2 py-0.5 rounded bg-hydro/10 border border-hydro/30 text-hydro font-bold">
              {filteredAlerts.length} alerta{filteredAlerts.length === 1 ? '' : 's'}
            </span>
            <span className="text-zinc-500">
              {selectedCity === 'ALL' ? 'no Brasil inteiro' : `em ${selectedCity}`}
              {selectedCategory !== 'ALL' && ` · ${ALERT_CATEGORIES.find(c => c.key === selectedCategory)?.label}`}
            </span>
          </div>

          {(selectedCity !== 'ALL' || selectedCategory !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedCity('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-zinc-400 hover:text-white underline cursor-pointer text-[11px]"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela Técnica de Incidentes (Desktop) & Cards (Mobile) */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 pb-20 md:pb-4">
        {/* Visualização Mobile: Cards Verticais Elegantes */}
        <div className="md:hidden space-y-2.5">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl glass-panel border border-border-subtle card-interactive space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSeverityBadge(alert.tipoAlerta)}
                    <span className="font-bold text-xs text-white font-sans">
                      {formatAlertTypeName(alert.tipoAlerta)}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    {new Date(alert.dataHoraAlerta).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} {new Date(alert.dataHoraAlerta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {alert.mensagem}
                </p>

                <div className="flex items-center justify-between pt-1.5 border-t border-border-subtle/50 text-[11px] font-sans text-zinc-400">
                  <span className="text-zinc-200 font-semibold">{alert.municipio} ({alert.estado})</span>
                  <span className="text-zinc-500 font-mono">ID #{alert.id}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-zinc-500 font-sans text-xs">
              <CheckCircle2 className="w-6 h-6 mx-auto text-nominal mb-2 animate-bounce" />
              Nenhum alerta encontrado para os filtros selecionados.
            </div>
          )}
        </div>

        {/* Visualização Desktop: Tabela Completa */}
        <div className="hidden md:block border border-border-subtle/80 rounded-xl glass-panel overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-dim/80 text-[11px] font-sans font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Severidade</th>
                <th className="py-3 px-4 font-semibold">Tipo de Evento</th>
                <th className="py-3 px-4 font-semibold">Capital</th>
                <th className="py-3 px-4 font-semibold">UF</th>
                <th className="py-3 px-4 font-semibold">Mensagem Operacional</th>
                <th className="py-3 px-4 font-semibold text-right">Data/Hora (UTC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-xs">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map(alert => (
                  <tr 
                    key={alert.id}
                    className="hover:bg-surface-hover/60 transition-colors group"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getSeverityBadge(alert.tipoAlerta)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-200 whitespace-nowrap">
                      {formatAlertTypeName(alert.tipoAlerta)}
                    </td>
                    <td className="py-3 px-4 text-zinc-200 font-medium whitespace-nowrap">
                      {alert.municipio}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                      {alert.estado}
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-sans max-w-xl leading-relaxed">
                      {alert.mensagem}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(alert.dataHoraAlerta).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono">
                    <CheckCircle2 className="w-6 h-6 mx-auto text-nominal mb-2" />
                    Nenhum alerta encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação e Status */}
      <div className="p-3 border-t border-border-subtle bg-surface-dim flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
        <span>Mostrando {filteredAlerts.length} de {alerts.length} alertas registrados</span>
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 rounded bg-surface-card border border-border-subtle text-zinc-300">Pág 1 de 1</span>
        </div>
      </div>
    </div>
  );
};
