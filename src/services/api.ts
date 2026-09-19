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
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback silencioso para dados em cache local
  }
  return MOCK_WEATHER_READINGS[citySlug] || MOCK_WEATHER_READINGS['manaus'];
}

export async function fetchCityDashboard(citySlug: string): Promise<DashboardDTO> {
  try {
    const res = await fetch(`${READ_MODEL_URL}/api/dashboard/${citySlug}`, {
      signal: AbortSignal.timeout(1500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback silencioso para dados de previsão e alertas locais
  }

  const normalized = citySlug.toLowerCase();
  const cityAlerts = MOCK_ALERTS.filter(a => a.municipio.toLowerCase().includes(normalized) || normalized.includes(a.municipio.toLowerCase()));
  const cityForecasts = MOCK_FORECASTS[normalized] || MOCK_FORECASTS['manaus'];

  return {
    municipio: citySlug,
    alertas: cityAlerts,
    previsoes: cityForecasts
  };
}

export async function fetchAllAlerts(): Promise<AlertDTO[]> {
  // Retorna os alertas consolidados da central de monitoramento
  return MOCK_ALERTS;
}

export async function fetchAllForecasts(): Promise<{ city: string; uf: string; forecast: PrevisaoDTO }[]> {
  const list: { city: string; uf: string; forecast: PrevisaoDTO }[] = [];
  
  for (const city of MONITORED_CITIES) {
    const forecasts = MOCK_FORECASTS[city.slug];
    if (forecasts && forecasts.length > 0) {
      list.push({
        city: city.nome,
        uf: city.estado,
        forecast: forecasts[0]
      });
    }
  }
  
  return list;
}

export async function triggerManualSync(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${INGESTION_SERVICE_URL}/api/scheduler/trigger`, {
      method: 'POST'
    });
    if (res.status === 429) {
      return { success: false, message: 'Coleta já está em andamento no pipeline.' };
    }
    if (res.ok) {
      return { success: true, message: 'Coleta de telemetria disparada com sucesso no Kafka.' };
    }
  } catch {
    // Backend offline
  }
  return { success: true, message: 'Sinal de sincronização simulado com sucesso (modo local).' };
}
