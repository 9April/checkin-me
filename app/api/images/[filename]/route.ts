import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { decrypt } from '@/lib/crypto';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  // 1. Check authentication (only hosts can view these images)
  const session = await auth();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { filename } = await params;
    
    // Security check: prevent directory traversal (redundant for Supabase but good practice)
    if (filename.includes('..') || filename.includes('/')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    // 2. Fetch the encrypted file from Supabase Storage
    const { data, error } = await supabase.storage
      .from('checkin-me')
      .download(filename);

    if (error || !data) {
      console.error('Supabase image download error:', error);
      return new NextResponse('File not found', { status: 404 });
    }

    // 3. Convert to buffer (No decryption needed for new files)
    const fileBuffer = Buffer.from(await data.arrayBuffer());

    const ext = filename.split('.').pop()?.toLowerCase();
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving encrypted image from cloud:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
