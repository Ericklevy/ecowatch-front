export interface WeatherReading {
  municipio: string;
  estado: string;
  temperatura: number;
  umidade: number;
  precipitacao: number;
  timestamp: string;
  pm25: number;
  pm10: number;
  focosIncendio: number;
  nivelRio: number;
  alertaEnxurrada: boolean;
  metano?: number | null;
  co2?: number | null;
  co?: number | null;
}

export interface AlertDTO {
  id: number;
  municipio: string;
  estado: string;
  tipoAlerta: string;
  mensagem: string;
  dataHoraAlerta: string;
}

export interface PrevisaoDTO {
  municipio: string;
  dataPrevisao: string;
  temperaturaPrevista: number;
  precipitacaoPrevista: number;
  umidadePrevista: number;
  riscoIncendio: number; // 0 a 100
  riscoDengue: number;   // 0 a 100
}

export interface DashboardDTO {
  municipio: string;
  alertas: AlertDTO[];
  previsoes: PrevisaoDTO[];
}

export interface CityInfo {
  nome: string;
  slug: string;
  estado: string;
  regiao: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul' | 'Nacional';
  bioma: string;
  lat: number;
  lng: number;
  rioNome?: string;
  cotaAlerta?: number;
  cotaEmergencia?: number;
  postoAna?: string;
  status: 'nominal' | 'warning' | 'critical';
}

export const ALERT_TYPE_LABELS: Record<string, string> = {
  RIVER_FLOOD: 'Inundação / Enchente (ANA)',
  FOREST_FIRE: 'Foco de Queimada Detectado (Satélite)',
  CRITICAL_FIRE_RISK: 'Chance Alta de Fogo na Vegetação',
  POOR_AIR_QUALITY: 'Qualidade do Ar Crítica',
  EXTREME_HEAT: 'Calor Extremo',
  EXTREME_RAIN: 'Chuva Extrema',
  FLASH_FLOOD: 'Enxurrada / Deslizamento (CEMADEN)',
  DROUGHT_RISK: 'Risco de Seca / Estiagem',
  DENGUE_OUTBREAK_RISK: 'Risco de Surto de Dengue',
  FIRE_NEAR_URBAN_AREA: 'Foco de Calor Próximo a Área Urbana'
};

export const formatAlertTypeName = (tipoAlerta: string): string => {
  if (!tipoAlerta) return '';
  return ALERT_TYPE_LABELS[tipoAlerta] || tipoAlerta.replace(/_/g, ' ');
};

export interface NewsItem {
  id: string;
  titulo: string;
  resumo: string;
  fonte: string;
  url: string;
  dataHora: string;
  categoria: 'FIRE' | 'FLOOD' | 'RAIN' | 'DENGUE' | 'DEFORESTATION' | 'GENERAL';
  municipio?: string;
  estado?: string;
}

export interface RagSourceItem {
  id: number;
  titulo: string;
  resumo: string;
  fonte: string;
  url: string;
  dataHora: string;
  categoria: 'FIRE' | 'FLOOD' | 'RAIN' | 'DENGUE' | 'DEFORESTATION' | 'GENERAL';
  municipio?: string;
  estado?: string;
  similaridade?: number;
}

export interface AiAskResponse {
  pergunta: string;
  resposta: string;
  fontes: RagSourceItem[];
  totalFontesEncontradas: number;
  modelo: string;
  tempoRespostaMs: number;
  limiteAtingido?: boolean;
  cidadesConsultadas?: string[];
  periodoFontes?: string | null;
}

export interface AiHistoricoItem {
  autor: 'usuario' | 'ia';
  texto: string;
}

export interface AiStatusResponse {
  pgvectorAtivo: boolean;
  totalNoticias: number;
  totalEmbeddings: number;
  geminiConfigurado: boolean;
  modeloPadrao: string;
}

// ── Emissões de Gases de Efeito Estufa (SEEG) ─────────────────────────────
export interface RankingEmissaoItem {
  codigoIbge: string;
  municipio: string;
  uf: string;
  ano: number;
  gas: string;
  emissaoTotal: number;
  setorPrincipal: string;
  percentualSetorPrincipal: number;
  explicacaoSetor: string;
  quebraPorSetor: Record<string, number>;
}

export interface EmissaoEstadoItem {
  uf: string;
  ano: number;
  gas: string;
  emissaoTotal: number;
  setorPrincipal: string;
  percentualSetorPrincipal: number;
  explicacaoSetor: string;
  quebraPorSetor: Record<string, number>;
}

export interface MunicipioEmissaoDetalhe {
  codigoIbge: string;
  municipio: string;
  uf: string;
  gas: string;
  setorDominante: string;
  explicacaoSetorDominante: string;
  serieHistorica: {
    ano: number;
    emissaoTotal: number;
    quebraPorSetor: Record<string, number>;
  }[];
}



