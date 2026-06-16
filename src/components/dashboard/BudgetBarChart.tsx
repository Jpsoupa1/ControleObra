'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import type { GastoPorCategoria } from '@/types/database';

interface BudgetBarChartProps {
  data: GastoPorCategoria[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-muted-foreground">{item.name}:</span>
          <span className="text-xs font-bold text-foreground">{formatCurrency(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function BudgetBarChart({ data }: BudgetBarChartProps) {
  // Abrevia nomes de categorias para caber no gráfico mobile
  const chartData = data
    .filter((d) => d.orcamento_planejado > 0 || d.total_gasto > 0)
    .map((d) => ({
      ...d,
      nome_curto: d.categoria_nome.length > 10
        ? d.categoria_nome.slice(0, 9) + '…'
        : d.categoria_nome,
    }));

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4" id="bar-chart-section">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Planejado vs. Realizado
      </h3>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
            barGap={2}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="oklch(0.30 0.012 260 / 0.3)"
            />
            <XAxis
              dataKey="nome_curto"
              tick={{ fontSize: 10, fill: 'oklch(0.65 0.01 260)' }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'oklch(0.65 0.01 260)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={32}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: '11px', color: 'oklch(0.65 0.01 260)' }}>{value}</span>
              )}
            />
            <Bar
              dataKey="orcamento_planejado"
              name="Planejado"
              fill="oklch(0.40 0.01 260)"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="total_gasto"
              name="Realizado"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.categoria_id}
                  fill={entry.cor}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
