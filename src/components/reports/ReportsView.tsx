import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Droplets,
  CloudRain,
  Building2,
  MapPin,
  Radio,
  Flame,
  Wind
} from 'lucide-react';
import { MONITORED_CITIES } from '../../data/mockData';
import { formatAlertTypeName, AlertDTO } from '../../types';
import { fetchAllAlerts } from '../../services/api';
import { carregarHistorico, Historico, usePrevisoes } from '../../services/forecasts';
import {
  normalizeCityName,
  humanizePrecipitation,
  humanizeAirQuality,
  humanizeFireRisk
} from '../../utils/humanFormatters';
import { Sparkline } from '../common/Sparkline';
import { AnimatedCounter } from '../common/AnimatedCounter';

export const ReportsView: React.FC = () => {
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>('brasilia');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7); // 7, 15 ou 30 dias

  const selectedCity = useMemo(() => {
    return MONITORED_CITIES.find(c => c.slug === selectedCitySlug) || MONITORED_CITIES[0];
  }, [selectedCitySlug]);

  // Dados reais: alertas do backend, histórico da Open-Meteo e previsão de amanhã
  const [todosAlertas, setTodosAlertas] = useState<AlertDTO[]>([]);
  const [historico, setHistorico] = useState<Historico | null | 'carregando'>('carregando');
  const { dados: previsoes } = usePrevisoes();

  useEffect(() => {
    fetchAllAlerts().then(a => setTodosAlertas(Array.isArray(a) ? a : [])).catch(() => setTodosAlertas([]));
  }, []);

  useEffect(() => {
    let vivo = true;
    setHistorico('carregando');
    carregarHistorico(selectedCity.lat, selectedCity.lng, selectedPeriod).then(h => vivo && setHistorico(h));
    return () => { vivo = false; };
  }, [selectedCity, selectedPeriod]);

  // Alertas reais da cidade dentro do período escolhido
  const cityAlerts = useMemo(() => {
    const cityNorm = normalizeCityName(selectedCity.nome);
    const limite = Date.now() - selectedPeriod * 24 * 3600 * 1000;
    return todosAlertas.filter(a => {
      const alertNorm = normalizeCityName(a.municipio);
      const naCidade = alertNorm === cityNorm || alertNorm.includes(cityNorm) || cityNorm.includes(alertNorm);
      return naCidade && new Date(a.dataHoraAlerta).getTime() >= limite;
    });
  }, [selectedCity, selectedPeriod, todosAlertas]);

  // KPIs com dados reais (Open-Meteo: chuva, temperatura e PM2.5 dos últimos dias; alertas do EcoWatch)
  const kpis = useMemo(() => {
    const h = historico && historico !== 'carregando' ? historico : null;
    const alertCount = cityAlerts.length;
    const criticalCount = cityAlerts.filter(a => a.tipoAlerta.includes('FLOOD') || a.tipoAlerta.includes('FIRE')).length;
    const alertasFogo = cityAlerts.filter(a => a.tipoAlerta.includes('FIRE')).length;
    const chuvaBase = h ? h.chuvaTotal : 0;
    const pm25Base = h?.pm25Medio ?? 0;
    const amanha = previsoes[selectedCity.slug]?.[0];
    const fmt = (v?: number) => (v === undefined || !isFinite(v) ? '—' : `${v.toFixed(1)}°C`);
    return {
      temDados: !!h,
      totalAlertas: alertCount,
      alertasCriticos: criticalCount,
      tempMedia: fmt(h?.tempMedia),
      tempMax: fmt(h?.tempMax),
      tempMin: fmt(h?.tempMin),
      tempMediaNum: h && isFinite(h.tempMedia) ? h.tempMedia : 0,
      serieTemp: h ? [h.tempMin, h.tempMedia, h.tempMax].filter(isFinite) : [0, 0],
      chuvaBase,
      serieChuva: h && h.chuvaDiaria.length ? h.chuvaDiaria : [0, 0],
      chuvaObj: humanizePrecipitation(chuvaBase),
      pm25Base,
      seriePm25: h && h.pm25Diario.length ? h.pm25Diario : [0, 0],
      arObj: humanizeAirQuality(pm25Base),
      fogoObj: humanizeFireRisk(amanha ? amanha.riscoIncendio : 0),
      riscoFogoAmanha: amanha?.riscoIncendio,
      focosIncendioPeriodo: alertasFogo
    };
  }, [historico, cityAlerts, previsoes, selectedCity]);

  /**
   * Sanitiza valores de células CSV prevenindo Formula Injection (CWE-1236).
   * Adiciona citação simples antes de caracteres executáveis (=, +, -, @, \t, \r).
   */
  const sanitizeCsvCell = (value: unknown): string => {
    if (value === null || value === undefined) return '""';
    let str = String(value);
    if (/^[=+@\t\r-]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str.replace(/"/g, '""')}"`;
  };

  // Função para exportar CSV (protegida contra CSV Formula Injection)
  const handleExportCSV = () => {
    const headers = ['ID', 'Data/Hora UTC', 'Capital', 'UF', 'Tipo de Evento', 'Severidade', 'Mensagem'];
    const rows = cityAlerts.map(a => [
      a.id,
      new Date(a.dataHoraAlerta).toISOString(),
      a.municipio,
      a.estado,
      formatAlertTypeName(a.tipoAlerta),
      a.tipoAlerta.includes('FLOOD') || a.tipoAlerta.includes('FIRE') ? 'CRÍTICO' : 'ALERTA',
      a.mensagem
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [
        headers.map(sanitizeCsvCell).join(','),
        ...rows.map(row => row.map(sanitizeCsvCell).join(','))
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecowatch-relatorio-${selectedCity.slug}-${selectedPeriod}dias.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para imprimir / Gerar PDF nativo
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-y-auto">
      {/* ── Barra Superior de Controle (Não sai na impressão) ── */}
      <div className="p-4 border-b border-border-subtle bg-surface-panel/90 sticky top-0 z-20 print:hidden space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold font-mono text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-hydro" />
              <span>Central de Relatórios & Auditoria Ambiental</span>
            </h1>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Boletins oficiais em linguagem acessível e didática para cidadãos, gestores públicos e imprensa
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-card hover:bg-surface-hover text-zinc-200 border border-border-subtle text-xs font-mono transition-colors cursor-pointer"
              title="Imprimir relatório timbrado ou salvar em PDF"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-hydro/15 hover:bg-hydro/25 text-hydro border border-hydro/30 text-xs font-mono font-medium transition-colors cursor-pointer shadow-sm"
              title="Exportar dados em formato CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">Capital:</span>
            <select
              value={selectedCitySlug}
              onChange={e => setSelectedCitySlug(e.target.value)}
              className="bg-surface-base border border-border-subtle rounded py-1 px-2 text-zinc-200 focus:border-hydro outline-none cursor-pointer"
            >
              {MONITORED_CITIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.nome} ({c.estado})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-border-subtle pl-3">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">Janela de Monitoramento:</span>
            <div className="flex items-center gap-1 bg-surface-base border border-border-subtle rounded p-0.5">
              {[7, 15, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedPeriod(days)}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    selectedPeriod === days
                      ? 'bg-hydro/20 text-hydro font-bold border border-hydro/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Últimos {days} dias
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Documento do Relatório (Layout Timbrado Operacional) ── */}
      <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6 pb-24 md:pb-6">
        
        {/* Cabeçalho Institucional do Boletim */}
        <div className="p-5 rounded-lg bg-surface-panel border border-border-subtle space-y-4 print:border-black print:bg-white print:text-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle/80 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-hydro/10 border border-hydro/30 flex items-center justify-center text-hydro font-mono font-bold text-lg shrink-0">
                <Radio className="w-5 h-5 text-hydro" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-hydro font-semibold">
                  Sistema Nacional EcoWatch Brasil
                </div>
                <h2 className="text-lg font-bold text-zinc-100 font-sans print:text-black">
                  Boletim Técnico e Cidadão de Segurança Climática
                </h2>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-zinc-400 print:text-zinc-600 space-y-0.5">
              <div>Ref: <span className="text-zinc-200 font-bold">ECO-{selectedCity.slug.toUpperCase()}-{new Date().getFullYear()}</span></div>
              <div>Emissão: {new Date().toLocaleString('pt-BR')}</div>
              <div>Auditoria: <span className="text-nominal font-bold">SISTEMA VERIFICADO</span></div>
            </div>
          </div>

          {/* Dados Cadastrais da Capital */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
            <div className="p-2.5 rounded bg-surface-base/60 border border-border-subtle/60">
              <span className="text-zinc-500 block text-[10px] uppercase">Município / UF</span>
              <span className="font-bold text-zinc-200 text-sm">{selectedCity.nome} ({selectedCity.estado})</span>
            </div>
            <div className="p-2.5 rounded bg-surface-base/60 border border-border-subtle/60">
              <span className="text-zinc-500 block text-[10px] uppercase">Bioma Predominante</span>
              <span className="font-semibold text-zinc-200">{selectedCity.bioma}</span>
            </div>
            <div className="p-2.5 rounded bg-surface-base/60 border border-border-subtle/60">
              <span className="text-zinc-500 block text-[10px] uppercase">Bacia Hidrográfica</span>
              <span className="font-semibold text-zinc-200">{selectedCity.rioNome ? selectedCity.rioNome : 'Bacia Urbana / Continental'}</span>
            </div>
            <div className="p-2.5 rounded bg-surface-base/60 border border-border-subtle/60">
              <span className="text-zinc-500 block text-[10px] uppercase">Janela Analisada</span>
              <span className="font-bold text-hydro">Últimos {selectedPeriod} dias</span>
            </div>
          </div>
        </div>

        {/* ── Cards de Indicadores Consolidados (KPIs Humanizados & Bento Architecture) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {historico === 'carregando' && (
            <div className="col-span-full text-xs text-zinc-400 font-mono">Carregando o histórico real da Open-Meteo…</div>
          )}
          {historico === null && (
            <div className="col-span-full text-xs text-warning font-mono">Não consegui buscar o histórico agora; os valores abaixo podem aparecer zerados.</div>
          )}
          {/* Card 1: Chuva Acumulada no Período */}
          <div className="p-4 rounded-xl bento-card card-interactive space-y-2.5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-sans font-medium">
                <span className="tracking-wide">Chuva Acumulada</span>
                <CloudRain className="w-4 h-4 text-hydro animate-breathing-glow" />
              </div>
              <div className="flex items-baseline justify-between">
                <AnimatedCounter
                  value={kpis.chuvaBase}
                  decimals={1}
                  suffix=" mm"
                  className="text-2xl font-bold font-mono text-zinc-100"
                />
                <div className="w-20 h-6">
                  <Sparkline 
                    data={kpis.serieChuva} 
                    color="#00e5ff" 
                    height={24} 
                  />
                </div>
              </div>
              <div className="text-[11px] font-sans font-semibold text-hydro">
                {kpis.chuvaObj.label}
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-2 border-t border-white/5">
              💡 {kpis.chuvaObj.explanation}
            </p>
          </div>

          {/* Card 2: Temperatura no período (Open-Meteo) */}
          <div className="p-4 rounded-xl bento-card card-interactive space-y-2.5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-sans font-medium">
                <span className="tracking-wide">Temperatura Média</span>
                <Droplets className="w-4 h-4 text-nominal animate-breathing-glow" />
              </div>
              <div className="flex items-baseline justify-between">
                <AnimatedCounter value={kpis.tempMediaNum} decimals={1} suffix="°C" className="text-2xl font-bold font-mono text-zinc-100" />
                <div className="w-20 h-6">
                  <Sparkline data={kpis.serieTemp} color="#00e676" height={24} />
                </div>
              </div>
              <div className="text-[11px] font-sans font-semibold text-zinc-300">
                Mín. {kpis.tempMin} · Máx. {kpis.tempMax}
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-2 border-t border-white/5">
              💡 Média das temperaturas diárias dos últimos {selectedPeriod} dias (Open-Meteo).
            </p>
          </div>

          {/* Card 3: Qualidade do Ar (PM2.5) */}
          <div className="p-4 rounded-xl bento-card card-interactive space-y-2.5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-sans font-medium">
                <span className="tracking-wide">Qualidade do Ar (PM2.5)</span>
                <Wind className="w-4 h-4 text-warning animate-breathing-glow" />
              </div>
              <div className="flex items-baseline justify-between">
                <AnimatedCounter
                  value={kpis.pm25Base}
                  decimals={1}
                  suffix=" µg/m³"
                  className="text-2xl font-bold font-mono text-zinc-100"
                />
                <div className="w-20 h-6">
                  <Sparkline 
                    data={kpis.seriePm25} 
                    color="#ffd600" 
                    height={24} 
                  />
                </div>
              </div>
              <div className="text-[11px] font-sans font-semibold text-warning">
                {kpis.arObj.label}
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-2 border-t border-white/5">
              💡 {kpis.arObj.explanation}
            </p>
          </div>

          {/* Card 4: Focos de Queimadas e Risco de Fogo */}
          <div className="p-4 rounded-xl bento-card card-interactive space-y-2.5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-sans font-medium">
                <span className="tracking-wide">Alertas de Fogo no Período</span>
                <Flame className={`w-4 h-4 animate-breathing-glow ${kpis.focosIncendioPeriodo > 5 ? 'text-critical' : 'text-nominal'}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <AnimatedCounter
                  value={kpis.focosIncendioPeriodo}
                  decimals={0}
                  suffix=" alertas"
                  className="text-2xl font-bold font-mono text-zinc-100"
                />
                <div className="w-20 h-6">
                  <Sparkline 
                    data={[0, kpis.focosIncendioPeriodo]} 
                    color={kpis.focosIncendioPeriodo > 5 ? '#ff1744' : '#00e676'} 
                    height={24} 
                  />
                </div>
              </div>
              <div className="text-[11px] font-sans font-semibold text-critical">
                {kpis.riscoFogoAmanha !== undefined ? `Amanhã: ${kpis.fogoObj.label}` : kpis.fogoObj.label}
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-2 border-t border-white/5">
              💡 {kpis.fogoObj.explanation}
            </p>
          </div>
        </div>

        {/* ── Parecer Técnico e Cidadão (Síntese Humana e Acessível) ── */}
        <div className="p-5 rounded-lg bg-surface-panel border border-border-subtle space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-hydro" />
            <span>Síntese Climática para a População e Defesa Civil</span>
          </h3>

          <div className="text-xs text-zinc-300 font-sans leading-relaxed space-y-2">
            <p>
              Durante os últimos <strong>{selectedPeriod} dias</strong> de monitoramento em <strong>{selectedCity.nome} ({selectedCity.estado})</strong>, 
              o volume acumulado de chuva foi de <strong>{kpis.chuvaBase.toFixed(1)} mm</strong> ({kpis.chuvaObj.label.toLowerCase()}). 
              {kpis.chuvaBase === 0 ? (
                <span> O período confirma estiagem contínua típica da estação seca no bioma {selectedCity.bioma}, mantendo o solo seco e elevando a suscetibilidade a queimadas acidentais.</span>
              ) : (
                <span> O volume pluviométrico contribuiu para umedecer a vegetação e atenuar a concentração de poeira e poluentes.</span>
              )}
            </p>

            <p>
              {kpis.totalAlertas > 0 ? (
                <span>
                  O EcoWatch registrou <strong>{kpis.totalAlertas} alerta(s)</strong> para a capital no período
                  {kpis.alertasCriticos > 0 ? <span className="text-critical font-semibold">, sendo {kpis.alertasCriticos} de enchente ou fogo</span> : null}. Veja a lista completa abaixo.
                </span>
              ) : (
                <span>Nenhum alerta foi registrado pelo EcoWatch para a capital neste período.</span>
              )}
            </p>

            <p>
              Quanto à saúde respiratória, a concentração de material particulado fino PM2.5 esteve em <strong>{kpis.pm25Base.toFixed(1)} µg/m³</strong> ({kpis.arObj.label.toLowerCase()}). 
              {kpis.pm25Base > 25 ? (
                <span> Recomenda-se que pessoas com sensibilidade respiratória (como asma, bronquite ou rinite), idosos e crianças evitem a prática de exercícios físicos prolongados ao ar livre durante o pico do calor.</span>
              ) : (
                <span> A atmosfera local encontra-se em condições favoráveis para circulação ao ar livre e práticas esportivas.</span>
              )}
            </p>
          </div>
        </div>

        {/* ── Tabela de Auditoria de Alertas Registrados ── */}
        <div className="rounded-lg bg-surface-panel border border-border-subtle overflow-hidden space-y-0">
          <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-dim/50">
            <div className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
              Registro Cronológico de Incidentes na Capital ({cityAlerts.length})
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Sensores: ANA · INPE · CEMADEN · NASA
            </div>
          </div>

          {/* Visualização Mobile: Cards */}
          <div className="md:hidden divide-y divide-border-subtle/50">
            {cityAlerts.length > 0 ? (
              cityAlerts.map(alert => (
                <div key={alert.id} className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        alert.tipoAlerta.includes('FLOOD') || alert.tipoAlerta.includes('FIRE')
                          ? 'bg-critical/15 text-critical border border-critical/30'
                          : 'bg-warning/15 text-warning border border-warning/30'
                      }`}>
                        <span>{alert.tipoAlerta.includes('FLOOD') || alert.tipoAlerta.includes('FIRE') ? 'Crítico' : 'Alerta'}</span>
                      </span>
                      <span className="font-bold text-xs text-zinc-200">
                        {formatAlertTypeName(alert.tipoAlerta)}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      {new Date(alert.dataHoraAlerta).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} {new Date(alert.dataHoraAlerta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {alert.mensagem}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-zinc-500 font-mono text-xs">
                Nenhum alerta crítico ativo para {selectedCity.nome} nesta janela temporal.
              </div>
            )}
          </div>

          {/* Visualização Desktop: Tabela Completa */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-base text-[11px] font-mono text-zinc-400 uppercase">
                  <th className="py-2.5 px-4 font-semibold">Severidade</th>
                  <th className="py-2.5 px-4 font-semibold">Tipo do Evento</th>
                  <th className="py-2.5 px-4 font-semibold">Mensagem Operacional</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Data/Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-xs font-mono">
                {cityAlerts.length > 0 ? (
                  cityAlerts.map(alert => (
                    <tr key={alert.id} className="hover:bg-surface-hover/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          alert.tipoAlerta.includes('FLOOD') || alert.tipoAlerta.includes('FIRE')
                            ? 'bg-critical/15 text-critical border border-critical/30'
                            : 'bg-warning/15 text-warning border border-warning/30'
                        }`}>
                          <span>{alert.tipoAlerta.includes('FLOOD') || alert.tipoAlerta.includes('FIRE') ? 'Crítico' : 'Alerta'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-zinc-200 whitespace-nowrap">
                        {formatAlertTypeName(alert.tipoAlerta)}
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
                    <td colSpan={4} className="py-8 text-center text-zinc-500 font-mono">
                      Nenhum alerta crítico ativo para {selectedCity.nome} nesta janela temporal.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
