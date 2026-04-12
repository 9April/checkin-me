import { prisma } from "@/lib/prisma";
import { reserveUniquePropertySlug } from "@/lib/property-slug";
import { notFound } from "next/navigation";
import CheckInForm from "../../components/CheckInForm";

export default async function PropertyCheckInPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: segment } = await params;
  const decoded = decodeURIComponent(segment);

  let property = await prisma.property.findFirst({
    where: {
      OR: [{ slug: decoded }, { id: decoded }],
    },
  });

  if (!property) {
    notFound();
  }

  if (!property.slug) {
    const newSlug = await reserveUniquePropertySlug(prisma, property.name, property.id);
    property = await prisma.property.update({
      where: { id: property.id },
      data: { slug: newSlug },
    });
  }

  return (
    <CheckInForm
      property={{
        id: property.id,
        name: property.name,
        logoUrl: property.logoUrl,
        checkinTime: property.checkinTime,
        checkoutTime: property.checkoutTime,
        houseRules: property.houseRules,
        showWhatsApp: property.showWhatsApp,
        requireSelfie: property.requireSelfie,
        requireIdPhotos: property.requireIdPhotos,
      }}
    />
  );
}
