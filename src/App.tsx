import React, { useState, useEffect } from 'react';
import { TopBar, ActiveTab } from './components/layout/TopBar';
import { StatusBar } from './components/layout/StatusBar';
import { BrazilMap } from './components/map/BrazilMap';
import { TelemetryDrawer } from './components/map/TelemetryDrawer';
import { AlertsView } from './components/alerts/AlertsView';
import { ForecastView } from './components/forecast/ForecastView';
import { LandingPage } from './components/landing/LandingPage';
import { MONITORED_CITIES, MOCK_WEATHER_READINGS, MOCK_ALERTS } from './data/mockData';
import { CityInfo, WeatherReading, AlertDTO } from './types';
import { fetchCityWeather, fetchCityDashboard } from './services/api';

const ALERT_SERVICE_URL = 'http://localhost:8081';

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

      for (const city of MONITORED_CITIES) {
        try {
          const reading = await fetchCityWeather(city.slug);
          // Se a leitura voltou do backend real (não é idêntica ao mock), conta como online
          if (reading.timestamp !== MOCK_WEATHER_READINGS[city.slug]?.timestamp) {
            anyOnline = true;
          }
          updatedReadings[city.slug] = reading;
        } catch {
          // Mantém mock
        }
      }

      // Fallback: tenta um ping direto no health endpoint
      if (!anyOnline) {
        try {
          const ping = await fetch(`${ALERT_SERVICE_URL}/actuator/health`, {
            signal: AbortSignal.timeout(1000)
          });
          if (ping.ok) anyOnline = true;
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
      </main>

      {/* Rodapé de Status */}
      <StatusBar isBackendOnline={isBackendOnline} lastUpdate={lastUpdate} />
    </div>
  );
};

export default App;
