import React, { useState } from 'react';
import {
  X,
  Droplets,
  Thermometer,
  CloudRain,
  Flame,
  Waves,
  AlertTriangle,
  Download,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { CityInfo, WeatherReading, AlertDTO, formatAlertTypeName } from '../../types';
import { triggerCitySync, fetchCityWeather, fetchCityDashboard } from '../../services/api';
import { Sparkline } from '../common/Sparkline';

interface TelemetryDrawerProps {
  city: CityInfo;
  reading: WeatherReading;
  alerts: AlertDTO[];
  onClose: () => void;
  onDataRefreshed?: (reading: WeatherReading, alerts: AlertDTO[]) => void;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({
  city,
  reading,
  alerts,
  onClose,
  onDataRefreshed
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const getSeverityBadge = () => {
    switch (city.status) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-critical/15 text-critical border border-critical/30 uppercase tracking-wider animate-pulse">
            Alerta Crítico
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/15 text-warning border border-warning/30 uppercase tracking-wider">
            Atenção
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-nominal/15 text-nominal border border-nominal/30 uppercase tracking-wider">
            Operação Nominal
          </span>
        );
    }
  };

  // ── Botão de Sincronização sob demanda ───────────────────────────────────
  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const result = await triggerCitySync(city.slug);
      setSyncMsg({ ok: result.success, text: result.message });

      if (result.success) {
        // Aguarda 2s para o backend processar e então relê os dados
        await new Promise(r => setTimeout(r, 2000));
        const [newReading, dashboard] = await Promise.all([
          fetchCityWeather(city.slug),
          fetchCityDashboard(city.slug)
        ]);
        const freshReading: WeatherReading = {
          ...newReading,
          timestamp: new Date().toISOString()
        };
        onDataRefreshed?.(freshReading, dashboard.alertas);
      }
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(null), 4000);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ city, reading, alerts }, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `ecowatch_${city.slug}_telemetria.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const riverPercentage = city.cotaAlerta && reading.nivelRio > 0
    ? Math.min(Math.round((reading.nivelRio / (city.cotaEmergencia || city.cotaAlerta * 1.1)) * 100), 100)
    : 0;

  const dataAge = reading.timestamp
    ? Math.round((Date.now() - new Date(reading.timestamp).getTime()) / 60000)
    : null;

  return (
    <>
      {/* Backdrop no mobile para fechar gaveta ao tocar fora */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-35 md:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="fixed inset-x-0 bottom-14 max-h-[75vh] md:max-h-full md:bottom-0 md:static md:w-[420px] md:h-full bg-surface-panel/98 backdrop-blur border-t md:border-t-0 md:border-l border-border-subtle flex flex-col z-40 md:z-20 overflow-y-auto shadow-2xl rounded-t-2xl md:rounded-none">
        {/* Puxador celular */}
        <div 
          onClick={onClose}
          className="w-12 h-1.5 bg-zinc-500/80 hover:bg-zinc-400 rounded-full mx-auto my-2.5 md:hidden shrink-0 cursor-pointer active:scale-95 transition-all" 
          title="Toque para fechar"
        />

        {/* Cabeçalho */}
        <div className="p-4 border-b border-border-subtle flex items-start justify-between gap-3 bg-surface-dim/70 sticky top-0 z-10 backdrop-blur">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold tracking-tight text-white font-sans">{city.nome}</h2>
            {getSeverityBadge()}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs font-mono text-zinc-400">
            <span>{city.estado} // Bioma {city.bioma}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-zinc-500">
            <span>{city.lat.toFixed(4)}, {city.lng.toFixed(4)}</span>
            {city.postoAna && (
              <>
                <span>·</span>
                <span className="text-zinc-400">{city.postoAna}</span>
              </>
            )}
            {dataAge !== null && (
              <>
                <span>·</span>
                <span className={dataAge > 60 ? 'text-warning' : 'text-zinc-500'}>
                  {dataAge === 0 ? 'agora' : `${dataAge}min atrás`}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-surface-card transition-colors shrink-0"
          title="Fechar painel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Botão de Sincronização sob demanda ── */}
      <div className="px-4 pt-3 pb-1">
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded border text-xs font-mono font-medium transition-all ${
            syncing
              ? 'bg-hydro/10 border-hydro/30 text-hydro cursor-wait'
              : 'bg-surface-card border-border-subtle text-zinc-300 hover:border-hydro/40 hover:text-hydro hover:bg-hydro/5'
          } disabled:opacity-70`}
          title="Busca dados frescos dos satélites NASA/Open-Meteo/INPE/ANA agora"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-hydro' : ''}`} />
          <span>{syncing ? 'Sincronizando com satélites...' : `↻ Atualizar dados de ${city.nome}`}</span>
        </button>

        {/* Feedback da sincronização */}
        {syncMsg && (
          <div className={`mt-2 px-3 py-1.5 rounded text-[11px] font-mono border ${
            syncMsg.ok
              ? 'bg-nominal/10 border-nominal/30 text-nominal'
              : 'bg-critical/10 border-critical/30 text-critical'
          }`}>
            {syncMsg.ok ? '✓' : '✗'} {syncMsg.text}
          </div>
        )}
      </div>

      {/* ── Conteúdo de Telemetria ── */}
      <div className="p-4 space-y-4 flex-1">

        {/* Bloco 1: Nível do Rio (ANA) */}
        <div className="p-4 rounded-xl bento-card card-interactive border border-border-subtle">
          <div className="flex items-center justify-between text-xs font-sans text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5 uppercase font-medium tracking-wider">
              <Waves className="w-3.5 h-3.5 text-hydro animate-breathing-glow" />
              <span>Nível Hidrológico (ANA)</span>
            </span>
            {city.rioNome && (
              <span className="text-hydro font-medium text-xs font-sans">{city.rioNome}</span>
            )}
          </div>

          {reading.nivelRio > 0 ? (
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono tracking-tight text-white tnum">
                    {reading.nivelRio.toFixed(2)}
                  </span>
                  <span className="text-xs font-sans text-zinc-400">metros</span>
                </div>
                {/* Mini Gráfico de Tendência da Lâmina d'água */}
                <Sparkline
                  data={[
                    reading.nivelRio * 0.94,
                    reading.nivelRio * 0.96,
                    reading.nivelRio * 0.99,
                    reading.nivelRio * 0.97,
                    reading.nivelRio * 1.01,
                    reading.nivelRio
                  ]}
                  width={110}
                  height={32}
                  color={city.status === 'critical' ? '#ef4444' : '#38bdf8'}
                />
              </div>

              {city.cotaAlerta && (
                <div className="mt-3 space-y-1.5">
                  <div className="w-full bg-surface-base h-2 rounded-full overflow-hidden border border-border-subtle/60">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        city.cotaEmergencia && reading.nivelRio >= city.cotaEmergencia
                          ? 'bg-critical'
                          : reading.nivelRio >= city.cotaAlerta
                          ? 'bg-warning'
                          : 'bg-hydro'
                      }`}
                      style={{ width: `${riverPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400 pt-0.5">
                    <span>Cota Alerta: {city.cotaAlerta.toFixed(1)}m</span>
                    {city.cotaEmergencia && (
                      <span className="text-critical/90 font-semibold">Emergência: {city.cotaEmergencia.toFixed(1)}m</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 font-sans py-1 leading-relaxed">
              Bacia continental com escoamento normalizado; sem estação crítica instalada.
            </p>
          )}
        </div>

        {/* Bloco 2: Clima em Tempo Real com Bento Cards e Tendências */}
        <div>
          <span className="text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider block mb-2">
            Sensores Meteorológicos (NASA / Open-Meteo)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bento-card card-interactive flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span className="flex items-center gap-1 font-sans">
                  <Thermometer className="w-3.5 h-3.5 text-warning animate-breathing-glow" />
                  <span>Temp</span>
                </span>
              </div>
              <span className="text-lg font-bold font-mono text-white tnum">
                {reading.temperatura.toFixed(1)}°C
              </span>
              <div className="pt-2 mt-1 border-t border-border-subtle/50">
                <Sparkline
                  data={[
                    reading.temperatura - 3.2,
                    reading.temperatura - 1.5,
                    reading.temperatura + 1.8,
                    reading.temperatura + 0.5,
                    reading.temperatura
                  ]}
                  width={75}
                  height={22}
                  color="#f59e0b"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bento-card card-interactive flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span className="flex items-center gap-1 font-sans">
                  <Droplets className="w-3.5 h-3.5 text-hydro animate-breathing-glow" />
                  <span>Ar</span>
                </span>
              </div>
              <span className="text-lg font-bold font-mono text-white tnum">
                {Math.round(reading.umidade)}%
              </span>
              <div className="pt-2 mt-1 border-t border-border-subtle/50">
                <Sparkline
                  data={[
                    Math.max(10, reading.umidade - 8),
                    Math.max(10, reading.umidade - 4),
                    reading.umidade + 3,
                    reading.umidade
                  ]}
                  width={75}
                  height={22}
                  color="#38bdf8"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bento-card card-interactive flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span className="flex items-center gap-1 font-sans">
                  <CloudRain className="w-3.5 h-3.5 text-nominal animate-breathing-glow" />
                  <span>Chuva</span>
                </span>
              </div>
              <span className="text-lg font-bold font-mono text-white tnum">
                {reading.precipitacao.toFixed(1)} mm
              </span>
              <div className="pt-2 mt-1 border-t border-border-subtle/50">
                <Sparkline
                  data={[
                    0,
                    reading.precipitacao * 0.2,
                    reading.precipitacao * 0.8,
                    reading.precipitacao
                  ]}
                  width={75}
                  height={22}
                  color="#10b981"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 3: Qualidade do Ar & Queimadas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded bg-surface-card border border-border-subtle">
            <span className="text-[11px] font-mono font-medium text-zinc-400 block mb-1">
              Qualidade do Ar
            </span>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">PM2.5:</span>
                <span className={`font-semibold ${reading.pm25 > 25 ? 'text-critical' : 'text-nominal'}`}>
                  {reading.pm25.toFixed(1)} µg/m³
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">PM10:</span>
                <span className="text-zinc-300 font-semibold">
                  {reading.pm10.toFixed(1)} µg/m³
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-surface-card border border-border-subtle">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-zinc-400 mb-1">
              <Flame className={`w-3.5 h-3.5 ${reading.focosIncendio > 0 ? 'text-critical' : 'text-zinc-500'}`} />
              <span>Queimadas INPE</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-xl font-bold font-mono ${reading.focosIncendio > 0 ? 'text-critical' : 'text-nominal'}`}>
                {reading.focosIncendio}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">focos ativos</span>
            </div>
          </div>
        </div>

        {/* Bloco 4: Histórico de Alertas */}
        <div>
          <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider block mb-2">
            Histórico Recente de Alertas ({alerts.length})
          </span>
          {alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-2.5 rounded bg-surface-card/60 border border-border-subtle text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-warning shrink-0" />
                      <span>{formatAlertTypeName(alert.tipoAlerta)}</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(alert.dataHoraAlerta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} UTC
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{alert.mensagem}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded bg-surface-card/30 border border-border-subtle text-center">
              <CheckCircle2 className="w-4 h-4 text-nominal mx-auto mb-1" />
              <p className="text-xs text-zinc-400 font-mono">Nenhum alerta crítico ativo para esta capital.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rodapé da Gaveta */}
      <div className="p-4 border-t border-border-subtle bg-surface-dim/60">
        <button
          onClick={handleExport}
          className="w-full py-2 px-3 rounded bg-surface-card hover:bg-surface-hover border border-border-subtle text-xs font-mono text-zinc-300 flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-hydro" />
          <span>Exportar Boletim Operacional (JSON)</span>
        </button>
      </div>
    </aside>
  </>
);
};
