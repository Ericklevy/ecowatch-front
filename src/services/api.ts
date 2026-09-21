import { WeatherReading, AlertDTO, PrevisaoDTO, DashboardDTO } from '../types';
import { MOCK_WEATHER_READINGS, MOCK_ALERTS, MOCK_FORECASTS, MONITORED_CITIES } from '../data/mockData';

const READ_MODEL_URL = 'http://localhost:8086';
const ALERT_SERVICE_URL = 'http://localhost:8081';
const INGESTION_SERVICE_URL = 'http://localhost:8083';

export async function fetchCityWeather(citySlug: string): Promise<WeatherReading> {
  try {
    const res = await fetch(`${ALERT_SERVICE_URL}/api/cache/${citySlug}`, {
      signal: AbortSignal.timeout(1500)
    });
    if (res.ok) return await res.json();
  } catch { /* fallback */ }
  return MOCK_WEATHER_READINGS[citySlug] || MOCK_WEATHER_READINGS['manaus'];
}

export async function fetchCityDashboard(citySlug: string): Promise<DashboardDTO> {
  try {
    const res = await fetch(`${READ_MODEL_URL}/api/dashboard/${citySlug}`, {
      signal: AbortSignal.timeout(1500)
    });
    if (res.ok) return await res.json();
  } catch { /* fallback */ }

  const normalized = citySlug.toLowerCase();
  return {
    municipio: citySlug,
    alertas: MOCK_ALERTS.filter(a =>
      a.municipio.toLowerCase().includes(normalized) ||
      normalized.includes(a.municipio.toLowerCase())
    ),
    previsoes: MOCK_FORECASTS[normalized] || MOCK_FORECASTS['manaus']
  };
}

export async function fetchAllAlerts(): Promise<AlertDTO[]> {
  return MOCK_ALERTS;
}

export async function fetchAllForecasts(): Promise<{ city: string; uf: string; forecast: PrevisaoDTO }[]> {
  return MONITORED_CITIES
    .map(city => ({
      city: city.nome,
      uf: city.estado,
      forecast: (MOCK_FORECASTS[city.slug] || [])[0]
    }))
    .filter(item => !!item.forecast);
}

// ── Dispara coleta sob demanda para UMA cidade específica ─────────────────
export async function triggerCitySync(citySlug: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${INGESTION_SERVICE_URL}/api/scheduler/trigger/${citySlug}`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000) // coleta real pode demorar um pouco
    });
    if (res.status === 429) {
      return { success: false, message: 'Coleta já em andamento para esta cidade.' };
    }
    if (res.ok) {
      return { success: true, message: `Dados de ${citySlug} atualizados via satélite!` };
    }
  } catch { /* backend offline */ }
  return { success: false, message: 'Backend offline — não foi possível sincronizar.' };
}

// ── Dispara coleta sob demanda para TODAS as 10 cidades ──────────────────
export async function triggerAllCitiesSync(): Promise<{ success: boolean; message: string }> {
  try {
    // Tenta primeiro o endpoint global sem parâmetro de cidade
    const res = await fetch(`${INGESTION_SERVICE_URL}/api/scheduler/trigger`, {
      method: 'POST',
      signal: AbortSignal.timeout(10000)
    });
    if (res.status === 429) {
      return { success: false, message: 'Coleta já está em andamento no pipeline.' };
    }
    if (res.ok) {
      return { success: true, message: 'Coleta de telemetria disparada para todas as capitais!' };
    }
  } catch { /* fallback: dispara cidade por cidade */ }

  // Fallback: dispara individualmente (paralelo)
  try {
    await Promise.all(
      MONITORED_CITIES.map(city =>
        fetch(`${INGESTION_SERVICE_URL}/api/scheduler/trigger/${city.slug}`, {
          method: 'POST',
          signal: AbortSignal.timeout(5000)
        }).catch(() => null)
      )
    );
    return { success: true, message: 'Sincronização disparada para todas as capitais!' };
  } catch { /* tudo offline */ }

  return { success: false, message: 'Backend offline — não foi possível sincronizar.' };
}

// ── Legado — mantido para compatibilidade com o botão RefreshCw da TopBar ─
export async function triggerManualSync(): Promise<{ success: boolean; message: string }> {
  return triggerAllCitiesSync();
}
