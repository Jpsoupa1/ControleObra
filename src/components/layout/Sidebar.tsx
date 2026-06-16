'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Tags,
  PieChart,
  BarChart3,
  HardHat,
  Menu,
  X,
  FileText,
  Filter,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/categorias', icon: Tags, label: 'Categorias' },
  { href: '/metodos-pagamento', icon: CreditCard, label: 'Pagamentos' },
  { href: '/gastos-categorias', icon: PieChart, label: 'Por Categoria' },
  { href: '/gastos-metodos', icon: BarChart3, label: 'Por Método' },
  { href: '/relatorio-metodos', icon: Filter, label: 'Filtro Métodos' },
  { href: '/recibos', icon: FileText, label: 'Recibos & Notas' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground backdrop-blur-sm md:hidden"
        id="sidebar-mobile-toggle"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border/30 bg-card/95 backdrop-blur-xl
          transition-transform duration-300 ease-out
          md:static md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        id="app-sidebar"
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/30 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15">
              <HardHat className="h-5 w-5 text-amber-400" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">ControleObra</h1>
              <p className="text-[10px] text-muted-foreground">Gestão financeira</p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 no-scrollbar">
          <nav className="flex flex-col gap-1 px-3">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }
                  `}
                  id={`nav-${item.href.replace('/', '') || 'dashboard'}`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`}
                    strokeWidth={isActive ? 2.2 : 1.5}
                  />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

      </aside>
    </>
  );
}
