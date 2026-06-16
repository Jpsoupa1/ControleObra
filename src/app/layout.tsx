import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ControleObra - Controle Financeiro de Obras",
  description:
    "Aplicativo de controle financeiro detalhado para obras de construção civil. Gerencie orçamentos, categorias de despesas e acompanhe gastos em tempo real.",
  keywords: [
    "controle de obra",
    "gestão financeira",
    "construção civil",
    "orçamento de obra",
    "despesas de obra",
  ],
  authors: [{ name: "ControleObra" }],
  openGraph: {
    title: "ControleObra - Controle Financeiro de Obras",
    description: "Gerencie o orçamento da sua obra na palma da mão.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f1117",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
