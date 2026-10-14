import React, { useState, useMemo } from 'react';
import { Flame, Bug, CloudRain, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { MONITORED_CITIES, MOCK_FORECASTS } from '../../data/mockData';
import { PrevisaoDTO } from '../../types';
import { Sparkline } from '../common/Sparkline';

export const ForecastView: React.FC = () => {
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);

  // ── Gera datas dinâmicas para o mês atual (Outubro de 2026 em diante) ──
  const dynamicForecasts = useMemo(() => {
    const today = new Date();
    const result: Record<string, PrevisaoDTO[]> = {};

    MONITORED_CITIES.forEach(city => {
      const base = MOCK_FORECASTS[city.slug] || [
        { municipio: city.nome, dataPrevisao: '', temperaturaPrevista: 30, precipitacaoPrevista: 0, umidadePrevista: 45, riscoIncendio: 40, riscoDengue: 30 },
        { municipio: city.nome, dataPrevisao: '', temperaturaPrevista: 31, precipitacaoPrevista: 0, umidadePrevista: 42, riscoIncendio: 45, riscoDengue: 30 },
        { municipio: city.nome, dataPrevisao: '', temperaturaPrevista: 30.5, precipitacaoPrevista: 0, umidadePrevista: 43, riscoIncendio: 42, riscoDengue: 30 }
      ];

      result[city.slug] = base.map((item, idx) => {
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + (idx + 1));
        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dd = String(targetDate.getDate()).padStart(2, '0');
        const iso = `${yyyy}-${mm}-${dd}`;

        return {
          ...item,
          dataPrevisao: iso
        };
      });
    });

    return result;
  }, []);

  // Janela Preditiva no cabeçalho
  const predictionWindow = useMemo(() => {
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(d1.getDate() + 1);
    const d3 = new Date(today);
    d3.setDate(d3.getDate() + 3);

    const mName = d1.toLocaleDateString('pt-BR', { month: 'long' });
    const capitalizedMonth = mName.charAt(0).toUpperCase() + mName.slice(1);
    return `Janela Preditiva: ${d1.getDate()} a ${d3.getDate()} de ${capitalizedMonth} de ${d1.getFullYear()}`;
  }, []);

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

  const selectedCityForecasts: PrevisaoDTO[] = selectedCitySlug ? dynamicForecasts[selectedCitySlug] || [] : [];
  const selectedCityName = selectedCitySlug ? MONITORED_CITIES.find(c => c.slug === selectedCitySlug)?.nome : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 space-y-6">
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
          <span>{predictionWindow}</span>
        </div>
      </div>

      {/* 3 Cards de Destaque Operacional (Bento Grid Architecture com Sparklines) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Risco de Incêndio */}
        <div className="p-4.5 rounded-2xl bento-card card-interactive hover:border-critical/50 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-xs font-sans text-zinc-400 mb-2">
              <span className="uppercase font-semibold text-critical flex items-center gap-1.5 tracking-wider">
                <Flame className="w-4 h-4 animate-breathing-glow" />
                <span>Maior Chance de Fogo na Vegetação</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <div>
                <div className="text-xl font-bold font-sans text-white">Brasília (DF)</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold font-mono text-critical tnum">91</span>
                  <span className="text-xs font-mono text-zinc-400">/100 (Score Crítico)</span>
                </div>
              </div>
              <div className="w-20 h-8">
                <Sparkline data={[84, 88, 91]} color="#ff1744" height={32} />
              </div>
            </div>
            {/* Barra de Progresso Visual */}
            <div className="w-full bg-surface-base h-2 rounded-full overflow-hidden mt-3.5 border border-border-subtle/50">
              <div className="h-full bg-gradient-to-r from-orange-500 to-critical rounded-full transition-all duration-1000" style={{ width: '91%' }} />
            </div>
          </div>
          <p className="text-[11px] font-sans text-zinc-400 mt-3 pt-2 border-t border-white/5 leading-relaxed">
            Projeção por ar seco (12%), calor (38°C) e estiagem no Cerrado · Facilita faíscas
          </p>
        </div>

        {/* Card 2: Risco de Dengue */}
        <div className="p-4.5 rounded-2xl bento-card card-interactive hover:border-warning/50 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-xs font-sans text-zinc-400 mb-2">
              <span className="uppercase font-semibold text-warning flex items-center gap-1.5 tracking-wider">
                <Bug className="w-4 h-4 animate-breathing-glow" />
                <span>Maior Risco de Dengue</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <div>
                <div className="text-xl font-bold font-sans text-white">Rio de Janeiro (RJ)</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold font-mono text-warning tnum">78</span>
                  <span className="text-xs font-mono text-zinc-400">/100 (Score Elevado)</span>
                </div>
              </div>
              <div className="w-20 h-8">
                <Sparkline data={[68, 74, 78]} color="#ffd600" height={32} />
              </div>
            </div>
            {/* Barra de Progresso Visual */}
            <div className="w-full bg-surface-base h-2 rounded-full overflow-hidden mt-3.5 border border-border-subtle/50">
              <div className="h-full bg-gradient-to-r from-amber-500 to-warning rounded-full transition-all duration-1000" style={{ width: '78%' }} />
            </div>
          </div>
          <p className="text-[11px] font-sans text-zinc-400 mt-3 pt-2 border-t border-white/5 leading-relaxed">
            Chuva 45.2mm acumulada · Umidade 89% · Temp 31.8°C
          </p>
        </div>

        {/* Card 3: Maior Precipitação */}
        <div className="p-4.5 rounded-2xl bento-card card-interactive hover:border-hydro/50 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-xs font-sans text-zinc-400 mb-2">
              <span className="uppercase font-semibold text-hydro flex items-center gap-1.5 tracking-wider">
                <CloudRain className="w-4 h-4 animate-breathing-glow" />
                <span>Maior Volume de Chuva</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <div>
                <div className="text-xl font-bold font-sans text-white">Salvador (BA)</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold font-mono text-hydro tnum">52.3</span>
                  <span className="text-xs font-mono text-zinc-400">mm previstos</span>
                </div>
              </div>
              <div className="w-20 h-8">
                <Sparkline data={[14, 52.3, 22]} color="#00e5ff" height={32} />
              </div>
            </div>
            {/* Barra de Progresso Visual */}
            <div className="w-full bg-surface-base h-2 rounded-full overflow-hidden mt-3.5 border border-border-subtle/50">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-hydro rounded-full transition-all duration-1000" style={{ width: '65%' }} />
            </div>
          </div>
          <p className="text-[11px] font-sans text-zinc-400 mt-3 pt-2 border-t border-white/5 leading-relaxed">
            Alerta para enxurradas e transbordamento fluvial
          </p>
        </div>
      </div>

      {/* Matriz Comparativa das 27 Capitais */}
      <div className="border border-border-subtle rounded-md bg-surface-panel overflow-hidden shadow-xl">
        <div className="p-3.5 border-b border-border-subtle bg-surface-dim/70 flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
            Matriz Comparativa das 27 Capitais Monitoradas (D+1)
          </span>
          <span className="text-[11px] font-mono text-zinc-500">Toque para ver os 3 dias</span>
        </div>

        {/* Visualização Mobile: Cards Verticais */}
        <div className="md:hidden divide-y divide-border-subtle/50">
          {MONITORED_CITIES.map(city => {
            const forecasts = dynamicForecasts[city.slug] || [];
            const nextDay = forecasts[0];
            if (!nextDay) return null;
            const isSelected = selectedCitySlug === city.slug;

            return (
              <div
                key={city.slug}
                onClick={() => setSelectedCitySlug(isSelected ? null : city.slug)}
                className={`p-3.5 space-y-2.5 transition-colors cursor-pointer ${
                  isSelected ? 'bg-hydro/10 border-l-4 border-l-hydro' : 'hover:bg-surface-hover/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-white">{city.nome}</span>
                    <span className="text-xs font-mono text-zinc-400 ml-1.5">({city.estado})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-zinc-200">
                      {nextDay.temperaturaPrevista.toFixed(1)}°C
                    </span>
                    <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${isSelected ? 'rotate-90 text-hydro' : ''}`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-surface-dim/60 p-2.5 rounded border border-border-subtle/50">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Chuva Prevista</div>
                    <div className="font-bold text-hydro">{nextDay.precipitacaoPrevista.toFixed(1)} mm</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Umidade</div>
                    <div className="font-semibold text-zinc-200">{Math.round(nextDay.umidadePrevista)}%</div>
                  </div>
                  <div className="pt-1.5 border-t border-border-subtle/40">
                    <div className="text-[10px] text-zinc-400 uppercase mb-1">Chance Fogo</div>
                    {getScoreBadge(nextDay.riscoIncendio)}
                  </div>
                  <div className="pt-1.5 border-t border-border-subtle/40">
                    <div className="text-[10px] text-zinc-400 uppercase mb-1">Risco Dengue</div>
                    {getScoreBadge(nextDay.riscoDengue)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visualização Desktop: Tabela Completa */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-dim/40 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold">Capital</th>
                <th className="py-2.5 px-4 font-semibold">UF</th>
                <th className="py-2.5 px-4 font-semibold">Temp. Prevista</th>
                <th className="py-2.5 px-4 font-semibold">Tendência 3D</th>
                <th className="py-2.5 px-4 font-semibold">Chuva Prevista</th>
                <th className="py-2.5 px-4 font-semibold">Umidade</th>
                <th className="py-2.5 px-4 font-semibold">Chance de Fogo (Vegetação)</th>
                <th className="py-2.5 px-4 font-semibold">Risco Dengue</th>
                <th className="py-2.5 px-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-xs font-mono">
              {MONITORED_CITIES.map(city => {
                const forecasts = dynamicForecasts[city.slug] || [];
                const nextDay = forecasts[0];

                if (!nextDay) return null;

                const isSelected = selectedCitySlug === city.slug;
                const tempTrends = forecasts.map(f => f.temperaturaPrevista);

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
                    <td className="py-3 px-4 text-zinc-200 tnum">
                      {nextDay.temperaturaPrevista.toFixed(1)}°C
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-14 h-5">
                        <Sparkline data={tempTrends} color="#ff9100" height={20} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-200 tnum">
                      {nextDay.precipitacaoPrevista.toFixed(1)} mm
                    </td>
                    <td className="py-3 px-4 text-zinc-200 tnum">
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
        <div className="p-4.5 rounded-2xl bento-card border border-hydro/40 space-y-3.5 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h3 className="font-sans font-bold text-white text-base">
              Detalhamento de 3 Dias: {selectedCityName}
            </h3>
            <span className="text-xs font-mono text-hydro">Projeções Temporais com Microinterações</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {selectedCityForecasts.map((forecast, idx) => (
              <div key={forecast.dataPrevisao} className="p-3.5 rounded-xl bento-card border border-white/10 text-xs font-mono space-y-2 card-interactive">
                <div className="flex items-center justify-between text-zinc-400 border-b border-white/5 pb-1.5">
                  <span className="font-semibold text-white">D+{idx + 1} ({forecast.dataPrevisao})</span>
                  <span className="text-[10px] text-zinc-400">Modelo ECMWF/GFS</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400">Temperatura:</span>
                  <span className="text-white font-bold tnum">{forecast.temperaturaPrevista.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400">Precipitação:</span>
                  <span className="text-hydro font-bold tnum">{forecast.precipitacaoPrevista.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400">Umidade:</span>
                  <span className="text-zinc-200 tnum">{Math.round(forecast.umidadePrevista)}%</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
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
