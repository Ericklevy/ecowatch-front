import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, CircleMarker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers } from 'lucide-react';
import { CityInfo, WeatherReading } from '../../types';
import { MONITORED_CITIES, MOCK_FORECASTS } from '../../data/mockData';
import { MAJOR_RIVERS, ACTIVE_FIRE_HOTSPOTS } from '../../data/geoData';

// ─── Ícone de marcador personalizado ────────────────────────────────────────
const createCityIcon = (city: CityInfo, isSelected: boolean) => {
  let colorClass = 'bg-nominal border-nominal';
  let pingClass = 'bg-nominal/50';

  if (city.status === 'critical') {
    colorClass = 'bg-critical border-critical';
    pingClass = 'bg-critical/60';
  } else if (city.status === 'warning') {
    colorClass = 'bg-warning border-warning';
    pingClass = 'bg-warning/50';
  }

  const selectedRing = isSelected ? 'ring-2 ring-hydro ring-offset-2 ring-offset-surface-base' : '';

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
      ${isSelected ? `<span class="absolute w-full h-full rounded-full animate-radar bg-hydro/35 pointer-events-none"></span>` : ''}
      ${city.status === 'critical' ? `
        <span class="absolute -inset-1 rounded-full animate-ping ${pingClass} opacity-75"></span>
        <span class="absolute -inset-3 rounded-full border border-critical/40 animate-pulse pointer-events-none"></span>
      ` : ''}
      ${city.status === 'warning' ? `<span class="absolute w-6 h-6 rounded-full animate-pulse bg-warning/30"></span>` : ''}
      <span class="relative w-3.5 h-3.5 rounded-full ${colorClass} border-2 ${selectedRing} shadow-[0_0_14px_rgba(0,229,255,0.6)] transition-all duration-300 group-hover:scale-125"></span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-city-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// ─── Metadados e Cores para Risco Epidemiológico de Dengue ───────────────────
const getDengueMeta = (score: number) => {
  if (score >= 70) {
    return { color: '#e11d48', stroke: '#fb7185', label: 'Crítico (Alto Risco de Surto)', radius: 34, fillOpacity: 0.35 };
  }
  if (score >= 45) {
    return { color: '#f59e0b', stroke: '#fbbf24', label: 'Atenção (Condições Favoráveis)', radius: 24, fillOpacity: 0.24 };
  }
  return { color: '#10b981', stroke: '#34d399', label: 'Baixo / Moderado', radius: 16, fillOpacity: 0.12 };
};

const getCityDengueScore = (citySlug: string, reading?: WeatherReading): number => {
  const forecast = MOCK_FORECASTS[citySlug]?.[0];
  if (forecast && typeof forecast.riscoDengue === 'number') {
    return forecast.riscoDengue;
  }
  if (reading) {
    let s = 20;
    if (reading.temperatura >= 24 && reading.temperatura <= 33) s += 35;
    if (reading.umidade > 70) s += 30;
    if (reading.precipitacao > 10) s += 15;
    return Math.min(s, 100);
  }
  return 25;
};

// ─── Limites Geográficos Focados no Brasil e América do Sul ─────────────────
// Impede que o usuário dê a volta ao mundo ou se perca em cópias vazias do mapa mundi
const BRAZIL_MAP_BOUNDS: L.LatLngBoundsLiteral = [
  [-38.0, -90.0], // Sudoeste (cone sul e oceano Pacífico adjacente)
  [12.0, -28.0]   // Nordeste (Caribe, norte do país e oceano Atlântico)
];

// ─── Componente interno para animação flyTo e ajuste de tamanho ────────────────
interface MapControllerProps {
  selectedCity: CityInfo;
  isDrawerOpen?: boolean;
}

const MapController: React.FC<MapControllerProps> = ({ selectedCity, isDrawerOpen }) => {
  const map = useMap();
  const prevCityRef = useRef<string>(selectedCity.slug);

  // 1. Observer de redimensionamento dinâmico (resolve gaveta abrindo/fechando e resize de janela)
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    const ro = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [map]);

  // 2. Quando o drawer abre ou fecha, forçar invalidação do tamanho do canvas
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize({ animate: false }), 60);
    const t2 = setTimeout(() => map.invalidateSize({ animate: false }), 240);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isDrawerOpen, map]);

  // 3. Ao trocar de cidade (ou selecionar visão panorâmica nacional)
  useEffect(() => {
    if (prevCityRef.current !== selectedCity.slug) {
      prevCityRef.current = selectedCity.slug;

      // Interrompe qualquer animação em andamento para não travar os frames do Leaflet
      map.stop();
      map.invalidateSize({ animate: false });

      if (selectedCity.slug === 'all') {
        // Enquadra o Brasil inteiro com zoom inteiro (4) para não quebrar os tiles
        setTimeout(() => {
          map.invalidateSize({ animate: false });
          map.flyTo([-14.235, -51.9253], 4, {
            animate: true,
            duration: 0.9
          });
        }, 60);
      } else {
        setTimeout(() => {
          map.invalidateSize({ animate: false });
          map.flyTo([selectedCity.lat, selectedCity.lng], 7, {
            animate: true,
            duration: 0.9
          });
        }, 60);
      }
    }
  }, [selectedCity, map]);

  return null;
};

