'use server';

import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function saveMediaStudio(formData: FormData) {
  try {
    const hostId = await getHostUserId();
    if (!hostId) {
      throw new Error("Unauthorized");
    }

    const propertyId = formData.get("propertyId") as string;
    if (!propertyId) {
      throw new Error("Missing propertyId");
    }

    // Verify ownership
    const property = await prisma.property.findFirst({
      where: { id: propertyId, hostId }
    });

    if (!property) {
      throw new Error("Property not found or unauthorized");
    }

    const supabaseAdmin = getSupabaseAdmin();
    const bucket = "checkin-me"; 

    let mediaVideoUrl = property.mediaVideoUrl || null;
    
    // Check if new video uploaded
    const videoFile = formData.get("videoFile") as File | null;
    if (videoFile && videoFile.size > 0) {
      const ext = videoFile.name.split('.').pop() || 'mp4';
      const path = `media-studio/${propertyId}/video-${crypto.randomUUID()}.${ext}`;
      const buffer = Buffer.from(await videoFile.arrayBuffer());
      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, buffer, {
          contentType: videoFile.type,
          upsert: true,
        });
      if (error) throw error;
      const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
      mediaVideoUrl = publicUrl;
    }

    // Process Images
    const imagesCountStr = formData.get("imagesCount") as string;
    const imagesCount = parseInt(imagesCountStr || "0", 10);
    
    const sliderImages = [];
    
    for (let i = 0; i < imagesCount; i++) {
      const file = formData.get(`image_${i}_file`) as File | null;
      const urlStr = formData.get(`image_${i}_url`) as string | null;
      const name = formData.get(`image_${i}_name`) as string || '';
      const role = formData.get(`image_${i}_role`) as string || '';
      
      let imageUrl = urlStr || '';

      if (file && file.size > 0) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `media-studio/${propertyId}/img-${crypto.randomUUID()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const { error } = await supabaseAdmin.storage
          .from(bucket)
          .upload(path, buffer, {
            contentType: file.type,
            upsert: true,
          });
        if (error) throw error;
        const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
        imageUrl = publicUrl;
      }
      
      sliderImages.push({
        id: `img-${i}`,
        url: imageUrl,
        name,
        role
      });
    }

    const imagesJson = JSON.stringify(sliderImages);

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        mediaVideoUrl,
        mediaSliderImages: imagesJson
      }
    });

    return { success: true };
  } catch (e: any) {
    console.error("Error saving media studio:", e);
    return { success: false, error: e.message };
  }
}
