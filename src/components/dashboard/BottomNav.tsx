'use client';

import { LayoutDashboard, PlusCircle, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
  { id: 'add', icon: PlusCircle, label: 'Lançar' },
  { id: 'reports', icon: BarChart3, label: 'Relatórios' },
  { id: 'settings', icon: Settings, label: 'Ajustes' },
];

export default function BottomNav() {
  const [active, setActive] = useState('dashboard');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/30 bg-background/90 backdrop-blur-xl safe-area-bottom md:hidden"
      id="bottom-navigation"
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
                ${isActive
                  ? 'text-amber-400'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              id={`nav-${item.id}`}
            >
              <div className={`relative ${isActive ? '' : ''}`}>
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.5} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-400" />
                )}
              </div>
              <span className={`text-[9px] font-medium ${isActive ? 'text-amber-400' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
