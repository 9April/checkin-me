import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CheckInForm from "../../components/CheckInForm";

export default async function PropertyCheckInPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    notFound();
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