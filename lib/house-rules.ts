import type { Lang } from './lang';

/**
 * Parses `houseRules` from the property.
 * - Legacy: `["rule 1", "rule 2"]` — same list for every language.
 * - Optional: `{ "EN": [...], "FR": [...], "SP": [...] }` — list for the selected language, with EN fallback.
 */
export function parseHouseRulesForLang(
  raw: string | null | undefined,
  lang: Lang
): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === 'string');
    }
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const o = parsed as Record<string, unknown>;
      const pick = o[lang] ?? o.EN ?? o.en;
      if (Array.isArray(pick)) {
        return pick.filter((x): x is string => typeof x === 'string');
      }
      const first = Object.values(o).find(
        (v) => Array.isArray(v) && (v as unknown[]).every((x) => typeof x === 'string')
      );
      if (Array.isArray(first)) {
        return first.filter((x): x is string => typeof x === 'string');
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}
