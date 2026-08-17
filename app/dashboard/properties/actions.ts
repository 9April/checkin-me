'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { attachSlugToNewProperty } from '@/lib/property-slug';
import { revalidatePath } from 'next/cache';
import { setActiveProperty } from '@/lib/property-actions';

export async function togglePropertyStatus(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.property.updateMany({
    where: { id, hostId: session.user.id },
    data: { isActive }
  });

  revalidatePath('/dashboard/properties');
  revalidatePath('/dashboard');
}

export async function createNewProperty(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const lastProperty = await prisma.property.findFirst({
    where: { hostId: session.user.id },
    orderBy: { updatedAt: 'desc' }
  });

  const created = await prisma.property.create({
    data: {
      name: name || "New Property",
      hostId: session.user.id,
      checkinTime: lastProperty?.checkinTime || "15:00",
      checkoutTime: lastProperty?.checkoutTime || "11:00",
      houseRules: lastProperty?.houseRules || JSON.stringify([
        "1. No loud music after 10PM",
        "2. No smoking inside",
        "3. Pets allowed on request"
      ]),
      pdfTemplate: lastProperty?.pdfTemplate,
      pdfFooter: lastProperty?.pdfFooter,
      privacyPolicy: lastProperty?.privacyPolicy,
      primaryColor: lastProperty?.primaryColor,
      formTitle: lastProperty?.formTitle,
      formSubtitle: lastProperty?.formSubtitle,
      requireSelfie: lastProperty?.requireSelfie ?? true,
      requireIdPhotos: lastProperty?.requireIdPhotos ?? true,
      showWhatsApp: lastProperty?.showWhatsApp ?? true,
      ruleLogistics: lastProperty?.ruleLogistics,
      ruleOccupants: lastProperty?.ruleOccupants,
      ruleResponsibility: lastProperty?.ruleResponsibility,
      ruleSecurity: lastProperty?.ruleSecurity,
    }
  });

  await attachSlugToNewProperty(prisma, created.id, created.name);
  
  await setActiveProperty(created.id);
  
  revalidatePath('/dashboard/properties');
  revalidatePath('/dashboard');
  
  return created.id;
}
