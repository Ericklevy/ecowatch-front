import React, { useState, useEffect, useMemo } from 'react';
import {
  Factory,
  Flame,
  Trees,
  Zap,
  Trash2,
  Tractor,
  BarChart3,
  ExternalLink,
  Info,
  RefreshCw,
  Building2,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  fetchEmissoesRanking,
  fetchEmissoesEstados,
  fetchEmissoesMunicipio
} from '../../services/api';
import {
  RankingEmissaoItem,
  EmissaoEstadoItem,
  MunicipioEmissaoDetalhe
} from '../../types';

const UFS = [
  { sigla: 'ALL', nome: '🇧🇷 Brasil (Nacional)' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'TO', nome: 'Tocantins' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'DF', nome: 'Distrito Federal' }
];

const GASES = [
  { id: 'CO2e', label: 'CO₂e (GWP-AR5)', desc: 'Gases combinados em CO₂ equivalente' },
  { id: 'CH4', label: 'Metano (CH₄)', desc: 'Pecuária, aterros e queima de biomassa' }
];

export const EmissionsView: React.FC = () => {
  const [selectedGas, setSelectedGas] = useState<string>('CO2e');
  const [selectedUf, setSelectedUf] = useState<string>('ALL');
  const [ranking, setRanking] = useState<RankingEmissaoItem[]>([]);
  const [estados, setEstados] = useState<EmissaoEstadoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);
  const [municipioDetalhe, setMunicipioDetalhe] = useState<MunicipioEmissaoDetalhe | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState<boolean>(false);
  const [visualizacao, setVisualizacao] = useState<'municipios' | 'estados'>('municipios');

  useEffect(() => {
    let ativo = true;
    setLoading(true);

    Promise.all([
      fetchEmissoesRanking(selectedGas, selectedUf, 2023, 10),
      fetchEmissoesEstados(selectedGas, 2023)
    ]).then(([r, e]) => {
      if (!ativo) return;
      setRanking(r);
      setEstados(e);
      setLoading(false);
    }).catch(() => {
      if (!ativo) return;
      setLoading(false);
    });

    return () => { ativo = false; };
  }, [selectedGas, selectedUf]);

  useEffect(() => {
    if (!selectedMunicipio) {
      setMunicipioDetalhe(null);
      return;
    }
    let ativo = true;
    setLoadingDetalhe(true);
    fetchEmissoesMunicipio(selectedMunicipio, selectedGas).then(d => {
      if (ativo) {
        setMunicipioDetalhe(d);
        setLoadingDetalhe(false);
      }
    });
    return () => { ativo = false; };
  }, [selectedMunicipio, selectedGas]);

  const maxEmissao = useMemo(() => {
    if (visualizacao === 'municipios') {
      return ranking.length > 0 ? ranking[0].emissaoTotal : 1;
    }
    return estados.length > 0 ? estados[0].emissaoTotal : 1;
  }, [ranking, estados, visualizacao]);

  const getSectorIcon = (setor: string) => {
    const s = setor.toLowerCase();
    if (s.includes('agro')) return <Tractor className="w-4 h-4 text-amber-400" />;
    if (s.includes('mudan') || s.includes('terra') || s.includes('florest')) return <Trees className="w-4 h-4 text-emerald-400" />;
    if (s.includes('energ')) return <Zap className="w-4 h-4 text-amber-300" />;
    if (s.includes('indus')) return <Factory className="w-4 h-4 text-cyan-400" />;
    if (s.includes('resídu') || s.includes('residu')) return <Trash2 className="w-4 h-4 text-purple-400" />;
    return <Flame className="w-4 h-4 text-critical" />;
  };

  const formatNumero = (val: number) => {
    if (val >= 1_000_000) {
      return `${(val / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} M t`;
    }
    if (val >= 1_000) {
      return `${(val / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mil t`;
    }
    return `${val.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} t`;
  };

  // Frase síntese do estado ou Brasil
  const sinteseRegional = useMemo(() => {
    if (selectedUf === 'PA') {
      return 'No Pará, a maior parte das emissões de CO₂e decorre de Mudança de uso da terra (desmatamento), enquanto o metano (CH₄) é impulsionado pelo rebanho bovino da pecuária.';
    }
    if (selectedUf === 'MT') {
      return 'Em Mato Grosso, as emissões se dividem intensamente entre conversão florestal/cerrado e a vasta cadeia da agropecuária mecanizada e gado de corte.';
    }
    if (selectedUf === 'SP') {
      return 'Em São Paulo, o setor de Energia (transportes rodoviários e indústria) e Resíduos urbanos lideram o perfil de emissões.';
    }
    if (selectedUf === 'MG') {
      return 'Em Minas Gerais, a pecuária leiteira e de corte lidera as emissões agrícolas, seguida por processos industriais siderúrgicos e cimento.';
    }
    if (selectedUf === 'ALL') {
      return selectedGas === 'CH4'
        ? 'No Brasil, a grande maioria do metano (CH₄) tem origem na fermentação entérica bovina (Agropecuária), com contribuição expressiva de queimadas e aterros sanitários.'
        : 'No Brasil, o desmatamento (Mudança de uso da terra) e a Agropecuária respondem juntos por mais de 70% das emissões brutas de CO₂ equivalente.';
    }
    return null;
  }, [selectedUf, selectedGas]);

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-base overflow-y-auto">
      {/* ── Cabeçalho ── */}
      <div className="px-4 sm:px-6 py-5 border-b border-border-subtle bg-surface-panel/90 backdrop-blur shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  Emissões de Gases de Efeito Estufa
                  <span className="text-xs px-2 py-0.5 rounded-full bg-hydro/10 text-hydro border border-hydro/30 font-mono">
                    SEEG 14.0
                  </span>
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Inventário oficial por município e estado · Observatório do Clima (série histórica até 2023)
                </p>
              </div>
            </div>
          </div>

          {/* Seletores */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Seletor de Gás */}
            <div className="flex items-center bg-surface-card border border-border-subtle rounded-xl p-1">
              {GASES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGas(g.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedGas === g.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title={g.desc}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Seletor de UF */}
            <select
              value={selectedUf}
              onChange={e => setSelectedUf(e.target.value)}
              className="bg-surface-card border border-border-subtle text-zinc-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              {UFS.map(uf => (
                <option key={uf.sigla} value={uf.sigla} className="bg-surface-panel text-zinc-200">
                  {uf.nome}
                </option>
              ))}
            </select>

            {/* Alternar Municípios / Estados */}
            <div className="flex items-center bg-surface-card border border-border-subtle rounded-xl p-1">
              <button
                onClick={() => setVisualizacao('municipios')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  visualizacao === 'municipios'
                    ? 'bg-hydro/20 text-hydro border border-hydro/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Municípios
              </button>
              <button
                onClick={() => setVisualizacao('estados')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  visualizacao === 'estados'
                    ? 'bg-hydro/20 text-hydro border border-hydro/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Estados (UF)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Conteúdo Principal ── */}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner com síntese regional */}
        {sinteseRegional && (
          <div className="p-4 rounded-xl bg-surface-card/90 border border-border-subtle flex items-start gap-3 text-xs text-zinc-300 leading-relaxed shadow-sm">
            <Info className="w-4 h-4 text-hydro shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-100">Visão Geral do Recorte: </span>
              {sinteseRegional}
            </div>
          </div>
        )}

        {/* Grade: Ranking + Detalhes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda: Ranking em Barras (2 colunas no desktop) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                {visualizacao === 'municipios'
                  ? `Top 10 Municípios Emissores ${selectedUf !== 'ALL' ? `(${selectedUf})` : 'do Brasil'}`
                  : 'Emissões Totais por Estado (UF)'}
              </h2>
              <span className="text-xs text-zinc-400 font-mono">
                Ano base: 2023 · {selectedGas === 'CH4' ? 'Metano bruto' : 'CO₂ equivalente'}
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center rounded-2xl bg-surface-card border border-border-subtle">
                <RefreshCw className="w-6 h-6 text-hydro animate-spin mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Carregando dados consolidados do SEEG...</p>
              </div>
            ) : visualizacao === 'municipios' ? (
              ranking.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-surface-card border border-border-subtle text-zinc-400 text-xs">
                  Sem dados registrados para este filtro.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {ranking.map((item, index) => {
                    const pctBar = maxEmissao > 0 ? (item.emissaoTotal / maxEmissao) * 100 : 0;
                    const isSelected = selectedMunicipio === item.municipio;

                    return (
                      <div
                        key={item.codigoIbge + item.municipio}
                        onClick={() => setSelectedMunicipio(item.municipio)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-surface-hover border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'bg-surface-card border-border-subtle hover:border-emerald-500/40 hover:bg-surface-hover/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-surface-base border border-border-subtle text-[11px] font-mono font-bold text-zinc-400 flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors truncate">
                              {item.municipio}
                            </span>
                            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-surface-base text-zinc-400 border border-border-subtle shrink-0">
                              {item.uf}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-zinc-100 font-mono">
                              {formatNumero(item.emissaoTotal)}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {item.percentualSetorPrincipal}% {item.setorPrincipal}
                            </div>
                          </div>
                        </div>

                        {/* Barra horizontal comparativa */}
                        <div className="w-full h-2 rounded-full bg-surface-base overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              index === 0
                                ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                                : index < 3
                                ? 'bg-gradient-to-r from-emerald-500/80 to-emerald-400'
                                : 'bg-hydro/70'
                            }`}
                            style={{ width: `${Math.max(pctBar, 3)}%` }}
                          />
                        </div>

                        {/* Setor dominante e explicação curta */}
                        <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
                          <div className="flex items-center gap-1.5 truncate">
                            {getSectorIcon(item.setorPrincipal)}
                            <span className="truncate">{item.explicacaoSetor}</span>
                          </div>
                          <span className="text-[10px] text-zinc-400 group-hover:text-emerald-400 shrink-0 flex items-center gap-0.5">
                            Ver quebra <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Visualização de Estados (UF) */
              <div className="space-y-2.5">
                {estados.map((item, index) => {
                  const pctBar = maxEmissao > 0 ? (item.emissaoTotal / maxEmissao) * 100 : 0;
                  return (
                    <div
                      key={item.uf}
                      className="p-3.5 rounded-xl bg-surface-card border border-border-subtle hover:border-emerald-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-surface-base border border-border-subtle text-[11px] font-mono font-bold text-zinc-400 flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-zinc-100">
                            {item.uf}
                          </span>
                          <span className="text-xs text-zinc-400">
                            · Principal: <strong className="text-zinc-200">{item.setorPrincipal}</strong> ({item.percentualSetorPrincipal}%)
                          </span>
                        </div>
                        <div className="text-sm font-bold text-zinc-100 font-mono">
                          {formatNumero(item.emissaoTotal)}
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-base overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-hydro"
                          style={{ width: `${Math.max(pctBar, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Coluna da Direita: Quebra por Setor e Histórico do Município Selecionado */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface-card border border-border-subtle sticky top-4">
              <h3 className="text-sm font-semibold text-zinc-100 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-hydro" />
                {selectedMunicipio ? selectedMunicipio : 'Selecione um município'}
              </h3>

              {loadingDetalhe ? (
                <div className="py-12 text-center text-xs text-zinc-400">
                  <RefreshCw className="w-5 h-5 text-hydro animate-spin mx-auto mb-2" />
                  Buscando série histórica...
                </div>
              ) : municipioDetalhe ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-zinc-400">Setor dominante:</span>
                    <div className="mt-1 font-semibold text-zinc-200 flex items-center gap-1.5">
                      {getSectorIcon(municipioDetalhe.setorDominante)}
                      <span>{municipioDetalhe.setorDominante}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {municipioDetalhe.explicacaoSetorDominante}
                    </p>
                  </div>

                  {/* Série dos últimos anos */}
                  <div className="border-t border-border-subtle pt-3">
                    <span className="text-zinc-400 block mb-2 font-medium">Histórico recente de emissões:</span>
                    <div className="space-y-2">
                      {municipioDetalhe.serieHistorica.map(sh => (
                        <div key={sh.ano} className="p-2 rounded-lg bg-surface-base border border-border-subtle">
                          <div className="flex justify-between font-mono text-[11px] mb-1">
                            <span className="text-zinc-400">{sh.ano}</span>
                            <span className="font-bold text-zinc-200">{formatNumero(sh.emissaoTotal)}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(sh.quebraPorSetor).map(([setor, val]) => (
                              <span
                                key={setor}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-surface-card text-zinc-300 border border-border-subtle"
                              >
                                {setor}: {formatNumero(val)}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-zinc-400 leading-relaxed">
                  Clique em qualquer município do ranking ao lado para visualizar a série histórica dos últimos 5 anos e a quebra detalhada por setor econômico.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Rodapé Oficial ── */}
        <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Fonte oficial:</span>
            <strong className="text-zinc-300">SEEG / Observatório do Clima (dados de 2023)</strong>
          </div>
          <a
            href="https://seeg.eco.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-hydro hover:text-hydro/80 transition-colors"
          >
            Acessar metodologia e dados abertos em seeg.eco.br
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
