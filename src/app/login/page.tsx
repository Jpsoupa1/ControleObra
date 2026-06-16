'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HardHat } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 mb-4">
            <HardHat className="h-7 w-7 text-amber-400" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Acesse sua conta
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Gerencie suas obras e orçamento em um só lugar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-8 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="bg-muted/30"
                placeholder="exemplo@email.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-xs font-medium text-amber-500 hover:text-amber-400">
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="bg-muted/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-xl bg-amber-500 px-3 py-3 text-sm font-bold text-amber-950 hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem uma conta?{' '}
          <Link href="/cadastro" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
            Cadastre-se gratuitamente
          </Link>
        </p>
      </div>
    </div>
  );
}
