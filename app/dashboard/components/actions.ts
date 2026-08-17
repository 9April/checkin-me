'use server';

import { prisma } from '@/lib/prisma';
import { sendCheckInEmails } from '@/lib/save-booking-core';
import { getHostUserId } from '@/lib/session-host-id';

export async function resendBookingEmailsAction(bookingId: string) {
  try {
    const hostId = await getHostUserId();
    if (!hostId) return { success: false, error: "Unauthorized" };

    const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      property: true,
      travelers: true,
    }
  });

    if (!booking || booking.property.hostId !== hostId) {
      return { success: false, error: "Not found" };
    }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  // Get Admin Attachments (Passport/ID photos, Selfies)
  const adminAttachments: { name: string, url: string }[] = [];
  
  if (booking.selfieUrl) {
    adminAttachments.push({
      name: booking.selfieUrl,
      url: `${supabaseUrl}/storage/v1/object/public/checkin-me/${booking.selfieUrl}`
    });
  }
  
  if (booking.signatureUrl) {
    adminAttachments.push({
      name: booking.signatureUrl,
      url: `${supabaseUrl}/storage/v1/object/public/checkin-me/${booking.signatureUrl}`
    });
  }

  for (const t of booking.travelers) {
    if (t.idImages) {
      const parsed = t.idImages.split(',').map(s => s.trim()).filter(Boolean);
      for (const img of parsed) {
        adminAttachments.push({
          name: img,
          url: `${supabaseUrl}/storage/v1/object/public/checkin-me/${img}`
        });
      }
    }
  }

  const downloadedAttachments = await Promise.all(
    adminAttachments.map(async (doc) => {
      try {
        const res = await fetch(doc.url);
        if (!res.ok) return null;
        const arrayBuffer = await res.arrayBuffer();
        return {
          filename: doc.name,
          content: Buffer.from(arrayBuffer),
          contentType: res.headers.get('content-type') || 'application/octet-stream'
        };
      } catch (e) {
        console.error("Failed to download attachment for email:", doc.url);
        return null;
      }
    })
  );

  const validAttachments = downloadedAttachments.filter(Boolean) as {filename: string, content: Buffer, contentType: string}[];

  const travelersData = booking.travelers.map(t => ({
    name: t.name,
    country: t.country,
    idNumber: t.idNumber || 'N/A',
    type: t.type || 'ID',
    idFiles: t.idImages ? t.idImages.split(',').map(s => s.trim()).filter(Boolean) : []
  }));

  const { mailError } = await sendCheckInEmails({
    guestEmail: booking.guestEmail,
    guestName: booking.guestName,
    adminEmail: booking.property.adminEmail,
    ccEmail: booking.property.ccEmail || undefined,
    propertyName: booking.property.name,
    checkin: booking.checkin,
    checkout: booking.checkout,
    checkinHour: booking.checkinHour || undefined,
    whatsapp: booking.whatsapp || undefined,
    totalTravelers: booking.totalTravelers || booking.travelers.length,
    travelers: travelersData,
    lang: 'EN',
    bookingId: booking.id,
    pdfAttachment: undefined,
    adminAttachments: validAttachments,
    guestAttachments: [],
    pdfFailedNote: "The Guest Stay Agreement PDF is not attached to this resent email. You can view it securely via the link above.",
  });

    if (mailError) {
      return { success: false, error: mailError };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Resend error:", error);
    return { success: false, error: error.message || String(error) };
  }
}
