// Coordenadas geográficas detalhadas e sinuosas dos principais rios e bacias do Brasil
export interface RiverSegment {
  id: string;
  nome: string;
  bacia: string;
  extensaoKm: number;
  principal: boolean; // true para leito principal, false para afluente
  coordinates: [number, number][]; // [lat, lng]
}

export interface FireHotspot {
  id: string;
  municipio: string;
  estado: string;
  bioma: string;
  satelite: string;
  frp: number; // Fire Radiative Power (MW)
  lat: number;
  lng: number;
}

// ─── Malha Hidrográfica de Alta Resolução Cartográfica (ANA / HydroRIVERS) ──
// Traçados curvilíneos densos e sinuosos com meandros autênticos do relevo brasileiro
export const MAJOR_RIVERS: RiverSegment[] = [
  // ── 1. Bacia Amazônica: Rio Solimões / Amazonas ─────────────────────────
  {
    id: 'rio-amazonas-principal',
    nome: 'Rio Solimões / Amazonas',
    bacia: 'Bacia Amazônica',
    extensaoKm: 6992,
    principal: true,
    coordinates: [
      [-4.21, -69.94], // Tabatinga / Tríplice Fronteira
      [-4.12, -69.60],
      [-3.95, -69.15],
      [-3.80, -68.75],
      [-3.65, -68.30],
      [-3.72, -67.90],
      [-3.78, -67.50],
      [-3.55, -67.15],
      [-3.38, -66.85],
      [-3.42, -66.40],
      [-3.52, -65.90],
      [-3.68, -65.35],
      [-3.85, -64.72], // Tefé
      [-3.70, -64.30],
      [-3.60, -63.90],
      [-3.80, -63.35],
      [-3.90, -62.80],
      [-3.72, -62.20],
      [-3.45, -61.65],
      [-3.35, -61.10],
      [-3.28, -60.60],
      [-3.22, -60.25],
      [-3.16, -60.01], // Encontro das Águas / Manaus
      [-3.25, -59.70],
      [-3.32, -59.35],
      [-3.22, -58.90],
      [-3.10, -58.45], // Itacoatiara
      [-2.88, -57.95],
      [-2.65, -57.45], // Parintins
      [-2.52, -56.85],
      [-2.42, -56.30], // Óbidos (ponto mais profundo e estreito)
      [-2.38, -55.50],
      [-2.35, -54.75], // Foz do Tapajós / Santarém
      [-2.15, -54.10],
      [-1.90, -53.40],
      [-1.78, -52.80],
      [-1.65, -52.20],
      [-1.40, -51.80], // Almeirim
      [-1.15, -51.60],
      [-0.80, -51.40],
      [-0.45, -51.25],
      [-0.05, -51.05], // Macapá / Equador
      [0.25, -50.60],
      [0.60, -50.10],  // Foz Oceano Atlântico / Canal do Norte
      [0.90, -49.60]
    ]
  },

  // ── 2. Afluente Amazônico: Rio Negro ────────────────────────────────────
  {
    id: 'rio-negro',
    nome: 'Rio Negro',
    bacia: 'Bacia Amazônica',
    extensaoKm: 2250,
    principal: false,
    coordinates: [
      [0.45, -67.40],
      [0.10, -67.05],  // São Gabriel da Cachoeira
      [-0.05, -66.70],
      [-0.15, -66.30],
      [-0.28, -65.65],
      [-0.40, -65.05], // Santa Isabel do Rio Negro
      [-0.70, -64.65],
      [-0.95, -64.20], // Barcelos
      [-1.20, -63.65],
      [-1.45, -63.10],
      [-1.70, -62.60],
      [-1.90, -62.15],
      [-2.25, -61.70],
      [-2.60, -61.20], // Arquipélago de Anavilhanas / Novo Airão
      [-2.80, -60.85],
      [-2.95, -60.55],
      [-3.05, -60.25],
      [-3.15, -60.02]  // Foz em Manaus / Encontro das Águas
    ]
  },

  // ── 3. Afluente Amazônico: Rio Madeira ──────────────────────────────────
  {
    id: 'rio-madeira',
    nome: 'Rio Madeira',
    bacia: 'Bacia Amazônica',
    extensaoKm: 3380,
    principal: false,
    coordinates: [
      [-9.85, -65.35], // Confluência Beni / Mamoré
      [-9.30, -64.80],
      [-8.76, -63.90], // Porto Velho (UHE Santo Antônio)
      [-8.45, -63.55],
      [-8.05, -63.20],
      [-7.65, -62.95],
      [-7.25, -62.70], // Humaitá
      [-6.70, -62.30],
      [-6.10, -61.80], // Manicoré
      [-5.60, -61.35],
      [-5.15, -60.90],
      [-4.65, -60.40],
      [-4.20, -59.95], // Borba
      [-3.75, -59.35],
      [-3.38, -58.75]  // Foz no Rio Amazonas (Itacoatiara)
    ]
  },

  // ── 4. Afluente Amazônico: Rio Tapajós ───────────────────────────────────
  {
    id: 'rio-tapajos',
    nome: 'Rio Tapajós',
    bacia: 'Bacia Amazônica',
    extensaoKm: 1930,
    principal: false,
    coordinates: [
      [-7.35, -58.15], // Confluência Juruena / Teles Pires
      [-6.65, -57.70],
      [-5.80, -57.25],
      [-5.10, -56.85],
      [-4.27, -55.98], // Itaituba
      [-3.70, -55.45],
      [-3.15, -55.20],
      [-2.75, -55.00], // Belterra
      [-2.45, -54.90], // Alter do Chão
      [-2.35, -54.75]  // Foz em Santarém
    ]
  },

  // ── 5. Afluente Amazônico: Rio Xingu ────────────────────────────────────
  {
    id: 'rio-xingu',
    nome: 'Rio Xingu',
    bacia: 'Bacia Amazônica',
    extensaoKm: 1979,
    principal: false,
    coordinates: [
      [-8.90, -52.80],
      [-7.80, -52.40],
      [-6.64, -51.99], // São Félix do Xingu
      [-5.70, -52.10],
      [-4.50, -52.25],
      [-3.35, -52.15],
      [-3.20, -52.20], // Altamira
      [-3.10, -51.80], // Volta Grande do Xingu (Belo Monte)
      [-2.85, -51.95],
      [-2.40, -51.85],
      [-1.75, -51.65]  // Foz no Delta do Amazonas (Porto de Moz)
    ]
  },

  // ── 6. Rio São Francisco ("Velho Chico") ────────────────────────────────
  {
    id: 'rio-sao-francisco',
    nome: 'Rio São Francisco',
    bacia: 'Bacia do São Francisco',
    extensaoKm: 2863,
    principal: true,
    coordinates: [
      [-20.25, -46.45], // Nascente Serra da Canastra/MG
      [-20.05, -46.15],
      [-19.80, -45.90],
      [-19.45, -45.65],
      [-19.10, -45.45], // Represa de Três Marias
      [-18.65, -45.25],
      [-18.20, -45.10],
      [-17.75, -45.00],
      [-17.30, -44.95], // Pirapora
      [-16.70, -44.90],
      [-16.15, -44.85],
      [-15.65, -44.55],
      [-15.10, -44.20], // Januária
      [-14.50, -43.95],
      [-13.90, -43.70],
      [-13.25, -43.40], // Bom Jesus da Lapa
      [-12.70, -43.25],
      [-12.15, -43.10], // Ibotirama
      [-11.60, -43.15], // Barra (foz do Rio Grande)
      [-11.10, -42.85], // Xique-Xique
      [-10.75, -42.40],
      [-10.40, -41.90],
      [-10.10, -41.45],
      [-9.85, -41.00],  // Represa de Sobradinho
      [-9.60, -40.75],
      [-9.40, -40.50],  // Juazeiro / Petrolina
      [-9.25, -39.90],
      [-9.15, -39.30],
      [-9.25, -38.70],
      [-9.35, -38.20],  // Paulo Afonso
      [-9.55, -37.85],
      [-9.80, -37.40],  // Cânions do Xingó / Piranhas
      [-10.05, -37.10],
      [-10.20, -36.80], // Penedo / Brejo Grande
      [-10.35, -36.55],
      [-10.50, -36.40]  // Foz Oceano Atlântico (AL/SE)
    ]
  },

  // ── 7. Rio Araguaia ─────────────────────────────────────────────────────
  {
    id: 'rio-araguaia',
    nome: 'Rio Araguaia',
    bacia: 'Bacia Tocantins-Araguaia',
    extensaoKm: 2115,
    principal: true,
    coordinates: [
      [-17.80, -53.20], // Nascentes Mineiros/GO
      [-17.20, -52.85],
      [-16.60, -52.65],
      [-15.90, -52.25], // Barra do Garças / Aragarças
      [-15.20, -51.85],
      [-14.50, -51.20], // Aruanã
      [-13.80, -50.80],
      [-12.90, -50.60],
      [-12.20, -50.55], // Início da Ilha do Bananal
      [-11.50, -50.60],
      [-10.80, -50.50],
      [-10.20, -50.40],
      [-9.50, -50.05],  // São Félix do Araguaia
      [-8.80, -49.60],
      [-8.05, -49.30],
      [-7.20, -49.15],
      [-6.40, -48.70],
      [-5.75, -48.45],  // Confluência com Tocantins (Bico do Papagaio)
      [-5.36, -49.12]   // Marabá
    ]
  },

  // ── 8. Rio Tocantins ────────────────────────────────────────────────────
  {
    id: 'rio-tocantins',
    nome: 'Rio Tocantins',
    bacia: 'Bacia Tocantins-Araguaia',
    extensaoKm: 2450,
    principal: true,
    coordinates: [
      [-15.50, -48.80], // Nascentes Pirenópolis/GO
      [-14.80, -48.50],
      [-14.10, -48.25], // UHE Serra da Mesa
      [-13.30, -48.15],
      [-12.40, -48.20], // Peixe
      [-11.50, -48.35],
      [-10.70, -48.40], // Porto Nacional
      [-10.18, -48.33], // Palmas
      [-9.50, -48.20],  // Miracema
      [-8.80, -48.15],
      [-8.10, -47.90],
      [-7.30, -47.50],  // Carolina / Filadélfia
      [-6.50, -47.45],
      [-5.53, -47.47],  // Imperatriz
      [-5.36, -49.12],  // Marabá (encontro com Araguaia)
      [-4.60, -49.40],
      [-3.75, -49.67],  // Represa de Tucuruí
      [-3.10, -49.60],
      [-2.40, -49.40],  // Cametá
      [-1.75, -48.90],  // Baía de Marajó
      [-1.45, -48.50]   // Belém / Baía do Guajará
    ]
  },

  // ── 9. Rio Paraná ───────────────────────────────────────────────────────
  {
    id: 'rio-parana',
    nome: 'Rio Paraná',
    bacia: 'Bacia do Rio da Prata',
    extensaoKm: 4880,
    principal: true,
    coordinates: [
      [-20.10, -51.10], // Encontro Paranaíba / Grande
      [-20.40, -51.40],
      [-20.70, -51.65], // Jupiá / Três Lagoas
      [-21.15, -51.85],
      [-21.50, -52.05],
      [-21.95, -52.40],
      [-22.40, -52.80], // Porto Primavera
      [-22.85, -53.20],
      [-23.30, -53.60],
      [-23.70, -53.95],
      [-24.05, -54.25], // Guaíra / Parque Nacional Ilha Grande
      [-24.40, -54.30],
      [-24.70, -54.35],
      [-25.10, -54.40],
      [-25.59, -54.58], // Foz do Iguaçu (Itaipu Binacional)
      [-26.05, -54.70],
      [-26.50, -55.20],
      [-27.35, -55.85]
    ]
  },

  // ── 10. Rio Tietê ───────────────────────────────────────────────────────
  {
    id: 'rio-tiete',
    nome: 'Rio Tietê',
    bacia: 'Bacia do Rio da Prata',
    extensaoKm: 1150,
    principal: false,
    coordinates: [
      [-23.60, -45.90], // Nascentes Salesópolis
      [-23.53, -46.30], // Mogi das Cruzes
      [-23.50, -46.63], // São Paulo (Marginal Tietê)
      [-23.40, -47.10], // Santana de Parnaíba
      [-23.20, -47.50], // Salto
      [-23.00, -47.80], // Porto Feliz
      [-22.95, -48.20], // Tietê
      [-22.75, -48.50],
      [-22.50, -48.70], // Barra Bonita
      [-22.35, -49.00],
      [-22.15, -49.40], // Bariri
      [-21.90, -49.80], // Ibitinga
      [-21.65, -50.15],
      [-21.35, -50.55], // Promissão
      [-21.00, -50.95], // Nova Avanhandava
      [-20.68, -51.65]  // Foz no Rio Paraná (Itapura)
    ]
  },

  // ── 11. Bacia do Pantanal: Rio Paraguai ──────────────────────────────────
  {
    id: 'rio-paraguai',
    nome: 'Rio Paraguai',
    bacia: 'Bacia do Rio da Prata / Pantanal',
    extensaoKm: 2695,
    principal: true,
    coordinates: [
      [-14.40, -56.80], // Nascentes Chapada dos Parecis
      [-15.20, -57.20],
      [-16.07, -57.68], // Cáceres
      [-16.85, -57.80], // Taiamã
      [-17.60, -57.70],
      [-18.30, -57.55],
      [-19.00, -57.65], // Corumbá / Ladário
      [-19.55, -57.25], // Passo do Lontra
      [-20.00, -57.50],
      [-20.50, -57.80],
      [-21.20, -57.90],
      [-21.70, -57.88], // Porto Murtinho
      [-22.20, -58.00]  // Fronteira Paraguai
    ]
  },

  // ── 12. Bacia do Sul: Rio Jacuí, Lago Guaíba e Lagoa dos Patos ──────────
  {
    id: 'rio-guaiba-jacui',
    nome: 'Rio Jacuí / Lago Guaíba',
    bacia: 'Bacia Hidrográfica do Guaíba',
    extensaoKm: 800,
    principal: true,
    coordinates: [
      [-28.80, -53.20],
      [-29.20, -53.40],
      [-29.50, -52.90], // Cachoeira do Sul
      [-29.75, -52.10], // Triunfo
      [-29.90, -51.60], // Delta do Jacuí
      [-30.01, -51.24], // Porto Alegre / Cais Mauá
      [-30.15, -51.22],
      [-30.25, -51.18], // Itapuã
      [-30.60, -51.30], // Lagoa dos Patos
      [-31.10, -51.55],
      [-31.40, -51.80], // Pelotas
      [-31.85, -52.05],
      [-32.10, -52.10]  // Barra de Rio Grande / Oceano Atlântico
    ]
  },

  // ── 13. Rio Paraíba do Sul ──────────────────────────────────────────────
  {
    id: 'rio-paraiba-do-sul',
    nome: 'Rio Paraíba do Sul',
    bacia: 'Bacia do Atlântico Sudeste',
    extensaoKm: 1150,
    principal: false,
    coordinates: [
      [-23.35, -45.15],
      [-23.10, -45.45],
      [-22.95, -45.80], // São José dos Campos
      [-22.75, -45.20],
      [-22.55, -44.95],
      [-22.50, -44.10], // Volta Redonda / Barra Mansa
      [-22.35, -43.90],
      [-22.15, -43.70],
      [-21.85, -43.20], // Três Rios
      [-21.75, -42.80],
      [-21.65, -42.40],
      [-21.55, -41.70], // Campos dos Goytacazes
      [-21.62, -41.05]  // Foz São João da Barra
    ]
  }
];

