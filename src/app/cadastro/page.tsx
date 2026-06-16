'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HardHat } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nome,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 mb-4">
            <HardHat className="h-7 w-7 text-amber-400" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Crie sua conta
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Comece a controlar o orçamento da sua obra
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 mt-8 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-500 bg-green-500/10 rounded-md">
              Cadastro realizado com sucesso! Verifique seu email ou faça login.
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
                required
                className="bg-muted/30"
                placeholder="João da Silva"
              />
            </div>
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
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="bg-muted/30"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmar Senha</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já possui uma conta?{' '}
          <Link href="/login" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
