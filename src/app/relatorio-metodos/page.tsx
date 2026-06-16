'use client';

import { useState, useMemo } from 'react';
import { useAppData } from '@/lib/store';
import { Filter } from 'lucide-react';
import DonutChart from '@/components/dashboard/DonutChart';
import { formatCurrency } from '@/lib/formatters';

export default function RelatorioMetodosPage() {
  const { despesas, categorias, metodosPagamento, isLoadingData } = useAppData();
  const [selectedMetodoId, setSelectedMetodoId] = useState<string>('');

  const chartData = useMemo(() => {
    if (!selectedMetodoId) return [];

    // Filter expenses by selected method
    const filteredDespesas = despesas.filter(d => d.metodo_pagamento_id === selectedMetodoId);

    // Group expenses by category
    return categorias.map(cat => {
      const catDespesas = filteredDespesas.filter(d => d.categoria_id === cat.id);
      const totalGasto = catDespesas.reduce((acc, d) => acc + d.valor, 0);

      return {
        categoria_id: cat.id,
        obra_id: cat.obra_id,
        categoria_nome: cat.nome,
        cor: cat.cor,
        icone: cat.icone,
        orcamento_planejado: cat.orcamento_planejado,
        total_gasto: totalGasto,
        saldo_categoria: 0,
        total_lancamentos: catDespesas.length,
      };
    }).filter(cat => cat.total_gasto > 0);
  }, [despesas, categorias, selectedMetodoId]);

  const activeMetodo = metodosPagamento.find(m => m.id === selectedMetodoId);
  const grandTotal = chartData.reduce((acc, item) => acc + item.total_gasto, 0);

  if (isLoadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 pl-12 md:pl-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15">
            <Filter className="h-5 w-5 text-indigo-400" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Relatório por Método</h1>
            <p className="text-xs text-muted-foreground">Analise os gastos de categorias em um método específico</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 space-y-6 w-full md:px-8 pb-24">
        {/* Filter Selection */}
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Selecione o Método de Pagamento
          </label>
          <div className="max-w-md">
            <select 
              value={selectedMetodoId}
              onChange={(e) => setSelectedMetodoId(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">-- Selecione --</option>
              {metodosPagamento.filter(m => m.ativo).map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {selectedMetodoId ? (
          chartData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="w-full">
                <DonutChart data={chartData} />
              </div>
              
              <div className="rounded-2xl border border-border/50 bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  Detalhamento - {activeMetodo?.nome}
                </h3>
                <div className="space-y-3">
                  {chartData.sort((a,b) => b.total_gasto - a.total_gasto).map(item => (
                    <div key={item.categoria_id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.cor }} />
                        <span className="text-sm font-medium">{item.categoria_nome}</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{formatCurrency(item.total_gasto)}</span>
                    </div>
                  ))}
                  <div className="pt-4 mt-2 border-t border-border/50 flex justify-between items-center">
                    <span className="text-sm font-bold text-muted-foreground">Total no Método</span>
                    <span className="text-lg font-black text-indigo-400">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center rounded-2xl border border-border/50 bg-card">
              <Filter className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma despesa encontrada para este método de pagamento.</p>
            </div>
          )
        ) : (
          <div className="py-12 text-center rounded-2xl border border-border/50 bg-card border-dashed">
            <p className="text-muted-foreground text-sm">Selecione um método acima para visualizar o relatório de categorias.</p>
          </div>
        )}
      </div>
    </div>
  );
}
