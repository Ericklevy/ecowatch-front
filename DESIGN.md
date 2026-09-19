---
name: EcoWatch Brasil - Telemetria & Monitoramento Ambiental
colors:
  surface: '#090d16'
  surface-dim: '#090d16'
  surface-bright: '#242b38'
  surface-container-lowest: '#06080e'
  surface-container-low: '#0e1422'
  surface-container: '#131b2c'
  surface-container-high: '#1a243a'
  surface-container-highest: '#222f4b'
  on-surface: '#f1f5f9'
  on-surface-variant: '#94a3b8'
  inverse-surface: '#f1f5f9'
  inverse-on-surface: '#090d16'
  outline: '#334155'
  outline-variant: '#1e293b'
  surface-tint: '#38bdf8'
  primary: '#38bdf8'
  on-primary: '#041d2e'
  primary-container: '#0284c7'
  on-primary-container: '#e0f2fe'
  secondary: '#10b981'
  on-secondary: '#022c22'
  secondary-container: '#065f46'
  on-secondary-container: '#d1fae5'
  tertiary: '#f59e0b'
  on-tertiary: '#451a03'
  tertiary-container: '#92400e'
  on-tertiary-container: '#fef3c7'
  error: '#ef4444'
  on-error: '#450a0a'
  error-container: '#991b1b'
  on-error-container: '#fee2e2'
  background: '#090d16'
  on-background: '#f1f5f9'
  surface-variant: '#1a243a'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## 1. Brand & Style (Anti-AI Slop Manifesto)

O **EcoWatch Brasil** é uma estação operacional de monitoramento geoespacial e ambiental em tempo real. Esta interface é uma ferramenta científica e analítica, construída para clareza, alta densidade informacional e observabilidade crítica.

### Regras Anti-Slop Estritas:
1. **Sem Gradientes Genéricos:** Proibido uso de gradientes roxos/azuis (`from-indigo to-purple`), fundos espelhados borrados (glassmorphism/aurora blobs) ou efeitos brilhantes decorativos.
2. **Sem Cantos Hiper-Arredondados:** Proibido `rounded-3xl` ou botões pílula gigantes em containers de dados. O raio de curvatura máximo em cards é 6px a 8px (`rounded-md`).
3. **Sem Emojis Decorativos:** Jamais usar emojis como ícones (🚫 🚀 ⚡ 🌱 ✨). Usar estritamente iconografia técnica vetorial limpa (Lucide em espessura regular de 1.5px).
4. **Sem Dados Fake / Honest Copy:** Nada de métricas fictícias sem sentido ("+84% de eficiência verde"). Todas as métricas devem refletir grandezas físicas reais: vazão em m³/s, nível fluviométrico em metros, precipitação em mm, focos de calor com satélite de referência (ex: GOES-16, Terra/Aqua MODIS).
5. **Tipografia Técnica Dupla:** `Geist` para navegação e hierarquia institucional; `JetBrains Mono` mandatória para coordenadas (Lat/Long), índices IQA, cotas fluviais, leituras de telemetria e carimbos de data/hora UTC.

---

## 2. Paleta de Cores e Semântica de Telemetria

- **Surface Base (`#090d16`)**: Canvas principal profundo, evitando reflexos e fadiga visual em operações de longa duração.
- **Surface Panels (`#0e1422`)**: Painéis de controle laterais e gavetas de métricas.
- **Surface Cards (`#131b2c`)**: Módulos e cards com borda nítida de 1px em `#1e293b`.
- **Cores Semânticas de Alerta Ambiental:**
  - **Hydro Blue (`#38bdf8`)**: Camadas fluviais, bacias hidrográficas, pluviometria e estações fluviométricas.
  - **Nominal Green (`#10b981`)**: Qualidade de água normal, vegetação estável, satélites operando normalmente.
  - **Warning Amber (`#f59e0b`)**: Nível de rio em cota de alerta, estiagem severa, anomalia térmica moderada.
  - **Critical Fire Red (`#ef4444`)**: Foco de queimada confirmado, risco crítico de transbordamento/seca extrema.

---

## 3. Componentes Centrais

### A. GeoSpatial Hydro Map (Mapa do Brasil & Bacias Fluviais)
- Elemento central ocupando a área principal de visualização da tela.
- Divisão geográfica política por Estados do Brasil com contorno sutil vetorial.
- **Camada Hidrográfica Vetorial**: Destaque para as grandes bacias hidrográficas brasileiras (Bacia Amazônica, Bacia do Tocantins-Araguaia, Bacia do São Francisco, Bacia do Paraná/Prata, Bacia do Parnaíba) representadas por linhas e polígonos em tom ciano/azul técnico (`#38bdf8`).
- **Seletor de Camadas (Layers)**:
  - [x] Malha Hidrográfica (Rios & Bacias)
  - [x] Estações de Telemetria Fluvial (ANA / CPRM)
  - [x] Focos de Queimadas (INPE Queimadas)
  - [ ] Áreas de Preservação e Unidades de Conservação
- Marcadores de telemetria no mapa com indicador em tempo real (ponto sólido de 6px com pulso sutil se crítico).

### B. Telemetry Inspector Panel (Painel de Telemetria Lateral)
- Painel lateral acoplado com cards modulares compactos:
  - Estação ativa selecionada: Código do posto (ex: `EST-66210000 - Rio Negro / Manaus`).
  - Nível atual do rio, cota de inundação e cota de seca em metros.
  - Gráfico de linha sparkline de série temporal dos últimos 30 dias (sem preenchimento gradiente excessivo).
  - Tabela técnica com linhas de leitura: Timestamp UTC, Nível (m), Vazão estimada (m³/s), Turbidez (NTU).

### C. Top Navigation & Global Ops Bar
- Identificador da estação: `EcoWatch // Centro de Operações Ambientais`.
- Seletor de Estado/Região (ex: Todos os Estados, Amazonas, Pará, Pantanal, etc.).
- Badge de integridade de telemetria: `1.420 estações ativas · Sincronizado via INPE/ANA`.
- Alternância de visualização: Modo Mapa Integrado | Tabela de Incidentes | Relatórios.

### D. Estados de Interface
- **Loading**: Skeletons em cinza ardósia com pulso tênue de 1.5s.
- **Empty State**: Mensagem técnica precisa ("Nenhuma ocorrência crítica reportada nesta bacia nas últimas 24h").
- **Error State**: Banner com contorno vermelho técnico indicando perda de sinal do posto telemétrico com botão de reconexão.
