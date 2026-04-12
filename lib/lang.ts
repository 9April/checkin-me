export type Lang = 'EN' | 'FR' | 'SP';

export function normalizeLang(raw: string | null | undefined): Lang {
  const u = String(raw || '').toUpperCase();
  if (u === 'FR' || u === 'SP') return u;
  return 'EN';
}
