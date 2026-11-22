import { useSyncExternalStore } from 'react';
import { askEcoWatchAi, AiIndisponivelError } from '../../services/api';
import { AiHistoricoItem, RagSourceItem } from '../../types';

/**
 * Conversa com a IA compartilhada entre o mascote flutuante e a aba "Assistente IA":
 * a mesma conversa continua quando a pessoa expande o painel.
 */
export interface Message {
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

interface Estado {
  messages: Message[];
  loading: boolean;
  /** Respostas que chegaram enquanto o painel do mascote estava fechado. */
  naoLidas: number;
}

let estado: Estado = { messages: [], loading: false, naoLidas: 0 };
const ouvintes = new Set<() => void>();
let painelAberto = false;

const mudar = (parcial: Partial<Estado>) => {
  estado = { ...estado, ...parcial };
  ouvintes.forEach(f => f());
};

export const agora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function useChat() {
  return useSyncExternalStore(
    f => { ouvintes.add(f); return () => ouvintes.delete(f); },
    () => estado
  );
}

/** O mascote avisa quando o painel abre ou fecha, para contar as respostas não lidas. */
export function marcarPainelAberto(aberto: boolean) {
  painelAberto = aberto;
  if (aberto && estado.naoLidas) mudar({ naoLidas: 0 });
}

export async function enviarPergunta(texto: string, categoria = 'ALL', repetir = false) {
  const text = texto.trim();
  if (!text || estado.loading) return;

  const anteriores: AiHistoricoItem[] = estado.messages
    .filter(m => !m.erro)
    .slice(-4)
    .map(m => ({ autor: m.sender === 'user' ? 'usuario' : 'ia', texto: m.text }));

  const base = repetir ? estado.messages.filter(m => !m.erro) : estado.messages;
  mudar({
    messages: repetir ? base : [...base, { id: `user-${Date.now()}`, sender: 'user', text, timestamp: agora() }],
    loading: true
  });

  let resposta: Message;
  try {
    const res = await askEcoWatchAi(text, categoria !== 'ALL' ? categoria : undefined, undefined, 4, anteriores);
    resposta = {
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
    };
  } catch (e) {
    const offline = e instanceof AiIndisponivelError && e.motivo === 'offline';
    resposta = {
      id: `err-${Date.now()}`,
      sender: 'ai',
      text: offline
        ? 'Não consegui falar com o servidor da IA. Ele é gratuito e às vezes leva até um minuto para acordar. Tente de novo.'
        : 'O servidor da IA respondeu com erro. Tente de novo em instantes.',
      timestamp: agora(),
      erro: { pergunta: text, categoria }
    };
  }
  mudar({
    messages: [...estado.messages, resposta],
    loading: false,
    naoLidas: painelAberto ? 0 : estado.naoLidas + 1
  });
}

export function limparConversa() {
  if (!estado.loading) mudar({ messages: [], naoLidas: 0 });
}
