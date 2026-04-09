import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { decrypt } from '@/lib/crypto';
import { auth } from '@/auth';

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
    
    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    const encryptedBuffer = await readFile(filePath);
    
    // Decrypt on the fly
    const decryptedBuffer = decrypt(encryptedBuffer);

    const ext = filename.split('.').pop()?.toLowerCase();
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

    return new NextResponse(new Uint8Array(decryptedBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving encrypted image:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
