import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const path = "media-studio/cmsxa7xwk00015327xvkthk1c/video-f9ad2096-8ab0-4a07-bd60-38709ce20fcb.mp4";
  const { data, error } = await supabaseAdmin.storage
    .from('checkin-me')
    .createSignedUrl(path, 315360000);
  console.log(data?.signedUrl || error);
}

test();
