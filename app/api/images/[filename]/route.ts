import { NextRequest, NextResponse } from 'next/server';
import { getLocalFileBuffer } from '@/lib/local-storage';
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

    // 2. Fetch the file from Local Storage
    const { data: arrayBuffer, error } = await getLocalFileBuffer(filename);

    if (error || !arrayBuffer) {
      console.error('Local image download error:', error);
      return new NextResponse('File not found', { status: 404 });
    }

    // 3. Convert to Uint8Array for Next.js response
    const fileBuffer = new Uint8Array(arrayBuffer);

    const ext = filename.split('.').pop()?.toLowerCase();
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

    return new NextResponse(fileBuffer, {
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
