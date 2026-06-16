'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Obra, Categoria, MetodoPagamento, Despesa, NovaDespesaForm } from '@/types/database';
import { parseCurrencyValue } from '@/lib/formatters';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

interface AppState {
  obra: Obra | null;
  categorias: Categoria[];
  metodosPagamento: MetodoPagamento[];
  despesas: Despesa[];
  isLoadingData: boolean;
  addCategoria: (nome: string, cor: string, orcamento: number) => Promise<void>;
  removeCategoria: (id: string) => Promise<void>;
  addMetodoPagamento: (nome: string) => Promise<void>;
  removeMetodoPagamento: (id: string) => Promise<void>;
  addDespesa: (form: NovaDespesaForm) => Promise<void>;
  updateOrcamentoTotal: (valor: number) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [obra, setObra] = useState<Obra | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [metodosPagamento, setMetodosPagamento] = useState<MetodoPagamento[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!user) {
      setObra(null);
      setCategorias([]);
      setMetodosPagamento([]);
      setDespesas([]);
      setIsLoadingData(false);
      return;
    }

    async function loadData() {
      setIsLoadingData(true);
      
      // 1. Fetch ou criar Obra
      let { data: obras } = await supabase.from('obras').select('*').eq('user_id', user!.id);
      let currentObra = obras && obras.length > 0 ? obras[0] : null;

      if (!currentObra) {
        const { data: newObra, error } = await supabase.from('obras').insert({
          user_id: user!.id,
          nome: 'Minha Obra',
          orcamento_total: 100000,
          data_inicio: new Date().toISOString().split('T')[0]
        }).select().single();
        
        if (newObra) currentObra = newObra;
      }
      
      if (currentObra) {
        setObra(currentObra);

        // 2. Carregar categorias
        const { data: catData } = await supabase.from('categorias').select('*').eq('obra_id', currentObra.id);
        if (catData) setCategorias(catData);

        // 3. Carregar metodos de pagamento
        const { data: metData } = await supabase.from('metodos_pagamento').select('*').eq('obra_id', currentObra.id);
        if (metData) setMetodosPagamento(metData);

        // 4. Carregar despesas
        const { data: despData } = await supabase.from('despesas').select('*').eq('obra_id', currentObra.id);
        if (despData) setDespesas(despData);
      }

      setIsLoadingData(false);
    }

    loadData();
  }, [user]);

  const addCategoria = useCallback(async (nome: string, cor: string, orcamento: number) => {
    if (!obra) return;
    const { data } = await supabase.from('categorias').insert({
      obra_id: obra.id,
      nome,
      cor,
      icone: 'package',
      orcamento_planejado: orcamento,
      ordem: categorias.length + 1,
      ativa: true
    }).select().single();
    
    if (data) setCategorias((prev) => [...prev, data]);
  }, [obra, categorias.length]);

  const removeCategoria = useCallback(async (id: string) => {
    const { error } = await supabase.from('categorias').delete().eq('id', id);
    if (!error) {
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    }
  }, []);

  const addMetodoPagamento = useCallback(async (nome: string) => {
    if (!obra) return;
    const { data } = await supabase.from('metodos_pagamento').insert({
      obra_id: obra.id,
      nome,
      ativo: true
    }).select().single();
    
    if (data) setMetodosPagamento((prev) => [...prev, data]);
  }, [obra]);

  const removeMetodoPagamento = useCallback(async (id: string) => {
    const { error } = await supabase.from('metodos_pagamento').delete().eq('id', id);
    if (!error) {
      setMetodosPagamento((prev) => prev.filter((m) => m.id !== id));
    }
  }, []);

  const addDespesa = useCallback(async (form: NovaDespesaForm) => {
    if (!obra) return;
    const { data } = await supabase.from('despesas').insert({
      obra_id: obra.id,
      categoria_id: form.categoria_id,
      metodo_pagamento_id: form.metodo_pagamento_id,
      descricao: form.descricao,
      valor: parseCurrencyValue(form.valor),
      data_despesa: form.data_despesa,
      fornecedor: form.fornecedor || null,
      observacoes: form.observacoes || null
    }).select().single();

    if (data) setDespesas((prev) => [data, ...prev]);
  }, [obra]);

  const updateOrcamentoTotal = useCallback(async (valor: number) => {
    if (!obra) return;
    const { data, error } = await supabase.from('obras').update({ orcamento_total: valor }).eq('id', obra.id).select().single();
    if (!error && data) {
      setObra(data);
    }
  }, [obra]);

  return (
    <AppContext.Provider
      value={{
        obra,
        categorias,
        metodosPagamento,
        despesas,
        isLoadingData,
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
