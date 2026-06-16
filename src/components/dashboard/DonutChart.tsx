'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { GastoPorCategoria } from '@/types/database';

interface DonutChartProps {
  data: GastoPorCategoria[];
}

// Custom tooltip
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: GastoPorCategoria }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const total = item.total_gasto + item.saldo_categoria;

  return (
    <div className="rounded-xl border border-border/50 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-xs text-muted-foreground">{item.categoria_nome}</p>
      <p className="text-sm font-bold text-foreground">{formatCurrency(item.total_gasto)}</p>
      <p className="text-xs text-muted-foreground">
        de {formatCurrency(item.orcamento_planejado)} planejado
      </p>
    </div>
  );
}

export default function DonutChart({ data }: DonutChartProps) {
  const totalGasto = data.reduce((acc, d) => acc + d.total_gasto, 0);

  // Filtra categorias com gasto > 0 para o gráfico
  const chartData = data
    .filter((d) => d.total_gasto > 0)
    .sort((a, b) => b.total_gasto - a.total_gasto);

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4" id="donut-chart-section">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Distribuição de Gastos
      </h3>

      <div className="flex items-center gap-4">
        {/* Chart */}
        <div className="relative h-[220px] w-[220px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={105}
                paddingAngle={3}
                dataKey="total_gasto"
                nameKey="categoria_nome"
                stroke="none"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.categoria_id} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</span>
            <span className="text-base font-bold text-foreground truncate w-full" title={formatCurrency(totalGasto)}>{formatCurrency(totalGasto)}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          {chartData.slice(0, 5).map((item) => {
            const pct = totalGasto > 0 ? (item.total_gasto / totalGasto) * 100 : 0;
            return (
              <div key={item.categoria_id} className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: item.cor }}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs text-muted-foreground">{item.categoria_nome}</p>
                </div>
                <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                  {formatPercent(pct)}
                </span>
              </div>
            );
          })}
          {chartData.length > 5 && (
            <p className="text-[10px] text-muted-foreground">
              +{chartData.length - 5} categorias
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
