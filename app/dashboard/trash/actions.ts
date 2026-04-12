'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

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

  if (!row) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/trash");
    return { success: true };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/trash");
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
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/trash");
    return { success: true };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { deletedAt: null },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/trash");
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

  // Idempotent: second concurrent delete finds nothing — no throw (avoids Next.js digest errors)
  if (!booking) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/trash");
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

  await prisma.booking.delete({
    where: { id: bookingId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/trash");
  return { success: true };
}
