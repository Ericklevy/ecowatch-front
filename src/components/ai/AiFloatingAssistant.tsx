import React, { useEffect, useState } from 'react';
import { CityInfo } from '../../types';
import { AiAssistantView } from './AiAssistantView';
import { Mascote } from './Mascote';
import { useChat, marcarPainelAberto } from './chatStore';

const CHAVE_DICA = 'ecowatch:gota-dica-vista';

const lerDicaVista = () => {
  try { return localStorage.getItem(CHAVE_DICA) === '1'; } catch { return false; }
};
const gravarDicaVista = () => {
  try { localStorage.setItem(CHAVE_DICA, '1'); } catch { /* navegador sem storage */ }
};

interface Props {
  cidade?: CityInfo;
  /** Leva para a aba "Assistente IA" com a mesma conversa. */
  onExpand: () => void;
}

/**
 * Mascote flutuante no canto inferior esquerdo. Abre um painel de conversa
 * sem sair da tela atual, com sugestões da cidade que está selecionada no mapa.
 */
export const AiFloatingAssistant: React.FC<Props> = ({ cidade, onExpand }) => {
  const [aberto, setAberto] = useState(false);
  const [dica, setDica] = useState(false);
  const { loading, naoLidas } = useChat();

  useEffect(() => {
    marcarPainelAberto(aberto);
    if (aberto) gravarDicaVista();
  }, [aberto]);

  // Balão de boas-vindas uma única vez, depois de alguns segundos
  useEffect(() => {
    if (lerDicaVista()) return;
    const mostra = setTimeout(() => setDica(true), 2500);
    const esconde = setTimeout(() => { setDica(false); gravarDicaVista(); }, 11000);
    return () => { clearTimeout(mostra); clearTimeout(esconde); };
  }, []);

  // Esc fecha o painel
  useEffect(() => {
    if (!aberto) return;
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [aberto]);

  const nomeCidade = cidade && cidade.slug !== 'all' ? cidade.nome : null;

  return (
    <>
      {/* Painel de conversa: lateral esquerda no computador, tela cheia no celular */}
      {aberto && (
        <div
          role="dialog"
          aria-label="Conversa com a Gota, IA do EcoWatch"
          className="fixed z-[1200] inset-0 sm:inset-auto sm:left-4 sm:bottom-24 sm:w-[390px] sm:h-[min(600px,calc(100vh-160px))]
                     flex flex-col sm:rounded-2xl overflow-hidden border border-border-subtle bg-surface-base shadow-2xl shadow-black/60
                     animate-[gotaAbre_0.22s_ease-out] origin-bottom-left"
        >
          <AiAssistantView
            compact
            cidade={cidade}
            onClose={() => setAberto(false)}
            onExpand={() => { setAberto(false); onExpand(); }}
          />
        </div>
      )}

      {/* Botão do mascote */}
      <div className={`fixed z-[1100] left-3 sm:left-4 bottom-20 sm:bottom-12 ${aberto ? 'hidden sm:block' : ''}`}>
        {dica && !aberto && (
          <button
            onClick={() => { setDica(false); setAberto(true); }}
            className="absolute bottom-full left-2 mb-2 w-60 text-left text-sm text-zinc-100 bg-surface-card border border-hydro/40
                       rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-xl animate-[fadeUp_0.3s_ease-out] cursor-pointer"
          >
            Oi! Eu sou a <strong className="text-hydro">Gota</strong> 💧
            <span className="block text-xs text-zinc-400 mt-0.5">
              {nomeCidade ? `Quer saber como está o clima em ${nomeCidade}?` : 'Me pergunte sobre clima e riscos nas capitais.'}
            </span>
          </button>
        )}

        <button
          onClick={() => { setDica(false); setAberto(a => !a); }}
          aria-label={aberto ? 'Fechar a Gota' : 'Abrir a Gota, assistente de IA'}
          title={aberto ? 'Fechar' : 'Pergunte à Gota'}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-transform
                      bg-surface-panel/90 backdrop-blur border shadow-lg shadow-black/40 hover:scale-105 active:scale-95
                      ${aberto ? 'border-hydro ring-2 ring-hydro/30' : 'border-hydro/40'}`}
        >
          <Mascote size={50} pensando={loading} className={loading ? 'gota-pensa' : 'gota-flutua'} />
          {naoLidas > 0 && !aberto && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-critical text-white text-[11px] font-bold flex items-center justify-center">
              {naoLidas}
            </span>
          )}
        </button>
      </div>
    </>
  );
};
