/**
 * Formata um número para moeda brasileira (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata um número curto (ex: 47.6k)
 */
export function formatCurrencyShort(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }
  return formatCurrency(value);
}

/**
 * Formata data no padrão brasileiro
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formata data curta (dia/mês)
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

/**
 * Formata mês/ano para labels de gráfico
 */
export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: '2-digit',
  }).format(date);
}

/**
 * Formata percentual
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Aplica máscara de moeda em um input (retorna string formatada)
 */
export function applyCurrencyMask(rawValue: string): string {
  // Remove tudo que não é dígito
  const digits = rawValue.replace(/\D/g, '');
  
  if (!digits) return '';
  
  // Converte para centavos
  const cents = parseInt(digits, 10);
  const reais = cents / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais);
}

/**
 * Converte valor com máscara de volta para número
 */
export function parseCurrencyValue(maskedValue: string): number {
  const digits = maskedValue.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD
 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
