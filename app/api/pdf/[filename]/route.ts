import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  // 1. Check authentication (only hosts can view these PDFs)
  const session = await auth();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { filename } = await params;

    // Fetch the PDF from Supabase Storage using the ADMIN client (bypasses RLS)
    const { data, error } = await supabaseAdmin.storage
      .from('checkin-me')
      .download(filename);

    if (error || !data) {
      console.error('Supabase PDF download error:', error);
      return new NextResponse('PDF not found in cloud storage', { status: 404 });
    }

    // Capture the bytes
    const blob = await data.arrayBuffer();

    // Return the PDF with correct headers for viewing/downloading
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('API PDF Route Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
