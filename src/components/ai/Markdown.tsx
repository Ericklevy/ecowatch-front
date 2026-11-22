import React from 'react';

/**
 * Markdown simples e seguro para as respostas da IA: **negrito**, *itálico*, listas com "-", "•" ou "1."
 * e parágrafos. Não usa innerHTML, então nenhum HTML vindo da IA é executado.
 */
function inline(texto: string, chave: string): React.ReactNode[] {
  const partes = texto.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g);
  return partes.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
      return <strong key={`${chave}-${i}`} className="font-semibold text-zinc-50">{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) {
      return <em key={`${chave}-${i}`} className="text-zinc-300">{p.slice(1, -1)}</em>;
    }
    return <React.Fragment key={`${chave}-${i}`}>{p}</React.Fragment>;
  });
}

export const Markdown: React.FC<{ texto: string }> = ({ texto }) => {
  const blocos: React.ReactNode[] = [];
  let lista: { ordenada: boolean; itens: string[] } | null = null;

  const fecharLista = () => {
    if (!lista) return;
    const Tag = lista.ordenada ? 'ol' : 'ul';
    blocos.push(
      <Tag key={`l${blocos.length}`} className={`${lista.ordenada ? 'list-decimal' : 'list-disc'} pl-5 space-y-1 marker:text-hydro`}>
        {lista.itens.map((item, i) => <li key={i}>{inline(item, `li${blocos.length}-${i}`)}</li>)}
      </Tag>
    );
    lista = null;
  };

  texto.split('\n').forEach((linha, n) => {
    const l = linha.trim();
    const marcador = l.match(/^([-•*]|📌)\s+(.*)$/);
    const numero = l.match(/^\d+[.)]\s+(.*)$/);
    if (marcador || numero) {
      const ordenada = !!numero;
      if (lista && lista.ordenada !== ordenada) fecharLista();
      lista = lista ?? { ordenada, itens: [] };
      lista.itens.push(numero ? numero[1] : marcador![2]);
      return;
    }
    fecharLista();
    if (!l) return;
    const titulo = l.match(/^#{1,4}\s+(.*)$/);
    blocos.push(
      titulo
        ? <p key={`p${n}`} className="font-semibold text-zinc-50">{inline(titulo[1], `h${n}`)}</p>
        : <p key={`p${n}`}>{inline(l, `p${n}`)}</p>
    );
  });
  fecharLista();

  return <div className="space-y-2.5">{blocos}</div>;
};