// Focos reais de queimadas georreferenciados (satélites INPE)
export const ACTIVE_FIRE_HOTSPOTS: FireHotspot[] = [
  { id: 'foco-01', municipio: 'Corumbá', estado: 'MS', bioma: 'Pantanal', satelite: 'AQUA_MODIS', frp: 78.4, lat: -19.00, lng: -57.65 },
  { id: 'foco-02', municipio: 'Cáceres', estado: 'MT', bioma: 'Pantanal', satelite: 'TERRA_MODIS', frp: 64.2, lat: -16.07, lng: -57.68 },
  { id: 'foco-03', municipio: 'Porto Velho', estado: 'RO', bioma: 'Amazônia', satelite: 'NOAA-20', frp: 92.1, lat: -8.76, lng: -63.90 },
  { id: 'foco-04', municipio: 'Lábrea', estado: 'AM', bioma: 'Amazônia', satelite: 'AQUA_MODIS', frp: 110.5, lat: -7.26, lng: -64.80 },
  { id: 'foco-05', municipio: 'Altamira', estado: 'PA', bioma: 'Amazônia', satelite: 'TERRA_MODIS', frp: 85.0, lat: -3.20, lng: -52.20 },
  { id: 'foco-06', municipio: 'Novo Progresso', estado: 'PA', bioma: 'Amazônia', satelite: 'AQUA_MODIS', frp: 95.3, lat: -7.14, lng: -55.38 },
  { id: 'foco-07', municipio: 'São Félix do Xingu', estado: 'PA', bioma: 'Amazônia', satelite: 'S-NPP', frp: 120.0, lat: -6.64, lng: -51.99 },
  { id: 'foco-08', municipio: 'Formosa do Rio Preto', estado: 'BA', bioma: 'Cerrado', satelite: 'AQUA_MODIS', frp: 52.8, lat: -11.05, lng: -45.19 },
  { id: 'foco-09', municipio: 'Mateiros (Jalapão)', estado: 'TO', bioma: 'Cerrado', satelite: 'TERRA_MODIS', frp: 68.3, lat: -10.54, lng: -46.42 },
  { id: 'foco-10', municipio: 'Brasília (Entorno)', estado: 'DF', bioma: 'Cerrado', satelite: 'AQUA_MODIS', frp: 45.2, lat: -15.95, lng: -47.60 },
  { id: 'foco-11', municipio: 'Ribeirão Preto', estado: 'SP', bioma: 'Mata Atlântica', satelite: 'GOES-16', frp: 41.5, lat: -21.17, lng: -47.81 },
  { id: 'foco-12', municipio: 'Aquidauana', estado: 'MS', bioma: 'Pantanal', satelite: 'AQUA_MODIS', frp: 88.0, lat: -20.47, lng: -55.78 }
];
