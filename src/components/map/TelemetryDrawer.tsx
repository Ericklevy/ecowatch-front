import React from 'react';
import { 
  X, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Flame, 
  Waves, 
  AlertTriangle, 
  Download, 
  CheckCircle2
} from 'lucide-react';
import { CityInfo, WeatherReading, AlertDTO } from '../../types';

interface TelemetryDrawerProps {
  city: CityInfo;
  reading: WeatherReading;
  alerts: AlertDTO[];
  onClose: () => void;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({
  city,
  reading,
  alerts,
  onClose
}) => {
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

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ city, reading, alerts }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecowatch_${city.slug}_telemetria.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Cálculo da barra de progresso do rio se houver cota
  const riverPercentage = city.cotaAlerta && reading.nivelRio > 0
    ? Math.min(Math.round((reading.nivelRio / (city.cotaEmergencia || city.cotaAlerta * 1.1)) * 100), 100)
    : 0;

  return (
    <aside className="fixed inset-x-0 bottom-0 max-h-[85vh] md:max-h-full md:static md:w-[420px] md:h-full bg-surface-panel/95 backdrop-blur border-t md:border-t-0 md:border-l border-border-subtle flex flex-col z-[1001] md:z-20 overflow-y-auto shadow-2xl rounded-t-2xl md:rounded-none">
      {/* Puxador para celular (Drag Handle) */}
      <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto my-2 md:hidden shrink-0" />

      {/* Cabeçalho do Drawer */}
      <div className="p-4 border-b border-border-subtle flex items-start justify-between gap-3 bg-surface-dim/50 sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-surface-card transition-colors"
          title="Fechar painel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Bloco 1: Telemetria Hídrica (ANA) */}
        <div className="p-3.5 rounded-md bg-surface-card border border-border-subtle">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5 uppercase font-medium">
              <Waves className="w-3.5 h-3.5 text-hydro" />
              <span>Nível do Rio (ANA)</span>
            </span>
            {city.rioNome && (
              <span className="text-hydro font-medium">{city.rioNome}</span>
            )}
          </div>

          {reading.nivelRio > 0 ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono tracking-tight text-white">
                  {reading.nivelRio.toFixed(2)}
                </span>
                <span className="text-sm font-mono text-zinc-400">metros</span>
              </div>

              {city.cotaAlerta && (
                <div className="mt-3 space-y-1.5">
                  <div className="w-full bg-surface-base h-2 rounded-full overflow-hidden border border-border-subtle">
                    <div 
                      className={`h-full transition-all duration-500 ${
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
                    <span>Cota de Alerta: {city.cotaAlerta.toFixed(1)}m</span>
                    {city.cotaEmergencia && (
                      <span className="text-critical/90">Emergência: {city.cotaEmergencia.toFixed(1)}m</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 font-mono py-1">
              Cidade sem estação fluviométrica com cota crítica no SNIRH.
            </p>
          )}
        </div>

        {/* Bloco 2: Clima em Tempo Real */}
        <div>
          <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider block mb-2">
            Clima Base (NASA / Open-Meteo)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded bg-surface-card border border-border-subtle">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-warning" />
                <span>Temp</span>
              </div>
              <span className="text-base font-bold font-mono text-white">
                {reading.temperatura.toFixed(1)}°C
              </span>
            </div>

            <div className="p-2.5 rounded bg-surface-card border border-border-subtle">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-1">
                <Droplets className="w-3.5 h-3.5 text-hydro" />
                <span>Umidade</span>
              </div>
              <span className="text-base font-bold font-mono text-white">
                {Math.round(reading.umidade)}%
              </span>
            </div>

            <div className="p-2.5 rounded bg-surface-card border border-border-subtle">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-hydro" />
                <span>Chuva</span>
              </div>
              <span className="text-base font-bold font-mono text-white">
                {reading.precipitacao.toFixed(1)} mm
              </span>
            </div>
          </div>
        </div>

        {/* Bloco 3: Qualidade do Ar & Queimadas */}
        <div className="grid grid-cols-2 gap-2">
          {/* Qualidade do Ar */}
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

          {/* Focos de Queimadas */}
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

        {/* Bloco 4: Alertas da Cidade */}
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
                      <span>{alert.tipoAlerta}</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(alert.dataHoraAlerta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} UTC
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {alert.mensagem}
                  </p>
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
  );
};
