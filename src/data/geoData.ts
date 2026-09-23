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

// Traçados curvilíneos e sinuosos dos rios com curvas reais de relevo
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
      [-3.95, -69.15],
      [-3.65, -68.30],
      [-3.78, -67.50],
      [-3.38, -66.85],
      [-3.52, -65.90],
      [-3.85, -64.72], // Tefé
      [-3.60, -63.90],
      [-3.90, -62.80],
      [-3.45, -61.65],
      [-3.28, -60.60],
      [-3.16, -60.01], // Encontro das Águas / Manaus
      [-3.32, -59.35],
      [-3.10, -58.45], // Itacoatiara
      [-2.65, -57.45], // Parintins
      [-2.42, -56.30], // Óbidos
      [-2.35, -54.75], // Santarém
      [-1.90, -53.40],
      [-1.65, -52.20],
      [-1.40, -51.80], // Almeirim
      [-0.80, -51.40],
      [-0.05, -51.05], // Macapá / Linha do Equador
      [0.60, -50.10]   // Foz Oceano Atlântico
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
      [0.10, -67.05],  // São Gabriel da Cachoeira
      [-0.15, -66.30],
      [-0.40, -65.05],
      [-0.95, -64.20], // Barcelos
      [-1.45, -63.10],
      [-1.90, -62.15],
      [-2.60, -61.20], // Novo Airão
      [-2.95, -60.55],
      [-3.15, -60.02]  // Foz em Manaus
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
      [-8.76, -63.90], // Porto Velho
      [-8.05, -63.20],
      [-7.25, -62.70],
      [-6.10, -61.80],
      [-5.15, -60.90],
      [-4.20, -59.95],
      [-3.38, -58.75]  // Foz no Amazonas
    ]
  },
  // ── 4. Rio São Francisco ("Velho Chico") ────────────────────────────────
  {
    id: 'rio-sao-francisco',
    nome: 'Rio São Francisco',
    bacia: 'Bacia do São Francisco',
    extensaoKm: 2863,
    principal: true,
    coordinates: [
      [-20.25, -46.45], // Serra da Canastra/MG
      [-19.80, -45.90],
      [-19.10, -45.45],
      [-18.20, -45.10],
      [-17.30, -44.95], // Pirapora
      [-16.15, -44.85],
      [-15.10, -44.20], // Januária
      [-13.90, -43.70],
      [-13.25, -43.40], // Bom Jesus da Lapa
      [-12.15, -43.10],
      [-11.10, -42.85], // Xique-Xique
      [-10.40, -41.90],
      [-9.85, -41.00],  // Sobradinho
      [-9.40, -40.50],  // Juazeiro / Petrolina
      [-9.15, -39.30],
      [-9.35, -38.20],  // Paulo Afonso
      [-9.80, -37.40],
      [-10.20, -36.80], // Penedo / Brejo Grande
      [-10.50, -36.40]  // Foz Atlântico AL/SE
    ]
  },
  // ── 5. Bacia do Paraná: Rio Tietê & Rio Paraná ──────────────────────────
  {
    id: 'rio-tiete',
    nome: 'Rio Tietê',
    bacia: 'Bacia do Rio da Prata',
    extensaoKm: 1150,
    principal: false,
    coordinates: [
      [-23.60, -45.90], // Salesópolis
      [-23.53, -46.30], // Mogi das Cruzes
      [-23.50, -46.63], // São Paulo Marginal
      [-23.40, -47.10], // Santana de Parnaíba
      [-23.20, -47.50], // Salto
      [-22.95, -48.20],
      [-22.50, -48.70], // Barra Bonita
      [-22.15, -49.40],
      [-21.65, -50.15],
      [-21.00, -50.95],
      [-20.68, -51.65]  // Foz no Rio Paraná
    ]
  },
  {
    id: 'rio-parana',
    nome: 'Rio Paraná',
    bacia: 'Bacia do Rio da Prata',
    extensaoKm: 4880,
    principal: true,
    coordinates: [
      [-20.10, -51.10], // Encontro Paranaíba/Grande
      [-20.70, -51.65],
      [-21.50, -52.05],
      [-22.40, -52.80], // Porto Primavera
      [-23.30, -53.60],
      [-24.05, -54.25], // Guaíra / Ilha Grande
      [-24.70, -54.35],
      [-25.59, -54.58], // Foz do Iguaçu (Itaipu)
      [-26.50, -55.20],
      [-27.35, -55.85]
    ]
  },
  // ── 6. Rio Tocantins & Araguaia ─────────────────────────────────────────
  {
    id: 'rio-tocantins-araguaia',
    nome: 'Rio Araguaia / Tocantins',
    bacia: 'Bacia Tocantins-Araguaia',
    extensaoKm: 2600,
    principal: true,
    coordinates: [
      [-17.80, -53.20], // Nascentes GO
      [-16.20, -52.50],
      [-14.80, -51.80],
      [-13.40, -51.10],
      [-11.50, -50.60], // Ilha do Bananal
      [-9.80, -49.90],
      [-7.80, -48.80],
      [-6.20, -48.40],
      [-5.36, -49.12], // Marabá
      [-3.75, -49.67], // Represa de Tucuruí
      [-2.40, -49.40],
      [-1.75, -48.90], // Foz Baía de Marajó
      [-1.40, -48.50]  // Belém
    ]
  },
  // ── 7. Bacia do Sul: Rio Jacuí e Lago Guaíba ────────────────────────────
  {
    id: 'rio-guaiba-jacui',
    nome: 'Rio Jacuí / Lago Guaíba',
    bacia: 'Bacia Hidrográfica do Guaíba',
    extensaoKm: 800,
    principal: true,
    coordinates: [
      [-29.20, -53.40],
      [-29.50, -52.90],
      [-29.75, -52.10],
      [-29.90, -51.60],
      [-30.01, -51.24], // Porto Alegre / Cais Mauá
      [-30.25, -51.18],
      [-30.60, -51.30], // Lagoa dos Patos
      [-31.40, -51.80],
      [-32.10, -52.10]  // Foz Rio Grande / Oceano
    ]
  },
  // ── 8. Rio Paraíba do Sul ───────────────────────────────────────────────
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
      [-22.55, -44.95],
      [-22.50, -44.10], // Volta Redonda
      [-22.15, -43.70],
      [-21.85, -43.20], // Três Rios
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
