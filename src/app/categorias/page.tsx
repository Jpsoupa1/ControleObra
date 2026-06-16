'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { formatCurrency, parseCurrencyValue } from '@/lib/formatters';

export default function CategoriasPage() {
  const { categorias, addCategoria, removeCategoria } = useAppData();
  
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#3b82f6'); // Default blue
  const [orcamento, setOrcamento] = useState('');

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic formatting for number input as currency string isn't perfect for simple inputs, 
    // but we can use simple numeric input here for simplicity or the same mask.
    // Let's use simple numeric string
    const val = e.target.value.replace(/\D/g, '');
    const num = Number(val) / 100;
    setOrcamento(num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;
    const orcamentoNum = parseCurrencyValue(`R$ ${orcamento}`);
    addCategoria(nome, cor, orcamentoNum);
    setNome('');
    setOrcamento('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 pl-12 md:pl-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Categorias</h1>
            <p className="text-xs text-muted-foreground">Gerencie as categorias de despesas</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 space-y-8 w-full md:px-8 pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            {/* Form to add new */}
            <div className="rounded-2xl border border-border/50 bg-card p-5">
              <h2 className="text-sm font-semibold mb-4">Nova Categoria</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-1">
                  <div>
                    <Label htmlFor="nome" className="text-xs font-medium text-muted-foreground mb-1 block">Nome</Label>
                    <Input 
                      id="nome" 
                      value={nome} 
                      onChange={(e) => setNome(e.target.value)} 
                      placeholder="Ex: Madeiramento"
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cor" className="text-xs font-medium text-muted-foreground mb-1 block">Cor</Label>
                      <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/30 px-3">
                        <input 
                          type="color" 
                          id="cor" 
                          value={cor} 
                          onChange={(e) => setCor(e.target.value)}
                          className="h-6 w-full cursor-pointer bg-transparent border-none outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="orcamento" className="text-xs font-medium text-muted-foreground mb-1 block">Orçamento (R$)</Label>
                      <Input 
                        id="orcamento" 
                        value={orcamento} 
                        onChange={handleValueChange} 
                        placeholder="0,00"
                        className="bg-muted/30"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!nome}
                  className="flex items-center justify-center gap-2 h-10 w-full md:w-auto px-6 rounded-xl bg-amber-500 text-sm font-bold text-amber-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Categoria
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* List */}
            <div>
              <h2 className="text-sm font-semibold mb-4">Categorias Cadastradas</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {categorias.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: cat.cor }} />
                      <div>
                        <p className="text-sm font-medium">{cat.nome}</p>
                        <p className="text-[10px] text-muted-foreground">Planejado: {formatCurrency(cat.orcamento_planejado)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeCategoria(cat.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Remover categoria"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {categorias.length === 0 && (
                  <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                    Nenhuma categoria cadastrada.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
