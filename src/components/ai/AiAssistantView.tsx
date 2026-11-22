import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Database,
  ExternalLink,
  Flame,
  Waves,
  CloudRain,
  Bug,
  Trees,
  ShieldAlert,
  RefreshCw,
  Clock,
  MapPin,
  AlertTriangle,
  CalendarDays
} from 'lucide-react';
import { askEcoWatchAi, fetchAiStatus, AiIndisponivelError } from '../../services/api';
import { AiAskResponse, RagSourceItem, AiStatusResponse, AiHistoricoItem } from '../../types';
import { Markdown } from './Markdown';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  fontes?: RagSourceItem[];
  modelo?: string;
  tempoRespostaMs?: number;
  limiteAtingido?: boolean;
  cidades?: string[];
  periodo?: string | null;
  erro?: { pergunta: string; categoria: string };
}

const QUICK_PROMPTS = [
  { label: '🌡️ Clima em Cuiabá', prompt: 'Como estão os alertas e a previsão para Cuiabá nos próximos dias?', categoria: 'ALL' },
  { label: '🌊 Rios no RS', prompt: 'Qual é a situação dos rios e das cotas de alerta em Porto Alegre?', categoria: 'FLOOD' },
  { label: '🔥 Queimadas', prompt: 'O que os órgãos oficiais relatam sobre focos de calor no Pantanal e na Amazônia?', categoria: 'FIRE' },
  { label: '⛈️ Chuvas fortes', prompt: 'Onde há previsão recente de chuvas intensas e atuação da Defesa Civil?', categoria: 'RAIN' },
  { label: '🦟 Dengue', prompt: 'Quais capitais têm aumento nos alertas de dengue?', categoria: 'DENGUE' },
  { label: '🌳 Desmatamento', prompt: 'Quais os dados mais recentes sobre desmatamento?', categoria: 'DEFORESTATION' }
];

const CATEGORIAS = [
  { valor: 'ALL', rotulo: 'Todos' },
  { valor: 'FLOOD', rotulo: '🌊 Rios' },
  { valor: 'FIRE', rotulo: '🔥 Fogo' },
  { valor: 'RAIN', rotulo: '⛈️ Chuva' },
  { valor: 'DEFORESTATION', rotulo: '🌳 Desmatamento' },
  { valor: 'DENGUE', rotulo: '🦟 Dengue' },
  { valor: 'GENERAL', rotulo: '🛡️ Defesa Civil' }
];

