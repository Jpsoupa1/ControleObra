'use client';

import { useAppData } from '@/lib/store';
import MetodosChart from '@/components/dashboard/MetodosChart';
import { getGastosPorMetodo } from '@/lib/mock-data';

export default function GastosMetodosPage() {
  const { metodosPagamento, despesas } = useAppData();
  const gastosPorMetodo = getGastosPorMetodo(metodosPagamento, despesas);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 pl-12 md:pl-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Gastos por Método</h1>
            <p className="text-xs text-muted-foreground">Análise de gastos por forma de pagamento</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 space-y-6 w-full md:px-8 pb-24">
        {gastosPorMetodo.length > 0 ? (
          <>
            <MetodosChart data={gastosPorMetodo} />
            
            {/* Detail table */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground">Detalhamento</h3>
              </div>
              <div className="divide-y divide-border/50">
                {gastosPorMetodo.sort((a, b) => b.total_gasto - a.total_gasto).map(metodo => (
                  <div key={metodo.metodo_id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: metodo.cor }} />
                      <div>
                        <p className="text-sm font-medium">{metodo.metodo_nome}</p>
                        <p className="text-[10px] text-muted-foreground">{metodo.total_lancamentos} lançamentos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metodo.total_gasto)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card p-8 text-center text-muted-foreground">
            Ainda não há lançamentos com métodos de pagamento cadastrados.
          </div>
        )}
      </div>
    </div>
  );
}
