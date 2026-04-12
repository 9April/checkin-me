'use server';

import { executeSaveBooking } from '@/lib/save-booking-core';

export async function saveBooking(formData: FormData) {
  return executeSaveBooking(formData);
}
