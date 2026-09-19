import React, { useState } from 'react';
import { Flame, Bug, CloudRain, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { MONITORED_CITIES, MOCK_FORECASTS } from '../../data/mockData';
import { PrevisaoDTO } from '../../types';

export const ForecastView: React.FC = () => {
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);

  const getScoreBadge = (score: number) => {
    if (score >= 61) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-critical/20 text-critical border border-critical/40">
          {score}/100
        </span>
      );
    }
    if (score >= 31) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-warning/20 text-warning border border-warning/40">
          {score}/100
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-nominal/20 text-nominal border border-nominal/40">
        {score}/100
      </span>
    );
  };

  const selectedCityForecasts: PrevisaoDTO[] = selectedCitySlug ? MOCK_FORECASTS[selectedCitySlug] || [] : [];
  const selectedCityName = selectedCitySlug ? MONITORED_CITIES.find(c => c.slug === selectedCitySlug)?.nome : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border-subtle pb-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-hydro" />
            <span>Previsões e Riscos // Próximos 3 Dias</span>
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Modelos analíticos de previsão climática e vetores de risco (analytics-service)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-hydro bg-hydro/10 px-3 py-1.5 rounded border border-hydro/20">
          <Calendar className="w-3.5 h-3.5" />
          <span>Janela Preditiva: 20 a 22 de Setembro</span>
        </div>
      </div>

      {/* 3 Cards de Destaque Operacional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Risco de Incêndio */}
        <div className="p-4 rounded-md bg-surface-panel border border-border-subtle hover:border-critical/40 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="uppercase font-semibold text-critical flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>Maior Risco de Incêndio</span>
            </span>
          </div>
          <div className="text-xl font-bold font-sans text-white">Brasília (DF)</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-critical">91</span>
            <span className="text-xs font-mono text-zinc-400">/100 (Score Crítico)</span>
          </div>
          <p className="text-[11px] font-mono text-zinc-400 mt-2 border-t border-border-subtle pt-2">
            Umidade crítica de 12% · Chuva 0.0mm · Temp 38.2°C
          </p>
        </div>

        {/* Card 2: Risco de Dengue */}
        <div className="p-4 rounded-md bg-surface-panel border border-border-subtle hover:border-warning/40 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="uppercase font-semibold text-warning flex items-center gap-1.5">
              <Bug className="w-4 h-4" />
              <span>Maior Risco de Dengue</span>
            </span>
          </div>
          <div className="text-xl font-bold font-sans text-white">Rio de Janeiro (RJ)</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-warning">78</span>
            <span className="text-xs font-mono text-zinc-400">/100 (Score Elevado)</span>
          </div>
          <p className="text-[11px] font-mono text-zinc-400 mt-2 border-t border-border-subtle pt-2">
            Chuva 45.2mm acumulada · Umidade 89% · Temp 31.8°C
          </p>
        </div>

        {/* Card 3: Maior Precipitação */}
        <div className="p-4 rounded-md bg-surface-panel border border-border-subtle hover:border-hydro/40 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="uppercase font-semibold text-hydro flex items-center gap-1.5">
              <CloudRain className="w-4 h-4" />
              <span>Maior Volume de Chuva</span>
            </span>
          </div>
          <div className="text-xl font-bold font-sans text-white">Salvador (BA)</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold font-mono text-hydro">52.3</span>
            <span className="text-xs font-mono text-zinc-400">mm previstos</span>
          </div>
          <p className="text-[11px] font-mono text-zinc-400 mt-2 border-t border-border-subtle pt-2">
            Alerta para enxurradas e transbordamento fluvial
          </p>
        </div>
      </div>

      {/* Tabela Comparativa de 10 Cidades */}
      <div className="border border-border-subtle rounded-md bg-surface-panel overflow-hidden shadow-xl">
        <div className="p-3.5 border-b border-border-subtle bg-surface-dim/70 flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
            Matriz Comparativa das 10 Capitais Monitoradas (D+1)
          </span>
          <span className="text-[11px] font-mono text-zinc-500">Clique na linha para ver os 3 dias</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-dim/40 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold">Capital</th>
                <th className="py-2.5 px-4 font-semibold">UF</th>
                <th className="py-2.5 px-4 font-semibold">Temp. Prevista</th>
                <th className="py-2.5 px-4 font-semibold">Chuva Prevista</th>
                <th className="py-2.5 px-4 font-semibold">Umidade</th>
                <th className="py-2.5 px-4 font-semibold">Risco Incêndio</th>
                <th className="py-2.5 px-4 font-semibold">Risco Dengue</th>
                <th className="py-2.5 px-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-xs font-mono">
              {MONITORED_CITIES.map(city => {
                const forecasts = MOCK_FORECASTS[city.slug] || [];
                const nextDay = forecasts[0];

                if (!nextDay) return null;

                const isSelected = selectedCitySlug === city.slug;

                return (
                  <tr
                    key={city.slug}
                    onClick={() => setSelectedCitySlug(isSelected ? null : city.slug)}
                    className={`hover:bg-surface-hover/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-hydro/10 border-l-2 border-l-hydro' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-white">
                      {city.nome}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {city.estado}
                    </td>
                    <td className="py-3 px-4 text-zinc-200">
                      {nextDay.temperaturaPrevista.toFixed(1)}°C
                    </td>
                    <td className="py-3 px-4 text-zinc-200">
                      {nextDay.precipitacaoPrevista.toFixed(1)} mm
                    </td>
                    <td className="py-3 px-4 text-zinc-200">
                      {Math.round(nextDay.umidadePrevista)}%
                    </td>
                    <td className="py-3 px-4">
                      {getScoreBadge(nextDay.riscoIncendio)}
                    </td>
                    <td className="py-3 px-4">
                      {getScoreBadge(nextDay.riscoDengue)}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-500">
                      <ChevronRight className={`w-4 h-4 inline-block transition-transform ${isSelected ? 'rotate-90 text-hydro' : ''}`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhe dos 3 Dias da Cidade Selecionada */}
      {selectedCitySlug && (
        <div className="p-4 rounded-md bg-surface-panel border border-hydro/40 space-y-3 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <h3 className="font-sans font-bold text-white text-base">
              Detalhamento de 3 Dias: {selectedCityName}
            </h3>
            <span className="text-xs font-mono text-hydro">Projeções Temporais</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedCityForecasts.map((forecast, idx) => (
              <div key={forecast.dataPrevisao} className="p-3 rounded bg-surface-card border border-border-subtle text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-zinc-400 border-b border-border-subtle/60 pb-1">
                  <span className="font-semibold text-white">D+{idx + 1} ({forecast.dataPrevisao})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Temperatura:</span>
                  <span className="text-white font-bold">{forecast.temperaturaPrevista.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Precipitação:</span>
                  <span className="text-hydro font-bold">{forecast.precipitacaoPrevista.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Umidade:</span>
                  <span className="text-zinc-200">{Math.round(forecast.umidadePrevista)}%</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-border-subtle/40">
                  <span className="text-zinc-400">Risco Incêndio:</span>
                  {getScoreBadge(forecast.riscoIncendio)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Risco Dengue:</span>
                  {getScoreBadge(forecast.riscoDengue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
