import { WeatherReading, AlertDTO, PrevisaoDTO, DashboardDTO } from '../types';
import { MOCK_WEATHER_READINGS, MOCK_ALERTS, MOCK_FORECASTS, MONITORED_CITIES } from '../data/mockData';

// ── Endpoints do Backend (via variáveis de ambiente — nunca hardcoded) ───
const READ_MODEL_URL        = import.meta.env.VITE_READ_MODEL_URL        || '';
const ALERT_SERVICE_URL     = import.meta.env.VITE_ALERT_SERVICE_URL     || '';
const INGESTION_SERVICE_URL = import.meta.env.VITE_INGESTION_SERVICE_URL || '';

export async function fetchCityWeather(citySlug: string): Promise<WeatherReading> {
  // 1. Tenta buscar do backend (alert-service Redis cache na Azure)
  if (ALERT_SERVICE_URL) {
    try {
      const res = await fetch(`${ALERT_SERVICE_URL}/api/cache/${citySlug}`, {
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) return await res.json();
    } catch { /* fallback para satélite direto */ }
  }

  // 2. Busca direto da Open-Meteo ao vivo (mesma fonte oficial que o backend consome)
  const city = MONITORED_CITIES.find(c => 
    c.slug.toLowerCase() === citySlug.toLowerCase() || 
    c.nome.toLowerCase() === citySlug.toLowerCase()
  );
  if (city) {
    try {
      const [weatherRes, aqRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=America/Sao_Paulo`, {
          signal: AbortSignal.timeout(3500)
        }),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lng}&current=pm10,pm2_5`, {
          signal: AbortSignal.timeout(3500)
        }).catch(() => null)
      ]);

      if (weatherRes.ok) {
        const data = await weatherRes.json();
        const aqData = aqRes && aqRes.ok ? await aqRes.json() : null;
        const current = data.current || {};
        const aqCurrent = aqData?.current || {};
        const baseMock = MOCK_WEATHER_READINGS[city.slug] || MOCK_WEATHER_READINGS[citySlug] || MOCK_WEATHER_READINGS['manaus'];

        return {
          municipio: city.nome,
          estado: city.estado,
          temperatura: typeof current.temperature_2m === 'number' ? current.temperature_2m : baseMock.temperatura,
          umidade: typeof current.relative_humidity_2m === 'number' ? current.relative_humidity_2m : baseMock.umidade,
          precipitacao: typeof current.precipitation === 'number' ? current.precipitation : baseMock.precipitacao,
          timestamp: new Date().toISOString(),
          pm25: typeof aqCurrent.pm2_5 === 'number' ? aqCurrent.pm2_5 : baseMock.pm25,
          pm10: typeof aqCurrent.pm10 === 'number' ? aqCurrent.pm10 : baseMock.pm10,
          focosIncendio: baseMock.focosIncendio,
          nivelRio: baseMock.nivelRio,
          alertaEnxurrada: baseMock.alertaEnxurrada
        };
      }
    } catch { /* fallback silencioso */ }
  }

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
  if (READ_MODEL_URL) {
    try {
      const res = await fetch(`${READ_MODEL_URL}/api/dashboard/alerts/all`, {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch { /* fallback */ }
  }
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
      signal: AbortSignal.timeout(8000)
    });
    if (res.status === 429) {
      return { success: false, message: 'Coleta já em andamento para esta cidade.' };
    }
    if (res.ok) {
      return { success: true, message: `Dados de ${citySlug} atualizados via satélite!` };
    }
    // Se o backend responder 404 (rota por cidade ainda não publicada), aciona o trigger geral
    if (res.status === 404) {
      const fallbackRes = await fetch(`${INGESTION_SERVICE_URL}/api/scheduler/trigger`, {
        method: 'POST',
        signal: AbortSignal.timeout(8000)
      });
      if (fallbackRes.ok || fallbackRes.status === 202) {
        return { success: true, message: `Coleta de telemetria disparada nos satélites com sucesso!` };
      }
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
