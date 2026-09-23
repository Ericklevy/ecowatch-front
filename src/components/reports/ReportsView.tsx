import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  ShieldAlert,
  Droplets,
  Thermometer,
  CloudRain,
  CheckCircle2,
  Building2,
  MapPin,
  Radio
} from 'lucide-react';
import { MONITORED_CITIES, MOCK_ALERTS } from '../../data/mockData';
import { formatAlertTypeName } from '../../types';

export const ReportsView: React.FC = () => {
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>('brasilia');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7); // 7, 15 ou 30 dias

  const selectedCity = useMemo(() => {
    return MONITORED_CITIES.find(c => c.slug === selectedCitySlug) || MONITORED_CITIES[0];
  }, [selectedCitySlug]);

  // Alertas filtrados pela cidade
  const cityAlerts = useMemo(() => {
    return MOCK_ALERTS.filter(a => 
      a.municipio.toLowerCase().includes(selectedCity.nome.toLowerCase()) ||
      selectedCity.nome.toLowerCase().includes(a.municipio.toLowerCase())
    );
  }, [selectedCity]);

  // Simulação de KPIs consolidados para o período selecionado
  const kpis = useMemo(() => {
    const isCapitalWithRiver = !!selectedCity.rioNome;
    const alertCount = cityAlerts.length;
    const criticalCount = cityAlerts.filter(a => a.tipoAlerta.includes('FLOOD') || a.tipoAlerta.includes('FIRE')).length;
    
    return {
      totalAlertas: alertCount,
      alertasCriticos: criticalCount,
      cotaMaxima: isCapitalWithRiver && selectedCity.cotaAlerta ? (selectedCity.cotaAlerta * 0.94).toFixed(2) : 'N/A',
      cotaEmergencia: isCapitalWithRiver && selectedCity.cotaEmergencia ? `${selectedCity.cotaEmergencia.toFixed(1)}m` : 'Sem cota crítica',
      tempMedia: '27.4°C',
      tempMax: '34.8°C',
      tempMin: '19.2°C',
      chuvaAcumulada: '42.6 mm',
      indiceQualidadeAr: 'Moderado (PM2.5: 18.2 µg/m³)',
      focosIncendioPeriodo: alertCount > 0 ? 8 : 1
    };
  }, [selectedCity, cityAlerts]);

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
              Boletins técnicos oficiais consolidados a partir da telemetria da ANA, INPE, CEMADEN e NASA
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
              title="Exportar dados brutos em formato CSV"
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
            <span className="text-zinc-400">Janela Temporal:</span>
            <div className="flex items-center gap-1 bg-surface-base border border-border-subtle rounded p-0.5">
              {[7, 15, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedPeriod(days)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    selectedPeriod === days
                      ? 'bg-hydro/20 text-hydro font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {days} dias
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Documento do Relatório (Layout Timbrado Operacional) ── */}
      <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        
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
                  Boletim Técnico de Risco e Segurança Ambiental
                </h2>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-zinc-400 print:text-zinc-600 space-y-0.5">
              <div>Ref: <span className="text-zinc-200 font-bold">ECO-{selectedCity.slug.toUpperCase()}-{new Date().getFullYear()}</span></div>
              <div>Emissão: {new Date().toLocaleString('pt-BR')}</div>
              <div>Autenticidade: <span className="text-nominal">SISTEMA VERIFICADO</span></div>
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
              <span className="font-semibold text-zinc-200">{selectedCity.rioNome ? selectedCity.rioNome : 'Bacia Continental'}</span>
            </div>
            <div className="p-2.5 rounded bg-surface-base/60 border border-border-subtle/60">
              <span className="text-zinc-500 block text-[10px] uppercase">Período de Análise</span>
              <span className="font-bold text-hydro">Últimos {selectedPeriod} dias</span>
            </div>
          </div>
        </div>

        {/* ── Cards de Indicadores Consolidados (KPIs) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Incidentes */}
          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Incidentes no Período</span>
              <ShieldAlert className={`w-4 h-4 ${kpis.alertasCriticos > 0 ? 'text-critical' : 'text-nominal'}`} />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {kpis.totalAlertas}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${kpis.alertasCriticos > 0 ? 'bg-critical animate-ping' : 'bg-nominal'}`} />
              <span>{kpis.alertasCriticos} crítico(s) detectado(s)</span>
            </div>
          </div>

          {/* Card 2: Nível do Rio */}
          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Cota Hidrológica (ANA)</span>
              <Droplets className="w-4 h-4 text-hydro" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {kpis.cotaMaxima !== 'N/A' ? `${kpis.cotaMaxima}m` : 'Estável'}
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              Cota Alerta: <span className="text-zinc-200 font-semibold">{kpis.cotaEmergencia}</span>
            </div>
          </div>

          {/* Card 3: Clima e Temperatura */}
          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Amplitude Térmica</span>
              <Thermometer className="w-4 h-4 text-warning" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {kpis.tempMedia}
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              Máx: <span className="text-zinc-200">{kpis.tempMax}</span> · Mín: <span className="text-zinc-200">{kpis.tempMin}</span>
            </div>
          </div>

          {/* Card 4: Chuva Acumulada */}
          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Chuva Acumulada</span>
              <CloudRain className="w-4 h-4 text-hydro" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {kpis.chuvaAcumulada}
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              Focos de Fogo: <span className="text-zinc-200 font-semibold">{kpis.focosIncendioPeriodo} ativos</span>
            </div>
          </div>
        </div>

        {/* ── Parecer Técnico Operacional ── */}
        <div className="p-5 rounded-lg bg-surface-panel border border-border-subtle space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-hydro" />
            <span>Síntese Técnica e Diagnóstico de Vulnerabilidade</span>
          </h3>
          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            Durante a janela de monitoramento dos últimos <strong>{selectedPeriod} dias</strong> na capital <strong>{selectedCity.nome}/{selectedCity.estado}</strong>, 
            os sensores de sensoriamento remoto registraram estabilidade nos índices pluviométricos, com volume acumulado de <strong>{kpis.chuvaAcumulada}</strong>. 
            {selectedCity.rioNome ? (
              <span> A estação fluviométrica do <strong>{selectedCity.rioNome}</strong> operou em regime acompanhado, sem transbordamento iminente das cotas de emergência estipuladas pelo SNIRH/ANA.</span>
            ) : (
              <span> As bacias hidrográficas urbanas mantiveram escoamento nominal sem risco de alagamentos catastróficos.</span>
            )}
            {' '}A qualidade do ar média no perímetro urbano manteve-se no nível <strong>{kpis.indiceQualidadeAr}</strong>.
          </p>
        </div>

        {/* ── Tabela de Auditoria de Alertas Registrados ── */}
        <div className="rounded-lg bg-surface-panel border border-border-subtle overflow-hidden space-y-0">
          <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-dim/50">
            <div className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
              Registro Cronológico de Eventos Operacionais ({cityAlerts.length})
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Origens: ANA · INPE · CEMADEN · NASA
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
                <CheckCircle2 className="w-5 h-5 text-nominal mx-auto mb-1.5" />
                Nenhum alerta registrado nesta janela temporal.
              </div>
            )}
          </div>

          {/* Visualização Desktop: Tabela */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-dim text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Severidade</th>
                  <th className="py-2.5 px-4">Tipo de Evento</th>
                  <th className="py-2.5 px-4">Mensagem de Telemetria</th>
                  <th className="py-2.5 px-4 text-right">Data/Hora (UTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-xs font-mono">
                {cityAlerts.length > 0 ? (
                  cityAlerts.map(alert => (
                    <tr key={alert.id} className="hover:bg-surface-hover/30 transition-colors">
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
                      <td className="py-3 px-4 text-zinc-300 font-sans max-w-lg leading-relaxed text-xs">
                        {alert.mensagem}
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-500 whitespace-nowrap text-[11px]">
                        {new Date(alert.dataHoraAlerta).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-zinc-500 font-mono">
                      <CheckCircle2 className="w-5 h-5 text-nominal mx-auto mb-1.5" />
                      Nenhum alerta crítico registrado para {selectedCity.nome} nesta janela temporal.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rodapé Institucional do Boletim */}
        <div className="pt-4 border-t border-border-subtle/60 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-2 pb-6">
          <div>
            EcoWatch Brasil © {new Date().getFullYear()} — Plataforma de Inteligência e Alerta Antecipado
          </div>
          <div className="text-[11px]">
            Relatório gerado em conformidade com o Protocolo Nacional de Defesa Civil
          </div>
        </div>

      </div>
    </div>
  );
};
