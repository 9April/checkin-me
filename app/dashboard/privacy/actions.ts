'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePrivacyPolicy(propertyId: string, htmlContent: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.property.update({
      where: { 
        id: propertyId,
        hostId: session.user.id
      },
      data: {
        privacyPolicy: htmlContent
      }
    });

    revalidatePath("/dashboard/privacy");
    revalidatePath("/privacy");
    revalidatePath(`/check-in/${propertyId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Update privacy policy failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update privacy policy." 
    };
  }
}
