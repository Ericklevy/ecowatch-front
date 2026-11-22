import { useEffect, useState } from 'react';
import { MONITORED_CITIES } from '../data/mockData';
import { PrevisaoDTO } from '../types';
import { READ_MODEL_URL } from './api';

/**
 * Previsões REAIS de D+1 a D+3 para as 27 capitais.
 * 1º tenta o backend (/api/dashboard/previsoes/all, que grava a Open-Meteo no banco);
 * se estiver vazio ou fora do ar, busca direto na Open-Meteo numa chamada só.
 * Os índices de risco usam as mesmas fórmulas do backend (PrevisaoRealService).
 */

export type FontePrevisao = 'carregando' | 'backend' | 'open-meteo' | 'indisponivel';
export type PrevisoesPorCidade = Record<string, PrevisaoDTO[]>;

const limitar = (v: number) => Math.round(Math.max(0, Math.min(100, v)));

export const riscoIncendio = (tMax: number, umidade: number, chuva: number) =>
  limitar((tMax - 20) * 3 + (60 - umidade) * 1.2 - chuva * 4);

export const riscoDengue = (tMax: number, umidade: number, chuva: number) => {
  const temp = tMax >= 22 && tMax <= 34 ? 100 - Math.abs(tMax - 29) * 8 : 10;
  const umid = Math.max(0, Math.min(100, (umidade - 50) * 2));
  const agua = Math.max(0, Math.min(100, chuva * 5));
  return limitar(temp * 0.45 + umid * 0.35 + agua * 0.2);
};

const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

async function doBackend(): Promise<PrevisoesPorCidade | null> {
  const res = await fetch(`${READ_MODEL_URL}/api/dashboard/previsoes/all`, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const lista: PrevisaoDTO[] = await res.json();
  if (!Array.isArray(lista) || lista.length === 0) return null;
  const porCidade: PrevisoesPorCidade = {};
  for (const p of lista) (porCidade[slug(p.municipio)] ??= []).push(p);
  Object.values(porCidade).forEach(l => l.sort((a, b) => a.dataPrevisao.localeCompare(b.dataPrevisao)));
  return porCidade;
}

async function daOpenMeteo(): Promise<PrevisoesPorCidade> {
  const lat = MONITORED_CITIES.map(c => c.lat).join(',');
  const lon = MONITORED_CITIES.map(c => c.lng).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
    + '&daily=temperature_2m_max,precipitation_sum,relative_humidity_2m_mean&forecast_days=4&timezone=America%2FSao_Paulo';
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const dados = await res.json();
  const locais = Array.isArray(dados) ? dados : [dados];
  const porCidade: PrevisoesPorCidade = {};
  MONITORED_CITIES.forEach((cidade, i) => {
    const d = locais[i]?.daily;
    if (!d) return;
    porCidade[cidade.slug] = [];
    for (let k = 1; k < d.time.length && k <= 3; k++) {   // índice 0 = hoje
      const t = d.temperature_2m_max[k];
      if (t == null) continue;
      const u = d.relative_humidity_2m_mean[k] ?? 60;
      const c = d.precipitation_sum[k] ?? 0;
      porCidade[cidade.slug].push({
        municipio: cidade.nome,
        dataPrevisao: d.time[k],
        temperaturaPrevista: t,
        precipitacaoPrevista: c,
        umidadePrevista: u,
        riscoIncendio: riscoIncendio(t, u, c),
        riscoDengue: riscoDengue(t, u, c)
      });
    }
  });
  return porCidade;
}

let pedido: Promise<{ dados: PrevisoesPorCidade; fonte: FontePrevisao }> | null = null;

export function carregarPrevisoes() {
  pedido ??= (async () => {
    try {
      const b = await doBackend();
      if (b) return { dados: b, fonte: 'backend' as const };
    } catch { /* tenta a Open-Meteo */ }
    try {
      return { dados: await daOpenMeteo(), fonte: 'open-meteo' as const };
    } catch {
      pedido = null; // deixa tentar de novo na próxima vez
      return { dados: {}, fonte: 'indisponivel' as const };
    }
  })();
  return pedido;
}

/** Hook: previsões por slug da cidade (ex.: "sao paulo") e de onde vieram. */
export function usePrevisoes() {
  const [estado, setEstado] = useState<{ dados: PrevisoesPorCidade; fonte: FontePrevisao }>({ dados: {}, fonte: 'carregando' });
  useEffect(() => {
    let vivo = true;
    carregarPrevisoes().then(r => vivo && setEstado(r));
    return () => { vivo = false; };
  }, []);
  return estado;
}

// ── Histórico real (últimos N dias) para os Relatórios ──────────────────────────
export interface Historico {
  dias: string[];
  chuvaDiaria: number[];
  chuvaTotal: number;
  tempMedia: number;
  tempMax: number;
  tempMin: number;
  pm25Diario: number[];
  pm25Medio: number | null;
}

const cacheHistorico = new Map<string, Promise<Historico | null>>();

export function carregarHistorico(lat: number, lng: number, dias: number): Promise<Historico | null> {
  const chave = `${lat},${lng},${dias}`;
  if (!cacheHistorico.has(chave)) {
    cacheHistorico.set(chave, (async () => {
      try {
        const [clima, ar] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}`
            + `&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum`
            + `&past_days=${dias}&forecast_days=1&timezone=America%2FSao_Paulo`, { signal: AbortSignal.timeout(12000) }).then(r => r.ok ? r.json() : null),
          fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}`
            + `&hourly=pm2_5&past_days=${dias}&forecast_days=1&timezone=America%2FSao_Paulo`, { signal: AbortSignal.timeout(12000) })
            .then(r => r.ok ? r.json() : null).catch(() => null)
        ]);
        if (!clima?.daily) return null;
        const d = clima.daily;
        const n = d.time.length - 1;                 // o último é hoje (incompleto)
        const fatia = <T,>(a: T[]) => a.slice(0, n);
        const num = (a: (number | null)[]) => a.filter((v): v is number => typeof v === 'number');
        const chuva = fatia<number | null>(d.precipitation_sum).map(v => v ?? 0);
        const medias = num(fatia(d.temperature_2m_mean));
        const pm25Horas: (number | null)[] = ar?.hourly?.pm2_5 ?? [];
        const pm25Diario: number[] = [];
        for (let i = 0; i < n; i++) {
          const dia = num(pm25Horas.slice(i * 24, i * 24 + 24));
          if (dia.length) pm25Diario.push(dia.reduce((a, b) => a + b, 0) / dia.length);
        }
        return {
          dias: fatia(d.time),
          chuvaDiaria: chuva,
          chuvaTotal: chuva.reduce((a, b) => a + b, 0),
          tempMedia: medias.length ? medias.reduce((a, b) => a + b, 0) / medias.length : NaN,
          tempMax: Math.max(...num(fatia(d.temperature_2m_max))),
          tempMin: Math.min(...num(fatia(d.temperature_2m_min))),
          pm25Diario,
          pm25Medio: pm25Diario.length ? pm25Diario.reduce((a, b) => a + b, 0) / pm25Diario.length : null
        };
      } catch {
        cacheHistorico.delete(chave);
        return null;
      }
    })());
  }
  return cacheHistorico.get(chave)!;
}
