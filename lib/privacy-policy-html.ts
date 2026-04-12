import { DEFAULT_PRIVACY_POLICY } from '@/lib/constants';
import { DEFAULT_PRIVACY_POLICY_FR } from '@/lib/privacy-default-fr';
import { DEFAULT_PRIVACY_POLICY_SP } from '@/lib/privacy-default-sp';
import type { Lang } from '@/lib/lang';

function themeTweaks(html: string): string {
  return html
    .replace(/--accent:\s*#E85D04/g, '--accent: #C5A059')
    .replace(/--accent-light:\s*#FFF0E6/g, '--accent-light: #F4EBD0')
    .replace(/--bg-primary:\s*#FDFBF7/g, '--bg-primary: #FDFCF9');
}

/**
 * Resolves privacy HTML for check-in / public privacy page.
 * - Custom policy may be a single HTML string (any language), or JSON:
 *   `{ "EN": "<html>...", "FR": "...", "SP": "..." }` for multilingual policies.
 * - If empty, uses the full styled default (EN / FR / SP) so the modal matches the form language.
 */
export function getPrivacyPolicyHtml(
  stored: string | null | undefined,
  lang: Lang = 'EN'
): string {
  const trimmed = stored?.trim();
  let raw: string;

  if (trimmed) {
    if (trimmed.startsWith('{')) {
      try {
        const o = JSON.parse(trimmed) as Record<string, string>;
        if (o && typeof o === 'object' && !Array.isArray(o)) {
          const pick =
            o[lang] ||
            o.EN ||
            o.en ||
            Object.values(o).find(
              (v) => typeof v === 'string' && v.includes('<')
            );
          raw =
            (typeof pick === 'string' && pick.trim()) ||
            DEFAULT_PRIVACY_POLICY;
        } else {
          raw = trimmed;
        }
      } catch {
        raw = trimmed;
      }
    } else {
      raw = trimmed;
    }
  } else {
    raw =
      lang === 'FR'
        ? DEFAULT_PRIVACY_POLICY_FR
        : lang === 'SP'
          ? DEFAULT_PRIVACY_POLICY_SP
          : DEFAULT_PRIVACY_POLICY;
  }

  return themeTweaks(raw);
}
