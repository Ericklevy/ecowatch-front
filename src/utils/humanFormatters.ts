/**
 * Funções de formatação humanizada para transformar dados técnicos
 * em explicações claras, empáticas e acessíveis para leigos e cidadãos.
 */

export const normalizeCityName = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentuação
    .replace(/\s*\(.*?\)\s*/g, '')   // remove sufixos de UF como (DF), (SP)
    .toLowerCase()
    .trim();
};

export const humanizePrecipitation = (mm: number): { label: string; explanation: string } => {
  if (mm <= 0.2) {
    return {
      label: 'Sem Chuva (0 mm)',
      explanation: 'Estiagem prolongada e tempo seco — sem previsão de chuva.'
    };
  }
  if (mm < 10) {
    return {
      label: `Chuva Fraca (${mm.toFixed(1)} mm)`,
      explanation: 'Garoa ou chuva passageira, sem risco de alagamentos.'
    };
  }
  if (mm < 30) {
    return {
      label: `Chuva Moderada (${mm.toFixed(1)} mm)`,
      explanation: 'Solo úmido; trânsito pode ficar lento, mas rios permanecem na calha.'
    };
  }
  if (mm < 50) {
    return {
      label: `Chuva Forte (${mm.toFixed(1)} mm)`,
      explanation: 'Pancadas volumosas com risco de poças d\'água, queda de galhos e enxurradas em vias baixas.'
    };
  }
  return {
    label: `Chuva Torrencial Extrema (${mm.toFixed(1)} mm)`,
    explanation: 'Alerta máximo: alto risco de inundações, transbordamento de córregos e deslizamento de encostas.'
  };
};

export const humanizeAirQuality = (pm25: number): { label: string; explanation: string; level: 'good' | 'moderate' | 'bad' | 'critical' } => {
  if (pm25 <= 15) {
    return {
      label: `Ar Puro & Saudável (PM2.5: ${pm25.toFixed(1)} µg/m³)`,
      explanation: 'Excelente para respirar, caminhar e praticar esportes ao ar livre.',
      level: 'good'
    };
  }
  if (pm25 <= 25) {
    return {
      label: `Ar Razoável / Aceitável (PM2.5: ${pm25.toFixed(1)} µg/m³)`,
      explanation: 'Dentro do limite da OMS. Pessoas muito sensíveis (asma ou rinite) podem sentir leve incômodo.',
      level: 'moderate'
    };
  }
  if (pm25 <= 50) {
    return {
      label: `Ar Ruim / Poluído (PM2.5: ${pm25.toFixed(1)} µg/m³)`,
      explanation: 'Fumaça ou fuligem visível no ar. Crianças e idosos devem evitar esforço físico intenso na rua.',
      level: 'bad'
    };
  }
  return {
    label: `Ar Crítico & Perigoso (PM2.5: ${pm25.toFixed(1)} µg/m³)`,
    explanation: 'Fumaça densa de queimadas. Use máscara se sair e mantenha portas e janelas fechadas.',
    level: 'critical'
  };
};

export const humanizeRiverLevel = (
  current: number,
  cotaAlerta?: number,
  cotaEmergencia?: number,
  riverName?: string
): { label: string; explanation: string; status: 'safe' | 'alert' | 'emergency' } => {
  const nome = riverName || 'Rio monitorado';

  if (!cotaAlerta) {
    return {
      label: 'Cota Estável (Sem risco)',
      explanation: `${nome} operando dentro dos padrões seguros para a época do ano.`,
      status: 'safe'
    };
  }

  if (cotaEmergencia && current >= cotaEmergencia) {
    const diff = (current - cotaEmergencia).toFixed(2);
    return {
      label: `Transbordamento Iminente (${current.toFixed(2)}m)`,
      explanation: `${nome} ultrapassou a cota máxima em ${diff}m. A água começou a invadir ruas e casas baixas. Alerta total da Defesa Civil.`,
      status: 'emergency'
    };
  }

  if (current >= cotaAlerta) {
    const diff = (current - cotaAlerta).toFixed(2);
    return {
      label: `Cota de Alerta Atingida (${current.toFixed(2)}m)`,
      explanation: `${nome} subiu ${diff}m acima do limite de alerta. A água já ameaça calçadas e cais. Moradores ribeirinhos devem ficar em prontidão.`,
      status: 'alert'
    };
  }

  return {
    label: `Nível Seguro (${current.toFixed(2)}m)`,
    explanation: `${nome} está com vazão controlada, longe de transbordar (cota de alerta em ${cotaAlerta.toFixed(2)}m).`,
    status: 'safe'
  };
};

export const humanizeFireRisk = (score: number): { label: string; explanation: string } => {
  if (score >= 80) {
    return {
      label: `Risco Crítico de Incêndio (${score}/100)`,
      explanation: 'Vegetação seca como palha e umidade do ar crítica. Qualquer fagulha ou ponta de cigarro vira incêndio florestal incontrolável.'
    };
  }
  if (score >= 50) {
    return {
      label: `Risco Moderado de Incêndio (${score}/100)`,
      explanation: 'Clima quente e pouca chuva. Atenção redobrada perto de matas e rodovias.'
    };
  }
  return {
    label: `Risco Baixo de Incêndio (${score}/100)`,
    explanation: 'Solo úmido ou chuva recente diminuem bastante o perigo de queimadas.'
  };
};

export const humanizeDengueRisk = (score: number): { label: string; explanation: string } => {
  if (score >= 60) {
    return {
      label: `Risco Alto de Proliferação (${score}/100)`,
      explanation: 'O calor acima de 30°C somado a poças de água de chuva cria o ambiente perfeito para o mosquito Aedes aegypti se multiplicar em poucos dias.'
    };
  }
  if (score >= 30) {
    return {
      label: `Risco Médio (${score}/100)`,
      explanation: 'Vistorie o quintal e tampe baldes e ralos para evitar água acumulada.'
    };
  }
  return {
    label: `Risco Baixo (${score}/100)`,
    explanation: 'Clima seco ou frio inibe o nascimento de novos mosquitos.'
  };
};
