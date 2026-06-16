'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Obra, Categoria, MetodoPagamento, Despesa, NovaDespesaForm } from '@/types/database';
import { MOCK_CATEGORIAS, MOCK_METODOS_PAGAMENTO, MOCK_DESPESAS, MOCK_OBRA } from '@/lib/mock-data';
import { parseCurrencyValue } from '@/lib/formatters';

interface AppState {
  obra: Obra;
  categorias: Categoria[];
  metodosPagamento: MetodoPagamento[];
  despesas: Despesa[];
  addCategoria: (nome: string, cor: string, orcamento: number) => void;
  removeCategoria: (id: string) => void;
  addMetodoPagamento: (nome: string) => void;
  removeMetodoPagamento: (id: string) => void;
  addDespesa: (form: NovaDespesaForm) => void;
  updateOrcamentoTotal: (valor: number) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [obra, setObra] = useState<Obra>(MOCK_OBRA);
  const [categorias, setCategorias] = useState<Categoria[]>(MOCK_CATEGORIAS);
  const [metodosPagamento, setMetodosPagamento] = useState<MetodoPagamento[]>(MOCK_METODOS_PAGAMENTO);
  const [despesas, setDespesas] = useState<Despesa[]>(MOCK_DESPESAS);

  const addCategoria = useCallback((nome: string, cor: string, orcamento: number) => {
    const nova: Categoria = {
      id: `cat-${Date.now()}`,
      obra_id: obra.id,
      nome,
      cor,
      icone: 'package',
      orcamento_planejado: orcamento,
      ordem: categorias.length + 1,
      ativa: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCategorias((prev) => [...prev, nova]);
  }, [categorias.length]);

  const removeCategoria = useCallback((id: string) => {
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addMetodoPagamento = useCallback((nome: string) => {
    const novo: MetodoPagamento = {
      id: `mp-${Date.now()}`,
      obra_id: obra.id,
      nome,
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMetodosPagamento((prev) => [...prev, novo]);
  }, []);

  const removeMetodoPagamento = useCallback((id: string) => {
    setMetodosPagamento((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const addDespesa = useCallback((form: NovaDespesaForm) => {
    const nova: Despesa = {
      id: `d-${Date.now()}`,
      obra_id: obra.id,
      categoria_id: form.categoria_id,
      metodo_pagamento_id: form.metodo_pagamento_id,
      descricao: form.descricao,
      valor: parseCurrencyValue(form.valor),
      data_despesa: form.data_despesa,
      fornecedor: form.fornecedor || null,
      recibo_url: null,
      observacoes: form.observacoes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDespesas((prev) => [nova, ...prev]);
  }, [obra.id]);

  const updateOrcamentoTotal = useCallback((valor: number) => {
    setObra((prev) => ({ ...prev, orcamento_total: valor }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        obra,
        categorias,
        metodosPagamento,
        despesas,
        addCategoria,
        removeCategoria,
        addMetodoPagamento,
        removeMetodoPagamento,
        addDespesa,
        updateOrcamentoTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within AppProvider');
  return ctx;
}
