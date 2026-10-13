import { NewsItem } from '../types';

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-df-01',
    titulo: 'Incêndio florestal atinge vegetação no Gama e mobiliza Corpo de Bombeiros no DF',
    resumo: 'Focos de calor avançaram rapidamente devido à baixa umidade do ar (12%) e rajadas de vento na região administrativa do Gama. Equipes atuam em combate com apoio aéreo.',
    fonte: 'G1 Distrito Federal / CBMDF',
    url: 'https://g1.globo.com/df/distrito-federal/',
    dataHora: '2026-10-13T14:30:00Z',
    categoria: 'FIRE',
    municipio: 'Brasília',
    estado: 'DF'
  },
  {
    id: 'news-mt-02',
    titulo: 'Cuiabá registra temperatura superior a 41°C e alerta vermelho para incêndios no Pantanal',
    resumo: 'Satélites de referência do INPE detectaram aumento de focos de queimada na borda norte do Pantanal e proximidades da capital mato-grossense.',
    fonte: 'Agência Brasil / INPE',
    url: 'https://agenciabrasil.ebc.com.br/meio-ambiente',
    dataHora: '2026-10-13T12:15:00Z',
    categoria: 'FIRE',
    municipio: 'Cuiabá',
    estado: 'MT'
  },
  {
    id: 'news-ro-03',
    titulo: 'Porto Velho e capitais do Norte enfrentam dias críticos de qualidade do ar por fuligem',
    resumo: 'Índices de material particulado fino (PM2.5) ultrapassam 120 µg/m³, muito acima do limite seguro recomendado pela OMS e CONAMA.',
    fonte: 'Defesa Civil de Rondônia',
    url: 'https://agenciabrasil.ebc.com.br/meio-ambiente',
    dataHora: '2026-10-13T09:40:00Z',
    categoria: 'FIRE',
    municipio: 'Porto Velho',
    estado: 'RO'
  },
  {
    id: 'news-ba-04',
    titulo: 'Defesa Civil emite alerta para pancadas de chuva torrencial e risco de alagamento em Salvador',
    resumo: 'Acumulado pluviométrico pode superar 50 mm em 24h em áreas de encosta e bacias costeiras da capital baiana. Sirenes preventivas em prontidão.',
    fonte: 'Codesal / CEMADEN',
    url: 'https://www.gov.br/mdr/pt-br/assuntos/protecao-e-defesa-civil',
    dataHora: '2026-10-12T19:00:00Z',
    categoria: 'RAIN',
    municipio: 'Salvador',
    estado: 'BA'
  },
  {
    id: 'news-rs-05',
    titulo: 'Monitoramento do Guaíba aponta estabilização das cotas fluviométricas em Porto Alegre',
    resumo: 'Estações telemétricas da ANA mostram nível da água abaixo da cota de alerta após recuo das vazões dos afluentes Jacuí e Taquari.',
    fonte: 'ANA HidroWeb / SEMA-RS',
    url: 'https://www.gov.br/ana/pt-br',
    dataHora: '2026-10-12T16:20:00Z',
    categoria: 'FLOOD',
    municipio: 'Porto Alegre',
    estado: 'RS'
  },
  {
    id: 'news-rj-06',
    titulo: 'Ministério da Saúde intensifica vigilância contra Dengue após calor e chuvas intermitentes no Sudeste',
    resumo: 'Combinação de calor acima de 30°C e água parada acelera o ciclo reprodutivo do Aedes aegypti. Municípios fluminenses reforçam fumacê e vistorias.',
    fonte: 'InfoDengue / Fiocruz',
    url: 'https://info.dengue.mat.br/',
    dataHora: '2026-10-12T11:00:00Z',
    categoria: 'DENGUE',
    municipio: 'Rio de Janeiro',
    estado: 'RJ'
  },
  {
    id: 'news-pe-07',
    titulo: 'Bacia do Rio Capibaribe opera em nível de atenção com chuvas na Zona da Mata',
    resumo: 'Apac e Defesa Civil monitoram pontos baixos no Recife. Sistema de telemetria fluvial indica calha com 68% de capacidade.',
    fonte: 'APAC Pernambuco',
    url: 'https://www.gov.br/mdr/pt-br/assuntos/protecao-e-defesa-civil',
    dataHora: '2026-10-11T18:45:00Z',
    categoria: 'FLOOD',
    municipio: 'Recife',
    estado: 'PE'
  },
  {
    id: 'news-sp-08',
    titulo: 'Defesa Civil do Estado de SP alerta para umidade do ar abaixo de 20% no interior e capital',
    resumo: 'Tempo seco extremo aumenta incidência de problemas respiratórios e queima de vegetação às margens de rodovias.',
    fonte: 'Defesa Civil SP',
    url: 'https://www.defesacivil.sp.gov.br/',
    dataHora: '2026-10-11T14:10:00Z',
    categoria: 'GENERAL',
    municipio: 'São Paulo',
    estado: 'SP'
  }
];
