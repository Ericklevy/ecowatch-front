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
  regiao: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
  bioma: string;
  lat: number;
  lng: number;
  rioNome?: string;
  cotaAlerta?: number;
  cotaEmergencia?: number;
  postoAna?: string;
  status: 'nominal' | 'warning' | 'critical';
}
