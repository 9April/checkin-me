import { signPropertyMedia } from './lib/sign-media';

async function test() {
  const videoUrl = "https://wblnwbdcfdiiitvrznmt.supabase.co/storage/v1/object/public/checkin-me/media-studio/cmsxa7xwk00015327xvkthk1c/video-f9ad2096-8ab0-4a07-bd60-38709ce20fcb.mp4";
  const signed = await signPropertyMedia(videoUrl, null);
  console.log(signed);
}

test();
