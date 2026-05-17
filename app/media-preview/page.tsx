import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import { redirect } from "next/navigation";
import MediaPreviewClient from "@/app/components/media-slider/MediaPreviewClient";

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

  let initialImages = [];
  try {
    if (property.mediaSliderImages) {
      initialImages = JSON.parse(property.mediaSliderImages);
    }
  } catch (e) {
    console.error("Failed to parse existing media images");
  }

  return (
    <MediaPreviewClient 
      propertyId={property.id} 
      initialVideoUrl={property.mediaVideoUrl} 
      initialImages={initialImages} 
    />
  );
}
