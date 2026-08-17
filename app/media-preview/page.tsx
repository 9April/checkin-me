import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import { getActiveProperty } from "@/lib/active-property";
import { redirect } from "next/navigation";
import MediaPreviewClient from "@/app/components/media-slider/MediaPreviewClient";
import { signPropertyMedia } from "@/lib/sign-media";

export const dynamic = 'force-dynamic';

export default async function MediaPreviewPage() {
  const hostId = await getHostUserId();
  if (!hostId) {
    redirect("/login");
  }

  const property = await getActiveProperty(hostId);

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
      propertyName={property.name}
      initialVideoUrl={videoUrl} 
      initialImages={images} 
    />
  );
}
