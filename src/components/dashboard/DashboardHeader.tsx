'use client';

import { HardHat, Bell } from 'lucide-react';
import type { Obra } from '@/types/database';

interface HeaderProps {
  obra: Obra;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  em_andamento: { label: 'Em andamento', color: '#22c55e' },
  pausada: { label: 'Pausada', color: '#f59e0b' },
  concluida: { label: 'Concluída', color: '#3b82f6' },
  cancelada: { label: 'Cancelada', color: '#ef4444' },
};

export default function DashboardHeader({ obra }: HeaderProps) {
  const status = statusLabels[obra.status] || statusLabels.em_andamento;

  return (
    <header className="sticky top-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-xl px-4 pb-4 pt-3" id="dashboard-header">
      <div className="flex items-start justify-between">
        {/* Logo & Obra */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
            <HardHat className="h-5 w-5 text-amber-400" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">
              {obra.nome.length > 25 ? obra.nome.slice(0, 22) + '…' : obra.nome}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div
                className="h-1.5 w-1.5 rounded-full animate-pulse-glow"
                style={{ backgroundColor: status.color }}
              />
              <span className="text-[10px] font-medium" style={{ color: status.color }}>
                {status.label}
              </span>
              {obra.endereco && (
                <>
                  <span className="text-muted-foreground text-[10px]">•</span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                    {obra.endereco}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Notification bell */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted/30 text-muted-foreground hover:bg-muted/50 active:scale-95 transition-all"
          id="notifications-button"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-amber-950">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
