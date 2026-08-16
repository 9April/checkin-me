import { cookies } from 'next/headers';
import { prisma } from './prisma';

export const ACTIVE_PROPERTY_COOKIE = 'checkin-active-property-id';

export async function getActiveProperty(hostId: string) {
  const cookieStore = await cookies();
  const activePropertyId = cookieStore.get(ACTIVE_PROPERTY_COOKIE)?.value;

  if (activePropertyId) {
    const property = await prisma.property.findFirst({
      where: {
        id: activePropertyId,
        hostId,
      },
    });

    if (property) {
      return property;
    }
  }

  // Fallback to first property
  return await prisma.property.findFirst({
    where: {
      hostId,
    },
  });
}
