'use client';

import { useState, useMemo, useRef } from 'react';
import { useAppData } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Upload, FileText, Image as ImageIcon, X } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function RecibosPage() {
  const { despesas, categorias } = useAppData();
  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
  
  // State for the modal
  const [viewingReceiptId, setViewingReceiptId] = useState<string | null>(null);
  
  // Simulate file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDespesas = useMemo(() => {
    return despesas.filter((d) => {
      const matchSearch = d.descricao.toLowerCase().includes(search.toLowerCase()) || 
                          (d.fornecedor?.toLowerCase() || '').includes(search.toLowerCase());
      const matchCat = selectedCategoria === 'all' || d.categoria_id === selectedCategoria;
      return matchSearch && matchCat;
    });
  }, [despesas, search, selectedCategoria]);

  const activeDespesa = despesas.find(d => d.id === viewingReceiptId);

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert('Upload de arquivo simulado com sucesso! (Na versão final, isso salvaria o arquivo no servidor)');
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 pl-12 md:pl-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
            <FileText className="h-5 w-5 text-purple-400" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Recibos & Notas</h1>
            <p className="text-xs text-muted-foreground">Gerencie os comprovantes das suas despesas</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 space-y-6 w-full md:px-8 pb-24">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por descrição ou fornecedor..." 
              className="pl-9 bg-muted/30"
            />
          </div>
          <div className="w-full md:w-64">
            <select 
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">Todas as Categorias</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List of expenses with receipts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDespesas.map((despesa) => {
            const cat = categorias.find(c => c.id === despesa.categoria_id);
            // Simulate that some have receipts
            const hasReceiptMock = parseInt(despesa.id.replace(/\D/g, '') || '0') % 2 === 0;

            return (
              <div key={despesa.id} className="rounded-2xl border border-border/50 bg-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md"
                      style={{ backgroundColor: `${cat?.cor}20`, color: cat?.cor }}
                    >
                      {cat?.nome}
                    </span>
                    <span className="text-sm font-bold text-foreground">{formatCurrency(despesa.valor)}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{despesa.descricao}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(despesa.data_despesa).toLocaleDateString('pt-BR')} {despesa.fornecedor ? `• ${despesa.fornecedor}` : ''}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewingReceiptId(despesa.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-500 hover:bg-amber-500/20 transition-colors"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {hasReceiptMock ? 'Ver Recibo' : 'Sem Recibo'}
                  </button>
                  <button
                    onClick={handleUploadClick}
                    className="flex items-center justify-center rounded-xl bg-muted/50 p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Upload de Recibo"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredDespesas.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma despesa encontrada com esses filtros.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*,.pdf" 
      />

      {/* Simple Modal for Receipt Viewing */}
      {viewingReceiptId && activeDespesa && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-border overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div>
                <h3 className="font-bold text-foreground">Comprovante</h3>
                <p className="text-xs text-muted-foreground">{activeDespesa.descricao}</p>
              </div>
              <button 
                onClick={() => setViewingReceiptId(null)}
                className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content (Mock Receipt Image) */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-muted/20 min-h-[300px]">
              <div className="text-center space-y-4">
                <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto" />
                <div className="text-muted-foreground max-w-sm text-sm">
                  <p>Esta é uma visualização simulada do recibo para a despesa: <strong>{activeDespesa.descricao}</strong></p>
                  <p className="mt-2 text-xs">Na versão com backend, a imagem ou PDF real seria carregada aqui.</p>
                </div>
                <button
                  onClick={handleUploadClick}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-400 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Fazer Upload Novo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
