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

  const { supabaseAdmin } = await import('@/lib/supabase-admin');

  // Get Admin Attachments (Passport/ID photos, Selfies)
  const adminAttachmentNames: string[] = [];
  
  if (booking.selfieUrl) {
    adminAttachmentNames.push(booking.selfieUrl);
  }
  
  if (booking.signatureUrl) {
    adminAttachmentNames.push(booking.signatureUrl);
  }

  for (const t of booking.travelers) {
    if (t.idImages) {
      const parsed = t.idImages.split(',').map(s => s.trim()).filter(Boolean);
      for (const img of parsed) {
        adminAttachmentNames.push(img);
      }
    }
  }

  const downloadedAttachments = await Promise.all(
    adminAttachmentNames.map(async (fileName) => {
      try {
        const { data, error } = await supabaseAdmin.storage.from('checkin-me').download(fileName);
        if (error || !data) {
          console.warn(`Failed to securely download ${fileName}:`, error);
          return null;
        }
        const arrayBuffer = await data.arrayBuffer();
        return {
          filename: fileName,
          content: Buffer.from(arrayBuffer),
          contentType: data.type || 'application/octet-stream'
        };
      } catch (e) {
        console.error("Failed to download attachment for email:", fileName);
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
