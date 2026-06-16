'use client';

import FinancialCards from '@/components/dashboard/FinancialCards';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import DonutChart from '@/components/dashboard/DonutChart';
import BurndownChart from '@/components/dashboard/BurndownChart';
import RecentExpenses from '@/components/dashboard/RecentExpenses';
import ExpenseForm from '@/components/dashboard/ExpenseForm';
import { useAppData } from '@/lib/store';
import {
  getResumoObra,
  getGastosPorCategoria,
  getGastosPorPeriodo,
  getUltimasDespesas,
} from '@/lib/mock-data';

export default function DashboardPage() {
  const { obra, categorias, metodosPagamento, despesas, addDespesa, updateOrcamentoTotal, isLoadingData } = useAppData();

  if (isLoadingData || !obra) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const resumo = getResumoObra(obra, despesas);
  const gastosPorCategoria = getGastosPorCategoria(categorias, despesas);
  const gastosPorPeriodo = getGastosPorPeriodo(obra, despesas);
  const ultimasDespesas = getUltimasDespesas(despesas, categorias, metodosPagamento, 8);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page header */}
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 pl-12 md:pl-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Visão geral financeira da obra</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-4 w-full md:px-8 pb-24">
        <FinancialCards resumo={resumo} onEditBudget={updateOrcamentoTotal} />
        <BudgetProgress resumo={resumo} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <DonutChart data={gastosPorCategoria} />
          <BurndownChart data={gastosPorPeriodo} resumo={resumo} />
        </div>
        <RecentExpenses despesas={ultimasDespesas} />
      </div>

      {/* FAB for new expense */}
      <ExpenseForm
        categorias={categorias}
        metodosPagamento={metodosPagamento}
        onSubmit={addDespesa}
      />
    </div>
  );
}
