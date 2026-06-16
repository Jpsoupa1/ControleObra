-- ============================================================
-- ControleObra - Schema SQL para Supabase
-- Modelo de Dados Relacional para Controle Financeiro de Obras
-- ============================================================

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. TABELA: profiles (extensão do auth.users do Supabase)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para criar perfil automaticamente ao registrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. TABELA: obras (projetos de construção)
-- ============================================================
CREATE TABLE public.obras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  endereco TEXT,
  orcamento_total DECIMAL(14, 2) NOT NULL DEFAULT 0,
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_previsao_fim DATE,
  status TEXT NOT NULL DEFAULT 'em_andamento' 
    CHECK (status IN ('em_andamento', 'pausada', 'concluida', 'cancelada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_obras_user_id ON public.obras(user_id);

-- ============================================================
-- 3. TABELA: categorias (categorias de despesas)
-- ============================================================
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '#6366f1',  -- cor para identificação visual
  icone TEXT DEFAULT 'package',          -- nome do ícone Lucide
  orcamento_planejado DECIMAL(14, 2) NOT NULL DEFAULT 0,
  ordem INT NOT NULL DEFAULT 0,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categorias_obra_id ON public.categorias(obra_id);

-- ============================================================
-- 3.5. TABELA: metodos_pagamento (formas de pagamento)
-- ============================================================
CREATE TABLE public.metodos_pagamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_metodos_pagamento_obra_id ON public.metodos_pagamento(obra_id);

-- ============================================================
-- 4. TABELA: despesas (lançamentos financeiros)
-- ============================================================
CREATE TABLE public.despesas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE RESTRICT,
  metodo_pagamento_id UUID NOT NULL REFERENCES public.metodos_pagamento(id) ON DELETE RESTRICT,
  descricao TEXT NOT NULL,
  valor DECIMAL(14, 2) NOT NULL CHECK (valor > 0),
  data_despesa DATE NOT NULL DEFAULT CURRENT_DATE,
  fornecedor TEXT,
  recibo_url TEXT,                       -- URL do upload do recibo
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_despesas_obra_id ON public.despesas(obra_id);
CREATE INDEX idx_despesas_categoria_id ON public.despesas(categoria_id);
CREATE INDEX idx_despesas_metodo_id ON public.despesas(metodo_pagamento_id);
CREATE INDEX idx_despesas_data ON public.despesas(data_despesa);

-- ============================================================
-- 5. VIEW: resumo financeiro por obra
-- ============================================================
CREATE OR REPLACE VIEW public.resumo_obra AS
SELECT 
  o.id AS obra_id,
  o.user_id,
  o.nome AS obra_nome,
  o.orcamento_total,
  COALESCE(SUM(d.valor), 0) AS total_gasto,
  o.orcamento_total - COALESCE(SUM(d.valor), 0) AS saldo_remanescente,
  CASE 
    WHEN o.orcamento_total > 0 
    THEN ROUND((COALESCE(SUM(d.valor), 0) / o.orcamento_total) * 100, 2)
    ELSE 0 
  END AS percentual_gasto,
  COUNT(d.id) AS total_lancamentos
FROM public.obras o
LEFT JOIN public.despesas d ON d.obra_id = o.id
GROUP BY o.id, o.user_id, o.nome, o.orcamento_total;

-- ============================================================
-- 6. VIEW: gastos por categoria
-- ============================================================
CREATE OR REPLACE VIEW public.gastos_por_categoria AS
SELECT 
  c.id AS categoria_id,
  c.obra_id,
  c.nome AS categoria_nome,
  c.cor,
  c.icone,
  c.orcamento_planejado,
  COALESCE(SUM(d.valor), 0) AS total_gasto,
  c.orcamento_planejado - COALESCE(SUM(d.valor), 0) AS saldo_categoria,
  COUNT(d.id) AS total_lancamentos
FROM public.categorias c
LEFT JOIN public.despesas d ON d.categoria_id = c.id
WHERE c.ativa = TRUE
GROUP BY c.id, c.obra_id, c.nome, c.cor, c.icone, c.orcamento_planejado;

-- ============================================================
-- 7. VIEW: gastos ao longo do tempo (para burn-down chart)
-- ============================================================
CREATE OR REPLACE VIEW public.gastos_por_periodo AS
SELECT 
  d.obra_id,
  DATE_TRUNC('week', d.data_despesa)::DATE AS semana,
  SUM(d.valor) AS gasto_semana,
  SUM(SUM(d.valor)) OVER (
    PARTITION BY d.obra_id 
    ORDER BY DATE_TRUNC('week', d.data_despesa)
  ) AS gasto_acumulado
FROM public.despesas d
GROUP BY d.obra_id, DATE_TRUNC('week', d.data_despesa)
ORDER BY semana;

-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Obras
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own obras"
  ON public.obras FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Categorias
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD categorias of own obras"
  ON public.categorias FOR ALL
  USING (
    obra_id IN (SELECT id FROM public.obras WHERE user_id = auth.uid())
  )
  WITH CHECK (
    obra_id IN (SELECT id FROM public.obras WHERE user_id = auth.uid())
  );

-- Metodos Pagamento
ALTER TABLE public.metodos_pagamento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD metodos_pagamento of own obras"
  ON public.metodos_pagamento FOR ALL
  USING (
    obra_id IN (SELECT id FROM public.obras WHERE user_id = auth.uid())
  )
  WITH CHECK (
    obra_id IN (SELECT id FROM public.obras WHERE user_id = auth.uid())
  );

-- Despesas
ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD despesas of own obras"
  ON public.despesas FOR ALL
  USING (
    obra_id IN (SELECT id FROM public.obras WHERE user_id = auth.uid())
  )
  WITH CHECK (
    obra_id IN (SELECT id FROM public.obras WHERE user_id = auth.uid())
  );

-- ============================================================
-- 9. TRIGGER: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_obras_updated_at
  BEFORE UPDATE ON public.obras
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON public.categorias
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_metodos_pagamento_updated_at
  BEFORE UPDATE ON public.metodos_pagamento
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_despesas_updated_at
  BEFORE UPDATE ON public.despesas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 10. SEED: Categorias padrão (inseridas ao criar uma obra)
-- ============================================================
-- Nota: Este insert de seed deve ser chamado via function/trigger
-- quando uma nova obra é criada.

CREATE OR REPLACE FUNCTION public.seed_categorias_padrao()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.categorias (obra_id, nome, cor, icone, ordem) VALUES
    (NEW.id, 'Mão de Obra',         '#f59e0b', 'hard-hat',      1),
    (NEW.id, 'Materiais de Base',    '#3b82f6', 'package',       2),
    (NEW.id, 'Acabamento',          '#8b5cf6', 'paint-bucket',  3),
    (NEW.id, 'Elétrica',            '#ef4444', 'zap',           4),
    (NEW.id, 'Hidráulica',          '#06b6d4', 'droplets',      5),
    (NEW.id, 'Documentação',        '#64748b', 'file-text',     6),
    (NEW.id, 'Equipamentos',        '#22c55e', 'wrench',        7),
    (NEW.id, 'Transporte/Frete',    '#f97316', 'truck',         8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_obra_created
  AFTER INSERT ON public.obras
  FOR EACH ROW EXECUTE FUNCTION public.seed_categorias_padrao();

-- ============================================================
-- 11. SEED: Métodos de pagamento padrão
-- ============================================================
CREATE OR REPLACE FUNCTION public.seed_metodos_padrao()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.metodos_pagamento (obra_id, nome) VALUES
    (NEW.id, 'PIX'),
    (NEW.id, 'Dinheiro'),
    (NEW.id, 'Cartão de Crédito'),
    (NEW.id, 'Cartão de Débito'),
    (NEW.id, 'Boleto Bancário'),
    (NEW.id, 'Transferência TED/DOC');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_obra_created_metodos
  AFTER INSERT ON public.obras
  FOR EACH ROW EXECUTE FUNCTION public.seed_metodos_padrao();
