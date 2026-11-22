import { NewsItem } from '../types';

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-df-01',
    titulo: 'Incêndio florestal atinge vegetação no Gama e mobiliza Corpo de Bombeiros no DF',
    resumo: 'Focos de calor avançaram rapidamente devido à baixa umidade do ar (12%) e rajadas de vento na região administrativa do Gama. Equipes atuam em combate com apoio aéreo.',
    fonte: 'G1 Distrito Federal / CBMDF',
    url: 'https://g1.globo.com/df/distrito-federal/noticia/2024/09/04/incendio-florestal-atinge-vegetacao-no-gama-e-mobiliza-corpo-de-bombeiros-no-df.ghtml',
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
    url: 'https://agenciabrasil.ebc.com.br/geral/noticia/2024-09/cuiaba-registra-temperatura-superior-41oc-e-alerta-vermelho',
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
    url: 'https://agenciabrasil.ebc.com.br/geral/noticia/2024-08/porto-velho-e-capitais-do-norte-enfrentam-dias-criticos-de-qualidade-do-ar',
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
    url: 'https://agenciabrasil.ebc.com.br/geral/noticia/2024-04/defesa-civil-emite-alerta-para-chuvas-intensas-em-salvador',
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
    url: 'https://agenciabrasil.ebc.com.br/geral/noticia/2024-05/guaiba-alcanca-cota-historica-e-inunda-porto-alegre',
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
    url: 'https://agenciabrasil.ebc.com.br/saude/noticia/2024-03/ministerio-da-saude-intensifica-vigilancia-contra-dengue',
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
    url: 'https://agenciabrasil.ebc.com.br/geral/noticia/2024-06/bacia-do-rio-capibaribe-opera-em-nivel-de-atencao-em-recife',
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
    url: 'https://agenciabrasil.ebc.com.br/geral/noticia/2024-09/defesa-civil-alerta-para-umidade-critica-em-sao-paulo',
    dataHora: '2026-10-11T14:10:00Z',
    categoria: 'GENERAL',
    municipio: 'São Paulo',
    estado: 'SP'
  },
  {
    id: 'news-am-09',
    titulo: 'DETER/INPE aponta pressão agropecuária em áreas de amortecimento na Amazônia',
    resumo: 'Imagens orbitais dos satélites CBERS e Sentinel mostram avanço sobre o bioma amazônico em áreas próximas a Unidades de Conservação e Terras Indígenas no sul do estado.',
    fonte: 'Agência Brasil / INPE',
    url: 'https://agenciabrasil.ebc.com.br/meio-ambiente/noticia/2024-08/deter-aponta-pressao-sobre-areas-de-preservacao-na-amazonia',
    dataHora: '2026-10-14T08:00:00Z',
    categoria: 'DEFORESTATION',
    municipio: 'Manaus',
    estado: 'AM'
  },
  {
    id: 'news-pa-10',
    titulo: 'Operação integrada combate desmatamento ilegal e apreende maquinário pesado no Pará',
    resumo: 'Ação com apoio de imagens de radar do Censipam identificou polígonos de corte raso na floresta nativa. Frentes de fiscalização mantêm vigilância contínua.',
    fonte: 'Agência Gov / IBAMA',
    url: 'https://agenciabrasil.ebc.com.br/meio-ambiente/noticia/2024-09/operacao-combate-desmatamento-ilegal-no-para',
    dataHora: '2026-10-13T17:20:00Z',
    categoria: 'DEFORESTATION',
    municipio: 'Belém',
    estado: 'PA'
  }
];
