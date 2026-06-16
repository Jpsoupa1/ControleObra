// ============================================================
// Tipos TypeScript derivados do Schema SQL
// ============================================================

export type ObraStatus = 'em_andamento' | 'pausada' | 'concluida' | 'cancelada';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Obra {
  id: string;
  user_id: string;
  nome: string;
  descricao: string | null;
  endereco: string | null;
  orcamento_total: number;
  data_inicio: string;
  data_previsao_fim: string | null;
  status: ObraStatus;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: string;
  obra_id: string;
  nome: string;
  cor: string;
  icone: string;
  orcamento_planejado: number;
  ordem: number;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

export interface MetodoPagamento {
  id: string;
  obra_id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Despesa {
  id: string;
  obra_id: string;
  categoria_id: string;
  metodo_pagamento_id: string;
  descricao: string;
  valor: number;
  data_despesa: string;
  fornecedor: string | null;
  recibo_url: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

// Views
export interface ResumoObra {
  obra_id: string;
  user_id: string;
  obra_nome: string;
  orcamento_total: number;
  total_gasto: number;
  saldo_remanescente: number;
  percentual_gasto: number;
  total_lancamentos: number;
}

export interface GastoPorCategoria {
  categoria_id: string;
  obra_id: string;
  categoria_nome: string;
  cor: string;
  icone: string;
  orcamento_planejado: number;
  total_gasto: number;
  saldo_categoria: number;
  total_lancamentos: number;
}

export interface GastoPorMetodo {
  metodo_id: string;
  metodo_nome: string;
  total_gasto: number;
  total_lancamentos: number;
  cor: string;
}

export interface GastoPorPeriodo {
  obra_id: string;
  semana: string;
  gasto_semana: number;
  gasto_acumulado: number;
}

// Form types
export interface NovaDespesaForm {
  categoria_id: string;
  metodo_pagamento_id: string;
  descricao: string;
  valor: string;
  data_despesa: string;
  fornecedor: string;
  observacoes: string;
}
