'use server';

import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import { getLocalPublicUrl, uploadLocalFile } from "@/lib/local-storage";
import crypto from "crypto";

export async function createPresignedUploadUrl(propertyId: string, fileName: string) {
  // We no longer need presigned URLs since we handle uploads through standard Server Actions
  // This is kept for backward compatibility if the client still calls it, but we can just
  // return a mock success and handle the actual upload when the form is submitted.
  return { 
    success: true, 
    signedUrl: 'local', 
    token: 'local',
    path: `media-studio/${propertyId}/` + fileName
  };
}

function cleanSupabaseUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('blob:')) return url;
  if (url.includes('/object/sign/') && url.includes('?token=')) {
    return url.split('?token=')[0].replace('/object/sign/', '/object/public/');
  }
  return url;
}

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


    let mediaVideoUrl = null;
    
    // Check if client-uploaded video URL is provided
    const clientVideoUrl = formData.get("videoUrl") as string | null;
    if (clientVideoUrl && clientVideoUrl !== "") {
      mediaVideoUrl = cleanSupabaseUrl(clientVideoUrl);
    } else {
      // Check if new video uploaded via file
      const videoFile = formData.get("videoFile") as File | null;
      if (videoFile && videoFile.size > 0) {
        const ext = videoFile.name.split('.').pop() || 'mp4';
        const path = `media-studio/${propertyId}/video-${crypto.randomUUID()}.${ext}`;
        const buffer = Buffer.from(await videoFile.arrayBuffer());
        
        const { error } = await uploadLocalFile(path, buffer);
        if (error) throw error;
        
        mediaVideoUrl = getLocalPublicUrl(path);
      }
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
      
      let imageUrl = cleanSupabaseUrl(urlStr) || '';

      if (file && file.size > 0) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `media-studio/${propertyId}/img-${crypto.randomUUID()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        
        const { error } = await uploadLocalFile(path, buffer);
        if (error) throw error;
        
        imageUrl = getLocalPublicUrl(path);
      }
      
      sliderImages.push({
        id: `img-${i}`,
        url: imageUrl,
        name,
        role
      });
    }

    const imagesJson = JSON.stringify(sliderImages);

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        mediaVideoUrl,
        mediaSliderImages: imagesJson
      }
    });

    // We don't need to sign local URLs
    return { 
      success: true, 
      videoUrl: mediaVideoUrl, 
      images: sliderImages 
    };
  } catch (e: any) {
    console.error("Error saving media studio:", e);
    return { success: false, error: e.message };
  }
}
