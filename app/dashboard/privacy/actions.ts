'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { publicCheckInPath } from "@/lib/property-slug";
import { revalidatePath } from "next/cache";

export async function updatePrivacyPolicy(propertyId: string, htmlContent: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const updated = await prisma.property.update({
      where: { 
        id: propertyId,
        hostId: session.user.id
      },
      data: {
        privacyPolicy: htmlContent
      },
      select: { id: true, slug: true },
    });

    revalidatePath("/dashboard/privacy");
    revalidatePath("/privacy");
    revalidatePath(publicCheckInPath(updated));
    
    return { success: true };
  } catch (error) {
    console.error("Update privacy policy failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update privacy policy." 
    };
  }
}
