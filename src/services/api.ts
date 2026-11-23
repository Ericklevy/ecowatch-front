import {
  WeatherReading,
  AlertDTO,
  PrevisaoDTO,
  DashboardDTO,
  NewsItem,
  AiAskResponse,
  AiStatusResponse,
  AiHistoricoItem,
  RankingEmissaoItem,
  EmissaoEstadoItem,
  MunicipioEmissaoDetalhe,
  FonteEmissaoItem
} from '../types';
import { MOCK_WEATHER_READINGS, MOCK_ALERTS, MOCK_FORECASTS, MONITORED_CITIES } from '../data/mockData';
import { MOCK_NEWS } from '../data/newsData';
import { sanitizeNewsList } from '../utils/newsSanitizer';

// ── Endpoints do Backend (injetados via variáveis de ambiente ou URL de produção na Azure) ──
export const READ_MODEL_URL =
  import.meta.env.VITE_READ_MODEL_URL ||
  'https://read-model-service.wittytree-8ba02066.brazilsouth.azurecontainerapps.io';

const ALERT_SERVICE_URL =
  import.meta.env.VITE_ALERT_SERVICE_URL ||
  'https://alert-service.wittytree-8ba02066.brazilsouth.azurecontainerapps.io';

const INGESTION_SERVICE_URL =
  import.meta.env.VITE_INGESTION_SERVICE_URL ||
  'https://data-ingestion.wittytree-8ba02066.brazilsouth.azurecontainerapps.io';

// Se o cache do alert-service falhar repetidamente, registra timestamp para tentar novamente após 5 min
let lastCacheFailureTime = 0;

// ── Leitura manual (botão "Atualizar dados") persistida no navegador ──────
// Mantém a última atualização feita pelo usuário após recarregar a página.
const CHAVE_LEITURA_MANUAL = (slug: string) => `ecowatch:leitura-manual:${slug}`;

export function salvarLeituraManual(citySlug: string, reading: WeatherReading): void {
  try {
    localStorage.setItem(CHAVE_LEITURA_MANUAL(citySlug), JSON.stringify(reading));
  } catch { /* navegador sem storage */ }
}

export function lerLeituraManual(citySlug: string): WeatherReading | null {
  try {
    const raw = localStorage.getItem(CHAVE_LEITURA_MANUAL(citySlug));
    return raw ? (JSON.parse(raw) as WeatherReading) : null;
  } catch {
    return null;
  }
}

