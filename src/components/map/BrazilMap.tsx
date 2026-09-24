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
    <div class="relative flex items-center justify-center w-6 h-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
      ${city.status === 'critical' ? `<span class="absolute w-full h-full rounded-full animate-ping ${pingClass}"></span>` : ''}
      <span class="relative w-3.5 h-3.5 rounded-full ${colorClass} border-2 ${selectedRing} shadow-lg transition-transform duration-200 group-hover:scale-125"></span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-city-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
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

// ─── Componente interno para animação flyTo ──────────────────────────────────
interface MapControllerProps {
  selectedCity: CityInfo;
}

const MapController: React.FC<MapControllerProps> = ({ selectedCity }) => {
  const map = useMap();
  const prevCityRef = useRef<string>(selectedCity.slug);

  useEffect(() => {
    if (prevCityRef.current !== selectedCity.slug) {
      map.flyTo([selectedCity.lat, selectedCity.lng], 7, {
        animate: true,
        duration: 1.2
      });
      prevCityRef.current = selectedCity.slug;
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
}

export const BrazilMap: React.FC<BrazilMapProps> = ({
  selectedCity,
  onSelectCity,
  readings
}) => {
  const [showRivers, setShowRivers] = useState(true);
  const [showFires, setShowFires] = useState(true);
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [showDengueRisk, setShowDengueRisk] = useState(true);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden bg-surface-base">

      {/* ── Painel Flutuante de Camadas (Top Left) ── */}
      <div className="absolute top-3 left-3 z-[1000] select-none">
        {/* Botão toggle mobile */}
        <button
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-panel/95 border border-border-subtle text-xs font-mono text-zinc-300 shadow-xl"
        >
          <Layers className="w-3.5 h-3.5 text-hydro" />
          <span>Camadas</span>
        </button>

        {/* Painel de Controles */}
        <div className={`${isLayersOpen ? 'block' : 'hidden'} sm:block mt-1 sm:mt-0 bg-surface-panel/95 backdrop-blur border border-border-subtle p-3 rounded-md shadow-xl text-xs w-56`}>
          <div className="flex items-center gap-1.5 font-mono text-zinc-300 font-semibold mb-2.5 pb-1.5 border-b border-border-subtle">
            <Layers className="w-3.5 h-3.5 text-hydro" />
            <span className="uppercase tracking-wider">Camadas de Dados</span>
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
        minZoom={3}
        maxZoom={12}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#090d16' }}
      >
        {/* Controlador de flyTo ao trocar cidade */}
        <MapController selectedCity={selectedCity} />

        {/* Camada Base ESRI Dark Gray */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, DeLorme, NAVTEQ'
          maxZoom={16}
        />
        {/* Rótulos e Fronteiras ESRI */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          attribution=''
          maxZoom={16}
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

              {/* Marcador da cidade */}
              <Marker
                position={[city.lat, city.lng]}
                icon={createCityIcon(city, isSelected)}
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
                        city.status === 'critical' ? 'bg-critical/20 text-critical' :
                        city.status === 'warning' ? 'bg-warning/20 text-warning' : 'bg-nominal/20 text-nominal'
                      }`}>
                        {city.status}
                      </span>
                    </div>
                    {reading && (
                      <div className="text-[10px] text-zinc-400 space-y-0.5 pt-1 border-t border-border-subtle mt-1">
                        <div>Temp: {reading.temperatura.toFixed(1)}°C · Chuva: {reading.precipitacao.toFixed(1)}mm</div>
                        {city.rioNome && (
                          <div>{city.rioNome}: {reading.nivelRio.toFixed(2)}m</div>
                        )}
                        {showDengueRisk && (
                          <div className="flex items-center justify-between pt-0.5" style={{ color: dengueMeta.stroke }}>
                            <span>🦟 Risco Dengue:</span>
                            <span className="font-bold">{dengueScore}/100 ({dengueMeta.label.split(' ')[0]})</span>
                          </div>
                        )}
                        {showAirQuality && (
                          <div style={{ color: pm25Color(reading.pm25) }}>
                            PM2.5: {reading.pm25.toFixed(1)} µg/m³
                          </div>
                        )}
                        {reading.focosIncendio > 0 && (
                          <div className="text-critical font-medium">⚠ {reading.focosIncendio} focos de queimada</div>
                        )}
                      </div>
                    )}
                    <div className="text-[9px] text-hydro/80 pt-0.5">Clique para inspecionar telemetria</div>
                  </div>
                </Tooltip>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
