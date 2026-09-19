import { CityInfo, WeatherReading, AlertDTO, PrevisaoDTO } from '../types';

export const MONITORED_CITIES: CityInfo[] = [
  {
    nome: 'Manaus',
    slug: 'manaus',
    estado: 'AM',
    regiao: 'Norte',
    bioma: 'Amazônia',
    lat: -3.1190,
    lng: -60.0217,
    rioNome: 'Rio Negro',
    cotaAlerta: 28.0,
    cotaEmergencia: 29.0,
    postoAna: 'ANA-66210000',
    status: 'critical'
  },
  {
    nome: 'Fortaleza',
    slug: 'fortaleza',
    estado: 'CE',
    regiao: 'Nordeste',
    bioma: 'Caatinga',
    lat: -3.7327,
    lng: -38.5270,
    rioNome: 'Rio Cocó',
    cotaAlerta: 2.0,
    cotaEmergencia: 2.8,
    postoAna: 'ANA-36200000',
    status: 'warning'
  },
  {
    nome: 'Recife',
    slug: 'recife',
    estado: 'PE',
    regiao: 'Nordeste',
    bioma: 'Mata Atlântica',
    lat: -8.0578,
    lng: -34.8778,
    rioNome: 'Rio Capibaribe',
    cotaAlerta: 3.5,
    cotaEmergencia: 4.5,
    postoAna: 'ANA-39180000',
    status: 'nominal'
  },
  {
    nome: 'Salvador',
    slug: 'salvador',
    estado: 'BA',
    regiao: 'Nordeste',
    bioma: 'Mata Atlântica',
    lat: -12.9777,
    lng: -38.5016,
    rioNome: 'Rio das Tripas',
    cotaAlerta: 1.5,
    cotaEmergencia: 2.5,
    postoAna: 'ANA-51200000',
    status: 'nominal'
  },
  {
    nome: 'Brasília',
    slug: 'brasilia',
    estado: 'DF',
    regiao: 'Centro-Oeste',
    bioma: 'Cerrado',
    lat: -15.7975,
    lng: -47.8919,
    postoAna: 'ANA-60100000',
    status: 'warning'
  },
  {
    nome: 'Belo Horizonte',
    slug: 'belo horizonte',
    estado: 'MG',
    regiao: 'Sudeste',
    bioma: 'Cerrado / Mata Atlântica',
    lat: -19.9167,
    lng: -43.9345,
    postoAna: 'ANA-41000000',
    status: 'nominal'
  },
  {
    nome: 'Rio de Janeiro',
    slug: 'rio de janeiro',
    estado: 'RJ',
    regiao: 'Sudeste',
    bioma: 'Mata Atlântica',
    lat: -22.9068,
    lng: -43.1729,
    postoAna: 'ANA-58000000',
    status: 'warning'
  },
  {
    nome: 'São Paulo',
    slug: 'sao paulo',
    estado: 'SP',
    regiao: 'Sudeste',
    bioma: 'Mata Atlântica',
    lat: -23.5505,
    lng: -46.6333,
    postoAna: 'ANA-62000000',
    status: 'nominal'
  },
  {
    nome: 'Curitiba',
    slug: 'curitiba',
    estado: 'PR',
    regiao: 'Sul',
    bioma: 'Mata Atlântica',
    lat: -25.4284,
    lng: -49.2733,
    postoAna: 'ANA-65100000',
    status: 'nominal'
  },
  {
    nome: 'Porto Alegre',
    slug: 'porto alegre',
    estado: 'RS',
    regiao: 'Sul',
    bioma: 'Pampa',
    lat: -30.0346,
    lng: -51.2177,
    rioNome: 'Lago Guaíba',
    cotaAlerta: 2.0,
    cotaEmergencia: 3.0,
    postoAna: 'ANA-87200000',
    status: 'warning'
  }
];

