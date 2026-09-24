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
  MapPin
} from 'lucide-react';
import { MONITORED_CITIES } from '../../data/mockData';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen w-full bg-surface-base text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-hydro/30 selection:text-white">
      {/* Header Superior */}
      <header className="h-16 border-b border-border-subtle px-6 md:px-12 flex items-center justify-between bg-surface-panel/80 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-hydro/10 border border-hydro/30 flex items-center justify-center text-hydro">
            <Radio className="w-5 h-5 text-hydro animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block leading-none">EcoWatch</span>
            <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">BRASIL // OBSERVATÓRIO ABERTO</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ErickLevy/ecowatch-brasil"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors hidden sm:flex"
          >
            <span>Repositório Backend</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onEnter}
            className="px-4 py-2 rounded bg-hydro hover:bg-hydro-dark text-surface-base font-semibold text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-hydro/10"
          >
            <span>Acessar Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Seção Hero */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-6xl mx-auto flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-border-subtle text-xs font-mono text-zinc-300 w-fit mb-6">
          <span className="w-2 h-2 rounded-full bg-nominal animate-ping" />
          <span>Arquitetura Event-Driven // Java 21 · Kafka · Leaflet</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl font-sans">
          Monitoramento geoespacial e telemetria ambiental em tempo real para o Brasil.
        </h1>

        <p className="mt-6 text-base md:text-lg text-zinc-400 max-w-3xl leading-relaxed font-sans">
          Uma plataforma de observabilidade ecológica que conecta fontes de satélite, dados pluviométricos e estações fluviométricas da ANA, CEMADEN e INPE em todas as 27 capitais brasileiras (26 estados + DF), avaliando riscos de inundações, incêndios e qualidade do ar.
        </p>

        {/* Ações do Hero */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onEnter}
            className="px-6 py-3 rounded bg-hydro hover:bg-hydro-dark text-surface-base font-bold text-sm font-mono flex items-center gap-2.5 transition-all shadow-xl shadow-hydro/20 group"
          >
            <span>Acessar Centro de Operações</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="https://github.com/ErickLevy/ecowatch-brasil"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded bg-surface-card hover:bg-surface-hover border border-border-subtle text-zinc-300 text-sm font-mono flex items-center gap-2 transition-colors"
          >
            <Cpu className="w-4 h-4 text-zinc-400" />
            <span>Documentação da Arquitetura</span>
          </a>
        </div>

        {/* Faixa das 5 Fontes Oficiais */}
        <div className="mt-14 pt-8 border-t border-border-subtle/70">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-4">
            Ingestão Contínua de Dados Oficiais
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 font-mono text-xs text-zinc-300">
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-hydro font-semibold">NASA POWER</span>
              <span className="text-[11px] text-zinc-400">Radiação & Clima</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-hydro font-semibold">Open-Meteo</span>
              <span className="text-[11px] text-zinc-400">Qualidade do Ar</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-critical font-semibold">INPE Queimadas</span>
              <span className="text-[11px] text-zinc-400">Satélites MODIS</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-hydro font-semibold">ANA HidroWeb</span>
              <span className="text-[11px] text-zinc-400">Cotas Fluviométricas</span>
            </div>
            <div className="p-3 rounded bg-surface-card border border-border-subtle flex flex-col gap-1">
              <span className="text-warning font-semibold">CEMADEN</span>
              <span className="text-[11px] text-zinc-400">Alertas de Enxurrada</span>
            </div>
          </div>
        </div>

        {/* 4 Pilares de Monitoramento */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-md bg-surface-panel border border-border-subtle">
            <Waves className="w-6 h-6 text-hydro mb-3" />
            <h3 className="font-bold text-base text-white">Nível dos Rios</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Acompanhamento de rios críticos (Rio Negro, Guaíba, Capibaribe) com calibração das cotas de alerta e emergência do SNIRH.
            </p>
          </div>

          <div className="p-5 rounded-md bg-surface-panel border border-border-subtle">
            <Wind className="w-6 h-6 text-nominal mb-3" />
            <h3 className="font-bold text-base text-white">Qualidade do Ar</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Leitura horária de material particulado fino (PM2.5 e PM10) comparado com as diretrizes do CONAMA e da OMS.
            </p>
          </div>

          <div className="p-5 rounded-md bg-surface-panel border border-border-subtle">
            <Flame className="w-6 h-6 text-critical mb-3" />
            <h3 className="font-bold text-base text-white">Focos de Incêndio</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Detecção de focos de calor com satélites de referência, disparando alertas automáticos em proximidades urbanas.
            </p>
          </div>

          <div className="p-5 rounded-md bg-surface-panel border border-border-subtle">
            <ShieldAlert className="w-6 h-6 text-warning mb-3" />
            <h3 className="font-bold text-base text-white">Analytics Preditivo</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Modelos preditivos em background calculando scores de risco de incêndio florestal e proliferação de dengue para 3 dias.
            </p>
          </div>
        </div>

        {/* Rede das 10 Capitais Monitoradas */}
        <div className="mt-16 p-6 rounded-md bg-surface-panel border border-border-subtle">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2 text-sm font-mono font-semibold text-zinc-300">
              <MapPin className="w-4 h-4 text-hydro" />
              <span>Rede de Capitais Monitoradas (5 Biomas Brasileiros)</span>
            </div>
            <span className="text-xs font-mono text-zinc-500">{MONITORED_CITIES.length} capitais monitoradas</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
            {MONITORED_CITIES.map(city => (
              <div key={city.slug} className="p-2.5 rounded bg-surface-card border border-border-subtle/80 flex items-center justify-between">
                <span className="text-white font-medium">{city.nome}</span>
                <span className="text-zinc-500 text-[11px]">{city.estado}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo da Arquitetura Técnica do Backend */}
        <div className="mt-8 p-6 rounded-md bg-surface-dim border border-border-subtle text-xs font-mono text-zinc-400 space-y-2">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold mb-1">
            <Database className="w-4 h-4 text-hydro" />
            <span>Infraestrutura e Padrões de Projeto do Backend</span>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Desenvolvido em microsserviços desacoplados utilizando <strong className="text-zinc-200">Java 21 LTS</strong> com Virtual Threads, <strong className="text-zinc-200">Spring Boot 3</strong>, mensageria dupla com <strong className="text-zinc-200">Apache Kafka</strong> para streaming de telemetria e <strong className="text-zinc-200">RabbitMQ</strong> para notificações, cache em memória com <strong className="text-zinc-200">Redis (Upstash)</strong> e persistência relacional com <strong className="text-zinc-200">PostgreSQL (Supabase)</strong> seguindo o padrão CQRS.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-12 border-t border-border-subtle px-6 flex items-center justify-between text-xs font-mono text-zinc-500 bg-surface-dim">
        <span>EcoWatch Brasil · Centro de Operações Ambientais © 2026</span>
        <button 
          onClick={onEnter} 
          className="text-hydro hover:underline flex items-center gap-1"
        >
          <span>Abrir Console</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </footer>
    </div>
  );
};
