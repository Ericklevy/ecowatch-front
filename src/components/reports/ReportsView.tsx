import React, { useState, useMemo } from 'react';
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
import { MONITORED_CITIES, MOCK_ALERTS } from '../../data/mockData';
import { formatAlertTypeName } from '../../types';
import {
  normalizeCityName,
  humanizePrecipitation,
  humanizeAirQuality,
  humanizeRiverLevel,
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

  // Alertas filtrados pela cidade usando normalização consistente
  const cityAlerts = useMemo(() => {
    const cityNorm = normalizeCityName(selectedCity.nome);
    return MOCK_ALERTS.filter(a => {
      const alertNorm = normalizeCityName(a.municipio);
      return alertNorm === cityNorm || alertNorm.includes(cityNorm) || cityNorm.includes(alertNorm);
    });
  }, [selectedCity]);

  // KPIs consolidados e calibrados para a realidade climática da capital e da janela temporal
  const kpis = useMemo(() => {
    const isCapitalWithRiver = !!selectedCity.rioNome;
    const alertCount = cityAlerts.length;
    const criticalCount = cityAlerts.filter(a => a.tipoAlerta.includes('FLOOD') || a.tipoAlerta.includes('FIRE')).length;

    // Multiplicador da janela temporal (7 dias = 1x, 15 dias = ~2.1x, 30 dias = ~4.2x)
    const factor = selectedPeriod / 7;

    // Calibrações específicas por capital e bioma
    let chuvaBase = 0.0;
    let pm25Base = 18.0;
    let focosBase = 1;
    let tempMedia = '27.4°C';
    let tempMax = '34.8°C';
    let tempMin = '19.2°C';
    let nivelRio = 0;

    if (selectedCity.slug === 'brasilia') {
      // Seca histórica e queimadas no Cerrado (Gama, Parque Nacional, entorno)
      chuvaBase = selectedPeriod === 30 ? 1.5 : 0.0;
      pm25Base = 28.4;
      focosBase = Math.round(14 * (selectedPeriod / 7));
      tempMedia = '28.2°C';
      tempMax = '35.6°C';
      tempMin = '18.0°C';
      nivelRio = 0;
    } else if (selectedCity.slug === 'porto alegre') {
      // Bacia do Guaíba - cheia recente e chuvas no Sul
      chuvaBase = Math.round(68.4 * factor);
      pm25Base = 12.0;
      focosBase = Math.round(1 * factor);
      tempMedia = '21.5°C';
      tempMax = '26.0°C';
      tempMin = '16.0°C';
      nivelRio = 2.18; // Cota de alerta do Guaíba é 2.0m
    } else if (selectedCity.slug === 'manaus') {
      // Rio Negro e calor úmido amazônico
      chuvaBase = Math.round(14.2 * factor);
      pm25Base = 38.5; // fumaça sazonal
      focosBase = Math.round(18 * factor);
      tempMedia = '32.8°C';
      tempMax = '37.0°C';
      tempMin = '25.0°C';
      nivelRio = 12.85; // Cota de emergência é 29m, vazante acentuada
    } else if (selectedCity.slug === 'cuiaba') {
      // Calor escaldante no Centro-Oeste
      chuvaBase = 0.0;
      pm25Base = 44.0;
      focosBase = Math.round(24 * factor);
      tempMedia = '34.5°C';
      tempMax = '40.2°C';
      tempMin = '23.0°C';
      nivelRio = 1.10;
    } else {
      // Demais capitais
      chuvaBase = isCapitalWithRiver ? Math.round(25.0 * factor) : 0.0;
      pm25Base = 19.5;
      focosBase = alertCount > 0 ? Math.round(5 * factor) : 1;
      nivelRio = selectedCity.cotaAlerta ? selectedCity.cotaAlerta * 0.85 : 0;
    }

    const chuvaObj = humanizePrecipitation(chuvaBase);
    const arObj = humanizeAirQuality(pm25Base);
    const rioObj = isCapitalWithRiver
      ? humanizeRiverLevel(nivelRio, selectedCity.cotaAlerta, selectedCity.cotaEmergencia, selectedCity.rioNome)
      : null;
    const fogoObj = humanizeFireRisk(selectedCity.slug === 'brasilia' || selectedCity.slug === 'cuiaba' ? 88 : 35);

    return {
      totalAlertas: alertCount,
      alertasCriticos: criticalCount,
      tempMedia,
      tempMax,
      tempMin,
      chuvaBase,
      chuvaObj,
      pm25Base,
      arObj,
      nivelRio,
      rioObj,
      fogoObj,
      focosIncendioPeriodo: focosBase
    };
  }, [selectedCity, cityAlerts, selectedPeriod]);

  // Função para exportar CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Data/Hora UTC', 'Capital', 'UF', 'Tipo de Evento', 'Severidade', 'Mensagem'];
    const rows = cityAlerts.map(a => [
      a.id,
      new Date(a.dataHoraAlerta).toISOString(),
      a.municipio,
      a.estado,
      formatAlertTypeName(a.tipoAlerta),
      a.tipoAlerta.includes('FLOOD') || a.tipoAlerta.includes('FIRE') ? 'CRÍTICO' : 'ALERTA',
      `"${a.mensagem.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

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
                    data={kpis.chuvaBase === 0 ? [0, 0, 0, 0, 0] : [kpis.chuvaBase * 0.1, kpis.chuvaBase * 0.25, kpis.chuvaBase * 0.05, kpis.chuvaBase * 0.45, kpis.chuvaBase]} 
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

          {/* Card 2: Cota do Rio / Nível das Águas */}
          <div className="p-4 rounded-xl bento-card card-interactive space-y-2.5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-sans font-medium">
                <span className="tracking-wide">Nível do Rio ({selectedCity.rioNome || 'Bacia'})</span>
                <Droplets className="w-4 h-4 text-nominal animate-breathing-glow" />
              </div>
              <div className="flex items-baseline justify-between">
                {selectedCity.rioNome ? (
                  <AnimatedCounter
                    value={kpis.nivelRio}
                    decimals={2}
                    suffix="m"
                    className="text-2xl font-bold font-mono text-zinc-100"
                  />
                ) : (
                  <div className="text-2xl font-bold font-mono text-zinc-100 tnum">Estável</div>
                )}
                {selectedCity.rioNome && (
                  <div className="w-20 h-6">
                    <Sparkline 
                      data={[kpis.nivelRio * 0.94, kpis.nivelRio * 0.97, kpis.nivelRio * 0.95, kpis.nivelRio * 0.99, kpis.nivelRio]} 
                      color="#00e676" 
                      height={24} 
                    />
                  </div>
                )}
              </div>
              <div className="text-[11px] font-sans font-semibold text-zinc-300">
                {kpis.rioObj ? kpis.rioObj.label : 'Sem risco de enchente'}
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-2 border-t border-white/5">
              💡 {kpis.rioObj ? kpis.rioObj.explanation : 'Região sem rio com cota de transbordamento monitorada pela ANA.'}
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
                    data={[kpis.pm25Base * 0.85, kpis.pm25Base * 0.95, kpis.pm25Base * 1.08, kpis.pm25Base * 0.92, kpis.pm25Base]} 
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
                <span className="tracking-wide">Focos no Período</span>
                <Flame className={`w-4 h-4 animate-breathing-glow ${kpis.focosIncendioPeriodo > 5 ? 'text-critical' : 'text-nominal'}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <AnimatedCounter
                  value={kpis.focosIncendioPeriodo}
                  decimals={0}
                  suffix=" focos"
                  className="text-2xl font-bold font-mono text-zinc-100"
                />
                <div className="w-20 h-6">
                  <Sparkline 
                    data={[Math.max(0, kpis.focosIncendioPeriodo - 4), Math.max(1, kpis.focosIncendioPeriodo - 2), Math.max(1, kpis.focosIncendioPeriodo - 1), kpis.focosIncendioPeriodo]} 
                    color={kpis.focosIncendioPeriodo > 5 ? '#ff1744' : '#00e676'} 
                    height={24} 
                  />
                </div>
              </div>
              <div className="text-[11px] font-sans font-semibold text-critical">
                {kpis.fogoObj.label}
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
              {selectedCity.rioNome ? (
                <span>
                  Em relação aos recursos hídricos, a estação hidrológica do <strong>{selectedCity.rioNome}</strong> registrou marca de <strong>{kpis.nivelRio.toFixed(2)}m</strong>. 
                  {kpis.rioObj?.status === 'emergency' ? (
                    <span className="text-critical font-bold"> Situação de emergência confirmada com invasão de vias públicas e áreas habitadas pela água.</span>
                  ) : kpis.rioObj?.status === 'alert' ? (
                    <span className="text-warning font-semibold"> O nível atingiu a cota de atenção ({selectedCity.cotaAlerta}m); a água se aproxima da margem das vias ribeirinhas e exige vigilância contínua das equipes da Defesa Civil.</span>
                  ) : (
                    <span> O fluxo hídrico permanece contido na calha, sem risco iminente de inundação para a população urbana.</span>
                  )}
                </span>
              ) : (
                <span>
                  O município não possui registro de grandes rios em estágio crítico de extravasamento, registrando escoamento pluvial urbano compatível com a capacidade dos córregos locais.
                </span>
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
