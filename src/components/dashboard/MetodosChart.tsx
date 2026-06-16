'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { GastoPorMetodo } from '@/types/database';

interface MetodosChartProps {
  data: GastoPorMetodo[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: GastoPorMetodo }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-border/50 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-xs text-muted-foreground">{item.metodo_nome}</p>
      <p className="text-sm font-bold text-foreground">{formatCurrency(item.total_gasto)}</p>
      <p className="text-xs text-muted-foreground">
        {item.total_lancamentos} lançamentos
      </p>
    </div>
  );
}

export default function MetodosChart({ data }: MetodosChartProps) {
  const totalGasto = data.reduce((acc, d) => acc + d.total_gasto, 0);

  const chartData = data
    .filter((d) => d.total_gasto > 0)
    .sort((a, b) => b.total_gasto - a.total_gasto);

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Gastos por Método de Pagamento
      </h3>

      <div className="flex items-center gap-4">
        <div className="relative h-[200px] w-[200px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={3}
                dataKey="total_gasto"
                nameKey="metodo_nome"
                stroke="none"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.metodo_id} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</span>
            <span className="text-sm font-bold text-foreground">{formatCurrency(totalGasto)}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          {chartData.slice(0, 6).map((item) => {
            const pct = totalGasto > 0 ? (item.total_gasto / totalGasto) * 100 : 0;
            return (
              <div key={item.metodo_id} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: item.cor }}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">{item.metodo_nome}</p>
                </div>
                <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                  {formatPercent(pct)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
