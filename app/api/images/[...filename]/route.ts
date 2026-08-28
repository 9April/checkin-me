import { NextRequest, NextResponse } from 'next/server';
import { getLocalFileBuffer } from '@/lib/local-storage';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  try {
    const { filename } = await params;
    const filePath = Array.isArray(filename) ? filename.join('/') : filename;
    
    // 1. Check authentication
    // NOTE: We allow public access specifically for property logos and media-studio
    const isPublic = filePath.startsWith('logo_') || filePath.startsWith('media-studio/');

    if (!isPublic) {
      const session = await auth();
      if (!session) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    // Security check: prevent directory traversal
    if (filePath.includes('..')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    // 2. Fetch the file from Local Storage
    const { data: arrayBuffer, error } = await getLocalFileBuffer(filePath);

    if (error || !arrayBuffer) {
      console.error('Local image download error:', error);
      return new NextResponse('File not found', { status: 404 });
    }

    // 3. Convert to Uint8Array for Next.js response
    const fileBuffer = new Uint8Array(arrayBuffer);

    const ext = filePath.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === 'png') {
      contentType = 'image/png';
    } else if (ext === 'mp4') {
      contentType = 'video/mp4';
    } else if (ext === 'webm') {
      contentType = 'video/webm';
    } else if (ext === 'mov' || ext === 'quicktime') {
      contentType = 'video/quicktime';
    }

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
