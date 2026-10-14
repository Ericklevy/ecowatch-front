import React from 'react';
import { Radio, Satellite, Droplets, Flame, Wind } from 'lucide-react';

export const LiveStatusTicker: React.FC = () => {
  const tickerItems = [
    { icon: Radio, text: 'SISTEMA OPERACIONAL // 27 capitais brasileiras sincronizadas', color: 'text-nominal' },
    { icon: Satellite, text: 'SATÉLITES ATIVOS // Sensores termais INPE & NASA em órbita polar e geoestacionária', color: 'text-hydro' },
    { icon: Droplets, text: 'BACIA DO GUAÍBA (RS) // Nível atual em 2.18m (Cota de Atenção da Defesa Civil)', color: 'text-warning' },
    { icon: Flame, text: 'CENTRO-OESTE & CERRADO // 14 focos de calor ativos detectados no DF e Gama', color: 'text-critical' },
    { icon: Droplets, text: 'BACIA AMAZÔNICA // Rio Negro em estágio de vazante severa (12.85m)', color: 'text-hydro' },
    { icon: Wind, text: 'QUALIDADE DO AR // Monitoramento contínuo de fuligem e material particulado PM2.5', color: 'text-nominal' }
  ];

  return (
    <div className="h-7 bg-surface-dim/90 border-b border-border-subtle/60 overflow-hidden flex items-center relative select-none z-20 backdrop-blur-sm">
      {/* Badge Fixo "AO VIVO" */}
      <div className="flex items-center gap-1.5 px-3 bg-surface-base h-full border-r border-border-subtle/80 text-[10px] font-mono font-bold text-nominal uppercase shrink-0 shadow-sm z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-nominal animate-ping" />
        <span>Telemetria</span>
      </div>

      {/* Ticker Animado Infinito */}
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-ticker flex items-center gap-8 text-[11px] font-mono text-zinc-400 whitespace-nowrap">
          {/* Loop duplo para animação suave infinita */}
          {[...tickerItems, ...tickerItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-1.5 shrink-0 hover:text-white transition-colors cursor-default">
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="font-medium text-zinc-300">{item.text}</span>
                <span className="text-zinc-600 ml-4 font-sans">|</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
