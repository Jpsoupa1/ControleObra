'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrency, formatMonthYear, formatCurrencyShort } from '@/lib/formatters';
import type { GastoPorPeriodo, ResumoObra } from '@/types/database';

interface BurndownChartProps {
  data: GastoPorPeriodo[];
  resumo: ResumoObra;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {label ? formatMonthYear(label) : ''}
      </p>
      {payload.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-muted-foreground">{item.name}:</span>
          <span className="text-xs font-bold text-foreground">{formatCurrency(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function BurndownChart({ data, resumo }: BurndownChartProps) {
  // Calcula saldo remanescente ao longo do tempo
  const chartData = data.map((d) => ({
    ...d,
    saldo_remanescente: resumo.orcamento_total - d.gasto_acumulado,
    label: formatMonthYear(d.semana),
  }));

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4" id="burndown-chart-section">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Burn-down Financeiro
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Gasto Acumulado
        </span>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientAcumulado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradientSemana" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="oklch(0.30 0.012 260 / 0.3)"
            />
            <XAxis
              dataKey="semana"
              tickFormatter={formatMonthYear}
              tick={{ fontSize: 10, fill: 'oklch(0.65 0.01 260)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'oklch(0.65 0.01 260)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrencyShort(v)}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Budget line */}
            <ReferenceLine
              y={resumo.orcamento_total}
              stroke="#ef4444"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: 'Orçamento',
                position: 'right',
                fill: '#ef4444',
                fontSize: 10,
              }}
            />

            <Area
              type="monotone"
              dataKey="gasto_semana"
              name="Gasto no Mês"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#gradientSemana)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: '#3b82f6' }}
            />
            <Area
              type="monotone"
              dataKey="gasto_acumulado"
              name="Gasto Acumulado"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#gradientAcumulado)"
              dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#f59e0b' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
