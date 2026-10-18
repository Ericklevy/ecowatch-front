import React, { useState, useEffect } from 'react';
import { TopBar, ActiveTab } from './components/layout/TopBar';
import { StatusBar } from './components/layout/StatusBar';
import { Map, AlertTriangle, TrendingUp, FileText, Newspaper, Info } from 'lucide-react';
import { BrazilMap } from './components/map/BrazilMap';
import { TelemetryDrawer } from './components/map/TelemetryDrawer';
import { AlertsView } from './components/alerts/AlertsView';
import { ForecastView } from './components/forecast/ForecastView';
import { ReportsView } from './components/reports/ReportsView';
import { NewsView } from './components/news/NewsView';
import { GlossaryView } from './components/glossary/GlossaryView';
import { AboutView } from './components/about/AboutView';
import { LandingPage } from './components/landing/LandingPage';
import { LiveStatusTicker } from './components/layout/LiveStatusTicker';
import { CommandPalette } from './components/common/CommandPalette';
import { MONITORED_CITIES, MOCK_WEATHER_READINGS, MOCK_ALERTS } from './data/mockData';
import { CityInfo, WeatherReading, AlertDTO } from './types';
import { fetchCityWeather, fetchCityDashboard, fetchAllAlerts } from './services/api';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'console'>('landing');
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [selectedCity, setSelectedCity] = useState<CityInfo>(MONITORED_CITIES[0]); // Padrão: Manaus
  // Inicia aberto apenas em telas médias/grandes (desktop). No celular inicia fechado para deixar a tela limpa.
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const [readings, setReadings] = useState<Record<string, WeatherReading>>(MOCK_WEATHER_READINGS);
  const [cityAlerts, setCityAlerts] = useState<AlertDTO[]>([]);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(3);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // ── Atalho Global de Teclado (Ctrl + K / Cmd + K) estilo Raycast ──────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Função unificada para carregar e atualizar leituras ao vivo ──────────
  const loadData = async () => {
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

    // Busca todos os alertas para atualizar contador global
    try {
      const allAlerts = await fetchAllAlerts();
      if (allAlerts && allAlerts.length > 0) {
        setUnreadAlertsCount(allAlerts.length);
      }
    } catch {
      // Fallback mantém valor anterior
    }

    setReadings(updatedReadings);
    setIsBackendOnline(anyOnline);
    setLastUpdate(new Date());
  };

  // ── Carregamento inicial e timer periódico de 60s ─────────────────────────
  useEffect(() => {
    loadData();

    // Recarrega a cada 60 segundos
    const interval = setInterval(loadData, 60_000);
    return () => clearInterval(interval);
  }, []);

  // ── Ao selecionar cidade, busca alertas dela ──────────────────────────────
  useEffect(() => {
    async function loadCityDetails() {
      if (selectedCity.slug === 'all') {
        try {
          const all = await fetchAllAlerts();
          if (all && all.length > 0) {
            setCityAlerts(all);
            return;
          }
        } catch {
          // fallback
        }
        setCityAlerts(MOCK_ALERTS);
        return;
      }

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
    if (city.slug === 'all') {
      setIsDrawerOpen(false);
    } else {
      setIsDrawerOpen(true);
    }
  };

  // ── Landing page ──────────────────────────────────────────────────────────
  if (currentView === 'landing') {
    return <LandingPage onEnter={() => setCurrentView('console')} />;
  }

  const currentReading: WeatherReading =
    readings[selectedCity.slug] || MOCK_WEATHER_READINGS['manaus'];

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-base text-zinc-100 overflow-hidden font-sans">
      {/* Barra de Topo com Glassmorphism */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenLanding={() => setCurrentView('landing')}
        unreadAlertsCount={unreadAlertsCount}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onRefreshAll={loadData}
      />

      {/* Fita de Telemetria e Operações ao Vivo (Live Status Ticker) */}
      <LiveStatusTicker />

      {/* Conteúdo Principal com Transição Fluida entre Abas */}
      <main key={activeTab} className="flex-1 flex overflow-hidden relative animate-fade-up">
        {activeTab === 'map' && (
          <div className="flex-1 flex w-full h-full relative overflow-hidden">
            <BrazilMap
              selectedCity={selectedCity}
              onSelectCity={handleSelectCity}
              readings={readings}
              isDrawerOpen={isDrawerOpen}
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
        {activeTab === 'news' && <NewsView />}
        {activeTab === 'glossary' && <GlossaryView />}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* ── Barra de Navegação Inferior (Mobile Bottom Navigation) ── */}
      <nav className="md:hidden h-16 bg-surface-panel/98 backdrop-blur border-t border-border-subtle flex items-center justify-around px-1 z-50 shrink-0 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'map' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'map' ? 'bg-hydro/20 text-hydro shadow-sm' : ''}`}>
            <Map className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] font-mono">Mapa</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all relative cursor-pointer ${
            activeTab === 'alerts' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all relative ${activeTab === 'alerts' ? 'bg-hydro/20 text-hydro shadow-sm' : ''}`}>
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-critical text-[9px] text-white flex items-center justify-center font-bold font-mono">
              {unreadAlertsCount}
            </span>
          </div>
          <span className="text-[10px] font-mono">Alertas</span>
        </button>

        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'forecast' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'forecast' ? 'bg-hydro/20 text-hydro shadow-sm' : ''}`}>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] font-mono">Previsão</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'reports' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'reports' ? 'bg-hydro/20 text-hydro shadow-sm' : ''}`}>
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] font-mono">Relatórios</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'news' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'news' ? 'bg-hydro/20 text-hydro shadow-sm' : ''}`}>
            <Newspaper className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] font-mono">Notícias</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'about' ? 'text-hydro font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'about' ? 'bg-hydro/20 text-hydro shadow-sm' : ''}`}>
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] font-mono">Sobre</span>
        </button>
      </nav>

      {/* Rodapé de Status (Desktop) */}
      <div className="hidden md:block shrink-0">
        <StatusBar isBackendOnline={isBackendOnline} lastUpdate={lastUpdate} />
      </div>

      {/* Menu Global de Comandos (Ctrl + K) estilo Raycast */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onTabChange={setActiveTab}
        onSelectCity={handleSelectCity}
        onSync={loadData}
      />
    </div>
  );
};

export default App;
