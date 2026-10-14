import React, { useState } from 'react';
import {
  BookOpen,
  CloudRain,
  Waves,
  Wind,
  Flame,
  Bug,
  HelpCircle,
  Search,
  ShieldCheck
} from 'lucide-react';

interface GlossaryTerm {
  id: string;
  category: 'chuva' | 'rios' | 'ar' | 'fogo' | 'dengue';
  title: string;
  technicalTerm: string;
  simpleExplanation: string;
  practicalExample: string;
  scale?: { range: string; meaning: string; severity: 'low' | 'medium' | 'high' | 'critical' }[];
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'pm25',
    category: 'ar',
    title: 'Material Particulado Fino (PM2.5)',
    technicalTerm: 'PM2.5: 18.2 µg/m³ (micrômetros por metro cúbico)',
    simpleExplanation:
      'Partículas microscópicas de fumaça, poeira e fuligem que ficam suspensas no ar. Elas medem menos de 2,5 micrômetros — cerca de 30 vezes mais finas do que um único fio de cabelo humano. Por serem minúsculas, entram direto nos alvéolos pulmonares e na corrente sanguínea.',
    practicalExample:
      'Quando há queimadas no cerrado ou na Amazônia, o céu fica cinzento e o cheiro de queimado no ar é composto por essas partículas. Acima de 25 µg/m³, crianças, idosos e asmáticos devem evitar correr ou fazer exercícios pesados na rua.',
    scale: [
      { range: '0 a 15 µg/m³', meaning: 'Ar Puro & Saudável — Perfeito para passeios e esportes ao ar livre.', severity: 'low' },
      { range: '15.1 a 25 µg/m³', meaning: 'Ar Razoável / Aceitável — Dentro dos padrões da OMS. Leve desconforto para pessoas com rinite ou asma.', severity: 'medium' },
      { range: '25.1 a 50 µg/m³', meaning: 'Ar Ruim / Poluído — Fumaça visível. Evite caminhadas longas nos horários mais quentes.', severity: 'high' },
      { range: '> 50 µg/m³', meaning: 'Ar Crítico & Perigoso — Use máscara N95/PFF2 se precisar sair e feche janelas de casa.', severity: 'critical' }
    ]
  },
  {
    id: 'cota-rio',
    category: 'rios',
    title: 'Cota de Alerta e Cota de Emergência de Rios',
    technicalTerm: 'Atingiu 2.18m (Cota de Alerta: 2.0m / Emergência: 3.0m)',
    simpleExplanation:
      'A altura medida da lâmina d’água do rio em relação a uma régua fixa instalada pela Agência Nacional de Águas (ANA).',
    practicalExample:
      'A "Cota de Alerta" (ex: 2.0m no Guaíba ou 28.5m no Rio Negro) significa que o rio chegou na borda do cais ou na calçada da avenida costeira. A água ainda não invadiu as casas, mas as pessoas que moram nas margens já devem levantar móveis e ficar atentas. A "Cota de Emergência" é quando a água transborda de fato e invade ruas e residências.',
    scale: [
      { range: 'Abaixo da Cota de Alerta', meaning: 'Nível Seguro — A água flui normalmente dentro do canal natural do rio.', severity: 'low' },
      { range: 'Igual ou Acima da Cota de Alerta', meaning: 'Cota de Alerta Atingida — Risco iminente; Defesa Civil mobiliza sirenes e barcos de apoio.', severity: 'high' },
      { range: 'Igual ou Acima da Cota de Emergência', meaning: 'Transbordamento e Inundação — A água invade ruas e casas; evacuação imediata obrigatória.', severity: 'critical' }
    ]
  },
  {
    id: 'milimetros-chuva',
    category: 'chuva',
    title: 'Milímetros de Chuva (mm)',
    technicalTerm: 'Precipitação acumulada: 42.6 mm',
    simpleExplanation:
      'Indica quantos litros de água caíram do céu sobre uma área de um metro quadrado (1 m²). Cada 1 mm de chuva equivale exatamente a 1 litro de água despejado em um quadrado de 1m x 1m no chão.',
    practicalExample:
      'Uma chuva de 50 mm significa que cada metro quadrado da sua rua recebeu 50 garrafas de 1 litro de água. Se o asfalto não tiver bueiros limpos ou áreas verdes para absorver tanta água em pouco tempo, as poças viram enxurrada.',
    scale: [
      { range: '0.0 mm', meaning: 'Sem Chuva — Tempo seco ou estiagem contínua.', severity: 'low' },
      { range: '< 10 mm', meaning: 'Chuva Fraca / Garoa — Apenas molha a calçada; sem perigo.', severity: 'low' },
      { range: '10 a 30 mm', meaning: 'Chuva Moderada — Solo fica úmido; trânsito pode ficar mais lento.', severity: 'medium' },
      { range: '30 a 50 mm', meaning: 'Chuva Forte — Risco de bolsões d\'água, galhos caídos e bueiros transbordando.', severity: 'high' },
      { range: '> 50 mm', meaning: 'Chuva Torrencial Extrema — Alto perigo de enxurradas, deslizamento de encostas e inundações.', severity: 'critical' }
    ]
  },
  {
    id: 'focos-calor',
    category: 'fogo',
    title: 'Focos de Calor e Risco de Incêndio (0 a 100)',
    technicalTerm: 'Índice de Risco: 88/100 · 14 focos ativos detectados',
    simpleExplanation:
      'Um cálculo diário feito por satélites do INPE e da NASA que cruza três fatores: quantos dias a cidade está sem chover, quão quente está a tarde e quão baixa está a umidade do ar.',
    practicalExample:
      'Um risco de 90/100 significa que a vegetação está seca feito palha de milho. Uma simples bituca de cigarro jogada pela janela do carro ou uma faísca de escapamento pode iniciar um incêndio que destrói hectares de mata e cobre cidades como Brasília ou Cuiabá de fumaça densa.',
    scale: [
      { range: '0 a 30', meaning: 'Risco Baixo — Solo úmido ou chuva recente; baixa chance de fogo.', severity: 'low' },
      { range: '31 a 60', meaning: 'Risco Médio / Atenção — Vegetação perdendo umidade; cuidado perto de matas.', severity: 'medium' },
      { range: '61 a 80', meaning: 'Risco Alto — Qualquer queimada de lixo pode fugir do controle dos bombeiros.', severity: 'high' },
      { range: '81 a 100', meaning: 'Risco Crítico / Alerta Vermelho — Proibição total de qualquer queima; perigo extremo de grandes incêndios florestais.', severity: 'critical' }
    ]
  },
  {
    id: 'risco-dengue',
    category: 'dengue',
    title: 'Risco de Surto de Dengue e Arboviroses',
    technicalTerm: 'Risco de Infestação: 68/100 (Modelagem InfoDengue/Fiocruz)',
    simpleExplanation:
      'Probabilidade do mosquito Aedes aegypti se multiplicar rapidamente em uma cidade, calculada combinando chuva (que cria poças e vasos com água) e calor acima de 28°C.',
    practicalExample:
      'O ovo do mosquito da dengue eclode e vira mosquito adulto em apenas 7 dias quando faz calor e chove com frequência. Em tempo seco, o risco diminui, mas ovos depositados em baldes e calhas podem ficar dormentes por até 1 ano esperando a primeira chuva.',
    scale: [
      { range: '0 a 30', meaning: 'Risco Baixo — Condições climáticas desfavoráveis para o mosquito.', severity: 'low' },
      { range: '31 a 60', meaning: 'Risco Moderado — Vistoria semanal de ralos, calhas e vasos de plantas recomendada.', severity: 'medium' },
      { range: '61 a 100', meaning: 'Risco Alto / Emergência — Alta taxa de reprodução de mosquitos; use repelente e elimine água parada.', severity: 'high' }
    ]
  }
];

