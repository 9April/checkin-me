import { supabaseAdmin } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/** PDFs we generate: `Booking-<cuid>.pdf` */
function isAppBookingPdfName(name: string): boolean {
  return /^Booking-[a-zA-Z0-9_-]+\.pdf$/i.test(name);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename: raw } = await params;
    const filename = decodeURIComponent(raw);

    if (!isAppBookingPdfName(filename) || filename.length > 240) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const session = await auth();

    if (!session?.user?.id) {
      // Guest (success page / email link): allow only if this PDF belongs to a saved booking
      const guestOk = await prisma.booking.findFirst({
        where: { pdfUrl: filename, deletedAt: null },
        select: { id: true },
      });
      if (!guestOk) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    } else {
      // Logged-in host: only PDFs for bookings on their property
      const booking = await prisma.booking.findFirst({
        where: { pdfUrl: filename, deletedAt: null },
        select: { id: true, property: { select: { hostId: true } } },
      });
      if (!booking) {
        return new NextResponse('Not Found', { status: 404 });
      }
      if (booking.property.hostId !== session.user.id) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    const { data, error } = await supabaseAdmin.storage
      .from('checkin-me')
      .download(filename);

    if (error || !data) {
      console.error('Supabase PDF download error:', error);
      return new NextResponse('PDF not found in cloud storage', { status: 404 });
    }

    const blob = await data.arrayBuffer();

    const wantsDownload =
      request.nextUrl.searchParams.get('download') === '1' ||
      request.nextUrl.searchParams.get('download') === 'true';

    const disposition = wantsDownload ? 'attachment' : 'inline';

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="${filename}"`,
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (error) {
    console.error('API PDF Route Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
