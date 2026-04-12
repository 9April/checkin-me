import type { Lang } from './lang';
import { getBuiltinHouseRulesLines } from './pdf-rules-i18n';

/**
 * Parses `houseRules` when stored as `{ "EN": [...], "FR": [...], "SP": [...] }`.
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
        (v) =>
          Array.isArray(v) &&
          (v as unknown[]).every((x) => typeof x === 'string')
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

/**
 * House rules for PDF + check-in UI in the guest’s language.
 * - Multilingual JSON: uses the list for the selected language (fallback EN).
 * - Legacy JSON array (one language): if the guest selects FR/SP, shows the
 *   built-in translated rules (same as PDF). For custom text per language, store
 *   `{ "EN": [...], "FR": [...], "SP": [...] }`.
 * - Empty: built-in rules for that language.
 */
export function resolveHouseRulesForLang(
  raw: string | null | undefined,
  lang: Lang
): string[] {
  if (!raw?.trim()) return getBuiltinHouseRulesLines(lang);
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      const lines = parsed.filter((x): x is string => typeof x === 'string');
      if (lines.length === 0) return getBuiltinHouseRulesLines(lang);
      if (lang === 'EN') return lines;
      return getBuiltinHouseRulesLines(lang);
    }
    if (parsed && typeof parsed === 'object') {
      const o = parsed as Record<string, unknown>;
      const pick = o[lang] ?? o.EN ?? o.en;
      if (Array.isArray(pick)) {
        const lines = pick.filter((x): x is string => typeof x === 'string');
        if (lines.length > 0) return lines;
      }
      const first = Object.values(o).find(
        (v) =>
          Array.isArray(v) &&
          (v as unknown[]).every((x) => typeof x === 'string')
      );
      if (Array.isArray(first)) {
        const lines = first.filter((x): x is string => typeof x === 'string');
        if (lines.length > 0) return lines;
      }
    }
  } catch {
    /* ignore */
  }
  return getBuiltinHouseRulesLines(lang);
}
