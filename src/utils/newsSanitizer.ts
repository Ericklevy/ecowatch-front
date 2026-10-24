import { NewsItem } from '../types';

/**
 * Palavras e expressões que indicam ruído, política partidária,
 * matérias curiosas ou irrelevantes para uma central de Defesa Civil e monitoramento climático.
 */
const BLACKLIST_PATTERNS = [
  /\burnas?\b/i,
  /\beleiç(ão|ões)\b/i,
  /\b(1º|2º|primeiro|segundo)\s+turno\b/i,
  /\bcandidat[oa]s?\b/i,
  /\bpartido\s+político\b/i,
  /\bvotação\b/i,
  /\btse\b/i,
  /\bdeputad[oa]s?\b/i,
  /\bsenador(a|es)?\b/i,
  /\bvereador(a|es)?\b/i,
  /\bmarco\s+temporal\b/i,
  /\bstf\b/i,
  /\bsupremo\s+tribunal\b/i,
  /\bnomead[oa]\s+coordenador\b/i,
  /\blixo\s+eletrônico\b/i,
  /\bbalcão\s+cidadão\b/i,
  /\btomando\s+um\s+solzinho\b/i,
  /\bflorada\s+d[oe]\s+ipê\b/i,
  /\bveja\s+fotos\b/i,
  /\btorre\s+de\s+telefonia\b/i,
  /\bninhos\s+nunca\s+vistos\b/i,
  /\bsuíça\s+fará\s+doações\b/i,
  /\bfundo\s+do\s+mar\s+em\s+noronha\b/i
];

/**
 * Valida se uma URL é segura para navegação externa (previne esquemas maliciosos como javascript: ou data:).
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida se uma matéria é estritamente relevante para o EcoWatch Brasil.
 */
export function isEcoWatchRelevant(item: NewsItem): boolean {
  const fullText = `${item.titulo} ${item.resumo}`.toLowerCase();

  // 1. Rejeita se bater em qualquer padrão de ruído
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(fullText)) {
      return false;
    }
  }

  // 2. Deve ter ao menos um termo relevante de risco ambiental / climático
  const hasEnvironmentalKeyword = 
    /\b(fogo|queimad[ao]s?|incêndio|fumaça|fuligem|chamas|inpe)\b/i.test(fullText) ||
    /\b(rio|rios|bacia|cheia|inundaç(ão|ões)|enchente|vazante|cota|transbordamento|hidroweb|ana)\b/i.test(fullText) ||
    /\b(chuva|chuvas|tempestade|temporal|enxurrada|granizo|precipitaç(ão|ões)|alagamento|deslizamento|cemaden)\b/i.test(fullText) ||
    /\b(dengue|aedes|arbovirose|chikungunya|zika|infodengue)\b/i.test(fullText) ||
    /\b(desmatamento|desmatar|agropecuária|florestal|preservad[ao]s?|unidade\s+de\s+conservação)\b/i.test(fullText) ||
    /\b(seca|estiagem|calor\s+extremo|onda\s+de\s+calor|baixa\s+umidade|defesa\s+civil)\b/i.test(fullText);

  return hasEnvironmentalKeyword;
}

/**
 * Classifica com precisão a categoria da notícia com base no conteúdo real,
 * corrigindo eventuais falhas de rotulagem do feed de notícias.
 */
export function classifyNewsCategory(item: NewsItem): NewsItem['categoria'] {
  const fullText = `${item.titulo} ${item.resumo}`.toLowerCase();

  // Prioridade 1: Queimadas e Fogo
  if (/\b(fogo|queimad[ao]s?|incêndio|fumaça|fuligem|chamas|calor\s+no\s+pantanal)\b/i.test(fullText)) {
    return 'FIRE';
  }

  // Prioridade 2: Nível dos Rios e Enchentes Fluviais
  if (/\b(rio|rios|guaíba|rio\s+negro|rio\s+branco|rio\s+madeira|cheia|inundaç(ão|ões)|enchente|vazante|cota|transbordamento|fluviométrica|hidroweb)\b/i.test(fullText)) {
    return 'FLOOD';
  }

  // Prioridade 3: Chuvas Torrenciais, Tempestades e Enxurradas
  if (/\b(chuva|chuvas|tempestade|temporal|enxurrada|granizo|precipitaç(ão|ões)|alagamento|deslizamento|pluviométrica|cemaden)\b/i.test(fullText)) {
    return 'RAIN';
  }

  // Prioridade 4: Vigilância Epidemiológica / Dengue
  if (/\b(dengue|aedes|arbovirose|chikungunya|zika|infodengue|fumacê)\b/i.test(fullText)) {
    return 'DENGUE';
  }

  // Prioridade 5: Desmatamento e Cobertura Florestal
  if (/\b(desmatamento|desmatar|agropecuária|bioma\s+amazônia|florestal|conservação)\b/i.test(fullText)) {
    return 'DEFORESTATION';
  }

  // Fallback: Defesa Civil & Clima Geral
  return 'GENERAL';
}

/**
 * Sanitiza o lote de notícias: elimina ruídos, valida URLs e recalcula as categorias certas.
 */
export function sanitizeNewsList(items: NewsItem[]): NewsItem[] {
  return items
    .filter(item => isEcoWatchRelevant(item) && isSafeUrl(item.url))
    .map(item => ({
      ...item,
      categoria: classifyNewsCategory(item)
    }));
}
