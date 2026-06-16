'use client';

import Sidebar from '@/components/layout/Sidebar';
import { AppProvider } from '@/lib/store';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/cadastro';
  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 min-w-0 ${isAuthPage ? 'overflow-y-auto' : 'overflow-y-auto'}`}>
          {children}
        </main>
      </div>
    </AppProvider>
  );
}
