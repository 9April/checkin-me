import { NextResponse } from 'next/server';
import { executeSaveBooking } from '@/lib/save-booking-core';

export const runtime = 'nodejs';
export const maxDuration = 300;

/**
 * Plain HTTP fallback when the Next.js server-action POST fails in some browsers
 * (e.g. "An unexpected response was received from the server" with multipart FormData).
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const result = await executeSaveBooking(formData);
    return NextResponse.json(result);
  } catch (e) {
    console.error('api/check-in POST error:', e);
    return NextResponse.json(
      { success: false, error: 'Submission failed' },
      { status: 500 }
    );
  }
}
