import React, { useState, useEffect } from 'react';
import { TopBar, ActiveTab } from './components/layout/TopBar';
import { StatusBar } from './components/layout/StatusBar';
import { Map, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { BrazilMap } from './components/map/BrazilMap';
import { TelemetryDrawer } from './components/map/TelemetryDrawer';
import { AlertsView } from './components/alerts/AlertsView';
import { ForecastView } from './components/forecast/ForecastView';
import { ReportsView } from './components/reports/ReportsView';
import { LandingPage } from './components/landing/LandingPage';
import { MONITORED_CITIES, MOCK_WEATHER_READINGS, MOCK_ALERTS } from './data/mockData';
import { CityInfo, WeatherReading, AlertDTO } from './types';
import { fetchCityWeather, fetchCityDashboard } from './services/api';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'console'>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [selectedCity, setSelectedCity] = useState<CityInfo>(MONITORED_CITIES[0]); // Padrão: Manaus
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [readings, setReadings] = useState<Record<string, WeatherReading>>(MOCK_WEATHER_READINGS);
  const [cityAlerts, setCityAlerts] = useState<AlertDTO[]>([]);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // ── Verifica se o backend está online e carrega leituras ──────────────────
  useEffect(() => {
    async function loadData() {
      let anyOnline = false;
      const updatedReadings: Record<string, WeatherReading> = { ...MOCK_WEATHER_READINGS };

      const results = await Promise.allSettled(
        MONITORED_CITIES.map(city => fetchCityWeather(city.slug))
      );

      results.forEach((res, index) => {
        const city = MONITORED_CITIES[index];
        if (res.status === 'fulfilled' && res.value) {
          const reading = res.value;
          if (reading.timestamp !== MOCK_WEATHER_READINGS[city.slug]?.timestamp) {
            anyOnline = true;
          }
          updatedReadings[city.slug] = reading;
        }
      });

      // Fallback: verifica se o read-model-service (Swagger/Dashboard) está respondendo
      if (!anyOnline) {
        try {
          const dashboard = await fetchCityDashboard('brasilia');
          if (dashboard && dashboard.alertas && dashboard.alertas.length > 0) {
            anyOnline = true;
          }
        } catch {
          // Offline
        }
      }

      setReadings(updatedReadings);
      setIsBackendOnline(anyOnline);
      setLastUpdate(new Date());
    }

    loadData();

    // Recarrega a cada 60 segundos
    const interval = setInterval(loadData, 60_000);
    return () => clearInterval(interval);
  }, []);

  // ── Ao selecionar cidade, busca alertas dela ──────────────────────────────
  useEffect(() => {
    async function loadCityDetails() {
      try {
        const dashboard = await fetchCityDashboard(selectedCity.slug);
        setCityAlerts(dashboard.alertas);
      } catch {
        const filtered = MOCK_ALERTS.filter(a =>
          a.municipio.toLowerCase().includes(selectedCity.slug.toLowerCase())
        );
        setCityAlerts(filtered);
      }
    }
    loadCityDetails();
  }, [selectedCity]);

  const handleSelectCity = (city: CityInfo) => {
    setSelectedCity(city);
    setIsDrawerOpen(true);
  };

  // ── Landing page ──────────────────────────────────────────────────────────
  if (currentView === 'landing') {
    return <LandingPage onEnter={() => setCurrentView('console')} />;
  }

  const currentReading: WeatherReading =
    readings[selectedCity.slug] || MOCK_WEATHER_READINGS['manaus'];

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-base text-zinc-100 overflow-hidden font-sans">
      {/* Barra de Topo */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenLanding={() => setCurrentView('landing')}
        unreadAlertsCount={3}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'map' && (
          <div className="flex-1 flex w-full h-full relative overflow-hidden">
            <BrazilMap
              selectedCity={selectedCity}
              onSelectCity={handleSelectCity}
              readings={readings}
            />
            {isDrawerOpen && (
              <TelemetryDrawer
                city={selectedCity}
                reading={currentReading}
                alerts={cityAlerts}
                onClose={() => setIsDrawerOpen(false)}
                onDataRefreshed={(newReading, newAlerts) => {
                  setReadings(prev => ({ ...prev, [selectedCity.slug]: newReading }));
                  setCityAlerts(newAlerts);
                  setLastUpdate(new Date());
                }}
              />
            )}
          </div>
        )}
        {activeTab === 'alerts' && <AlertsView />}
        {activeTab === 'forecast' && <ForecastView />}
        {activeTab === 'reports' && <ReportsView />}
      </main>

      {/* ── Barra de Navegação Inferior (Mobile Bottom Navigation) ── */}
      <nav className="md:hidden h-14 bg-surface-panel/95 backdrop-blur border-t border-border-subtle flex items-center justify-around px-2 z-30 shrink-0 select-none">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'map' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Map className="w-4 h-4" />
          <span className="text-[10px] font-mono">Mapa</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors relative cursor-pointer ${
            activeTab === 'alerts' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <AlertTriangle className="w-4 h-4" />
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-critical text-[9px] text-white flex items-center justify-center font-bold font-mono">
              3
            </span>
          </div>
          <span className="text-[10px] font-mono">Alertas</span>
        </button>

        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'forecast' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-[10px] font-mono">Previsões</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'reports' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] font-mono">Relatórios</span>
        </button>
      </nav>

      {/* Rodapé de Status (Desktop) */}
      <div className="hidden md:block shrink-0">
        <StatusBar isBackendOnline={isBackendOnline} lastUpdate={lastUpdate} />
      </div>
    </div>
  );
};

export default App;
