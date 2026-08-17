'use server';

import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { unlink } from "fs/promises";
import path from "path";

function revalidateDashboard() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/trash");
}

function isNotFound(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025";
}

export async function softDeleteBooking(bookingId: string) {
  const hostId = await getHostUserId();
  if (!hostId) throw new Error("Unauthorized");

  // findFirst + update by id: avoids updateMany quirks with relation + nullable filters in some Prisma/DB setups
  const row = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      deletedAt: null,
      property: { hostId },
    },
    select: { id: true },
  });

  // Already trashed / not ours: idempotent. Do NOT revalidate here — spamming revalidatePath caused Next.js digest errors.
  if (!row) {
    return { success: true };
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { deletedAt: new Date() },
    });
  } catch (e) {
    if (isNotFound(e)) return { success: true };
    throw e;
  }

  revalidateDashboard();
  return { success: true };
}

export async function restoreBooking(bookingId: string) {
  const hostId = await getHostUserId();
  if (!hostId) throw new Error("Unauthorized");

  const row = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      deletedAt: { not: null },
      property: { hostId },
    },
    select: { id: true },
  });

  if (!row) {
    return { success: true };
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { deletedAt: null },
    });
  } catch (e) {
    if (isNotFound(e)) return { success: true };
    throw e;
  }

  revalidateDashboard();
  return { success: true };
}

export async function permanentlyDeleteBooking(bookingId: string) {
  const hostId = await getHostUserId();
  if (!hostId) throw new Error("Unauthorized");

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      property: { hostId },
    },
    include: {
      travelers: true,
    }
  });

  if (!booking) {
    return { success: true };
  }

  // 1. Collect all files associated with this booking from Supabase Storage
  const filesToDelete: string[] = [];
  if (booking.selfieUrl) filesToDelete.push(booking.selfieUrl);
  if (booking.signatureUrl) filesToDelete.push(booking.signatureUrl);

  for (const t of booking.travelers) {
    if (t.idImages) {
      const parsed = t.idImages.split(',').map(s => s.trim()).filter(Boolean);
      filesToDelete.push(...parsed);
    }
  }

  // 2. Wipe from Supabase
  if (filesToDelete.length > 0) {
    try {
      const { supabaseAdmin } = await import("@/lib/supabase-admin");
      const { error } = await supabaseAdmin.storage.from('checkin-me').remove(filesToDelete);
      if (error) {
        console.warn("Non-fatal: Failed to delete some files from Supabase", error);
      } else {
        console.log(`Successfully wiped ${filesToDelete.length} files from storage for booking ${bookingId}`);
      }
    } catch (e) {
      console.warn("Non-fatal: Error wiping files from Supabase", e);
    }
  }

  if (booking.pdfUrl) {
    try {
      const pdfPath = path.join(process.cwd(), "public", "pdfs", booking.pdfUrl);
      await unlink(pdfPath);
    } catch (e) {
      console.warn("Failed to delete PDF file:", e);
    }
  }

  try {
    await prisma.booking.delete({
      where: { id: bookingId },
    });
  } catch (e) {
    if (isNotFound(e)) return { success: true };
    throw e;
  }

  revalidateDashboard();
  return { success: true };
}
