'use client';

import { formatPercent } from '@/lib/formatters';
import type { ResumoObra } from '@/types/database';

interface BudgetProgressProps {
  resumo: ResumoObra;
}

export default function BudgetProgress({ resumo }: BudgetProgressProps) {
  const percent = Math.min(resumo.percentual_gasto, 100);
  const isOverBudget = resumo.percentual_gasto > 100;
  const isWarning = resumo.percentual_gasto > 80;

  const barColor = isOverBudget
    ? 'bg-red-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-green-500';

  const glowColor = isOverBudget
    ? 'shadow-red-500/40'
    : isWarning
    ? 'shadow-amber-500/40'
    : 'shadow-green-500/40';

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4" id="budget-progress-bar">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Progresso do Orçamento
        </h3>
        <span className={`text-sm font-bold ${isOverBudget ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-green-400'}`}>
          {formatPercent(resumo.percentual_gasto)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted/50">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out shadow-lg ${glowColor}`}
          style={{ width: `${percent}%` }}
        />

        {/* Markers at 25%, 50%, 75% */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute top-0 h-full w-px bg-white/10"
            style={{ left: `${mark}%` }}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      {isOverBudget && (
        <p className="mt-2 text-xs font-medium text-red-400 animate-pulse">
          ⚠️ Orçamento excedido em {formatPercent(resumo.percentual_gasto - 100)}
        </p>
      )}
    </div>
  );
}
