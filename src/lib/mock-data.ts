import type {
  Obra,
  Categoria,
  MetodoPagamento,
  Despesa,
  ResumoObra,
  GastoPorCategoria,
  GastoPorMetodo,
  GastoPorPeriodo,
} from '@/types/database';

// ============================================================
// Mock Data - Simula dados do Supabase para desenvolvimento
// ============================================================

export const MOCK_OBRA: Obra = {
  id: 'obra-001',
  user_id: 'user-001',
  nome: 'Casa Residencial - Lote 47',
  descricao: 'Construção residencial de 180m², 3 quartos, 2 banheiros',
  endereco: 'Rua das Palmeiras, 47 - Condomínio Sol Nascente',
  orcamento_total: 350000,
  data_inicio: '2026-01-15',
  data_previsao_fim: '2026-12-30',
  status: 'em_andamento',
  created_at: '2026-01-10T10:00:00Z',
  updated_at: '2026-06-15T14:30:00Z',
};

export const MOCK_CATEGORIAS: Categoria[] = [];

export const MOCK_METODOS_PAGAMENTO: MetodoPagamento[] = [];

export const MOCK_DESPESAS: Despesa[] = [];

// Cores para os métodos de pagamento nos gráficos
const METODO_CORES = ['#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4', '#22c55e', '#f97316', '#ec4899'];

// ============================================================
// Funções auxiliares para computar views a partir dos mock data
// ============================================================

export function getResumoObra(obra: Obra, despesas: Despesa[]): ResumoObra {
  const totalGasto = despesas.reduce((acc, d) => acc + d.valor, 0);
  return {
    obra_id: obra.id,
    user_id: obra.user_id,
    obra_nome: obra.nome,
    orcamento_total: obra.orcamento_total,
    total_gasto: totalGasto,
    saldo_remanescente: obra.orcamento_total - totalGasto,
    percentual_gasto: obra.orcamento_total > 0 ? Math.round((totalGasto / obra.orcamento_total) * 10000) / 100 : 0,
    total_lancamentos: despesas.length,
  };
}

export function getGastosPorCategoria(categorias: Categoria[] = MOCK_CATEGORIAS, despesas: Despesa[] = MOCK_DESPESAS): GastoPorCategoria[] {
  return categorias.map((cat) => {
    const despesasCat = despesas.filter((d) => d.categoria_id === cat.id);
    const totalGasto = despesasCat.reduce((acc, d) => acc + d.valor, 0);
    return {
      categoria_id: cat.id,
      obra_id: cat.obra_id,
      categoria_nome: cat.nome,
      cor: cat.cor,
      icone: cat.icone,
      orcamento_planejado: cat.orcamento_planejado,
      total_gasto: totalGasto,
      saldo_categoria: cat.orcamento_planejado - totalGasto,
      total_lancamentos: despesasCat.length,
    };
  });
}

export function getGastosPorMetodo(metodos: MetodoPagamento[] = MOCK_METODOS_PAGAMENTO, despesas: Despesa[] = MOCK_DESPESAS): GastoPorMetodo[] {
  return metodos
    .filter((m) => m.ativo)
    .map((m, idx) => {
      const despesasMetodo = despesas.filter((d) => d.metodo_pagamento_id === m.id);
      const totalGasto = despesasMetodo.reduce((acc, d) => acc + d.valor, 0);
      return {
        metodo_id: m.id,
        metodo_nome: m.nome,
        total_gasto: totalGasto,
        total_lancamentos: despesasMetodo.length,
        cor: METODO_CORES[idx % METODO_CORES.length],
      };
    })
    .filter((m) => m.total_gasto > 0);
}

export function getGastosPorPeriodo(obra: Obra, despesas: Despesa[]): GastoPorPeriodo[] {
  const grouped: Record<string, number> = {};

  despesas.forEach((d) => {
    const date = new Date(d.data_despesa);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    grouped[monthKey] = (grouped[monthKey] || 0) + d.valor;
  });

  const sortedKeys = Object.keys(grouped).sort();
  let acumulado = 0;

  return sortedKeys.map((key) => {
    acumulado += grouped[key];
    return {
      obra_id: obra.id,
      semana: key,
      gasto_semana: grouped[key],
      gasto_acumulado: acumulado,
    };
  });
}

export function getUltimasDespesas(
  despesas: Despesa[] = MOCK_DESPESAS,
  categorias: Categoria[] = MOCK_CATEGORIAS,
  metodos: MetodoPagamento[] = MOCK_METODOS_PAGAMENTO,
  limit: number = 8
): (Despesa & { categoria_nome: string; categoria_cor: string; metodo_nome: string })[] {
  const sorted = [...despesas].sort(
    (a, b) => new Date(b.data_despesa).getTime() - new Date(a.data_despesa).getTime()
  );

  return sorted.slice(0, limit).map((d) => {
    const cat = categorias.find((c) => c.id === d.categoria_id);
    const met = metodos.find((m) => m.id === d.metodo_pagamento_id);
    return {
      ...d,
      categoria_nome: cat?.nome ?? 'Sem categoria',
      categoria_cor: cat?.cor ?? '#64748b',
      metodo_nome: met?.nome ?? 'Desconhecido',
    };
  });
}
