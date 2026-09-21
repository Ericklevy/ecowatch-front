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

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'console'>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [selectedCity, setSelectedCity] = useState<CityInfo>(MONITORED_CITIES[0]); // Padrão: Manaus
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [readings, setReadings] = useState<Record<string, WeatherReading>>(MOCK_WEATHER_READINGS);
  const [cityAlerts, setCityAlerts] = useState<AlertDTO[]>([]);

  // Carrega leituras das cidades ao montar
  useEffect(() => {
    async function loadData() {
      const updatedReadings: Record<string, WeatherReading> = { ...MOCK_WEATHER_READINGS };
      for (const city of MONITORED_CITIES) {
        try {
          const reading = await fetchCityWeather(city.slug);
          updatedReadings[city.slug] = reading;
        } catch {
          // Mantém fallback
        }
      }
      setReadings(updatedReadings);
    }
    loadData();
  }, []);

  // Ao selecionar cidade, busca alertas específicos dela
  useEffect(() => {
    async function loadCityDetails() {
      try {
        const dashboard = await fetchCityDashboard(selectedCity.slug);
        setCityAlerts(dashboard.alertas);
      } catch {
        const filtered = MOCK_ALERTS.filter(a => a.municipio.toLowerCase().includes(selectedCity.slug.toLowerCase()));
        setCityAlerts(filtered);
      }
    }
    loadCityDetails();
  }, [selectedCity]);

  const handleSelectCity = (city: CityInfo) => {
    setSelectedCity(city);
    setIsDrawerOpen(true);
  };

  // Se estiver na visualização de apresentação
  if (currentView === 'landing') {
    return <LandingPage onEnter={() => setCurrentView('console')} />;
  }

  const currentReading: WeatherReading = readings[selectedCity.slug] || MOCK_WEATHER_READINGS['manaus'];

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

      {/* Conteúdo Principal (de acordo com a aba ativa) */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'map' && (
          <div className="flex-1 flex w-full h-full relative overflow-hidden">
            {/* Mapa Interativo */}
            <BrazilMap 
              selectedCity={selectedCity}
              onSelectCity={handleSelectCity}
              readings={readings}
            />

            {/* Gaveta Lateral de Telemetria */}
            {isDrawerOpen && (
              <TelemetryDrawer
                city={selectedCity}
                reading={currentReading}
                alerts={cityAlerts}
                onClose={() => setIsDrawerOpen(false)}
              />
            )}
          </div>
        )}

        {activeTab === 'alerts' && <AlertsView />}

        {activeTab === 'forecast' && <ForecastView />}
      </main>

      {/* Rodapé de Status */}
      <StatusBar />
    </div>
  );
};

export default App;
