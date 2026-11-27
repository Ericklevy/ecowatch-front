# EcoWatch Brasil — Frontend

> **Observatório Ambiental Operacional** — Monitoramento geoespacial e telemetria ambiental em tempo real para 10 capitais brasileiras.

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)](https://ecowatchbrasil.live)
[![React](https://img.shields.io/badge/react-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.6-3178c6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/vite-6-646cff?logo=vite)](https://vitejs.dev)

---

## 🌐 Demo ao Vivo

| Ambiente | URL |
|---|---|
| **Produção** | [https://ecowatchbrasil.live](https://ecowatchbrasil.live) |

---

## 🔗 Repositório do Backend

> Este frontend **consome diretamente** os endpoints REST dos microsserviços do backend EcoWatch Brasil.

**👉 [github.com/Ericklevy/ecowatch-brasil](https://github.com/Ericklevy/ecowatch-brasil)**

O backend é uma arquitetura de microsserviços em **Java 21 + Spring Boot 3** com pipeline de ingestão de dados via **Apache Kafka**, cache em **Redis (Upstash)** e persistência em **PostgreSQL (Supabase)**. Os dados climáticos, fluviométricos e de qualidade do ar são coletados automaticamente a cada hora das seguintes fontes oficiais:

| Fonte | Dados |
|---|---|
| **Open-Meteo / Copernicus CAMS** | Clima Base em Tempo Real (`@Primary`), Qualidade do Ar (PM2.5, PM10) e Gases de Efeito Estufa (CH₄, CO₂, CO) |
| **NASA POWER** | Fallback climatológico (Temperatura, Radiação Solar, Umidade) |
| **INPE BDQueimadas** | Focos de Incêndio (Satélites MODIS/GOES-16) |
| **ANA HidroWeb** | Cotas Fluviométricas (Nível dos Rios em metros) |
| **CEMADEN** | Alertas de Enxurrada e Deslizamentos |
| **SEEG 14.0 (Observatório do Clima)** | Inventário Histórico Municipal de Emissões de Gases de Efeito Estufa (2019–2023) |
| **Climate TRACE v6** | Maiores Ativos e Instalações Emissoras Georreferenciadas no Brasil |

### Endpoints Consumidos

```
GET  /api/dashboard/{municipio}       → DashboardDTO (alertas reais + previsões consolidadas)
GET  /api/cache/{municipio}           → WeatherReading (leitura fresca em cache Redis)
GET  /api/emissoes/ranking            → Ranking municipal de emissões SEEG (por gás e UF)
GET  /api/emissoes/estados            → Total de emissões consolidadas por UF
GET  /api/emissoes/municipio/{nome}   → Série histórica e quebra setorial de emissões
GET  /api/emissoes/fontes             → Top instalações emissoras Climate TRACE
POST /api/v1/ai/ask                   → Assistente IA (Gota) RAG com contexto integrado
POST /api/scheduler/trigger           → Forçar ingestão de telemetria nos satélites
POST /api/scheduler/trigger/{cidade}  → Coleta sob demanda para uma capital específica
```

---

## 🏛️ Arquitetura Híbrida & Decisões de Engenharia (FinOps & Resiliência)

O projeto adota um modelo arquitetural moderno focado em **eficiência de custos em nuvem (FinOps)** e **alta disponibilidade (Graceful Degradation)**:

```
[ Usuário no Navegador (ecowatchbrasil.live) ]
      │
      ├── 1. Telemetria e Camadas Visuais (Edge / Client)
      │      ├── Open-Meteo API (Temperatura, Umidade, Vento, Chuva, PM2.5) -> R$ 0,00
      │      ├── ESRI World Dark Gray (Tiles de mapa geoespacial)           -> R$ 0,00
      │      └── Camadas WMS (ANA HidroWeb & INPE BDQueimadas)              -> R$ 0,00
      │
      └── 2. Inteligência e Persistência (Backend Azure Container Apps)
             ├── Data Ingestion Service (Coleta sob demanda e gatilho de satélites)
             ├── Apache Kafka (Streaming distribuído de eventos de telemetria)
             ├── Alert Service (Motor de regras de risco: enchente, seca, calor, fogo)
             ├── Upstash Redis (Cache de leituras e dashboards com latência < 5ms)
             ├── Supabase PostgreSQL (Histórico oficial e auditoria de incidentes)
             └── Read Model Service (Consultas consolidadas padrão CQRS)
```

### Por que essa divisão de papéis?
1. **FinOps (Economia Inteligente de Nuvem):** O backend roda em **Azure Container Apps** com *scale-to-zero* (`minReplicas = 0`) e imagens hospedadas gratuitamente no **GitHub Container Registry (`ghcr.io`)**, operando a **R$ 0,00/mês**. Além disso, o frontend aproveita o cache oficial do Redis por até **8 horas** (alinhado aos ciclos de ingestão 3x/dia), evitando requisições redundantes e bloqueios `429`.
2. **Autoridade Central de Dados:** O Backend em Java/Spring Boot permanece como a autoridade máxima para **auditoria, regras críticas de desastre, persistência histórica e mensageria assíncrona**, sincronizando o clima em tempo real via Open-Meteo como fonte primária.
3. **Resiliência (Tolerância a Falhas):** O frontend implementa uma hierarquia de fallback: tenta o cache Redis na Azure; se o container estiver iniciando ou o cache expirado, busca a telemetria ao vivo preservando os dados de sensores do backend (INPE/ANA), garantindo que o usuário nunca veja telas quebradas.

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
- **Gases de Efeito Estufa**: Concentração atmosférica de Metano (CH₄), Dióxido de Carbono (CO₂) e Monóxido de Carbono (CO) do modelo Copernicus CAMS
- Focos de queimadas ativos (INPE MODIS)
- Histórico recente de alertas da capital selecionada
- Exportação de boletim operacional em JSON

**Camadas de Dados no Mapa:**
- 🌊 Nível dos Rios (ANA HidroWeb)
- 🔥 Focos de Queimadas (INPE BDQueimadas)
- 🦟 Risco de Dengue (Analytics)
- 🌫️ Qualidade do Ar (PM2.5 / CONAMA)
- 💨 **Gases (CH₄ / CO₂)**: Concentração atmosférica de metano nas 27 capitais por quintis relativos de cor (Copernicus CAMS)
- 🏭 **Grandes Emissores**: Top 200 instalações pontuais de alta emissão no Brasil com ícones por setor e raio proporcional ao volume (Climate TRACE v6)

### Aba 2 — Matriz Geral de Alertas
Tabela técnica densa com os 10 tipos de alerta gerados pelo `alert-service` do backend:
`RIVER_FLOOD`, `FOREST_FIRE`, `CRITICAL_FIRE_RISK`, `POOR_AIR_QUALITY`, `EXTREME_HEAT`, `EXTREME_RAIN`, `FLASH_FLOOD`, `DROUGHT_RISK`, `DENGUE_OUTBREAK_RISK`, `FIRE_NEAR_URBAN_AREA`

Filtros por tipo de evento, busca textual e seletor por capital monitorada.

### Aba 3 — Comparativo de Previsões e Riscos (Próximos 3 Dias)
Matriz comparativa das capitais com os dados do `analytics-service`:
- Temperatura prevista (°C), Precipitação (mm), Umidade (%)
- **Score de Risco de Incêndio (0–100)** com escala semântica de cores
- **Score de Risco de Dengue (0–100)** com escala semântica de cores
- Cards de destaque: Capital com maior risco de incêndio, maior risco de dengue e maior precipitação prevista
- Expandir linha para ver projeção dia a dia (D+1, D+2, D+3)

### Aba 4 — Emissões e Gases de Efeito Estufa (SEEG)
Módulo completo de transparência de emissões territoriais brasileiras:
- Seletor por gás (`CO₂e`, `Metano - CH₄`, `CO₂`, `N₂O`) e filtro por Estado (UF) ou Brasil consolidado
- Ranking horizontal dos 10 municípios que mais emitem com cálculo percentual
- Destaque explicativo do setor dominante (ex: *"No Pará, a maior parte das emissões provém de Mudança de Uso da Terra e Florestas"* ou *"No Mato Grosso, predomina a Agropecuária"*)
- Série temporal histórica dos últimos 5 anos por município com distribuição setorial detalhada
- Rodapé e atribuição com link canônico para o SEEG / Observatório do Clima

### Aba 5 — Notícias Oficiais Sanitizadas
Feed de notícias ambientais oficiais e verificadas (Agência Brasil, G1 Meio Ambiente, etc.) com categorização automática e expurgo semântico de ruído.

### 🤖 Assistente Virtual "Gota" (IA RAG)
Assistente operacional especializada em meio ambiente alimentada por Google Gemini com RAG em tempo real:
- Consulta contexto do clima, cotas de rios, alertas vigentes e notícias locais
- **Módulo de Emissões Integrado**: Responde sobre rankings de emissões municipais (SEEG), grandes fontes industriais/agropecuárias (Climate TRACE) e concentração atmosférica em tempo real (Copernicus CAMS)
- Diferenciação epistemológica obrigatória: a IA explicita a diferença entre *concentração no ar hoje* (CAMS) e *emissão anual na fonte* (SEEG / Climate TRACE), sempre citando fontes e anos de referência.

---

## 🌍 Gases e Emissões de Efeito Estufa

O EcoWatch Brasil adota uma abordagem multi-escala para monitorar e explicar a dinâmica dos Gases de Efeito Estufa (GEE) no território nacional:

| Camada / Dimensão | Fonte Oficial | Escopo & Variáveis | Frequência de Atualização | Licença de Uso |
|---|---|---|---|---|
| **Concentração Atmosférica (Tempo Quase-Real)** | **Copernicus CAMS** (via Open-Meteo Air Quality API) | CH₄ (Metano em $\mu g/m^3$), CO₂ (Dióxido de Carbono em ppm), CO ($\mu g/m^3$) nas 27 capitais | Horária / Atualização diária contínua | [Open-Meteo Non-Commercial / Copernicus CAMS License](https://open-meteo.com/en/terms) |
| **Inventário Municipal de Emissões** | **SEEG 14.0** (Observatório do Clima) | Emissões brutas em toneladas ($t$) dos últimos 5 anos (2019-2023) por município e UF para CO₂e, CH₄, CO₂ e N₂O, divididos pelos 5 setores econômicos | Anual (publicação oficial pelo Observatório do Clima) | [Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)](https://seeg.eco.br) |
| **Grandes Emissores Pontuais** | **Climate TRACE v6** | Top 200 instalações pontuais no Brasil com coordenadas georreferenciadas, setor (pecuária, aterros sanitários, usinas, refinarias, mineração) e emissões anuais de CO₂e e CH₄ | Mensal (sincronização no backend com defasagem de ~60 dias dos satélites) | [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://climatetrace.org/data) |

### 🔍 Diferenças e Limitações Metodológicas

1. **Concentração no Ar ≠ Emissão da Cidade:**
   - A concentração atmosférica (Open-Meteo / Copernicus CAMS) mede a quantidade de gás na coluna de ar naquele instante. Fatores meteorológicos (ventos, relevo, correntes de convecção) transportam plumas gasosas por milhares de quilômetros. Uma capital pode apresentar alta concentração atmosférica devido a incêndios em outros estados ou países vizinhos, sem que seja o ponto de emissão original.
2. **SEEG (Inventário Territorial Municipal):**
   - Reflete o volume total de emissões antrópicas atribuído às atividades territoriais daquele município ao longo de um ano completo (ano-base 2023 no SEEG 14.0).
3. **Climate TRACE (Instalações e Ativos Rastreados):**
   - Focado em fontes pontuais individuais mensuradas por sensoriamento remoto e aprendizado de máquina. Não substitui o inventário total municipal, mas identifica instalações de grande porte (como aterros e termelétricas).

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
- 🎨 **Design System no Stitch:** Projeto `EcoWatch Brasil - Frontend`

---

## 📄 Licença

MIT © 2026 Erick Levy
