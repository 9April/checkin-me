import { prisma } from "@/lib/prisma";
import { normalizeLang } from "@/lib/lang";
import { reserveUniquePropertySlug } from "@/lib/property-slug";
import { notFound } from "next/navigation";
import CheckInForm from "../../components/CheckInForm";
import { signPropertyMedia } from "@/lib/sign-media";

export default async function PropertyCheckInPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug: segment } = await params;
  const { lang: langParam } = await searchParams;
  const initialLang = normalizeLang(langParam);
  const decoded = decodeURIComponent(segment);

  let property = await prisma.property.findFirst({
    where: {
      OR: [{ slug: decoded }, { id: decoded }],
    },
  });

  if (!property || !property.isActive) {
    notFound();
  }

  if (!property.slug) {
    const newSlug = await reserveUniquePropertySlug(prisma, property.name, property.id);
    property = await prisma.property.update({
      where: { id: property.id },
      data: { slug: newSlug },
    });
  }

  const { videoUrl, images } = await signPropertyMedia(
    property.mediaVideoUrl,
    property.mediaSliderImages
  );

  return (
    <CheckInForm
      initialLang={initialLang}
      property={{
        id: property.id,
        name: property.name,
        checkinTime: property.checkinTime,
        checkoutTime: property.checkoutTime,
        houseRules: property.houseRules,
        showWhatsApp: property.showWhatsApp,
        requireSelfie: property.requireSelfie,
        requireIdPhotos: property.requireIdPhotos,
        privacyPolicy: property.privacyPolicy,
        ruleLogistics: property.ruleLogistics,
        ruleOccupants: property.ruleOccupants,
        ruleResponsibility: property.ruleResponsibility,
        ruleSecurity: property.ruleSecurity,
        logoUrl: property.logoUrl,
        mediaVideoUrl: videoUrl,
        mediaSliderImages: JSON.stringify(images),
        whatsappNumber: property.whatsappNumber,
        companyName: property.companyName,
        locationEmbedUrl: property.locationEmbedUrl,
      }}
    />
  );
}
