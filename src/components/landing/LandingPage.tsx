import React from 'react';
import { 
  Radio, 
  ArrowRight, 
  Database, 
  Waves, 
  Flame, 
  Wind, 
  ShieldAlert, 
  Cpu, 
  ExternalLink,
  MapPin,
  Bug,
  Smartphone,
  Newspaper
} from 'lucide-react';
import { MONITORED_CITIES } from '../../data/mockData';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen w-full bg-surface-base text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-hydro/30 selection:text-white">
      {/* Header Superior */}
      <header className="h-16 border-b border-border-subtle px-4 sm:px-6 md:px-12 flex items-center justify-between bg-surface-panel/90 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-hydro/10 border border-hydro/30 flex items-center justify-center text-hydro shrink-0">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-hydro animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white block leading-none">EcoWatch</span>
            <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 block mt-0.5">BRASIL // OBSERVATÓRIO ABERTO</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <a
            href="https://github.com/ErickLevy/ecowatch-brasil"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-zinc-400 hover:text-white items-center gap-1.5 transition-colors hidden sm:flex"
          >
            <span>Repositório Backend</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onEnter}
            className="px-3.5 sm:px-4 py-2 rounded bg-hydro hover:bg-hydro-dark text-surface-base font-semibold text-xs font-mono flex items-center gap-1.5 sm:gap-2 transition-all shadow-lg shadow-hydro/10 active:scale-95"
          >
            <span>Acessar Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Seção Hero */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-border-subtle text-xs font-mono text-zinc-300 w-fit mb-6">
          <span className="w-2 h-2 rounded-full bg-nominal animate-ping" />
          <span>Arquitetura Event-Driven // Java 21 · Kafka · CQRS · Leaflet</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18] max-w-4xl font-sans">
          Monitoramento geoespacial e inteligência climática em tempo real para o Brasil.
        </h1>

        <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-3xl leading-relaxed font-sans">
          Uma plataforma de observabilidade ambiental que unifica telemetria fluvial da ANA, focos de incêndio do INPE, dados meteorológicos de satélite e modelos preditivos de surtos de Dengue em todas as <strong className="text-zinc-200 font-semibold">27 capitais brasileiras</strong>.
        </p>

        {/* Ações do Hero */}
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={onEnter}
            className="px-5 sm:px-6 py-3 rounded bg-hydro hover:bg-hydro-dark text-surface-base font-bold text-xs sm:text-sm font-mono flex items-center gap-2 transition-all shadow-xl shadow-hydro/20 group active:scale-95"
          >
            <span>Acessar Centro de Operações</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="https://github.com/ErickLevy/ecowatch-brasil"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 sm:px-5 py-3 rounded bg-surface-card hover:bg-surface-hover border border-border-subtle text-zinc-300 text-xs sm:text-sm font-mono flex items-center gap-2 transition-colors"
          >
            <Cpu className="w-4 h-4 text-zinc-400" />
            <span>Documentação da Arquitetura</span>
          </a>
        </div>

        {/* Faixa das Fontes Oficiais */}
        <div className="mt-12 sm:mt-14 pt-6 sm:pt-8 border-t border-border-subtle/70">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-3 sm:mb-4">
            Ingestão Contínua de Dados Oficiais & Modelos Governamentais
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 font-mono text-xs text-zinc-300">
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-hydro font-semibold">ANA HidroWeb</span>
              <span className="text-[11px] text-zinc-400">Cotas Fluviométricas</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-critical font-semibold">INPE Queimadas</span>
              <span className="text-[11px] text-zinc-400">Satélites MODIS & VIIRS</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-warning font-semibold">InfoDengue & SUS</span>
              <span className="text-[11px] text-zinc-400">Risco Bioclimático</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-hydro font-semibold">Open-Meteo Air</span>
              <span className="text-[11px] text-zinc-400">PM2.5 / CONAMA</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-nominal font-semibold">CEMADEN</span>
              <span className="text-[11px] text-zinc-400">Enxurradas e Encostas</span>
            </div>
          </div>
        </div>

        {/* 5 Pilares de Monitoramento e Alerta */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-lg sm:text-xl font-bold font-sans text-white mb-4 flex items-center gap-2">
            <span>Pilares de Observabilidade Ambiental</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 sm:p-5 rounded-md bg-surface-panel border border-border-subtle">
              <Waves className="w-5 h-5 text-hydro mb-2.5" />
              <h3 className="font-bold text-sm sm:text-base text-white">Nível dos Rios</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed font-sans">
                Acompanhamento em tempo real das cotas de alerta e emergência da ANA em bacias críticas (Rio Negro, Guaíba, Capibaribe, etc.).
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-md bg-surface-panel border border-border-subtle">
              <Flame className="w-5 h-5 text-critical mb-2.5" />
              <h3 className="font-bold text-sm sm:text-base text-white">Incêndios Florestais</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed font-sans">
                Detecção orbital de focos de calor com satélites de referência do INPE, notificando proximidade com perímetros urbanos.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-md bg-surface-panel border border-border-subtle">
              <Bug className="w-5 h-5 text-warning mb-2.5" />
              <h3 className="font-bold text-sm sm:text-base text-white">Surtos de Dengue</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed font-sans">
                Modelagem bioclimática preditiva correlacionando temperatura de reprodução vetorial (24°C–32°C) e precipitação acumulada.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-md bg-surface-panel border border-border-subtle">
              <Wind className="w-5 h-5 text-nominal mb-2.5" />
              <h3 className="font-bold text-sm sm:text-base text-white">Qualidade do Ar</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed font-sans">
                Monitoramento horário de micropartículas suspensas (PM2.5 e PM10) em consonância com as normas CONAMA 491/2018 e OMS.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-md bg-surface-panel border border-border-subtle">
              <ShieldAlert className="w-5 h-5 text-hydro mb-2.5" />
              <h3 className="font-bold text-sm sm:text-base text-white">Previsões & Riscos D+3</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed font-sans">
                Cálculo analítico contínuo de scores de risco composto para 24h, 48h e 72h futuras para pronta resposta da Defesa Civil.
              </p>
            </div>
          </div>
        </div>

        {/* Destaque de Engenharia: Mobile-First e Usabilidade em Campo */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-6 rounded-md bg-surface-panel border border-border-subtle space-y-4">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold font-sans text-white">
            <Smartphone className="w-5 h-5 text-hydro" />
            <span>Engenharia Mobile-First para Equipes em Campo</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            O EcoWatch foi projetado para uso tanto em grandes salas de situação (CICC) quanto na ponta, em smartphones de agentes da Defesa Civil em áreas de risco. Toda a interface conta com:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded bg-surface-card border border-border-subtle/80">
              <span className="text-hydro font-bold block mb-1">Camadas Limpas sob Demanda</span>
              <span className="text-zinc-400 font-sans text-[11px]">Camadas geográficas iniciam desligadas para evitar sobrecarga visual e cognitiva na tela compacta.</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle/80">
              <span className="text-hydro font-bold block mb-1">Gaveta Tátil Deslizante</span>
              <span className="text-zinc-400 font-sans text-[11px]">Painel de telemetria inferior que não sobrepõe a barra de navegação e pode ser minimizado a qualquer instante.</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle/80">
              <span className="text-hydro font-bold block mb-1">Relatórios Timbrados & PDF</span>
              <span className="text-zinc-400 font-sans text-[11px]">Gere e imprima boletins oficiais de ocorrência ou exporte CSVs analíticos diretamente pelo celular.</span>
            </div>
          </div>
        </div>

        {/* Integração com Feeds de Notícias e APIs de Desastres */}
        <div className="mt-6 p-5 sm:p-6 rounded-md bg-surface-card border border-border-subtle/80 space-y-3">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold font-sans text-white">
            <Newspaper className="w-5 h-5 text-warning" />
            <span>Inteligência Contextual: Notícias & APIs de Desastres em Tempo Real</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            Para complementar a telemetria física dos sensores, o EcoWatch integra e planeja expansão com fontes de notícias e registros factuais de eventos extremos no Brasil:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-surface-panel border border-border-subtle">
              <span className="text-warning font-semibold block">Google News RSS (BR)</span>
              <span className="text-zinc-400 text-[11px]">Feed gratuito em tempo real filtrado para cheias, enxurradas e queimadas.</span>
            </div>
            <div className="p-2.5 rounded bg-surface-panel border border-border-subtle">
              <span className="text-hydro font-semibold block">GDACS (ONU / CE)</span>
              <span className="text-zinc-400 text-[11px]">Feed global georreferenciado de desastres naturais com GeoJSON oficial.</span>
            </div>
            <div className="p-2.5 rounded bg-surface-panel border border-border-subtle">
              <span className="text-nominal font-semibold block">S2ID / Defesa Civil</span>
              <span className="text-zinc-400 text-[11px]">Base nacional de decretações de situação de emergência e calamidade pública.</span>
            </div>
            <div className="p-2.5 rounded bg-surface-panel border border-border-subtle">
              <span className="text-zinc-200 font-semibold block">Agência Brasil (EBC)</span>
              <span className="text-zinc-400 text-[11px]">Feed RSS governamental aberto com notícias oficiais de meio ambiente e clima.</span>
            </div>
          </div>
        </div>

        {/* Rede das 27 Capitais Monitoradas */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-6 rounded-md bg-surface-panel border border-border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2 text-sm font-mono font-semibold text-zinc-300">
              <MapPin className="w-4 h-4 text-hydro" />
              <span>Rede de Monitoramento Integral: 27 Capitais (26 Estados + DF)</span>
            </div>
            <span className="text-xs font-mono text-zinc-500">{MONITORED_CITIES.length} nós federados</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs font-mono">
            {MONITORED_CITIES.map(city => (
              <div key={city.slug} className="p-2 sm:p-2.5 rounded bg-surface-card border border-border-subtle/80 flex items-center justify-between">
                <span className="text-white font-medium truncate">{city.nome}</span>
                <span className="text-zinc-500 text-[11px] shrink-0 ml-1">{city.estado}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo da Arquitetura Técnica do Backend & FinOps */}
        <div className="mt-8 p-5 sm:p-6 rounded-md bg-surface-dim border border-border-subtle text-xs font-mono text-zinc-400 space-y-2.5">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold mb-1">
            <Database className="w-4 h-4 text-hydro" />
            <span>Arquitetura de Microsserviços & Estratégia FinOps</span>
          </div>
          <p className="text-zinc-400 leading-relaxed font-sans">
            Construído sobre <strong className="text-zinc-200">Java 21 LTS</strong> com Virtual Threads (Loom), <strong className="text-zinc-200">Spring Boot 3</strong>, mensageria dupla com <strong className="text-zinc-200">Apache Kafka</strong> (streaming de telemetria) e <strong className="text-zinc-200">RabbitMQ</strong> (alertas e notificações), cache em memória com <strong className="text-zinc-200">Redis (Upstash)</strong> e persistência relacional com <strong className="text-zinc-200">PostgreSQL (Supabase)</strong> seguindo o padrão CQRS.
          </p>
          <p className="text-zinc-500 leading-relaxed font-sans text-[11px]">
            Hospedado no Azure com arquitetura serverless em escala zero nos microsserviços de background, garantindo custo operacional praticamente nulo quando inativo e escalabilidade elástica instantânea durante episódios climáticos severos.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-14 border-t border-border-subtle px-4 sm:px-6 flex items-center justify-between text-xs font-mono text-zinc-500 bg-surface-dim">
        <span className="truncate">EcoWatch Brasil · Observatório Aberto © 2026</span>
        <button 
          onClick={onEnter} 
          className="text-hydro hover:underline flex items-center gap-1 shrink-0 ml-2"
        >
          <span>Abrir Console</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </footer>
    </div>
  );
};

