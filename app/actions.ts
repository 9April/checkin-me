'use server';

import { executeSaveBooking } from '@/lib/save-booking-core';
import { headers } from 'next/headers';

// In-memory rate limiting store (cleared on server restart, suitable for Hostinger without Redis)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10; // Max 10 check-ins per hour per IP

export async function saveBooking(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') || 'unknown';
  
  const now = Date.now();
  let rateData = rateLimitMap.get(ip);
  if (!rateData || now > rateData.resetTime) {
    rateData = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  }
  
  if (rateData.count >= MAX_REQUESTS) {
    return { success: false, error: "Rate limit exceeded. Please try again later." };
  }
  
  rateData.count++;
  rateLimitMap.set(ip, rateData);

  return executeSaveBooking(formData);
}
