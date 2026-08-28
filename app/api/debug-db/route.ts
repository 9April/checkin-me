import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        name: true,
        mediaVideoUrl: true,
        mediaSliderImages: true,
      }
    });

    const uploadDir = path.join(require('os').homedir(), ".checkin-me-uploads", "media-studio", "test-property-1");
    let files: string[] = [];
    try {
      files = await fs.readdir(uploadDir);
    } catch (e: any) {
      files = [`Error reading directory: ${e.message}`];
    }

    return NextResponse.json({ success: true, properties, filesOnDisk: files });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
