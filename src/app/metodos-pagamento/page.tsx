'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

export default function MetodosPagamentoPage() {
  const { metodosPagamento, addMetodoPagamento, removeMetodoPagamento } = useAppData();
  
  const [nome, setNome] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;
    addMetodoPagamento(nome);
    setNome('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 pl-12 md:pl-0">
          <div>
            <h1 className="text-lg font-bold text-foreground">Métodos de Pagamento</h1>
            <p className="text-xs text-muted-foreground">Cadastre as formas como você paga as despesas</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 space-y-8 w-full md:px-8 pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            {/* Form to add new */}
            <div className="rounded-2xl border border-border/50 bg-card p-5">
              <h2 className="text-sm font-semibold mb-4">Novo Método de Pagamento</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="w-full">
                  <Label htmlFor="nome" className="text-xs font-medium text-muted-foreground mb-1 block">Nome Referencial</Label>
                  <Input 
                    id="nome" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    placeholder="Ex: Cartão de Crédito Nubank"
                    className="bg-muted/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!nome}
                  className="flex items-center justify-center gap-2 h-10 w-full px-6 rounded-xl bg-amber-500 text-sm font-bold text-amber-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* List */}
            <div>
              <h2 className="text-sm font-semibold mb-4">Métodos Cadastrados</h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {metodosPagamento.map(metodo => (
                  <div key={metodo.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4">
                    <p className="text-sm font-medium">{metodo.nome}</p>
                    <button 
                      onClick={() => removeMetodoPagamento(metodo.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Remover método"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {metodosPagamento.length === 0 && (
                  <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                    Nenhum método de pagamento cadastrado.
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
