'use client';

import { useAppData } from '@/lib/store';
import DonutChart from '@/components/dashboard/DonutChart';
import BudgetBarChart from '@/components/dashboard/BudgetBarChart';
import { getGastosPorCategoria } from '@/lib/mock-data';

export default function GastosCategoriasPage() {
  const { categorias, despesas } = useAppData();
  const gastosPorCategoria = getGastosPorCategoria(categorias, despesas);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 pl-12 md:pl-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Gastos por Categoria</h1>
            <p className="text-xs text-muted-foreground">Análise detalhada do orçamento por setor</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 space-y-6 w-full md:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <DonutChart data={gastosPorCategoria} />
          <BudgetBarChart data={gastosPorCategoria} />
        </div>
        
        {/* Detail table */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground">Detalhamento</h3>
          </div>
          <div className="divide-y divide-border/50">
            {gastosPorCategoria.sort((a, b) => b.total_gasto - a.total_gasto).map(cat => (
              <div key={cat.categoria_id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.cor }} />
                  <div>
                    <p className="text-sm font-medium">{cat.categoria_nome}</p>
                    <p className="text-[10px] text-muted-foreground">{cat.total_lancamentos} lançamentos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cat.total_gasto)}
                  </p>
                  <p className={`text-[10px] ${cat.saldo_categoria < 0 ? 'text-destructive' : 'text-green-500'}`}>
                    Saldo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cat.saldo_categoria)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
