'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // findFirst + update by id: avoids updateMany quirks with relation + nullable filters in some Prisma/DB setups
  const row = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      deletedAt: null,
      property: { hostId: session.user.id },
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
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const row = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      deletedAt: { not: null },
      property: { hostId: session.user.id },
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
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      property: { hostId: session.user.id },
    },
  });

  if (!booking) {
    return { success: true };
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
