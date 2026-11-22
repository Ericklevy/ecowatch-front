import React, { useState, useMemo } from 'react';
import { Flame, Bug, CloudRain, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { MONITORED_CITIES } from '../../data/mockData';
import { usePrevisoes } from '../../services/forecasts';
import { PrevisaoDTO } from '../../types';
import { Sparkline } from '../common/Sparkline';
import { AnimatedCounter } from '../common/AnimatedCounter';

export const ForecastView: React.FC = () => {
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);

  // Previsões reais (backend ou Open-Meteo direto)
  const { dados: dynamicForecasts, fonte } = usePrevisoes();

  // Destaques de D+1: maior risco de fogo, de dengue e maior chuva
  const destaques = useMemo(() => {
    const itens = MONITORED_CITIES
      .map(cidade => ({ cidade, lista: dynamicForecasts[cidade.slug] || [] }))
      .filter(x => x.lista.length > 0)
      .map(x => ({ ...x, d1: x.lista[0] }));
    if (itens.length === 0) return null;
    const maior = (f: (p: PrevisaoDTO) => number) => itens.reduce((m, x) => (f(x.d1) > f(m.d1) ? x : m));
    return {
      fogo: maior(p => p.riscoIncendio),
      dengue: maior(p => p.riscoDengue),
      chuva: maior(p => p.precipitacaoPrevista)
    };
  }, [dynamicForecasts]);

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
            {fonte === 'carregando' ? 'Carregando…' : 'Previsão diária da Open-Meteo para as 27 capitais · riscos de incêndio e dengue estimados por temperatura, umidade e chuva'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-hydro bg-hydro/10 px-3 py-1.5 rounded border border-hydro/20">
          <Calendar className="w-3.5 h-3.5" />
          <span>{predictionWindow}</span>
        </div>
      </div>

      {/* 3 cards de destaque calculados a partir das previsões reais de D+1 */}
      {fonte === 'carregando' && (
        <div className="p-6 rounded-2xl bento-card text-sm text-zinc-400 text-center">Carregando as previsões da Open-Meteo…</div>
      )}
      {fonte === 'indisponivel' && (
        <div className="p-6 rounded-2xl bento-card text-sm text-warning text-center">
          Não consegui buscar as previsões agora. Tente atualizar a página em alguns minutos.
        </div>
      )}
      {destaques && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { titulo: 'Maior Chance de Fogo na Vegetação', Icone: Flame, cor: 'text-critical', hover: 'hover:border-critical/50', barra: 'from-orange-500 to-critical', linha: '#ff1744',
              item: destaques.fogo, valor: destaques.fogo.d1.riscoIncendio, dec: 0, unidade: '/100',
              serie: destaques.fogo.lista.map(p => p.riscoIncendio), pct: destaques.fogo.d1.riscoIncendio,
              nota: `Umidade ${Math.round(destaques.fogo.d1.umidadePrevista)}% · máx. ${destaques.fogo.d1.temperaturaPrevista.toFixed(1)}°C · chuva ${destaques.fogo.d1.precipitacaoPrevista.toFixed(1)} mm` },
            { titulo: 'Maior Risco de Dengue', Icone: Bug, cor: 'text-warning', hover: 'hover:border-warning/50', barra: 'from-amber-500 to-warning', linha: '#ffd600',
              item: destaques.dengue, valor: destaques.dengue.d1.riscoDengue, dec: 0, unidade: '/100',
              serie: destaques.dengue.lista.map(p => p.riscoDengue), pct: destaques.dengue.d1.riscoDengue,
              nota: `Máx. ${destaques.dengue.d1.temperaturaPrevista.toFixed(1)}°C · umidade ${Math.round(destaques.dengue.d1.umidadePrevista)}% · chuva ${destaques.dengue.d1.precipitacaoPrevista.toFixed(1)} mm` },
            { titulo: 'Maior Volume de Chuva', Icone: CloudRain, cor: 'text-hydro', hover: 'hover:border-hydro/50', barra: 'from-cyan-500 to-hydro', linha: '#00e5ff',
              item: destaques.chuva, valor: destaques.chuva.d1.precipitacaoPrevista, dec: 1, unidade: 'mm previstos',
              serie: destaques.chuva.lista.map(p => p.precipitacaoPrevista), pct: Math.min(100, destaques.chuva.d1.precipitacaoPrevista * 2),
              nota: destaques.chuva.d1.precipitacaoPrevista >= 30 ? 'Atenção para alagamentos e enxurradas' : 'Sem volume extremo previsto' }
          ].map(c => (
            <div key={c.titulo} className={`p-4.5 rounded-2xl bento-card card-interactive ${c.hover} transition-all shadow-lg flex flex-col justify-between relative overflow-hidden`}>
              <div>
                <div className="flex items-center justify-between text-xs font-sans text-zinc-400 mb-2">
                  <span className={`uppercase font-semibold ${c.cor} flex items-center gap-1.5 tracking-wider`}>
                    <c.Icone className="w-4 h-4 animate-breathing-glow" />
                    <span>{c.titulo}</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <div className="text-xl font-bold font-sans text-white">{c.item.cidade.nome} ({c.item.cidade.estado})</div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <AnimatedCounter value={c.valor} decimals={c.dec} className={`text-3xl font-extrabold font-mono ${c.cor}`} />
                      <span className="text-xs font-mono text-zinc-400">{c.unidade}</span>
                    </div>
                  </div>
                  <div className="w-20 h-8">
                    <Sparkline data={c.serie} color={c.linha} height={32} />
                  </div>
                </div>
                <div className="w-full bg-surface-base h-2 rounded-full overflow-hidden mt-3.5 border border-border-subtle/50">
                  <div className={`h-full bg-gradient-to-r ${c.barra} rounded-full transition-all duration-1000`} style={{ width: `${Math.max(3, c.pct)}%` }} />
                </div>
              </div>
              <p className="text-[11px] font-sans text-zinc-400 mt-3 pt-2 border-t border-white/5 leading-relaxed">{c.nota}</p>
            </div>
          ))}
        </div>
      )}

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
