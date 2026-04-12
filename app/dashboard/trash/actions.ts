'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

export async function softDeleteBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Idempotent: repeated clicks / races after first soft-delete affect 0 rows — still OK
  await prisma.booking.updateMany({
    where: {
      id: bookingId,
      property: { hostId: session.user.id },
      deletedAt: null,
    },
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

  await prisma.booking.updateMany({
    where: {
      id: bookingId,
      property: { hostId: session.user.id },
      deletedAt: { not: null },
    },
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
