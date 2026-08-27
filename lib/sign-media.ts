export async function signMediaUrl(url: string | null): Promise<string | null> {
  // We no longer use Supabase signed URLs. Local API routes handle access.
  return url;
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
