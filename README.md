# EcoWatch Brasil — Frontend

> **Observatório Ambiental Operacional** — Monitoramento geoespacial e telemetria ambiental em tempo real para 10 capitais brasileiras.

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)](https://ecowatchbrasil.live)
[![GitHub Pages](https://img.shields.io/badge/github-pages-222?logo=github)](https://ericklevy.github.io/ecowatch-front/)
[![React](https://img.shields.io/badge/react-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.6-3178c6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/vite-6-646cff?logo=vite)](https://vitejs.dev)

---

## 🌐 Demo ao Vivo

| Ambiente | URL |
|---|---|
| **Produção (Domínio Próprio)** | [https://ecowatchbrasil.live](https://ecowatchbrasil.live) |
| **GitHub Pages** | [https://ericklevy.github.io/ecowatch-front](https://ericklevy.github.io/ecowatch-front) |

---

## 🔗 Repositório do Backend

> Este frontend **consome diretamente** os endpoints REST dos microsserviços do backend EcoWatch Brasil.

**👉 [github.com/Ericklevy/ecowatch-brasil](https://github.com/Ericklevy/ecowatch-brasil)**

O backend é uma arquitetura de microsserviços em **Java 21 + Spring Boot 3** com pipeline de ingestão de dados via **Apache Kafka**, cache em **Redis (Upstash)** e persistência em **PostgreSQL (Supabase)**. Os dados climáticos, fluviométricos e de qualidade do ar são coletados automaticamente a cada hora das seguintes fontes oficiais:

| Fonte | Dados |
|---|---|
| **NASA POWER** | Temperatura, Radiação Solar, Umidade |
| **Open-Meteo** | Clima Base + Qualidade do Ar (PM2.5, PM10) |
| **INPE BDQueimadas** | Focos de Incêndio (Satélites MODIS/GOES-16) |
| **ANA HidroWeb** | Cotas Fluviométricas (Nível dos Rios em metros) |
| **CEMADEN** | Alertas de Enxurrada e Deslizamentos |

### Endpoints Consumidos

```
GET http://localhost:8086/api/dashboard/{municipio}   → DashboardDTO (alertas + previsões)
GET http://localhost:8081/api/cache/{municipio}       → WeatherReading (leitura mais recente)
POST http://localhost:8083/api/scheduler/trigger      → Forçar ingestão manual de telemetria
```

---

## 📸 Telas da Aplicação

### Apresentação e Manifesto Técnico
Página inicial explicando a plataforma, as 5 fontes de dados oficiais, a arquitetura de microsserviços e a rede das 10 capitais monitoradas.

### Aba 1 — Console Cartográfico com Mapa Interativo
Mapa real do Brasil com tiles **ESRI World Dark Gray Canvas** (sem API key), zoom e pan fluidos. As 10 capitais são representadas por marcadores georreferenciados com indicadores de status semântico em tempo real:
- 🔴 **Crítico** (pulso animado) — Ex: Manaus com Rio Negro em cota de alerta
- 🟡 **Atenção** — Ex: Porto Alegre com Guaíba se aproximando da cota
- 🟢 **Nominal** — Operação estável

Ao clicar em qualquer capital, abre o **painel de telemetria** (Drawer lateral no desktop / Bottom Sheet no celular) com:
- Cota hídrica do rio da ANA (barra de progresso até cota de emergência)
- Clima em tempo real (temperatura, umidade, chuva acumulada)
- Qualidade do ar (PM2.5 e PM10 vs padrão CONAMA)
- Focos de queimadas ativos (INPE MODIS)
- Histórico recente de alertas da capital selecionada
- Exportação de boletim operacional em JSON

### Aba 2 — Matriz Geral de Alertas
Tabela técnica densa com os 10 tipos de alerta gerados pelo `alert-service` do backend:
`RIVER_FLOOD`, `FOREST_FIRE`, `CRITICAL_FIRE_RISK`, `POOR_AIR_QUALITY`, `EXTREME_HEAT`, `EXTREME_RAIN`, `FLASH_FLOOD`, `DROUGHT_RISK`, `DENGUE_OUTBREAK_RISK`, `FIRE_NEAR_URBAN_AREA`

Filtros por tipo de evento, busca textual e seletor por capital monitorada.

### Aba 3 — Comparativo de Previsões e Riscos (Próximos 3 Dias)
Matriz comparativa das 10 capitais com os dados do `analytics-service`:
- Temperatura prevista (°C), Precipitação (mm), Umidade (%)
- **Score de Risco de Incêndio (0–100)** com escala semântica de cores
- **Score de Risco de Dengue (0–100)** com escala semântica de cores
- Cards de destaque: Capital com maior risco de incêndio, maior risco de dengue e maior precipitação prevista
- Expandir linha para ver projeção dia a dia (D+1, D+2, D+3)

---

## 🏗️ Arquitetura do Frontend

```
ecowatch-front/
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   └── LandingPage.tsx        # Apresentação e manifesto técnico
│   │   ├── layout/
│   │   │   ├── TopBar.tsx             # Barra de navegação global (3 abas)
│   │   │   └── StatusBar.tsx          # Rodapé técnico com fontes de dados
│   │   ├── map/
│   │   │   ├── BrazilMap.tsx          # Mapa Leaflet com ESRI Dark Canvas
│   │   │   └── TelemetryDrawer.tsx    # Painel/Bottom-Sheet de telemetria
│   │   ├── alerts/
│   │   │   └── AlertsView.tsx         # Tabela com filtros de alertas
│   │   └── forecast/
│   │       └── ForecastView.tsx       # Matriz de previsões e riscos
│   ├── data/
│   │   └── mockData.ts                # Dados de fallback para dev offline
│   ├── services/
│   │   └── api.ts                     # Client HTTP + resiliência com fallback
│   ├── types/
│   │   └── index.ts                   # Interfaces TypeScript (espelham os DTOs Java)
│   ├── App.tsx                        # Orquestrador de views (landing ↔ console)
│   ├── main.tsx                       # Entry point React
│   └── index.css                      # Tailwind + estilos globais do Leaflet
├── DESIGN.md                          # Sistema visual anti-AI slop (tokens de cor e tipo)
├── tailwind.config.js                 # Tokens semânticos de telemetria
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 Sistema Visual — Anti-AI Slop

O design segue o manifesto documentado em [`DESIGN.md`](./DESIGN.md). As regras principais:

- ❌ Sem gradientes roxos/azuis genéricos
- ❌ Sem `rounded-3xl` ou botões pílula em containers de dados
- ❌ Sem emojis como ícones (apenas iconografia vetorial Lucide em 1.5px)
- ❌ Sem métricas inventadas — todos os valores são grandezas físicas reais
- ✅ Tipografia dupla: `Inter` para UI + `JetBrains Mono` para dados tabulares, coordenadas GPS e carimbos UTC
- ✅ Paleta escura técnica de alta densidade informacional

| Token | Cor | Uso |
|---|---|---|
| `surface-base` | `#090d16` | Canvas principal |
| `surface-panel` | `#0e1422` | Painéis laterais e TopBar |
| `surface-card` | `#131b2c` | Cards e módulos de dados |
| `hydro` | `#38bdf8` | Rios, bacias e camadas hídricas |
| `nominal` | `#10b981` | Status operacional normal |
| `warning` | `#f59e0b` | Cota de alerta, anomalia moderada |
| `critical` | `#ef4444` | Queimada confirmada, risco extremo |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 20+
- Backend do EcoWatch rodando (opcional — o frontend possui fallback offline completo)

### Instalação

```bash
git clone https://github.com/Ericklevy/ecowatch-front.git
cd ecowatch-front
npm install
npm run dev
```

Acesse: **http://localhost:5173**

### Build de Produção

```bash
npm run build
```

Os arquivos são gerados na pasta `dist/` prontos para qualquer servidor estático (Vercel, GitHub Pages, Nginx, etc).

---

## 🗺️ Cidades Monitoradas

| Capital | UF | Região | Bioma | Rio Monitorado (ANA) |
|---|---|---|---|---|
| Manaus | AM | Norte | Amazônia | Rio Negro |
| Fortaleza | CE | Nordeste | Caatinga | Rio Cocó |
| Recife | PE | Nordeste | Mata Atlântica | Rio Capibaribe |
| Salvador | BA | Nordeste | Mata Atlântica | Rio das Tripas |
| Brasília | DF | Centro-Oeste | Cerrado | — |
| Belo Horizonte | MG | Sudeste | Cerrado / Mata Atlântica | — |
| Rio de Janeiro | RJ | Sudeste | Mata Atlântica | — |
| São Paulo | SP | Sudeste | Mata Atlântica | — |
| Curitiba | PR | Sul | Mata Atlântica | — |
| Porto Alegre | RS | Sul | Pampa | Lago Guaíba |

---

## 🔗 Links Relacionados

- 🌍 **Site ao Vivo:** [ecowatchbrasil.live](https://ecowatchbrasil.live)
- ⚙️ **Backend (Microsserviços Java):** [github.com/Ericklevy/ecowatch-brasil](https://github.com/Ericklevy/ecowatch-brasil)
- 🎨 **Design System no Stitch:** Projeto `EcoWatch Brasil - Frontend` (ID: `11908236725091041433`)

---

## 📄 Licença

MIT © 2026 Erick Levy
