import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Fetch the PDF from Supabase Storage
    const { data, error } = await supabase.storage
      .from('checkin-me')
      .download(filename);

    if (error || !data) {
      console.error('Supabase PDF download error:', error);
      return new NextResponse('PDF not found', { status: 404 });
    }

    // Capture the bytes
    const blob = await data.arrayBuffer();

    // Return the PDF with correct headers for viewing/downloading
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('API PDF Route Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
