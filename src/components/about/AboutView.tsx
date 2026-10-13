import React from 'react';
import { 
  Radio, 
  User, 
  Waves, 
  Flame, 
  Wind, 
  Bug, 
  ShieldAlert, 
  Smartphone, 
  ExternalLink,
  Server
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* ── Banner Institucional do Projeto ── */}
      <div className="p-6 sm:p-8 rounded-xl bg-surface-panel border border-border-subtle relative overflow-hidden shadow-lg space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hydro/10 border border-hydro/30 text-xs font-mono text-hydro w-fit">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>EcoWatch Brasil // Observatório Aberto de Telemetria Ambiental</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-sans tracking-tight leading-tight">
          Inteligência climática, observabilidade geoespacial e alerta antecipado para o Brasil.
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-3xl">
          O EcoWatch Brasil é uma plataforma civil de monitoramento contínuo concebida para integrar dados governamentais de satélites e sensores fluviométricos, convertendo telemetria bruta em respostas rápidas para defesa civil, pesquisadores e população em todas as <strong className="text-white font-semibold">27 capitais brasileiras</strong>.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-surface-card border border-border-subtle">
            26 Estados + Distrito Federal
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-card border border-border-subtle">
            5 Biomas Monitorados
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-card border border-border-subtle">
            Padrão FinOps (Scale-to-Zero)
          </span>
        </div>
      </div>

      {/* ── Seção: Idealização, Autoria e Concepção ── */}
      <div className="p-6 rounded-xl bg-surface-panel border border-border-subtle space-y-4">
        <div className="flex items-center gap-2.5 text-base font-bold font-sans text-white border-b border-border-subtle/70 pb-3">
          <User className="w-5 h-5 text-hydro" />
          <span>Idealização, Autoria & Arquitetura do Sistema</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-14 h-14 rounded-xl bg-hydro/15 border border-hydro/30 flex items-center justify-center text-hydro font-mono font-bold text-xl shrink-0">
            EL
          </div>

          <div className="space-y-3 flex-1 font-sans text-sm text-zinc-300 leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Erick Levy</span>
                <span className="text-xs font-mono font-normal text-hydro bg-hydro/10 px-2 py-0.5 rounded border border-hydro/20">
                  Idealizador & Engenheiro do Projeto
                </span>
              </h2>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Concepção das ideias, engenharia de software e modelagem de risco
              </p>
            </div>

            <p>
              O projeto nasceu da necessidade de unificar fontes oficiais que operam historicamente de forma isolada (ANA para rios, INPE para queimadas, CEMADEN para deslizamentos e InfoDengue para arboviroses) em um painel único, ágil e acessível pelo celular.
            </p>

            <p>
              A engenharia foi concebida sob rigorosos princípios de **alta disponibilidade assíncrona** (Event-Driven Architecture) e **eficiência orçamentária (FinOps)**, permitindo que um ecossistema com 5 microsserviços em Java 21 opere na nuvem com **custo fixo de computação de R$ 0,00**, ativado por rotinas inteligentes sob demanda e orquestração do GitHub Actions.
            </p>

            <div className="flex items-center gap-3 pt-2 font-mono text-xs">
              <a
                href="https://github.com/ErickLevy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-hydro hover:underline font-semibold"
              >
                <span>GitHub @ErickLevy</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-zinc-600">·</span>
              <a
                href="https://github.com/ErickLevy/ecowatch-brasil"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white"
              >
                <span>Repositório Backend</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-zinc-600">·</span>
              <a
                href="https://github.com/ErickLevy/ecowatch-front"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white"
              >
                <span>Repositório Frontend</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Os 5 Pilares de Inteligência Ambiental ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-sans text-white flex items-center gap-2">
          <span>Os 5 Pilares de Monitoramento Governamental Integrados</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-hydro font-bold text-sm">
              <Waves className="w-4 h-4" />
              <span>1. Telemetria Fluvial (ANA)</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Integração com o sistema HidroWeb da Agência Nacional de Águas, acompanhando cotas de alerta e emergência em bacias críticas como Rio Negro, Guaíba, Capibaribe e Cuiabá.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-critical font-bold text-sm">
              <Flame className="w-4 h-4" />
              <span>2. Focos de Incêndio (INPE)</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Leituras dos satélites de referência (MODIS e VIIRS) via BDQueimadas, detectando anomalias térmicas e proximidade com matas e centros urbanos.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-warning font-bold text-sm">
              <Bug className="w-4 h-4" />
              <span>3. Risco Bioclimático de Dengue</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Modelagem preditiva baseada em biologia vetorial: correlaciona temperatura ideal de reprodução do mosquito (24°C a 32°C) com precipitação acumulada recente.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-nominal font-bold text-sm">
              <Wind className="w-4 h-4" />
              <span>4. Qualidade do Ar (CONAMA/OMS)</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Acompanhamento horário de material particulado fino (PM2.5 e PM10) gerado por queimadas e emissões urbanas, comparando com os limites da Resolução CONAMA 491/2018.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-hydro font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>5. Enxurradas e Encostas (CEMADEN)</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Alertas de movimento de massa, deslizamentos de encostas e enxurradas bruscas associadas a tempestades convectivas em relevos vulneráveis.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-panel border border-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-hydro" />
              <span>Mobile-First para Campo</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Projetado com interface táctil, camadas desligáveis para economizar banda e dados em telas pequenas, e geração direta de boletins impressos ou em PDF.
            </p>
          </div>
        </div>
      </div>

      {/* ── Arquitetura de Engenharia & FinOps ── */}
      <div className="p-6 rounded-xl bg-surface-dim border border-border-subtle space-y-4">
        <div className="flex items-center gap-2 text-base font-bold font-sans text-white border-b border-border-subtle/70 pb-3">
          <Server className="w-5 h-5 text-hydro" />
          <span>Stack Tecnológica & Engenharia FinOps</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-surface-card border border-border-subtle">
            <span className="text-hydro font-bold block mb-1">Backend</span>
            <span className="text-zinc-300">Java 21 LTS (Loom)</span>
            <span className="text-zinc-500 block text-[11px] mt-0.5">Spring Boot 3 + CQRS</span>
          </div>

          <div className="p-3 rounded bg-surface-card border border-border-subtle">
            <span className="text-hydro font-bold block mb-1">Mensageria</span>
            <span className="text-zinc-300">Apache Kafka (Aiven)</span>
            <span className="text-zinc-500 block text-[11px] mt-0.5">RabbitMQ (Notificações)</span>
          </div>

          <div className="p-3 rounded bg-surface-card border border-border-subtle">
            <span className="text-hydro font-bold block mb-1">Armazenamento</span>
            <span className="text-zinc-300">PostgreSQL (Supabase)</span>
            <span className="text-zinc-500 block text-[11px] mt-0.5">Redis Cache (Upstash)</span>
          </div>

          <div className="p-3 rounded bg-surface-card border border-border-subtle">
            <span className="text-hydro font-bold block mb-1">Frontend & Nuvem</span>
            <span className="text-zinc-300">React + Vite + Leaflet</span>
            <span className="text-zinc-500 block text-[11px] mt-0.5">Azure Container Apps</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-sans leading-relaxed pt-1">
          O backend opera sob política de <strong>Scale-to-Zero</strong>: quando inativo, os containers de ingestão e analytics são pausados na Azure. Três vezes ao dia (07h, 13h e 19h), o GitHub Actions acorda a ingestão, coleta as 27 capitais em ~30 segundos, publica no Kafka e volta ao repouso, consumindo apenas 1,5% da cota gratuita da Microsoft (custo zero).
        </p>
      </div>

      {/* ── Rodapé de Créditos ── */}
      <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-2">
        <span>EcoWatch Brasil · Desenvolvido por Erick Levy © {new Date().getFullYear()}</span>
        <span>Observatório Aberto de Telemetria Ambiental</span>
      </div>
    </div>
  );
};
