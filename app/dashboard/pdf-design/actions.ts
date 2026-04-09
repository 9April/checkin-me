'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { readFile } from 'fs/promises';
import path from 'path';

export async function updatePdfTemplate(propertyId: string, template: string, footer: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.property.update({
      where: { 
        id: propertyId,
        hostId: session.user.id
      },
      data: { 
        pdfTemplate: template,
        pdfFooter: footer
      },
    });
    revalidatePath('/dashboard/pdf-design');
    return { success: true };
  } catch (e) {
    console.error('Update PDF Template error:', e);
    return { success: false, error: 'Database update failed.' };
  }
}

import { buildPDF } from '@/lib/pdf';

export async function generatePdfPreview(propertyName: string, template: string, houseRules: string, footer: string, logoUrl?: string | null) {
  let rulesArr = [];
  try { rulesArr = JSON.parse(houseRules || "[]"); } catch (e) {}
  
  if (rulesArr.length === 0) {
    rulesArr = ["No smoking inside", "No parties allowed", "Respect the neighbors"];
  }

  
  let logoB64 = '';
  if (logoUrl) {
    try {
      if (logoUrl.startsWith('data:')) {
        logoB64 = logoUrl;
      } else if (logoUrl.startsWith('http')) {
        const res = await fetch(logoUrl);
        const buf = await res.arrayBuffer();
        const contentType = res.headers.get('content-type') || 'image/png';
        logoB64 = `data:${contentType};base64,${Buffer.from(buf).toString('base64')}`;
      }
    } catch (e) {
      console.error('Preview logo load error:', e);
    }
  }

  const pdfBuffer = await buildPDF({
    guestName: 'John Doe',
    guestEmail: 'john.doe@example.com',
    checkin: 'April 10, 2026',
    checkout: 'April 15, 2026',
    propertyName,
    logoUrl: logoB64,
    pdfTemplate: template,
    pdfFooter: footer,
    travelers: [{ country: 'MA', idNumber: 'A1234567', idFiles: [] }],
    rules: rulesArr,
    signature: '',
    idImages: [],
    lang: 'EN',
  });

  return `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString('base64')}`;
}