export async function fetchCityWeather(citySlug: string, forceLive: boolean = false): Promise<WeatherReading> {
  const isCacheSuspended = Date.now() - lastCacheFailureTime < 300_000; // 5 min retry

  // 1. Tenta buscar do backend (alert-service Redis cache na Azure), a menos que forceLive=true
  if (!forceLive && ALERT_SERVICE_URL && !isCacheSuspended) {
    try {
      const res = await fetch(`${ALERT_SERVICE_URL}/api/cache/${encodeURIComponent(citySlug)}`, {
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) {
        if (res.status >= 500) lastCacheFailureTime = Date.now();
      } else {
        const cached: WeatherReading = await res.json();
        // Aproveita o cache oficial do ciclo de ingestão (até 8 horas de validade, alinhado aos ciclos 3x/dia)
        if (cached && cached.timestamp) {
          const ageMinutes = (Date.now() - new Date(cached.timestamp).getTime()) / 60000;
          if (ageMinutes < 480) {
            return cached;
          }
        }
      }
    } catch {
      lastCacheFailureTime = Date.now();
    }
  }

  // 2. Busca direto da Open-Meteo ao vivo (respeitando cache HTTP para não disparar 429 rate limit)
  const city = MONITORED_CITIES.find(c => 
    c.slug.toLowerCase() === citySlug.toLowerCase() || 
    c.nome.toLowerCase() === citySlug.toLowerCase()
  );
  if (city) {
    try {
      const [weatherRes, aqRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=America/Sao_Paulo`, {
          signal: AbortSignal.timeout(5000)
        }),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lng}&current=pm10,pm2_5,methane,carbon_dioxide,carbon_monoxide`, {
          signal: AbortSignal.timeout(5000)
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
          alertaEnxurrada: baseMock.alertaEnxurrada,
          metano: typeof aqCurrent.methane === 'number' ? aqCurrent.methane : null,
          co2: typeof aqCurrent.carbon_dioxide === 'number' ? aqCurrent.carbon_dioxide : null,
          co: typeof aqCurrent.carbon_monoxide === 'number' ? aqCurrent.carbon_monoxide : null
        };
      }
    } catch { /* fallback silencioso */ }
  }

  return MOCK_WEATHER_READINGS[citySlug] || MOCK_WEATHER_READINGS['manaus'];
}

export async function fetchCityDashboard(citySlug: string): Promise<DashboardDTO> {
  try {
    const res = await fetch(`${READ_MODEL_URL}/api/dashboard/${encodeURIComponent(citySlug)}`, {
      signal: AbortSignal.timeout(6000)
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
        signal: AbortSignal.timeout(8000)
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
    const res = await fetch(`${INGESTION_SERVICE_URL}/api/scheduler/trigger/${encodeURIComponent(citySlug)}`, {
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
        fetch(`${INGESTION_SERVICE_URL}/api/scheduler/trigger/${encodeURIComponent(city.slug)}`, {
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

// ── Busca notícias ambientais reais do read-model-service ─────────────────
export interface FetchNewsParams {
  categoria?: string;
  estado?: string;
  municipio?: string;
  page?: number;
  size?: number;
}

export async function fetchNews(params?: FetchNewsParams): Promise<{ items: NewsItem[]; total: number }> {
  if (READ_MODEL_URL) {
    try {
      const searchParams = new URLSearchParams();
      if (params?.categoria && params.categoria !== 'ALL') searchParams.set('categoria', params.categoria);
      if (params?.estado) searchParams.set('estado', params.estado);
      if (params?.municipio) searchParams.set('municipio', params.municipio);
      if (typeof params?.page === 'number') searchParams.set('page', String(params.page));
      if (typeof params?.size === 'number') searchParams.set('size', String(params.size));

      const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
      const res = await fetch(`${READ_MODEL_URL}/api/v1/news${queryStr}`, {
        signal: AbortSignal.timeout(20000)
      });

      if (res.ok) {
        const data = await res.json();
        const rawItems = (data.content || []) as NewsItem[];
        const sanitized = sanitizeNewsList(rawItems);
        const filteredByCat = (params?.categoria && params.categoria !== 'ALL')
          ? sanitized.filter(n => n.categoria === params.categoria)
          : sanitized;
        return {
          items: filteredByCat,
          total: filteredByCat.length
        };
      }
    } catch { /* fallback suave */ }
  }

  // Fallback para MOCK_NEWS caso offline
  const sanitized = sanitizeNewsList(MOCK_NEWS);
  let filtered = sanitized;
  if (params?.categoria && params.categoria !== 'ALL') {
    filtered = filtered.filter(n => n.categoria === params.categoria);
  }
  if (params?.estado) {
    filtered = filtered.filter(n => n.estado?.toUpperCase() === params.estado?.toUpperCase());
  }
  if (params?.municipio) {
    filtered = filtered.filter(n => n.municipio?.toLowerCase().includes(params.municipio!.toLowerCase()));
  }

  return {
    items: filtered,
    total: filtered.length
  };
}

// ── Sincroniza notícias sob demanda no backend ────────────────────────────
export async function triggerNewsSync(): Promise<{ success: boolean; count: number; message: string }> {
  if (READ_MODEL_URL) {
    try {
      const res = await fetch(`${READ_MODEL_URL}/api/v1/news/sync`, {
        method: 'POST',
        signal: AbortSignal.timeout(15000)
      });
      if (res.ok) {
        const data = await res.json();
        const count = data.novasNoticiasImportadas || 0;
        return {
          success: true,
          count,
          message: count > 0 ? `${count} novas matérias oficiais sincronizadas!` : 'Feeds atualizados. Nenhuma nova matéria recente.'
        };
      }
    } catch { /* offline */ }
  }
  return { success: false, count: 0, message: 'Não foi possível sincronizar notícias no momento.' };
}

// ── Assistente de IA & RAG ───────────────────────────────────────────────
export class AiIndisponivelError extends Error {
  constructor(public motivo: 'offline' | 'erro') {
    super(motivo);
  }
}

/**
 * Pergunta à IA. Não inventa resposta: se o servidor não responder, lança AiIndisponivelError
 * e a tela mostra o aviso com botão de tentar de novo.
 */
export async function askEcoWatchAi(
  pergunta: string,
  categoria?: string,
  estado?: string,
  topK: number = 4,
  historico: AiHistoricoItem[] = []
): Promise<AiAskResponse> {
  if (!READ_MODEL_URL) throw new AiIndisponivelError('offline');
  let res: Response;
  try {
    res = await fetch(`${READ_MODEL_URL}/api/v1/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pergunta,
        categoria: categoria && categoria !== 'ALL' ? categoria : undefined,
        estado: estado && estado !== 'all' ? estado : undefined,
        topK,
        historico: historico.slice(-4)
      }),
      // O servidor gratuito "dorme"; a primeira chamada pode levar uns 40 s para acordar
      signal: AbortSignal.timeout(60000)
    });
  } catch {
    throw new AiIndisponivelError('offline');
  }
  if (!res.ok) throw new AiIndisponivelError('erro');
  return await res.json();
}

export async function fetchAiStatus(): Promise<AiStatusResponse | null> {
  if (READ_MODEL_URL) {
    try {
      const res = await fetch(`${READ_MODEL_URL}/api/v1/ai/status`, {
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch { /* offline */ }
  }
  return null;
}

// ── Emissões Municipais e Estaduais (SEEG 14.0) ────────────────────────────

export async function fetchEmissoesRanking(
  gas: string = 'CO2e',
  uf?: string,
  ano?: number,
  limite: number = 10
): Promise<RankingEmissaoItem[]> {
  if (READ_MODEL_URL) {
    try {
      const p = new URLSearchParams();
      p.set('gas', gas);
      if (uf && uf !== 'ALL') p.set('uf', uf);
      if (ano) p.set('ano', String(ano));
      p.set('limite', String(limite));

      const res = await fetch(`${READ_MODEL_URL}/api/emissoes/ranking?${p.toString()}`, {
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch { /* fallback suave */ }
  }
  return [];
}

export async function fetchEmissoesEstados(
  gas: string = 'CO2e',
  ano?: number
): Promise<EmissaoEstadoItem[]> {
  if (READ_MODEL_URL) {
    try {
      const p = new URLSearchParams();
      p.set('gas', gas);
      if (ano) p.set('ano', String(ano));

      const res = await fetch(`${READ_MODEL_URL}/api/emissoes/estados?${p.toString()}`, {
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch { /* fallback */ }
  }
  return [];
}

export async function fetchEmissoesMunicipio(
  nome: string,
  gas: string = 'CO2e'
): Promise<MunicipioEmissaoDetalhe | null> {
  if (READ_MODEL_URL) {
    try {
      const res = await fetch(`${READ_MODEL_URL}/api/emissoes/municipio/${encodeURIComponent(nome)}?gas=${encodeURIComponent(gas)}`, {
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch { /* fallback */ }
  }
  return null;
}

export async function fetchFontesEmissao(
  gas: string = 'CH4',
  setor?: string,
  limite: number = 100
): Promise<FonteEmissaoItem[]> {
  if (READ_MODEL_URL) {
    try {
      const p = new URLSearchParams();
      p.set('gas', gas);
      if (setor && setor !== 'ALL') p.set('setor', setor);
      p.set('limite', String(limite));

      const res = await fetch(`${READ_MODEL_URL}/api/emissoes/fontes?${p.toString()}`, {
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch { /* fallback */ }
  }
  return [];
}