export const GlossaryView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<'all' | 'chuva' | 'rios' | 'ar' | 'fogo' | 'dengue'>('all');

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchCat = selectedCat === 'all' || term.category === selectedCat;
    const query = search.toLowerCase();
    const matchSearch =
      search === '' ||
      term.title.toLowerCase().includes(query) ||
      term.technicalTerm.toLowerCase().includes(query) ||
      term.simpleExplanation.toLowerCase().includes(query) ||
      term.practicalExample.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  const getSeverityPill = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'low':
        return <span className="w-2 h-2 rounded-full bg-nominal" />;
      case 'medium':
        return <span className="w-2 h-2 rounded-full bg-warning" />;
      case 'high':
        return <span className="w-2 h-2 rounded-full bg-critical" />;
      case 'critical':
        return <span className="w-2 h-2 rounded-full bg-critical animate-ping" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-y-auto">
      {/* ── Topo do Glossário ── */}
      <div className="p-4 sm:p-6 border-b border-border-subtle bg-surface-panel/90 space-y-3 shrink-0">
        <div className="max-w-5xl mx-auto w-full space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-hydro/10 border border-hydro/30 text-xs font-mono text-hydro">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guia de Acessibilidade & Educação Cidadã</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
            Glossário Cidadão: Entenda o Clima sem Complicação
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed max-w-3xl">
            Dados climáticos não precisam parecer indecifráveis. Veja aqui a tradução direta de cada termo técnico
            utilizado no EcoWatch Brasil (como milímetros de chuva, cotas de rio e partículas PM2.5) para o português do dia a dia.
          </p>

          {/* Barra de Busca e Categorias */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Pesquisar termo (ex: PM2.5, cota de rio, milímetros)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded py-1.5 pl-9 pr-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-hydro transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              {[
                { id: 'all', label: 'Todos os Termos' },
                { id: 'ar', label: 'Qualidade do Ar' },
                { id: 'rios', label: 'Nível dos Rios' },
                { id: 'chuva', label: 'Chuvas (mm)' },
                { id: 'fogo', label: 'Queimadas' },
                { id: 'dengue', label: 'Dengue' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id as any)}
                  className={`px-2.5 py-1 rounded whitespace-nowrap transition-all cursor-pointer ${
                    selectedCat === cat.id
                      ? 'bg-hydro/20 text-hydro border border-hydro/40 font-semibold'
                      : 'bg-surface-card text-zinc-400 hover:text-zinc-200 border border-border-subtle'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Conteúdo dos Termos em Cards Explicativos ── */}
      <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6 pb-24 md:pb-8">
        {filteredTerms.length > 0 ? (
          <div className="space-y-6">
            {filteredTerms.map(term => (
              <article
                key={term.id}
                className="p-5 sm:p-6 rounded-xl bg-surface-panel border border-border-subtle space-y-4 shadow-sm hover:border-hydro/30 transition-colors"
              >
                {/* Cabeçalho do Card */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border-subtle/60 pb-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
                      {term.category === 'ar' && <Wind className="w-5 h-5 text-warning" />}
                      {term.category === 'rios' && <Waves className="w-5 h-5 text-hydro" />}
                      {term.category === 'chuva' && <CloudRain className="w-5 h-5 text-nominal" />}
                      {term.category === 'fogo' && <Flame className="w-5 h-5 text-critical" />}
                      {term.category === 'dengue' && <Bug className="w-5 h-5 text-warning" />}
                      <span>{term.title}</span>
                    </h2>
                    <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-base border border-border-subtle text-[11px] font-mono text-zinc-400">
                      <span className="text-zinc-500 font-semibold">Como aparece no sistema:</span>
                      <span className="text-zinc-200">{term.technicalTerm}</span>
                    </div>
                  </div>
                </div>

                {/* Explicação Simples */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-hydro flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>O que significa em português claro?</span>
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                    {term.simpleExplanation}
                  </p>
                </div>

                {/* Exemplo Prático da Vida Real */}
                <div className="p-3.5 rounded-lg bg-surface-base border border-border-subtle/70 space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                    🏠 Exemplo Prático no seu Dia a Dia
                  </span>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {term.practicalExample}
                  </p>
                </div>

                {/* Tabela ou Escala Didática (Se houver) */}
                {term.scale && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                      📊 Como interpretar os níveis de gravidade:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {term.scale.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded bg-surface-base/80 border border-border-subtle/50 flex items-start gap-2.5"
                        >
                          <div className="mt-1 shrink-0">{getSeverityPill(s.severity)}</div>
                          <div>
                            <span className="font-bold text-zinc-200 block text-[11px]">{s.range}</span>
                            <span className="text-zinc-400 text-[11px] font-sans leading-snug">{s.meaning}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-zinc-500 font-mono text-xs">
            Nenhum termo encontrado para sua busca. Tente buscar por "chuva", "rio", "ar" ou "fogo".
          </div>
        )}

        {/* ── Box de Compromisso com o Cidadão ── */}
        <div className="p-5 rounded-xl bg-hydro/10 border border-hydro/30 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-hydro shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-100 font-sans">
              Compromisso com a Transparência Pública
            </h3>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              O EcoWatch Brasil tem a premissa de que a segurança climática é um direito de todos. Por isso, toda informação
              técnica originada de agências estatais (ANA, INPE, CEMADEN) e satélites internacionais (NASA FIRMS) passa por
              processamento inteligente para que qualquer cidadão saiba exatamente o que fazer para proteger sua vida e seu patrimônio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
