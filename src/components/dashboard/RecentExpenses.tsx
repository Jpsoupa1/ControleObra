'use client';

import { formatCurrency, formatDate } from '@/lib/formatters';
import type { Despesa } from '@/types/database';
import { ArrowDownRight } from 'lucide-react';

interface RecentExpensesProps {
  despesas: (Despesa & { categoria_nome: string; categoria_cor: string; metodo_nome: string })[];
}

export default function RecentExpenses({ despesas }: RecentExpensesProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4" id="recent-expenses-section">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Últimos Lançamentos
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {despesas.length} itens
        </span>
      </div>

      <div className="space-y-3">
        {despesas.map((d, i) => (
          <div
            key={d.id}
            className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/30 active:bg-muted/50"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Category indicator */}
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${d.categoria_cor}20` }}
            >
              <ArrowDownRight
                className="h-4 w-4"
                style={{ color: d.categoria_cor }}
                strokeWidth={2.5}
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {d.descricao}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[10px] font-medium rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: `${d.categoria_cor}15`,
                    color: d.categoria_cor,
                  }}
                >
                  {d.categoria_nome}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {d.metodo_nome}
                </span>
              </div>
            </div>

            {/* Value & Date */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-foreground">
                {formatCurrency(d.valor)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {formatDate(d.data_despesa)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
