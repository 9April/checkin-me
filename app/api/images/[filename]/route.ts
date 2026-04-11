import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // 1. Check authentication
    // NOTE: We allow public access specifically for property logos
    const isLogo = filename.startsWith('logo_');

    if (!isLogo) {
      const session = await auth();
      if (!session) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    // 2. Fetch the file from Supabase Storage
    const activeClient = isLogo ? getSupabaseAdmin() : supabase;
    const { data, error } = await activeClient.storage
      .from('checkin-me')
      .download(filename);

    if (error || !data) {
      console.error('Supabase image download error:', error);
      return new NextResponse('File not found', { status: 404 });
    }

    // 3. Convert to buffer
    const fileBuffer = Buffer.from(await data.arrayBuffer());

    const ext = filename.split('.').pop()?.toLowerCase();
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving image from cloud:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
