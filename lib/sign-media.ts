import { getSupabaseAdmin } from "@/lib/supabase";

function getStoragePathFromUrl(url: string | null): string | null {
  if (!url) return null;
  const parts = url.split('/checkin-me/');
  if (parts.length > 1) {
    // URL decode to convert any %20 etc. back to plain characters for path
    return decodeURIComponent(parts[1]);
  }
  return null;
}

export async function signMediaUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  
  // If it's already a signed URL (contains token=) or a blob URL, return it
  if (url.includes('token=') || url.startsWith('blob:')) {
    return url;
  }
  
  const path = getStoragePathFromUrl(url);
  if (!path) return url;
  
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.storage
      .from('checkin-me')
      .createSignedUrl(path, 315360000); // 10 years expiry
      
    if (error) throw error;
    return data.signedUrl;
  } catch (e) {
    console.error("Error signing URL:", e);
    return url; // Fallback
  }
}

export async function signPropertyMedia(
  videoUrl: string | null,
  imagesJson: string | null
): Promise<{ videoUrl: string | null; images: { id: string; url: string; name: string; role: string }[] }> {
  const signedVideoUrl = await signMediaUrl(videoUrl);
  
  let images: any[] = [];
  if (imagesJson) {
    try {
      images = JSON.parse(imagesJson);
    } catch (e) {
      console.error("Failed to parse images JSON for signing:", e);
    }
  }
  
  const signedImages = await Promise.all(
    images.map(async (img: any) => {
      const signedUrl = await signMediaUrl(img.url);
      return {
        ...img,
        url: signedUrl || img.url
      };
    })
  );
  
  return {
    videoUrl: signedVideoUrl,
    images: signedImages
  };
}
