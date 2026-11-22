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
  HelpCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { askEcoWatchAi, fetchAiStatus, syncAiEmbeddings } from '../../services/api';
import { AiAskResponse, RagSourceItem, AiStatusResponse } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  fontes?: RagSourceItem[];
  modelo?: string;
  tempoRespostaMs?: number;
}

const QUICK_PROMPTS = [
  {
    label: '🌊 Rios e Enchentes no RS',
    prompt: 'Qual é a situação atual do nível dos rios e cotas de alerta no Rio Grande do Sul?',
    categoria: 'FLOOD'
  },
  {
    label: '🔥 Queimadas e Fogo',
    prompt: 'O que os órgãos oficiais relatam sobre focos de calor e combate ao fogo no Pantanal e Amazônia?',
    categoria: 'FIRE'
  },
  {
    label: '⛈️ Chuvas e Granizo',
    prompt: 'Onde há previsão recente de chuvas intensas, tempestades e atuação da Defesa Civil?',
    categoria: 'RAIN'
  },
  {
    label: '🌳 Alertas de Desmatamento',
    prompt: 'Quais os dados mais recentes divulgados sobre desmatamento e preservação de biomas?',
    categoria: 'DEFORESTATION'
  },
  {
    label: '🦟 Vigilância da Dengue',
    prompt: 'Quais as capitais e regiões com registros de aumento nos alertas de dengue e arboviroses?',
    categoria: 'DENGUE'
  }
];

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Olá! Sou o **EcoWatch AI**, seu assistente especialista em desastres climáticos e monitoramento ambiental no Brasil.\n\nMinhas respostas são fundamentadas via **RAG (Retrieval-Augmented Generation)** utilizando as notícias e comunicados oficiais ingeridos no banco vetorial do Supabase (Agência Brasil, G1 Meio Ambiente, Defesa Civil, CEMADEN e INPE).\n\nComo posso ajudar você hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      modelo: 'ecowatch-rag-engine'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [aiStatus, setAiStatus] = useState<AiStatusResponse | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    fetchAiStatus().then(status => {
      if (status) setAiStatus(status);
    });
  }, []);

  const handleSend = async (queryToSend?: string, categoryOverride?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setLoading(true);

    try {
      const cat = categoryOverride || selectedCategory;
      const res: AiAskResponse = await askEcoWatchAi(text, cat !== 'ALL' ? cat : undefined);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.resposta,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        fontes: res.fontes,
        modelo: res.modelo,
        tempoRespostaMs: res.tempoRespostaMs
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Desculpe, ocorreu uma instabilidade momentânea ao consultar a base vetorial. Por favor, tente novamente em instantes.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncEmbeddings = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncAiEmbeddings();
      setSyncMessage(res.message);
      const status = await fetchAiStatus();
      if (status) setAiStatus(status);
      setTimeout(() => setSyncMessage(null), 4000);
    } finally {
      setSyncing(false);
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
      {/* ── Cabeçalho do Assistente ── */}
      <div className="p-4 border-b border-border-subtle bg-surface-panel/90 backdrop-blur shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-hydro/15 border border-hydro/30 flex items-center justify-center text-hydro shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <Sparkles className="w-5 h-5 animate-pulse text-hydro" />
            </div>
            <div>
              <h1 className="text-base font-bold font-mono text-zinc-100 flex items-center gap-2">
                <span>EcoWatch AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-hydro/20 text-hydro border border-hydro/30 font-semibold uppercase tracking-wider">
                  RAG Neural
                </span>
              </h1>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Pergunte sobre desastres, enchentes, clima e queimadas com fundamentação oficial em tempo real
              </p>
            </div>
          </div>

          {/* Badges de Status da Infraestrutura */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-card border border-border-subtle text-[11px] font-mono text-zinc-300" title="Banco vetorial pgvector no Supabase">
              <Database className="w-3 h-3 text-hydro" />
              <span>Base RAG: {aiStatus ? `${aiStatus.totalEmbeddings || aiStatus.totalNoticias} docs` : 'Conectada'}</span>
            </div>

            <button
              onClick={handleSyncEmbeddings}
              disabled={syncing}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-card hover:bg-surface-hover border border-border-subtle hover:border-hydro text-[11px] font-mono text-zinc-300 transition-all cursor-pointer disabled:opacity-50"
              title="Sincronizar novos embeddings vetoriais"
            >
              <RefreshCw className={`w-3 h-3 text-hydro ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Indexando...' : 'Sincronizar'}</span>
            </button>
          </div>
        </div>

        {syncMessage && (
          <div className="mt-2.5 px-3 py-1.5 rounded text-xs font-mono bg-nominal/15 border border-nominal/30 text-nominal flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{syncMessage}</span>
          </div>
        )}
      </div>

      {/* ── Feed de Conversa ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                msg.sender === 'user'
                  ? 'bg-zinc-700 text-zinc-200'
                  : 'bg-hydro/20 border border-hydro/40 text-hydro shadow-sm'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Conteúdo da Mensagem */}
            <div
              className={`rounded-xl p-4 text-xs font-sans leading-relaxed border ${
                msg.sender === 'user'
                  ? 'bg-hydro/15 border-hydro/30 text-zinc-100'
                  : 'bg-surface-card/90 border-border-subtle text-zinc-200 shadow-md'
              }`}
            >
              <div className="whitespace-pre-line prose-invert text-zinc-200">
                {msg.text}
              </div>

              {/* Fontes Oficiais Citadas (RAG) */}
              {msg.fontes && msg.fontes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border-subtle/80 space-y-2">
                  <div className="text-[11px] font-mono font-semibold text-hydro flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Fontes Oficiais Consultadas ({msg.fontes.length}):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                    {msg.fontes.map(fonte => (
                      <a
                        key={fonte.id}
                        href={fonte.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-surface-base/80 hover:bg-surface-hover border border-border-subtle hover:border-hydro/50 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                            <span className="flex items-center gap-1">
                              {getCategoryIcon(fonte.categoria)}
                              <span className="font-semibold text-zinc-300">{fonte.fonte}</span>
                            </span>
                            {fonte.estado && (
                              <span className="px-1.5 py-0.2 rounded bg-surface-card border border-border-subtle text-zinc-300 font-bold">
                                {fonte.municipio ? `${fonte.municipio}/${fonte.estado}` : fonte.estado}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-medium text-zinc-200 group-hover:text-hydro transition-colors line-clamp-2">
                            {fonte.titulo}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border-subtle/40 text-[10px] font-mono text-zinc-400">
                          <span>{fonte.similaridade ? `Relevância: ${Math.round(fonte.similaridade * 100)}%` : 'Fonte Verificada'}</span>
                          <span className="flex items-center gap-0.5 text-hydro font-medium">
                            <span>Acessar</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Rodapé da mensagem */}
              <div className="flex items-center justify-between gap-3 mt-2 pt-1 text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{msg.timestamp}</span>
                </span>
                {msg.modelo && (
                  <span className="text-zinc-400">
                    {msg.modelo} {msg.tempoRespostaMs ? `(${msg.tempoRespostaMs}ms)` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-3xl mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-hydro/20 border border-hydro/40 text-hydro flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-xl p-4 bg-surface-card border border-border-subtle text-xs text-zinc-300 flex items-center gap-2 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-hydro animate-spin" />
              <span>Buscando no banco vetorial e formulando resposta com IA...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Sugestões Rápidas (Chips) ── */}
      <div className="px-4 py-2 border-t border-border-subtle/60 bg-surface-dim/40 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-hydro" />
          <span>Sugestões:</span>
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt, qp.categoria)}
            disabled={loading}
            className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-surface-card hover:bg-surface-hover border border-border-subtle hover:border-hydro text-zinc-300 hover:text-white transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* ── Barra de Input e Envio ── */}
      <div className="p-3 sm:p-4 border-t border-border-subtle bg-surface-panel/95 backdrop-blur shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          {/* Seletor de Categoria Opcional */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-surface-card border border-border-subtle rounded-lg px-2.5 py-2 text-xs font-mono text-zinc-300 outline-none hover:border-hydro/50 cursor-pointer hidden sm:inline-block shrink-0"
            title="Filtrar por tema específico"
          >
            <option value="ALL">🔍 Todos os Temas</option>
            <option value="FLOOD">🌊 Rios & Enchentes</option>
            <option value="FIRE">🔥 Queimadas & Fogo</option>
            <option value="RAIN">⛈️ Chuvas Extremas</option>
            <option value="DEFORESTATION">🌳 Desmatamento</option>
            <option value="DENGUE">🦟 Dengue</option>
            <option value="GENERAL">🛡️ Defesa Civil</option>
          </select>

          {/* Campo de Texto */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Pergunte sobre desastres, enchentes, queimadas ou consulte dados de uma cidade/estado..."
              disabled={loading}
              className="w-full bg-surface-card border border-border-subtle rounded-lg px-3.5 py-2 text-xs font-sans text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-hydro focus:ring-1 focus:ring-hydro/30 transition-all pr-10"
            />
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-4 py-2 rounded-lg bg-hydro hover:bg-hydro/90 text-surface-dim font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Perguntar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
