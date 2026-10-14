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
  Server,
  Satellite,
  Cpu,
  BellRing,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';

export const AboutView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* ── Banner Institucional do Projeto (Aurora Bento Card) ── */}
      <div className="p-6 sm:p-8 rounded-2xl bento-card relative overflow-hidden shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hydro/10 border border-hydro/30 text-xs font-mono text-hydro">
            <Radio className="w-3.5 h-3.5 animate-pulse text-hydro" />
            <span>EcoWatch Brasil // Observatório Aberto de Telemetria Ambiental</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nominal/10 border border-nominal/30 text-xs font-mono text-nominal">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Dados Públicos & Transparentes</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-sans tracking-tight leading-tight">
          Inteligência climática, observabilidade geoespacial e alerta antecipado para o Brasil.
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-3xl">
          O EcoWatch Brasil é uma plataforma civil de monitoramento contínuo concebida para integrar dados governamentais de satélites e sensores fluviométricos, convertendo telemetria bruta em respostas rápidas para defesa civil, pesquisadores e população em todas as <strong className="text-white font-semibold">27 capitais brasileiras</strong>.
        </p>

        {/* ── KPIs Rápidos com Contadores Animados ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bento-card border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 block uppercase">Capitais</span>
            <div className="text-2xl font-bold font-mono text-white">
              <AnimatedCounter value={27} decimals={0} suffix=" Capitais" />
            </div>
            <span className="text-[10px] text-zinc-500 font-sans">26 Estados + DF</span>
          </div>

          <div className="p-3 rounded-xl bento-card border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 block uppercase">Biomas</span>
            <div className="text-2xl font-bold font-mono text-hydro">
              <AnimatedCounter value={5} decimals={0} suffix=" Biomas" />
            </div>
            <span className="text-[10px] text-zinc-500 font-sans">Amazônia ao Pampa</span>
          </div>

          <div className="p-3 rounded-xl bento-card border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 block uppercase">Custo Nuvem</span>
            <div className="text-2xl font-bold font-mono text-nominal">
              R$ 0,00
            </div>
            <span className="text-[10px] text-zinc-500 font-sans">FinOps Scale-to-Zero</span>
          </div>

          <div className="p-3 rounded-xl bento-card border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 block uppercase">Latência</span>
            <div className="text-2xl font-bold font-mono text-warning">
              &lt; 30s
            </div>
            <span className="text-[10px] text-zinc-500 font-sans">Ingestão paralela</span>
          </div>
        </div>
      </div>

      {/* ── Seção: Storytelling do Pipeline de Dados (Como o EcoWatch Funciona) ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-hydro" />
            <span>Como o EcoWatch Funciona: A Esteira de Dados</span>
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Do sensor orbital até o smartphone do cidadão em três etapas automatizadas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Etapa 1 */}
          <div className="p-5 rounded-2xl bento-card card-interactive space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-hydro/10 border border-hydro/30 flex items-center justify-center text-hydro font-mono font-bold text-sm">
                01
              </span>
              <Satellite className="w-5 h-5 text-hydro animate-breathing-glow" />
            </div>
            <h3 className="font-bold text-white text-base">Coleta & Ingestão</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Três vezes ao dia, rotinas serverless acordam e consultam a API do <strong>INPE</strong> (satélites Aqua/Terra/VIIRS), estações fluviométricas da <strong>ANA</strong> e modelos climáticos da <strong>NASA/Open-Meteo</strong> para as 27 capitais.
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-hydro flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Normalização Geoespacial</span>
            </div>
          </div>

          {/* Etapa 2 */}
          <div className="p-5 rounded-2xl bento-card card-interactive space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-warning/10 border border-warning/30 flex items-center justify-center text-warning font-mono font-bold text-sm">
                02
              </span>
              <Cpu className="w-5 h-5 text-warning animate-breathing-glow" />
            </div>
            <h3 className="font-bold text-white text-base">Processamento & IA</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Os dados brutos trafegam pelo <strong>Apache Kafka</strong> para microsserviços Java 21. O motor analítico cruza temperatura e chuva para prever <strong>risco de dengue</strong> e calcula o <strong>índice de risco de fogo</strong> específico de cada bioma.
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-warning flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Modelagem Bioclimática</span>
            </div>
          </div>

          {/* Etapa 3 */}
          <div className="p-5 rounded-2xl bento-card card-interactive space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-nominal/10 border border-nominal/30 flex items-center justify-center text-nominal font-mono font-bold text-sm">
                03
              </span>
              <BellRing className="w-5 h-5 text-nominal animate-breathing-glow" />
            </div>
            <h3 className="font-bold text-white text-base">Alerta & Cidadão</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Apresentação em linguagem 100% humanizada (com glossário para leigos), mapas interativos com Sparklines, envio de alertas de emergência e geração de boletins oficiais timbrados para imprensa e Defesa Civil.
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-nominal flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Comunicação Acessível</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Seção: Idealização, Autoria e Concepção ── */}
      <div className="p-6 rounded-2xl bento-card border border-border-subtle space-y-4">
        <div className="flex items-center gap-2.5 text-base font-bold font-sans text-white border-b border-white/10 pb-3">
          <User className="w-5 h-5 text-hydro" />
          <span>Idealização, Autoria & Arquitetura do Sistema</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-14 h-14 rounded-2xl bg-hydro/15 border border-hydro/30 flex items-center justify-center text-hydro font-mono font-bold text-xl shrink-0 shadow-inner">
            EL
          </div>

          <div className="space-y-3 flex-1 font-sans text-sm text-zinc-300 leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Erick Levy</span>
                <span className="text-xs font-mono font-normal text-hydro bg-hydro/10 px-2.5 py-0.5 rounded-full border border-hydro/20">
                  Idealizador & Engenheiro do Projeto
                </span>
              </h2>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Concepção das ideias, engenharia de software e modelagem de risco socioambiental
              </p>
            </div>

            <p>
              O projeto nasceu da constatação de que as fontes oficiais brasileiras operam historicamente de forma isolada (a ANA cuida de bacias fluviais, o INPE monitora queimadas por satélite, o CEMADEN vigia encostas e o Ministério da Saúde acompanha arboviroses). O EcoWatch une todos esses vetores em um centro de inteligência único e compreensível para qualquer cidadão.
            </p>

            <p>
              A arquitetura foi desenhada sob rígidos padrões de <strong>eficiência orçamentária (FinOps)</strong>: um ecossistema com 5 microsserviços em Java 21 opera na nuvem com <strong>custo fixo de computação de R$ 0,00</strong>, ativado sob demanda por orquestração de eventos e GitHub Actions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
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
          <div className="p-4 rounded-xl bento-card card-interactive space-y-2">
            <div className="flex items-center gap-2 text-hydro font-bold text-sm">
              <Waves className="w-4 h-4" />
              <span>1. Telemetria Fluvial (ANA)</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Integração com o sistema HidroWeb da Agência Nacional de Águas, acompanhando cotas de alerta e emergência em bacias críticas como Rio Negro, Guaíba, Capibaribe e Cuiabá.
            </p>
          </div>

          <div className="p-4 rounded-xl bento-card card-interactive space-y-2">
            <div className="flex items-center gap-2 text-critical font-bold text-sm">
              <Flame className="w-4 h-4" />
              <span>2. Focos de Incêndio (INPE)</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Leituras dos satélites de referência (MODIS e VIIRS) via BDQueimadas, detectando anomalias térmicas e proximidade com matas e centros urbanos.
            </p>
          </div>

          <div className="p-4 rounded-xl bento-card card-interactive space-y-2">
            <div className="flex items-center gap-2 text-warning font-bold text-sm">
              <Bug className="w-4 h-4" />
              <span>3. Risco Bioclimático de Dengue</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Modelagem preditiva baseada em biologia vetorial: correlaciona temperatura ideal de reprodução do mosquito (24°C a 32°C) com precipitação acumulada recente.
            </p>
          </div>

          <div className="p-4 rounded-xl bento-card card-interactive space-y-2">
            <div className="flex items-center gap-2 text-nominal font-bold text-sm">
              <Wind className="w-4 h-4" />
              <span>4. Qualidade do Ar (CONAMA/OMS)</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Acompanhamento horário de material particulado fino (PM2.5 e PM10) gerado por queimadas e emissões urbanas, comparando com os limites da Resolução CONAMA 491/2018.
            </p>
          </div>

          <div className="p-4 rounded-xl bento-card card-interactive space-y-2">
            <div className="flex items-center gap-2 text-hydro font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>5. Enxurradas e Encostas (CEMADEN)</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Alertas de movimento de massa, deslizamentos de encostas e enxurradas bruscas associadas a tempestades convectivas em relevos vulneráveis.
            </p>
          </div>

          <div className="p-4 rounded-xl bento-card card-interactive space-y-2">
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
      <div className="p-6 rounded-2xl bento-card space-y-4">
        <div className="flex items-center gap-2 text-base font-bold font-sans text-white border-b border-white/10 pb-3">
          <Server className="w-5 h-5 text-hydro" />
          <span>Stack Tecnológica & Engenharia FinOps</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bento-card border border-white/5">
            <span className="text-hydro font-bold block mb-1">Backend</span>
            <span className="text-zinc-200">Java 21 LTS (Loom)</span>
            <span className="text-zinc-500 block text-[11px] mt-0.5">Spring Boot 3 + CQRS</span>
          </div>

          <div className="p-3.5 rounded-xl bento-card border border-white/5">
            <span className="text-hydro font-bold block mb-1">Mensageria</span>
            <span className="text-zinc-200">Apache Kafka (Aiven)</span>
            <span className="text-zinc-500 block text-[11px] mt-0.5">RabbitMQ (Notificações)</span>
          </div>

          <div className="p-3.5 rounded-xl bento-card border border-white/5">
            <span className="text-hydro font-bold block mb-1">Armazenamento</span>
            <span className="text-zinc-200">PostgreSQL (Supabase)</span>
            <span className="text-zinc-500 block text-[11px] mt-0.5">Redis Cache (Upstash)</span>
          </div>

          <div className="p-3.5 rounded-xl bento-card border border-white/5">
            <span className="text-hydro font-bold block mb-1">Frontend & Nuvem</span>
            <span className="text-zinc-200">React + Vite + Leaflet</span>
            <span className="text-zinc-500 block text-[11px] mt-0.5">Azure Container Apps</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-sans leading-relaxed pt-1">
          O backend opera sob política de <strong>Scale-to-Zero</strong>: quando inativo, os containers de ingestão e analytics são pausados na Azure. Três vezes ao dia (07h, 13h e 19h), o GitHub Actions acorda a ingestão, coleta as 27 capitais em ~30 segundos, publica no Kafka e volta ao repouso, consumindo apenas 1,5% da cota gratuita da Microsoft (custo zero).
        </p>
      </div>

      {/* ── Rodapé de Créditos ── */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-2">
        <span>EcoWatch Brasil · Desenvolvido por Erick Levy © {new Date().getFullYear()}</span>
        <span>Observatório Aberto de Telemetria Ambiental</span>
      </div>
    </div>
  );
};