// ─── Cor semântica para PM2.5 ────────────────────────────────────────────────
const pm25Color = (pm25: number): string => {
  if (pm25 > 55) return '#ef4444';  // critical
  if (pm25 > 25) return '#f59e0b';  // warning
  return '#10b981';                 // nominal
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface BrazilMapProps {
  selectedCity: CityInfo;
  onSelectCity: (city: CityInfo) => void;
  readings: Record<string, WeatherReading>;
  isDrawerOpen?: boolean;
}

export const BrazilMap: React.FC<BrazilMapProps> = ({
  selectedCity,
  onSelectCity,
  readings,
  isDrawerOpen
}) => {
  const [selectedTimeOffset, setSelectedTimeOffset] = useState<number>(0); // 0 = Agora, 1 = D+1, 2 = D+2, 3 = D+3
  const [showRivers, setShowRivers] = useState(false);
  const [showFires, setShowFires] = useState(false);
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [showDengueRisk, setShowDengueRisk] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  const activeLayersCount = (showRivers ? 1 : 0) + (showFires ? 1 : 0) + (showDengueRisk ? 1 : 0) + (showAirQuality ? 1 : 0);

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden bg-surface-base">

      {/* ── Seletor Temporal Estilo Windy (Top Center) ── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] select-none">
        <div className="flex items-center gap-1 p-1 rounded-full bento-card shadow-2xl backdrop-blur-md border border-white/10 text-xs font-mono">
          <button
            onClick={() => setSelectedTimeOffset(0)}
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedTimeOffset === 0
                ? 'bg-critical/20 text-critical font-bold border border-critical/30 shadow-[0_0_10px_rgba(255,23,68,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Telemetria e dados em tempo real"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${selectedTimeOffset === 0 ? 'bg-critical animate-ping' : 'bg-zinc-500'}`} />
            <span>Tempo Real</span>
          </button>
          <button
            onClick={() => setSelectedTimeOffset(1)}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              selectedTimeOffset === 1
                ? 'bg-hydro/20 text-hydro font-bold border border-hydro/30 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Previsão meteorológica para amanhã"
          >
            <span>D+1 (Amanhã)</span>
          </button>
          <button
            onClick={() => setSelectedTimeOffset(2)}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              selectedTimeOffset === 2
                ? 'bg-hydro/20 text-hydro font-bold border border-hydro/30 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Previsão para depois de amanhã"
          >
            <span>D+2</span>
          </button>
          <button
            onClick={() => setSelectedTimeOffset(3)}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              selectedTimeOffset === 3
                ? 'bg-hydro/20 text-hydro font-bold border border-hydro/30 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Previsão para 3 dias à frente"
          >
            <span>D+3</span>
          </button>
        </div>
      </div>

      {/* ── Painel Flutuante de Camadas (Top Left) ── */}
      <div className="absolute top-3 left-3 z-[1000] select-none">
        {/* Botão toggle mobile com badge de camadas ativas */}
        <button
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-panel/95 backdrop-blur border border-border-subtle text-xs font-mono text-zinc-200 shadow-2xl active:scale-95 transition-transform"
        >
          <Layers className="w-4 h-4 text-hydro" />
          <span className="font-semibold">Camadas</span>
          {activeLayersCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-hydro text-[10px] font-bold text-black font-mono">
              {activeLayersCount}
            </span>
          )}
        </button>

        {/* Painel de Controles */}
        <div className={`${isLayersOpen ? 'block' : 'hidden'} sm:block mt-2 sm:mt-0 bg-surface-panel/95 backdrop-blur border border-border-subtle p-3.5 rounded-xl shadow-2xl text-xs w-60 animate-fade-in`}>
          <div className="flex items-center justify-between font-mono text-zinc-300 font-semibold mb-2.5 pb-1.5 border-b border-border-subtle">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-hydro" />
              <span className="uppercase tracking-wider">Camadas de Dados</span>
            </div>
            {/* Botão de fechar no mobile */}
            <button
              onClick={() => setIsLayersOpen(false)}
              className="sm:hidden text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 font-mono">
            {/* Rios & Bacias — WMS ANA */}
            <label className="flex items-center justify-between text-zinc-300 cursor-pointer hover:text-white">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-hydro" />
                <span>Rios & Bacias (ANA)</span>
              </span>
              <input
                type="checkbox"
                checked={showRivers}
                onChange={e => setShowRivers(e.target.checked)}
                className="accent-hydro cursor-pointer rounded"
              />
            </label>

            {/* Queimadas — WMS INPE */}
            <label className="flex items-center justify-between text-zinc-300 cursor-pointer hover:text-white">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-critical" />
                <span>Queimadas (INPE)</span>
              </span>
              <input
                type="checkbox"
                checked={showFires}
                onChange={e => setShowFires(e.target.checked)}
                className="accent-critical cursor-pointer rounded"
              />
            </label>

            {/* Risco Epidemiológico de Dengue */}
            <label className="flex items-center justify-between text-zinc-300 cursor-pointer hover:text-white">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Risco Dengue (Vetores)</span>
              </span>
              <input
                type="checkbox"
                checked={showDengueRisk}
                onChange={e => setShowDengueRisk(e.target.checked)}
                className="accent-rose-500 cursor-pointer rounded"
              />
            </label>

            {/* Qualidade do Ar — dados do backend */}
            <label className="flex items-center justify-between text-zinc-300 cursor-pointer hover:text-white">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-nominal" />
                <span>Qualidade do Ar (PM2.5)</span>
              </span>
              <input
                type="checkbox"
                checked={showAirQuality}
                onChange={e => setShowAirQuality(e.target.checked)}
                className="accent-nominal cursor-pointer rounded"
              />
            </label>
          </div>

          <div className="mt-3 pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>ESRI Dark Gray Canvas</span>
            <span className="text-hydro">{MONITORED_CITIES.length} nós GPS</span>
          </div>
        </div>
      </div>

      {/* ── Mapa Leaflet ── */}
      <MapContainer
        center={[-14.2350, -51.9253]}
        zoom={4}
        minZoom={3.5}
        maxZoom={12}
        maxBounds={BRAZIL_MAP_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#090d16' }}
      >
        {/* Controlador de flyTo e redimensionamento dinâmico */}
        <MapController selectedCity={selectedCity} isDrawerOpen={isDrawerOpen} />

        {/* Camada Base ESRI Dark Gray */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, DeLorme, NAVTEQ'
          maxZoom={16}
          noWrap={true}
          bounds={BRAZIL_MAP_BOUNDS}
        />
        {/* Rótulos e Fronteiras ESRI */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          attribution=''
          maxZoom={16}
          noWrap={true}
          bounds={BRAZIL_MAP_BOUNDS}
        />

        {/* ── Camada Vetorial: Principais Rios e Bacias Hidrográficas (ANA/SNIRH) ── */}
        {showRivers && (
          <>
            {MAJOR_RIVERS.map(river => (
              <React.Fragment key={river.id}>
                {/* Linha externa para dispersão suave de luz na água */}
                <Polyline
                  positions={river.coordinates}
                  pathOptions={{
                    color: '#0284c7',
                    weight: river.principal ? 4.5 : 3,
                    opacity: 0.18,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
                {/* Leito hidrográfico do rio */}
                <Polyline
                  positions={river.coordinates}
                  pathOptions={{
                    color: river.principal ? '#38bdf8' : '#7dd3fc',
                    weight: river.principal ? 2 : 1.4,
                    opacity: 0.8,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                >
                  <Tooltip sticky direction="top" className="custom-river-tooltip">
                    <div className="font-mono text-xs p-1 space-y-0.5">
                      <div className="font-bold text-sky-300 flex items-center gap-1">
                        <span>🌊</span>
                        <span>{river.nome}</span>
                      </div>
                      <div className="text-zinc-400 text-[10px]">
                        {river.bacia} · {river.extensaoKm.toLocaleString('pt-BR')} km
                        {river.principal ? ' · Leito Principal' : ' · Afluente'}
                      </div>
                    </div>
                  </Tooltip>
                </Polyline>
              </React.Fragment>
            ))}
          </>
        )}

        {/* ── Camada Vetorial: Focos de Queimadas Ativos (INPE BDQueimadas) ── */}
        {showFires && (
          <>
            {ACTIVE_FIRE_HOTSPOTS.map(hotspot => (
              <React.Fragment key={hotspot.id}>
                {/* Círculo de pulso térmico / calor radiativo */}
                <CircleMarker
                  center={[hotspot.lat, hotspot.lng]}
                  radius={hotspot.frp > 80 ? 18 : 12}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#dc2626',
                    fillOpacity: 0.25,
                    weight: 1,
                    dashArray: '2, 4'
                  }}
                />
                {/* Núcleo do foco de incêndio */}
                <CircleMarker
                  center={[hotspot.lat, hotspot.lng]}
                  radius={hotspot.frp > 80 ? 6 : 4}
                  pathOptions={{
                    color: '#f87171',
                    fillColor: '#ef4444',
                    fillOpacity: 0.95,
                    weight: 1.5
                  }}
                >
                  <Tooltip sticky direction="top" className="custom-fire-tooltip">
                    <div className="font-mono text-xs p-1 space-y-0.5">
                      <div className="font-bold text-critical flex items-center gap-1">
                        <span>🔥</span>
                        <span>Foco de Calor // {hotspot.municipio}/{hotspot.estado}</span>
                      </div>
                      <div className="text-zinc-300 text-[10px]">
                        Bioma: <span className="text-zinc-100 font-semibold">{hotspot.bioma}</span>
                      </div>
                      <div className="text-zinc-400 text-[10px]">
                        Satélite: {hotspot.satelite} · FRP: {hotspot.frp.toFixed(1)} MW
                      </div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              </React.Fragment>
            ))}
          </>
        )}

        {/* ── Marcadores das 27 capitais ── */}
        {MONITORED_CITIES.map(city => {
          const reading = readings[city.slug];
          const isSelected = selectedCity.slug === city.slug;
          const dengueScore = getCityDengueScore(city.slug, reading);
          const dengueMeta = getDengueMeta(dengueScore);

          // Integração com a Timeline Windy
          const isLive = selectedTimeOffset === 0;
          const forecast = !isLive ? MOCK_FORECASTS[city.slug]?.[selectedTimeOffset - 1] : null;

          const displayTemp = isLive 
            ? reading?.temperatura 
            : forecast?.temperaturaPrevista ?? reading?.temperatura;
          const displayRain = isLive 
            ? reading?.precipitacao 
            : forecast?.precipitacaoPrevista ?? reading?.precipitacao;

          let effectiveStatus = city.status;
          if (!isLive && forecast) {
            if (forecast.riscoIncendio >= 70 || forecast.precipitacaoPrevista >= 40) {
              effectiveStatus = 'critical';
            } else if (forecast.riscoIncendio >= 40 || forecast.precipitacaoPrevista >= 20) {
              effectiveStatus = 'warning';
            } else {
              effectiveStatus = 'nominal';
            }
          }

          const effectiveCity: CityInfo = { ...city, status: effectiveStatus as any };

          return (
            <React.Fragment key={city.slug}>
              {/* Círculo de Risco Epidemiológico de Dengue (Mapa de Calor Térmico) */}
              {showDengueRisk && (
                <CircleMarker
                  center={[city.lat, city.lng]}
                  radius={dengueMeta.radius}
                  pathOptions={{
                    color: dengueMeta.stroke,
                    fillColor: dengueMeta.color,
                    fillOpacity: dengueMeta.fillOpacity,
                    weight: dengueScore >= 70 ? 2 : 1,
                    dashArray: dengueScore >= 70 ? '3, 5' : undefined
                  }}
                />
              )}

              {/* Círculo de Qualidade do Ar (PM2.5) */}
              {showAirQuality && reading && (
                <CircleMarker
                  center={[city.lat, city.lng]}
                  radius={Math.max(8, Math.min(28, reading.pm25 * 0.6))}
                  pathOptions={{
                    color: pm25Color(reading.pm25),
                    fillColor: pm25Color(reading.pm25),
                    fillOpacity: 0.18,
                    weight: 1.5,
                    opacity: 0.6
                  }}
                />
              )}

              {/* Marcador da cidade com status temporal dinâmico */}
              <Marker
                position={[city.lat, city.lng]}
                icon={createCityIcon(effectiveCity, isSelected)}
                eventHandlers={{
                  click: () => onSelectCity(city)
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -12]}
                  opacity={0.95}
                  permanent={false}
                  className="bg-surface-card text-white border border-border-subtle shadow-xl font-mono text-[11px] px-2.5 py-1.5 rounded"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center justify-between gap-2">
                      <span>{city.nome} ({city.estado})</span>
                      <span className={`text-[9px] uppercase px-1 rounded ${
                        effectiveStatus === 'critical' ? 'bg-critical/20 text-critical' :
                        effectiveStatus === 'warning' ? 'bg-warning/20 text-warning' : 'bg-nominal/20 text-nominal'
                      }`}>
                        {isLive ? city.status : `D+${selectedTimeOffset} (${effectiveStatus})`}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 space-y-0.5 pt-1 border-t border-border-subtle mt-1">
                      <div>
                        Temp: {displayTemp !== undefined ? `${displayTemp.toFixed(1)}°C` : 'N/D'} · Chuva: {displayRain !== undefined ? `${displayRain.toFixed(1)}mm` : '0.0mm'}
                        {!isLive && <span className="text-hydro font-semibold ml-1">(Previsto)</span>}
                      </div>
                      {city.rioNome && (
                        <div>{city.rioNome}: {reading?.nivelRio.toFixed(2)}m</div>
                      )}
                      {showDengueRisk && (
                        <div className="flex items-center justify-between pt-0.5" style={{ color: dengueMeta.stroke }}>
                          <span>🦟 Risco Dengue:</span>
                          <span className="font-bold">{dengueScore}/100 ({dengueMeta.label.split(' ')[0]})</span>
                        </div>
                      )}
                      {showAirQuality && reading && (
                        <div style={{ color: pm25Color(reading.pm25) }}>
                          PM2.5: {reading.pm25.toFixed(1)} µg/m³
                        </div>
                      )}
                      {reading && reading.focosIncendio > 0 && isLive && (
                        <div className="text-critical font-medium">⚠ {reading.focosIncendio} focos de queimada</div>
                      )}
                    </div>
                    <div className="text-[9px] text-hydro/80 pt-0.5">Clique para inspecionar telemetria</div>
                  </div>
                </Tooltip>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* ── Legenda Flutuante de Severidade & Sensores (Bottom Right) ── */}
      <div className="absolute bottom-5 right-4 z-[1000] hidden sm:flex flex-col gap-1.5 p-3 rounded-xl bento-card text-[11px] font-mono shadow-2xl backdrop-blur-md border border-white/10 select-none">
        <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold border-b border-white/10 pb-1 flex items-center justify-between gap-3">
          <span>Legenda Operacional</span>
          <span className="text-hydro">27 Capitais</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-critical shadow-[0_0_8px_#ff1744] animate-pulse"></span>
          <span className="text-zinc-200">Crítico (Emergência / Fogo)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-warning shadow-[0_0_8px_#ffd600]"></span>
          <span className="text-zinc-300">Atenção (Cota Alerta / Calor)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-nominal shadow-[0_0_8px_#00e676]"></span>
          <span className="text-zinc-400">Nominal (Normalidade)</span>
        </div>
        <div className="pt-1.5 mt-0.5 border-t border-white/5 text-[9px] text-zinc-400 font-sans">
          📡 Sensores: INPE · ANA · Open-Meteo · NASA
        </div>
      </div>
    </div>
  );
};
