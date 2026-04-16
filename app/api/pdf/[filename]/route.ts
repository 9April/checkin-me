import { getSupabaseAdmin } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { getHostUserId } from '@/lib/session-host-id';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/** PDFs we generate: `Booking-<cuid>.pdf`, plus signatures: `*_signature.png` */
function isValidFileName(name: string): boolean {
  const isPdf = /^Booking-[a-zA-Z0-9_-]+\.pdf$/i.test(name);
  const isSignature = /^[0-9]+_signature\.png$/i.test(name);
  return isPdf || isSignature;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename: raw } = await params;
    const filename = decodeURIComponent(raw);

    if (!isValidFileName(filename) || filename.length > 240) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const session = await auth();
    const isSignature = filename.endsWith('.png');

    if (!session?.user?.id) {
      // Guest (success page / email link): allow if this PDF or Signature belongs to a saved booking
      const guestOk = await prisma.booking.findFirst({
        where: { 
          OR: [{ pdfUrl: filename }, { signatureUrl: filename }],
          deletedAt: null 
        },
        select: { id: true },
      });
      if (!guestOk) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    } else {
      // Logged-in host: only files for bookings on their property
      const hostId = await getHostUserId();
      const booking = await prisma.booking.findFirst({
        where: { 
          OR: [{ pdfUrl: filename }, { signatureUrl: filename }],
          deletedAt: null 
        },
        select: { id: true, property: { select: { hostId: true } } },
      });
      if (!booking) {
        return new NextResponse('Not Found', { status: 404 });
      }
      if (!hostId || booking.property.hostId !== hostId) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from('checkin-me')
      .download(filename);

    if (error || !data) {
      const msg = error?.message || 'unknown error';
      console.error('Supabase download error:', msg, error);
      return new NextResponse('File not found in storage', { status: 404 });
    }

    const blob = await data.arrayBuffer();

    const wantsDownload =
      request.nextUrl.searchParams.get('download') === '1' ||
      request.nextUrl.searchParams.get('download') === 'true';

    const disposition = wantsDownload ? 'attachment' : 'inline';
    const contentType = isSignature ? 'image/png' : 'application/pdf';

    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `${disposition}; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('API PDF Route Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
