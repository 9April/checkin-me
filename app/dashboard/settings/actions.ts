'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

  // Handle Logo Upload
  const logoFile = formData.get('logo') as File | null;
  let logoUrl: string | undefined;

  if (logoFile && logoFile.size > 0 && typeof logoFile.arrayBuffer === 'function') {
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      
      const ext = logoFile.name.split('.').pop() || 'png';
      const filename = `logo_${propertyId}_${Date.now()}.${ext}`;
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      
      await writeFile(path.join(uploadDir, filename), buffer);
      logoUrl = `/uploads/${filename}`;
    } catch (e) {
      console.error("Logo upload failed:", e);
    }
  }

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
    await prisma.property.update({
      where: { 
        id: propertyId,
        hostId: session.user.id
      },
      data: {
        name,
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
        ...(logoUrl ? { logoUrl } : {})
      }
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath("/privacy");
    revalidatePath(`/check-in/${propertyId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Update property failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update property settings." 
    };
  }
}
