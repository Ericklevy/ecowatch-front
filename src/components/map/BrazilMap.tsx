import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Layers } from 'lucide-react';
import { CityInfo, WeatherReading } from '../../types';
import { MONITORED_CITIES } from '../../data/mockData';

// Função para criar divIcon personalizado com anéis de pulso e cores semânticas
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
  // Controles de camada
  const [showRivers, setShowRivers] = useState(true);
  const [showFires, setShowFires] = useState(true);
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden bg-surface-base">
      {/* Painel Flutuante de Camadas (Top Left) */}
      <div className="absolute top-3 left-3 z-[1000] select-none">
        {/* Botão de Toggle em Telas Pequenas */}
        <button
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-panel/95 border border-border-subtle text-xs font-mono text-zinc-300 shadow-xl"
        >
          <Layers className="w-3.5 h-3.5 text-hydro" />
          <span>Camadas</span>
        </button>

        {/* Painel de Controles */}
        <div className={`${isLayersOpen ? 'block' : 'hidden'} sm:block mt-1 sm:mt-0 bg-surface-panel/95 backdrop-blur border border-border-subtle p-3 rounded-md shadow-xl text-xs w-48 sm:w-52`}>
          <div className="flex items-center gap-1.5 font-mono text-zinc-300 font-semibold mb-2.5 pb-1.5 border-b border-border-subtle">
            <Layers className="w-3.5 h-3.5 text-hydro" />
            <span className="uppercase tracking-wider">Camadas de Dados</span>
          </div>

          <div className="space-y-2 font-mono">
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

          <label className="flex items-center justify-between text-zinc-300 cursor-pointer hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-nominal" />
              <span>Qualidade do Ar</span>
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
          <span className="text-hydro">10 nós GPS</span>
        </div>
        </div>
      </div>

      {/* Mapa Leaflet Real */}
      <MapContainer
        center={[-14.2350, -51.9253]}
        zoom={4}
        minZoom={3}
        maxZoom={12}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#090d16' }}
      >
        {/* Camada Base ESRI Dark Gray Canvas (Sem marca d'água, sem API key) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, DeLorme, NAVTEQ'
          maxZoom={16}
        />
        {/* Camada de Rótulos e Fronteiras ESRI */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          attribution=''
          maxZoom={16}
        />

        {/* Marcadores das 10 capitais monitoradas */}
        {MONITORED_CITIES.map(city => {
          const reading = readings[city.slug];
          const isSelected = selectedCity.slug === city.slug;

          return (
            <Marker
              key={city.slug}
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
                      {reading.focosIncendio > 0 && (
                        <div className="text-critical font-medium">🔥 {reading.focosIncendio} focos de queimada</div>
                      )}
                    </div>
                  )}
                  <div className="text-[9px] text-hydro/80 pt-0.5">Clique para inspecionar telemetria</div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
