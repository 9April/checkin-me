import type { SaveBookingResult } from '@/lib/save-booking-core';

/**
 * App Router POST /api/check-in may return plain-text errors (e.g. "Request Entity Too Large")
 * instead of JSON. Never call res.json() blindly.
 */
export async function parseCheckInApiResponse(
  res: Response
): Promise<SaveBookingResult> {
  const text = await res.text();
  const trimmed = text.trim();

  if (trimmed.startsWith('{')) {
    try {
      const j = JSON.parse(trimmed) as SaveBookingResult;
      if (j && typeof j === 'object' && 'success' in j) {
        return j;
      }
    } catch {
      /* fall through */
    }
  }

  const lower = trimmed.toLowerCase();
  const tooLarge =
    res.status === 413 ||
    lower.includes('entity too large') ||
    lower.includes('body exceeded') ||
    lower.includes('payload too large');

  if (tooLarge) {
    return {
      success: false,
      error:
        'The backup upload endpoint rejected the payload size. Your photos may be too large for this path; try slightly smaller images or submit again.',
    };
  }

  return {
    success: false,
    error:
      trimmed.slice(0, 240) ||
      (res.status ? `Request failed (${res.status})` : 'Request failed'),
  };
}
