'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Plus, Camera } from 'lucide-react';
import { applyCurrencyMask, parseCurrencyValue, todayISO } from '@/lib/formatters';
import type { Categoria, MetodoPagamento, NovaDespesaForm } from '@/types/database';

interface ExpenseFormProps {
  categorias: Categoria[];
  metodosPagamento: MetodoPagamento[];
  onSubmit: (data: NovaDespesaForm) => void;
}

export default function ExpenseForm({ categorias, metodosPagamento, onSubmit }: ExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NovaDespesaForm>({
    categoria_id: '',
    metodo_pagamento_id: '',
    descricao: '',
    valor: '',
    data_despesa: todayISO(),
    fornecedor: '',
    observacoes: '',
  });

  const resetForm = useCallback(() => {
    setFormData({
      categoria_id: '',
      metodo_pagamento_id: '',
      descricao: '',
      valor: '',
      data_despesa: todayISO(),
      fornecedor: '',
      observacoes: '',
    });
  }, []);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyCurrencyMask(e.target.value);
    setFormData((prev) => ({ ...prev, valor: masked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valor = parseCurrencyValue(formData.valor);
    if (!formData.categoria_id || !formData.metodo_pagamento_id || !formData.descricao || valor <= 0) return;
    onSubmit(formData);
    resetForm();
    setOpen(false);
  };

  const isValid =
    formData.categoria_id &&
    formData.metodo_pagamento_id &&
    formData.descricao &&
    parseCurrencyValue(formData.valor) > 0;

  return (
    <>
      {/* FAB Trigger */}
      <div
        role="button"
        tabIndex={0}
        id="add-expense-button"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true); }}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl bg-amber-500 text-amber-950 shadow-lg shadow-amber-500/30 hover:bg-amber-400 hover:shadow-amber-500/50 active:scale-95 transition-all duration-200 md:bottom-8 md:right-8"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] rounded-t-3xl border-t border-border/50 bg-background px-4 pb-8 pt-4 animate-slide-up"
        >
          <SheetHeader className="mb-6">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
            <SheetTitle className="text-lg font-bold text-foreground">
              Nova Despesa
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto max-h-[calc(85vh-140px)] pb-4">
            {/* Valor com máscara */}
            <div>
              <Label htmlFor="valor" className="text-xs font-medium text-muted-foreground mb-2 block">
                Valor *
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                  R$
                </span>
                <Input
                  id="valor"
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={handleValueChange}
                  className="h-14 pl-12 text-2xl font-bold bg-muted/30 border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/40"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao" className="text-xs font-medium text-muted-foreground mb-2 block">
                Descrição *
              </Label>
              <Input
                id="descricao"
                type="text"
                placeholder="Ex: Cimento CP-II (50 sacos)"
                value={formData.descricao}
                onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                className="h-12 bg-muted/30 border-border/50 rounded-xl text-foreground"
                autoComplete="off"
              />
            </div>

            {/* Categoria (seleção rápida com chips) */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                Categoria *
              </Label>
              <div className="flex flex-wrap gap-2">
                {categorias.filter((c) => c.ativa).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, categoria_id: cat.id }))}
                    className={`
                      flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium
                      transition-all duration-200 active:scale-95
                      ${formData.categoria_id === cat.id
                        ? 'ring-2 ring-offset-2 ring-offset-background shadow-md'
                        : 'opacity-60 hover:opacity-100'
                      }
                    `}
                    style={{
                      backgroundColor: formData.categoria_id === cat.id ? `${cat.cor}30` : `${cat.cor}12`,
                      color: cat.cor,
                      '--tw-ring-color': formData.categoria_id === cat.id ? cat.cor : 'transparent',
                    } as React.CSSProperties}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.cor }} />
                    {cat.nome}
                  </button>
                ))}
              </div>
            </div>

            {/* Data e Método de Pagamento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="data" className="text-xs font-medium text-muted-foreground mb-2 block">
                  Data
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data_despesa}
                  onChange={(e) => setFormData((prev) => ({ ...prev, data_despesa: e.target.value }))}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="pagamento" className="text-xs font-medium text-muted-foreground mb-2 block">
                  Método de Pagamento *
                </Label>
                <Select
                  value={formData.metodo_pagamento_id}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, metodo_pagamento_id: v || '' }))}
                >
                  <SelectTrigger id="pagamento" className="h-12 bg-muted/30 border-border/50 rounded-xl text-foreground">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {metodosPagamento.filter((m) => m.ativo).map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fornecedor */}
            <div>
              <Label htmlFor="fornecedor" className="text-xs font-medium text-muted-foreground mb-2 block">
                Fornecedor
              </Label>
              <Input
                id="fornecedor"
                type="text"
                placeholder="Nome do fornecedor (opcional)"
                value={formData.fornecedor}
                onChange={(e) => setFormData((prev) => ({ ...prev, fornecedor: e.target.value }))}
                className="h-12 bg-muted/30 border-border/50 rounded-xl text-foreground"
                autoComplete="off"
              />
            </div>

            {/* Upload de recibo */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                Recibo / Nota
              </Label>
              <button
                type="button"
                className="flex h-16 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground transition-colors hover:border-amber-500/50 hover:text-amber-400 active:bg-muted/30"
              >
                <Camera className="h-5 w-5" />
                <span className="text-xs font-medium">Tirar foto ou anexar</span>
              </button>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes" className="text-xs font-medium text-muted-foreground mb-2 block">
                Observações
              </Label>
              <Input
                id="observacoes"
                type="text"
                placeholder="Anotações extras (opcional)"
                value={formData.observacoes}
                onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
                className="h-12 bg-muted/30 border-border/50 rounded-xl text-foreground"
                autoComplete="off"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid}
              className="h-14 w-full rounded-xl bg-amber-500 text-base font-bold text-amber-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-40 disabled:shadow-none transition-all"
            >
              Lançar Despesa
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
