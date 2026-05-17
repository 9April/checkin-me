import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import { redirect } from "next/navigation";
import MediaPreviewClient from "@/app/components/media-slider/MediaPreviewClient";
import { signPropertyMedia } from "@/lib/sign-media";

export default async function MediaPreviewPage() {
  const hostId = await getHostUserId();
  if (!hostId) {
    redirect("/login");
  }

  const property = await prisma.property.findFirst({
    where: { hostId }
  });

  if (!property) {
    redirect("/dashboard");
  }

  const { videoUrl, images } = await signPropertyMedia(
    property.mediaVideoUrl,
    property.mediaSliderImages
  );

  return (
    <MediaPreviewClient 
      propertyId={property.id} 
      initialVideoUrl={videoUrl} 
      initialImages={images} 
    />
  );
}
