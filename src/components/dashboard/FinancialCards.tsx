'use client';

import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { ResumoObra } from '@/types/database';
import {
  DollarSign,
  TrendingDown,
  Wallet,
  Receipt,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';

interface FinancialCardsProps {
  resumo: ResumoObra;
  onEditBudget?: (newBudget: number) => void;
}

const cards = [
  {
    key: 'orcamento',
    label: 'Orçamento Total',
    icon: Wallet,
    getValue: (r: ResumoObra) => formatCurrency(r.orcamento_total),
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
  },
  {
    key: 'gasto',
    label: 'Total Gasto',
    icon: TrendingDown,
    getValue: (r: ResumoObra) => formatCurrency(r.total_gasto),
    getSubtext: (r: ResumoObra) => `${formatPercent(r.percentual_gasto)} do orçamento`,
    color: 'from-amber-500/20 to-amber-600/5',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  {
    key: 'saldo',
    label: 'Saldo Disponível',
    icon: DollarSign,
    getValue: (r: ResumoObra) => formatCurrency(r.saldo_remanescente),
    getSubtext: (r: ResumoObra) => r.saldo_remanescente >= 0 ? 'Dentro do orçamento' : 'Orçamento excedido!',
    color: (r: ResumoObra) => r.saldo_remanescente >= 0 ? 'from-green-500/20 to-green-600/5' : 'from-red-500/20 to-red-600/5',
    iconColor: (r: ResumoObra) => r.saldo_remanescente >= 0 ? 'text-green-400' : 'text-red-400',
    borderColor: (r: ResumoObra) => r.saldo_remanescente >= 0 ? 'border-green-500/20' : 'border-red-500/20',
  },
  {
    key: 'lancamentos',
    label: 'Lançamentos',
    icon: Receipt,
    getValue: (r: ResumoObra) => r.total_lancamentos.toString(),
    getSubtext: () => 'despesas registradas',
    color: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
  },
];

import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function FinancialCards({ resumo, onEditBudget }: FinancialCardsProps) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInputValue, setBudgetInputValue] = useState('');

  const handleOpenEdit = () => {
    setBudgetInputValue(resumo.orcamento_total.toString());
    setIsEditingBudget(true);
  };

  const handleSaveBudget = () => {
    const num = Number(budgetInputValue.replace(/\D/g, '')) / 100 || Number(budgetInputValue);
    if (num > 0 && onEditBudget) {
      onEditBudget(num);
    }
    setIsEditingBudget(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3" id="financial-summary-cards">
      {cards.map((card) => {
        const colorClass = typeof card.color === 'function' ? card.color(resumo) : card.color;
        const iconColorClass = typeof card.iconColor === 'function' ? card.iconColor(resumo) : card.iconColor;
        const borderClass = typeof card.borderColor === 'function' ? card.borderColor(resumo) : card.borderColor;
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            id={`card-${card.key}`}
            className={`
              relative overflow-hidden rounded-2xl border ${borderClass}
              bg-gradient-to-br ${colorClass}
              p-4 transition-all duration-300
              active:scale-[0.97] hover:shadow-lg
            `}
          >
            {/* Icon */}
            <div className={`mb-3 flex items-center justify-between ${iconColorClass}`}>
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" strokeWidth={2.5} />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </span>
              </div>
              {card.key === 'orcamento' && onEditBudget && (
                <button
                  onClick={handleOpenEdit}
                  className="rounded-md p-1 hover:bg-blue-500/10 text-blue-400 transition-colors cursor-pointer z-10"
                  title="Editar orçamento"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
              )}
            </div>

            {/* Value */}
            <p className="text-xl font-bold tracking-tight text-foreground leading-none">
              {card.getValue(resumo)}
            </p>

            {/* Subtext */}
            {card.getSubtext && (
              <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
                {card.key === 'saldo' && (
                  resumo.saldo_remanescente >= 0
                    ? <ArrowUp className="h-3 w-3 text-green-400" />
                    : <ArrowDown className="h-3 w-3 text-red-400" />
                )}
                {card.getSubtext(resumo)}
              </p>
            )}

            {/* Glow effect */}
            <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl opacity-30 ${iconColorClass.replace('text-', 'bg-')}`} />
          </div>
        );
      })}
      </div>

      {/* Edit Budget Modal */}
      {isEditingBudget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-border/50 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-foreground mb-1">Editar Orçamento</h3>
            <p className="text-xs text-muted-foreground mb-5">
              Defina o novo valor total estipulado para a obra.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Novo Valor (R$)</label>
                <Input
                  type="number"
                  value={budgetInputValue}
                  onChange={(e) => setBudgetInputValue(e.target.value)}
                  className="bg-muted/30 h-11 text-lg font-semibold"
                  placeholder="Ex: 150000"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setIsEditingBudget(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveBudget}
                  className="rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-400 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
