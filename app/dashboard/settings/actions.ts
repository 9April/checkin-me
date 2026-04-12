'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { publicCheckInPath, reserveUniquePropertySlug } from "@/lib/property-slug";
import { revalidatePath } from "next/cache";

export async function updateProperty(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const propertyId = formData.get('propertyId') as string;
  const name = formData.get('name') as string;
  const adminEmail = formData.get('adminEmail') as string;
  const checkinTime = formData.get('checkinTime') as string;
  const checkoutTime = formData.get('checkoutTime') as string;
  const houseRulesRaw = formData.get('houseRules') as string;
  const privacyPolicy = formData.get('privacyPolicy') as string;
  const formTitle = formData.get('formTitle') as string;
  const formSubtitle = formData.get('formSubtitle') as string;
  const primaryColor = formData.get('primaryColor') as string;
  const showWhatsApp = formData.get('showWhatsApp') === 'true';
  const requireSelfie = formData.get('requireSelfie') === 'true';
  const requireIdPhotos = formData.get('requireIdPhotos') === 'true';

  // Validate house rules is valid JSON array of strings
  let houseRules = houseRulesRaw;
  try {
     if (!houseRulesRaw.startsWith('[')) {
       const list = houseRulesRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
       houseRules = JSON.stringify(list);
     }
  } catch (e) {
    console.error("Failed to parse house rules", e);
  }

  try {
    const newSlug = await reserveUniquePropertySlug(prisma, name, propertyId);

    await prisma.property.update({
      where: { 
        id: propertyId,
        hostId: session.user.id
      },
      data: {
        name,
        slug: newSlug,
        adminEmail,
        privacyPolicy,
        houseRules,
        checkinTime,
        checkoutTime,
        formTitle,
        formSubtitle,
        primaryColor,
        showWhatsApp,
        requireSelfie,
        requireIdPhotos,
      }
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath("/privacy");
    revalidatePath(publicCheckInPath({ id: propertyId, slug: newSlug }));
    
    return { success: true };
  } catch (error) {
    console.error("Update property failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update property settings." 
    };
  }
}