export const MOCK_WEATHER_READINGS: Record<string, WeatherReading> = {
  'manaus': {
    municipio: 'Manaus',
    estado: 'AM',
    temperatura: 32.4,
    umidade: 78,
    precipitacao: 12.3,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 18.2,
    pm10: 34.7,
    focosIncendio: 3,
    nivelRio: 28.12,
    alertaEnxurrada: false
  },
  'fortaleza': {
    municipio: 'Fortaleza',
    estado: 'CE',
    temperatura: 34.1,
    umidade: 22,
    precipitacao: 0.0,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 14.0,
    pm10: 25.5,
    focosIncendio: 1,
    nivelRio: 1.15,
    alertaEnxurrada: false
  },
  'recife': {
    municipio: 'Recife',
    estado: 'PE',
    temperatura: 29.8,
    umidade: 82,
    precipitacao: 15.4,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 12.3,
    pm10: 22.0,
    focosIncendio: 0,
    nivelRio: 2.10,
    alertaEnxurrada: false
  },
  'salvador': {
    municipio: 'Salvador',
    estado: 'BA',
    temperatura: 28.5,
    umidade: 88,
    precipitacao: 52.3,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 11.5,
    pm10: 19.8,
    focosIncendio: 0,
    nivelRio: 0.95,
    alertaEnxurrada: true
  },
  'brasilia': {
    municipio: 'Brasília',
    estado: 'DF',
    temperatura: 38.2,
    umidade: 12,
    precipitacao: 0.0,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 28.4,
    pm10: 45.1,
    focosIncendio: 4,
    nivelRio: 0.0,
    alertaEnxurrada: false
  },
  'belo horizonte': {
    municipio: 'Belo Horizonte',
    estado: 'MG',
    temperatura: 30.1,
    umidade: 45,
    precipitacao: 5.6,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 22.0,
    pm10: 38.0,
    focosIncendio: 1,
    nivelRio: 0.0,
    alertaEnxurrada: false
  },
  'rio de janeiro': {
    municipio: 'Rio de Janeiro',
    estado: 'RJ',
    temperatura: 31.8,
    umidade: 89,
    precipitacao: 45.2,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 35.0,
    pm10: 52.3,
    focosIncendio: 0,
    nivelRio: 0.0,
    alertaEnxurrada: true
  },
  'sao paulo': {
    municipio: 'São Paulo',
    estado: 'SP',
    temperatura: 27.3,
    umidade: 68,
    precipitacao: 18.7,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 42.1,
    pm10: 64.5,
    focosIncendio: 0,
    nivelRio: 0.0,
    alertaEnxurrada: false
  },
  'curitiba': {
    municipio: 'Curitiba',
    estado: 'PR',
    temperatura: 22.1,
    umidade: 72,
    precipitacao: 32.1,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 15.6,
    pm10: 28.3,
    focosIncendio: 0,
    nivelRio: 0.0,
    alertaEnxurrada: false
  },
  'porto alegre': {
    municipio: 'Porto Alegre',
    estado: 'RS',
    temperatura: 24.6,
    umidade: 75,
    precipitacao: 28.9,
    timestamp: '2026-09-19T14:00:00Z',
    pm25: 16.8,
    pm10: 31.2,
    focosIncendio: 0,
    nivelRio: 2.18,
    alertaEnxurrada: false
  }
};

export const MOCK_ALERTS: AlertDTO[] = [
  {
    id: 101,
    municipio: 'Manaus',
    estado: 'AM',
    tipoAlerta: 'RIVER_FLOOD',
    mensagem: 'ENCHENTE — COTA DE ALERTA em Manaus/AM: Nível do Rio Negro em 28.12m (cota de alerta: 28.0m). Evite margem do rio e áreas de baixada.',
    dataHoraAlerta: '2026-09-19T14:22:00Z'
  },
  {
    id: 102,
    municipio: 'Manaus',
    estado: 'AM',
    tipoAlerta: 'FOREST_FIRE',
    mensagem: 'INCÊNDIO FLORESTAL DETECTADO em Manaus/AM: 3 focos ativos detectados via satélite de referência Terra/Aqua MODIS.',
    dataHoraAlerta: '2026-09-19T13:45:00Z'
  },
  {
    id: 103,
    municipio: 'São Paulo',
    estado: 'SP',
    tipoAlerta: 'POOR_AIR_QUALITY',
    mensagem: 'QUALIDADE DO AR RUIM em São Paulo/SP: Concentração de PM2.5 em 42.1 µg/m³, excedendo o padrão diário CONAMA de 25 µg/m³.',
    dataHoraAlerta: '2026-09-19T13:15:00Z'
  },
  {
    id: 104,
    municipio: 'Brasília',
    estado: 'DF',
    tipoAlerta: 'CRITICAL_FIRE_RISK',
    mensagem: 'RISCO CRÍTICO DE INCÊNDIO em Brasília/DF: Umidade relativa em 12% e temperatura em 38.2°C no bioma Cerrado.',
    dataHoraAlerta: '2026-09-19T12:30:00Z'
  },
  {
    id: 105,
    municipio: 'Porto Alegre',
    estado: 'RS',
    tipoAlerta: 'RIVER_FLOOD',
    mensagem: 'ENCHENTE — COTA DE ALERTA em Porto Alegre/RS: Lago Guaíba atingiu 2.18m (cota de alerta: 2.0m). Risco para o Cais Mauá.',
    dataHoraAlerta: '2026-09-19T12:00:00Z'
  },
  {
    id: 106,
    municipio: 'Rio de Janeiro',
    estado: 'RJ',
    tipoAlerta: 'DENGUE_OUTBREAK_RISK',
    mensagem: 'RISCO DE SURTO DE DENGUE no Rio de Janeiro/RJ: Condições de alta umidade (89%) e chuva acumulada (45.2mm) favorecem proliferação de vetores.',
    dataHoraAlerta: '2026-09-19T11:45:00Z'
  },
  {
    id: 107,
    municipio: 'Fortaleza',
    estado: 'CE',
    tipoAlerta: 'DROUGHT_RISK',
    mensagem: 'RISCO DE SECA em Fortaleza/CE: 15 dias consecutivos com precipitação 0.0mm e umidade de 22% no semiárido/litoral.',
    dataHoraAlerta: '2026-09-19T11:00:00Z'
  },
  {
    id: 108,
    municipio: 'Salvador',
    estado: 'BA',
    tipoAlerta: 'FLASH_FLOOD',
    mensagem: 'RISCO DE ENXURRADA em Salvador/BA: Chuva torrencial de 52.3mm nas últimas horas. Alerta para deslizamentos de encostas.',
    dataHoraAlerta: '2026-09-19T10:30:00Z'
  },
  {
    id: 109,
    municipio: 'Brasília',
    estado: 'DF',
    tipoAlerta: 'EXTREME_HEAT',
    mensagem: 'CALOR EXTREMO em Brasília/DF: Temperatura máxima registrada de 38.2°C, superando limiar de onda de calor.',
    dataHoraAlerta: '2026-09-19T09:15:00Z'
  },
  {
    id: 110,
    municipio: 'Salvador',
    estado: 'BA',
    tipoAlerta: 'EXTREME_RAIN',
    mensagem: 'CHUVA EXTREMA em Salvador/BA: Volume acumulado de precipitação superior a 50mm em intervalo de 3 horas.',
    dataHoraAlerta: '2026-09-19T08:00:00Z'
  }
];