const agora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const dataCurta = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [demorando, setDemorando] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [aiStatus, setAiStatus] = useState<AiStatusResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 || loading) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    fetchAiStatus().then(status => {
      if (status) setAiStatus(status);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      setDemorando(false);
      return;
    }
    const t = setTimeout(() => setDemorando(true), 8000);
    return () => clearTimeout(t);
  }, [loading]);

  const historico = (): AiHistoricoItem[] =>
    messages
      .filter(m => !m.erro)
      .slice(-4)
      .map(m => ({ autor: m.sender === 'user' ? 'usuario' : 'ia', texto: m.text }));

  const handleSend = async (queryToSend?: string, categoryOverride?: string, repetir = false) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || loading) return;
    const cat = categoryOverride || selectedCategory;
    const anteriores = historico();

    setMessages(prev => {
      const base = repetir ? prev.filter(m => !m.erro) : prev;
      return repetir ? base : [...base, { id: `user-${Date.now()}`, sender: 'user', text, timestamp: agora() }];
    });
    if (!queryToSend) setInputQuery('');
    setLoading(true);

    try {
      const res: AiAskResponse = await askEcoWatchAi(text, cat !== 'ALL' ? cat : undefined, undefined, 4, anteriores);
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.resposta,
        timestamp: agora(),
        fontes: res.fontes,
        modelo: res.modelo,
        tempoRespostaMs: res.tempoRespostaMs,
        limiteAtingido: res.limiteAtingido,
        cidades: res.cidadesConsultadas,
        periodo: res.periodoFontes
      }]);
    } catch (e) {
      const offline = e instanceof AiIndisponivelError && e.motivo === 'offline';
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: offline
          ? 'Não consegui falar com o servidor da IA. Ele é gratuito e às vezes leva até um minuto para acordar. Tente de novo.'
          : 'O servidor da IA respondeu com erro. Tente de novo em instantes.',
        timestamp: agora(),
        erro: { pergunta: text, categoria: cat }
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'FIRE': return <Flame className="w-3.5 h-3.5 text-critical" />;
      case 'FLOOD': return <Waves className="w-3.5 h-3.5 text-hydro" />;
      case 'RAIN': return <CloudRain className="w-3.5 h-3.5 text-nominal" />;
      case 'DENGUE': return <Bug className="w-3.5 h-3.5 text-warning" />;
      case 'DEFORESTATION': return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <ShieldAlert className="w-3.5 h-3.5 text-zinc-300" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-hidden">
      {/* ── Cabeçalho ── */}
      <div className="px-4 sm:px-6 py-4 border-b border-border-subtle bg-surface-panel/90 backdrop-blur shrink-0">
        <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-hydro/15 border border-hydro/30 flex items-center justify-center text-hydro">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-zinc-100">Pergunte ao EcoWatch</h1>
              <p className="text-sm text-zinc-400">Respostas com os alertas, previsões e notícias oficiais salvos no sistema</p>
            </div>
          </div>
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-card border border-border-subtle text-xs text-zinc-300 tnum"
            title="Notícias indexadas no banco vetorial (pgvector no Supabase)"
          >
            <Database className="w-3.5 h-3.5 text-hydro" />
            <span>{aiStatus ? `${aiStatus.totalEmbeddings || aiStatus.totalNoticias} notícias na base` : 'Base de notícias'}</span>
          </div>
        </div>
      </div>

      {/* ── Conversa ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {messages.length === 0 && (
            <div className="text-center pt-6 sm:pt-12 animate-[fadeUp_0.4s_ease-out]">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-hydro/15 border border-hydro/30 flex items-center justify-center text-hydro mb-4">
                <Bot className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100">Como posso ajudar?</h2>
              <p className="text-sm text-zinc-400 mt-2 max-w-lg mx-auto leading-relaxed">
                Cite uma capital para eu usar os dados medidos dela, ou pergunte sobre enchentes, queimadas,
                chuvas e dengue. Eu sempre mostro de onde veio a informação.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-8 text-left">
                {QUICK_PROMPTS.map(qp => (
                  <button
                    key={qp.label}
                    onClick={() => handleSend(qp.prompt, qp.categoria)}
                    disabled={loading}
                    className="text-left p-3.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-border-subtle hover:border-hydro/50 transition-all cursor-pointer disabled:opacity-50 group"
                  >
                    <div className="text-sm font-medium text-zinc-100">{qp.label}</div>
                    <div className="text-xs text-zinc-400 mt-1 line-clamp-2 group-hover:text-zinc-300">{qp.prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-[fadeUp_0.3s_ease-out]`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                msg.sender === 'user' ? 'bg-zinc-700 text-zinc-200' : msg.erro ? 'bg-warning/15 border border-warning/40 text-warning' : 'bg-hydro/15 border border-hydro/40 text-hydro'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : msg.erro ? <AlertTriangle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                msg.sender === 'user'
                  ? 'bg-hydro/15 border-hydro/30 text-zinc-100 rounded-tr-sm'
                  : 'bg-surface-card/90 border-border-subtle text-zinc-200 rounded-tl-sm'
              }`}>
                {msg.limiteAtingido && (
                  <div className="mb-3 px-3 py-2 rounded-lg bg-warning/10 border border-warning/30 text-warning text-xs flex gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>A cota gratuita da IA acabou por agora. Esta resposta foi montada só com os dados salvos.</span>
                  </div>
                )}

                {msg.sender === 'user' ? <p className="whitespace-pre-line">{msg.text}</p> : <Markdown texto={msg.limiteAtingido ? msg.text.replace(/^⚠️.*?\n\n/s, '') : msg.text} />}

                {msg.erro && (
                  <button
                    onClick={() => handleSend(msg.erro!.pergunta, msg.erro!.categoria, true)}
                    disabled={loading}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning/15 hover:bg-warning/25 border border-warning/40 text-warning text-xs font-medium cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Tentar de novo
                  </button>
                )}

                {(msg.cidades?.length || msg.periodo) ? (
                  <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                    {msg.cidades?.map(c => (
                      <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-nominal/10 border border-nominal/30 text-nominal">
                        <MapPin className="w-3 h-3" /> Dados medidos: {c}
                      </span>
                    ))}
                    {msg.periodo && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-base border border-border-subtle text-zinc-300">
                        <CalendarDays className="w-3 h-3" /> Notícias de {msg.periodo}
                      </span>
                    )}
                  </div>
                ) : null}

                {msg.fontes && msg.fontes.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border-subtle/80">
                    <div className="text-xs font-medium text-zinc-400 mb-2">Fontes ({msg.fontes.length})</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.fontes.map(fonte => (
                        <a
                          key={fonte.id}
                          href={fonte.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-lg bg-surface-base/80 hover:bg-surface-hover border border-border-subtle hover:border-hydro/50 transition-all group"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-1">
                            <span className="flex items-center gap-1 min-w-0">
                              {getCategoryIcon(fonte.categoria)}
                              <span className="font-medium text-zinc-300 truncate">{fonte.fonte}</span>
                            </span>
                            <span className="shrink-0 tnum">
                              {[fonte.municipio ? `${fonte.municipio}/${fonte.estado}` : fonte.estado, dataCurta(fonte.dataHora)].filter(Boolean).join(' · ')}
                            </span>
                          </div>
                          <div className="text-sm text-zinc-200 group-hover:text-hydro transition-colors line-clamp-2 flex gap-1">
                            <span className="flex-1">{fonte.titulo}</span>
                            <ExternalLink className="w-3 h-3 mt-1 shrink-0 opacity-60" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 mt-2 text-[11px] text-zinc-500 tnum">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{msg.timestamp}</span>
                  {msg.modelo && msg.sender === 'ai' && (
                    <span>{msg.modelo}{msg.tempoRespostaMs ? ` · ${(msg.tempoRespostaMs / 1000).toFixed(1)} s` : ''}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-hydro/15 border border-hydro/40 text-hydro flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-surface-card border border-border-subtle text-sm text-zinc-300 flex items-center gap-2.5">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-hydro animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-hydro animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-hydro animate-bounce" />
                </span>
                <span>{demorando ? 'Acordando o servidor gratuito, pode levar até 1 minuto…' : 'Consultando os dados e as notícias…'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Entrada ── */}
      <div className="px-3 sm:px-6 pt-2 pb-3 sm:pb-4 border-t border-border-subtle bg-surface-panel/95 backdrop-blur shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIAS.map(c => (
              <button
                key={c.valor}
                onClick={() => setSelectedCategory(c.valor)}
                className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  selectedCategory === c.valor
                    ? 'bg-hydro/20 border-hydro text-hydro'
                    : 'bg-surface-card border-border-subtle text-zinc-400 hover:text-zinc-200 hover:border-focus'
                }`}
              >
                {c.rotulo}
              </button>
            ))}
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ex.: Vai chover forte em Recife esta semana?"
              disabled={loading}
              maxLength={500}
              className="flex-1 min-w-0 bg-surface-card border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-hydro focus:ring-1 focus:ring-hydro/30 transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              aria-label="Perguntar"
              className="px-4 py-2.5 rounded-xl bg-hydro hover:bg-hydro/90 text-surface-dim font-semibold text-sm flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Perguntar</span>
            </button>
          </form>
          <p className="text-[11px] text-zinc-500 mt-2 text-center">
            A IA pode errar. Em emergência, siga a Defesa Civil (199) e o Corpo de Bombeiros (193).
          </p>
        </div>
      </div>
    </div>
  );
};
