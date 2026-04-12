import { DEFAULT_PRIVACY_POLICY } from '@/lib/constants';

/** Same HTML + theme tweaks as `/privacy` — use for inline modal and standalone page. */
export function getPrivacyPolicyHtml(stored: string | null | undefined): string {
  const raw = stored?.trim() ? stored : DEFAULT_PRIVACY_POLICY;
  return raw
    .replace(/--accent:\s*#E85D04/g, '--accent: #C5A059')
    .replace(/--accent-light:\s*#FFF0E6/g, '--accent-light: #F4EBD0')
    .replace(/--bg-primary:\s*#FDFBF7/g, '--bg-primary: #FDFCF9');
}