export const MOCK_FORECASTS: Record<string, PrevisaoDTO[]> = {
  'manaus': [
    { municipio: 'Manaus', dataPrevisao: '2026-09-20', temperaturaPrevista: 32.4, precipitacaoPrevista: 8.2, umidadePrevista: 78, riscoIncendio: 72, riscoDengue: 45 },
    { municipio: 'Manaus', dataPrevisao: '2026-09-21', temperaturaPrevista: 33.1, precipitacaoPrevista: 14.0, umidadePrevista: 80, riscoIncendio: 68, riscoDengue: 50 },
    { municipio: 'Manaus', dataPrevisao: '2026-09-22', temperaturaPrevista: 31.8, precipitacaoPrevista: 22.5, umidadePrevista: 85, riscoIncendio: 55, riscoDengue: 60 }
  ],
  'fortaleza': [
    { municipio: 'Fortaleza', dataPrevisao: '2026-09-20', temperaturaPrevista: 34.1, precipitacaoPrevista: 0.0, umidadePrevista: 22, riscoIncendio: 85, riscoDengue: 28 },
    { municipio: 'Fortaleza', dataPrevisao: '2026-09-21', temperaturaPrevista: 34.5, precipitacaoPrevista: 0.0, umidadePrevista: 20, riscoIncendio: 88, riscoDengue: 25 },
    { municipio: 'Fortaleza', dataPrevisao: '2026-09-22', temperaturaPrevista: 33.8, precipitacaoPrevista: 1.2, umidadePrevista: 25, riscoIncendio: 82, riscoDengue: 30 }
  ],
  'recife': [
    { municipio: 'Recife', dataPrevisao: '2026-09-20', temperaturaPrevista: 29.8, precipitacaoPrevista: 15.4, umidadePrevista: 82, riscoIncendio: 18, riscoDengue: 62 },
    { municipio: 'Recife', dataPrevisao: '2026-09-21', temperaturaPrevista: 30.2, precipitacaoPrevista: 10.0, umidadePrevista: 80, riscoIncendio: 22, riscoDengue: 65 },
    { municipio: 'Recife', dataPrevisao: '2026-09-22', temperaturaPrevista: 29.5, precipitacaoPrevista: 18.0, umidadePrevista: 84, riscoIncendio: 15, riscoDengue: 70 }
  ],
  'salvador': [
    { municipio: 'Salvador', dataPrevisao: '2026-09-20', temperaturaPrevista: 28.5, precipitacaoPrevista: 52.3, umidadePrevista: 88, riscoIncendio: 12, riscoDengue: 71 },
    { municipio: 'Salvador', dataPrevisao: '2026-09-21', temperaturaPrevista: 27.8, precipitacaoPrevista: 35.0, umidadePrevista: 86, riscoIncendio: 10, riscoDengue: 75 },
    { municipio: 'Salvador', dataPrevisao: '2026-09-22', temperaturaPrevista: 28.0, precipitacaoPrevista: 20.0, umidadePrevista: 82, riscoIncendio: 15, riscoDengue: 68 }
  ],
  'brasilia': [
    { municipio: 'Brasília', dataPrevisao: '2026-09-20', temperaturaPrevista: 38.2, precipitacaoPrevista: 0.0, umidadePrevista: 12, riscoIncendio: 91, riscoDengue: 15 },
    { municipio: 'Brasília', dataPrevisao: '2026-09-21', temperaturaPrevista: 38.7, precipitacaoPrevista: 0.0, umidadePrevista: 11, riscoIncendio: 94, riscoDengue: 12 },
    { municipio: 'Brasília', dataPrevisao: '2026-09-22', temperaturaPrevista: 37.5, precipitacaoPrevista: 0.0, umidadePrevista: 14, riscoIncendio: 89, riscoDengue: 18 }
  ],
  'belo horizonte': [
    { municipio: 'Belo Horizonte', dataPrevisao: '2026-09-20', temperaturaPrevista: 30.1, precipitacaoPrevista: 5.6, umidadePrevista: 45, riscoIncendio: 42, riscoDengue: 38 },
    { municipio: 'Belo Horizonte', dataPrevisao: '2026-09-21', temperaturaPrevista: 31.0, precipitacaoPrevista: 2.0, umidadePrevista: 42, riscoIncendio: 48, riscoDengue: 35 },
    { municipio: 'Belo Horizonte', dataPrevisao: '2026-09-22', temperaturaPrevista: 29.8, precipitacaoPrevista: 12.0, umidadePrevista: 55, riscoIncendio: 35, riscoDengue: 45 }
  ],
  'rio de janeiro': [
    { municipio: 'Rio de Janeiro', dataPrevisao: '2026-09-20', temperaturaPrevista: 31.8, precipitacaoPrevista: 45.2, umidadePrevista: 89, riscoIncendio: 22, riscoDengue: 78 },
    { municipio: 'Rio de Janeiro', dataPrevisao: '2026-09-21', temperaturaPrevista: 30.5, precipitacaoPrevista: 25.0, umidadePrevista: 85, riscoIncendio: 20, riscoDengue: 74 },
    { municipio: 'Rio de Janeiro', dataPrevisao: '2026-09-22', temperaturaPrevista: 32.0, precipitacaoPrevista: 10.0, umidadePrevista: 80, riscoIncendio: 28, riscoDengue: 70 }
  ],
  'sao paulo': [
    { municipio: 'São Paulo', dataPrevisao: '2026-09-20', temperaturaPrevista: 27.3, precipitacaoPrevista: 18.7, umidadePrevista: 68, riscoIncendio: 25, riscoDengue: 55 },
    { municipio: 'São Paulo', dataPrevisao: '2026-09-21', temperaturaPrevista: 28.0, precipitacaoPrevista: 8.0, umidadePrevista: 65, riscoIncendio: 30, riscoDengue: 52 },
    { municipio: 'São Paulo', dataPrevisao: '2026-09-22', temperaturaPrevista: 26.5, precipitacaoPrevista: 25.0, umidadePrevista: 75, riscoIncendio: 18, riscoDengue: 60 }
  ],
  'curitiba': [
    { municipio: 'Curitiba', dataPrevisao: '2026-09-20', temperaturaPrevista: 22.1, precipitacaoPrevista: 32.1, umidadePrevista: 72, riscoIncendio: 15, riscoDengue: 32 },
    { municipio: 'Curitiba', dataPrevisao: '2026-09-21', temperaturaPrevista: 21.5, precipitacaoPrevista: 18.0, umidadePrevista: 75, riscoIncendio: 12, riscoDengue: 30 },
    { municipio: 'Curitiba', dataPrevisao: '2026-09-22', temperaturaPrevista: 23.0, precipitacaoPrevista: 5.0, umidadePrevista: 68, riscoIncendio: 20, riscoDengue: 35 }
  ],
  'porto alegre': [
    { municipio: 'Porto Alegre', dataPrevisao: '2026-09-20', temperaturaPrevista: 24.6, precipitacaoPrevista: 28.9, umidadePrevista: 75, riscoIncendio: 20, riscoDengue: 40 },
    { municipio: 'Porto Alegre', dataPrevisao: '2026-09-21', temperaturaPrevista: 23.8, precipitacaoPrevista: 35.0, umidadePrevista: 82, riscoIncendio: 15, riscoDengue: 45 },
    { municipio: 'Porto Alegre', dataPrevisao: '2026-09-22', temperaturaPrevista: 25.2, precipitacaoPrevista: 12.0, umidadePrevista: 70, riscoIncendio: 25, riscoDengue: 38 }
  ]
};
