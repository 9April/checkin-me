'use server';

import { buildPDF } from '@/lib/pdf';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/crypto';
import { sendEmail } from '@/lib/mail';
import { supabase } from '@/lib/supabase';

export async function saveBooking(formData: FormData) {
  let pdfName: string | undefined;
  console.log('--- saveBooking (Encrypted) called ---');
  try {
    /* ---------- 1. read fields ---------- */
    const propertyId = formData.get('propertyId') as string;
    const signature = formData.get('signature') as string;
    const selfieInput = formData.get('selfie');
    const isFile = (obj: any): obj is File => obj && typeof obj === 'object' && typeof obj.arrayBuffer === 'function';
    const selfieFile = isFile(selfieInput) ? selfieInput : null;
    const lang = (formData.get('lang') as string || 'EN') as 'EN' | 'FR' | 'SP';
    const guestName = (formData.get('guestName') as string || '').trim();
    const guestEmail = (formData.get('guestEmail') as string || '').trim();
    const checkin = (formData.get('checkin') as string || '').trim();
    const checkout = (formData.get('checkout') as string || '').trim();
    const checkinHour = (formData.get('checkinHour') as string || '').trim();
    const whatsapp = (formData.get('whatsapp') as string || '').trim();
    const adults = parseInt(formData.get('adults') as string) || 1;
    const kids = parseInt(formData.get('kids') as string) || 0;
    
    if (!propertyId) throw new Error('Property ID is required');
    const property = await prisma.property.findUnique({ 
      where: { id: propertyId },
      include: { host: true }
    }) as any;
    if (!property) throw new Error('Property not found');
    console.log('--- Property found:', property.name, 'Admin:', property.host?.email);

    /* ---------- 2. Initial Validation ---------- */
    if (!guestName) throw new Error('Guest name is required');
    if (!guestEmail) throw new Error('Guest email is required');
    if (!checkin) throw new Error('Check-in date is required');
    if (!checkout) throw new Error('Check-out date is required');
    if ((property as any).requireSelfie && (!selfieFile || selfieFile.size === 0)) {
      throw new Error('Selfie verification is required');
    }
    if (!signature || signature.length < 100) throw new Error('Valid signature is required');

    const totalTravelers = adults + kids;

    const getFileExtension = (filename: string): string => {
      const parts = filename.split('.');
      return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
    };

    const timestamp = Date.now();
    const saveToCloud = async (f: File, name: string) => {
      const bytes = await f.arrayBuffer();
      // No encryption as requested (Simple readable path)
      
      const { error } = await supabase.storage
        .from('checkin-me')
        .upload(name, Buffer.from(bytes), { contentType: f.type || 'image/jpeg' });
      
      if (error) throw new Error(`Supabase Upload Error: ${error.message}`);
      return name;
    };

    /* ---------- 4. handle files & Traveler data ---------- */
    let idFiles: string[] = [];
    let selfieName: string | undefined;
    if (selfieFile && selfieFile.size > 0) {
      selfieName = await saveToCloud(selfieFile, `${timestamp}_selfie.${getFileExtension(selfieFile.name)}`);
      idFiles.push(selfieName);
    }

    const travelersData: Array<{
      country: string;
      idNumber: string;
      idFiles: string[];
      type: 'ADULT' | 'KID';
      name: string;
    }> = [];

    for (let i = 0; i < totalTravelers; i++) {
      const country = formData.get(`traveler_${i}_country`) as string;
      const idNumber = (formData.get(`traveler_${i}_idNumber`) as string || '').trim();
      const noCIN = !!formData.get(`traveler_${i}_noCIN`);
      const isPassport = country === 'OTHER' || noCIN;
      let travelerIdFiles: string[] = [];

      // Only handle photo uploads if required
      if ((property as any).requireIdPhotos) {
        if (isPassport) {
          const pInput = formData.get(`traveler_${i}_passport`);
          const p = isFile(pInput) ? pInput : null;
          if (p && p.size > 0) {
            const name = await saveToCloud(p, `${timestamp}_traveler_${i}_passport.${getFileExtension(p.name)}`);
            travelerIdFiles.push(name);
            idFiles.push(name);
          }
        } else {
          const fInput = formData.get(`traveler_${i}_cinFront`);
          const bInput = formData.get(`traveler_${i}_cinBack`);
          const front = isFile(fInput) ? fInput : null;
          const back = isFile(bInput) ? bInput : null;
          if (front && front.size > 0) {
            const fName = await saveToCloud(front, `${timestamp}_traveler_${i}_cin_front.${getFileExtension(front.name)}`);
            travelerIdFiles.push(fName);
            idFiles.push(fName);
          }
          if (back && back.size > 0) {
            const bName = await saveToCloud(back, `${timestamp}_traveler_${i}_cin_back.${getFileExtension(back.name)}`);
            travelerIdFiles.push(bName);
            idFiles.push(bName);
          }
        }
      }

      travelersData.push({ 
        country, 
        idNumber, 
        idFiles: travelerIdFiles,
        type: i < adults ? 'ADULT' : 'KID',
        name: i === 0 ? guestName : `Traveler ${i+1}`
      });
    }

    // Save signature (plain) to cloud
    const sigBase64 = signature.replace(/^data:image\/png;base64,/, '');
    const sigBuffer = Buffer.from(sigBase64, 'base64');
    const sigName = `${timestamp}_signature.png`;
    
    const { error: sigError } = await supabase.storage
      .from('checkin-me')
      .upload(sigName, sigBuffer, { contentType: 'image/png' });
    
    if (sigError) throw new Error(`Signature Upload Error: ${sigError.message}`);

    /* ---------- 5. Database Persistence ---------- */
    const booking = await (prisma.booking as any).create({
      data: {
        propertyId,
        guestName,
        guestEmail,
        checkin,
        checkout,
        checkinHour,
        whatsapp,
        status: 'COMPLETED',
        travelers: {
          create: travelersData.map(t => ({
            name: t.name,
            country: t.country,
            idNumber: t.idNumber,
            type: t.type,
            idImages: JSON.stringify(t.idFiles),
          }))
        }
      }
    });
    console.log('--- Booking created:', booking.id);

    /* ---------- 6. build PDF ---------- */
    let rules = [];
    const clientRules = formData.get('rules') as string;
    if (clientRules) {
      try {
        rules = JSON.parse(clientRules);
      } catch (e) {
        console.warn('Failed to parse client rules:', e);
      }
    }

    if (!rules || rules.length === 0) {
      try {
        rules = JSON.parse(property.houseRules || '[]');
      } catch (e) {
        rules = ["Please respect the house rules."];
      }
    }

    const imagesB64 = await Promise.all(
      idFiles.map(async (f) => {
        const { data, error } = await supabase.storage.from('checkin-me').download(f);
        if (error || !data) throw new Error(`Failed to download ID image: ${f}`);
        
        const buf = Buffer.from(await data.arrayBuffer());
        // No decryption needed for new files
        const ext = getFileExtension(f);
        const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        return `data:${mime};base64,${buf.toString('base64')}`;
      })
    );

    const pdfBytes = await buildPDF({
      guestName,
      guestEmail,
      checkin,
      checkout,
      propertyName: property.name,
      logoUrl: property.logoUrl,
      primaryColor: property.primaryColor,
      pdfTemplate: property.pdfTemplate,
      pdfFooter: property.pdfFooter,
      travelers: travelersData.map(t => ({ country: t.country, idNumber: t.idNumber, idFiles: t.idFiles })),
      rules,
      signature,
      idImages: imagesB64,
      lang,
      checkinHour,
      whatsapp,
    });

    pdfName = `Booking-${booking.id}.pdf`;
    const { error: pdfError } = await supabase.storage
      .from('checkin-me')
      .upload(pdfName, Buffer.from(pdfBytes), { contentType: 'application/pdf' });
    
    if (pdfError) throw new Error(`PDF Cloud Upload Error: ${pdfError.message}`);
    
    await prisma.booking.update({
      where: { id: booking.id },
      data: { pdfUrl: pdfName }
    });

    /* ---------- 7. Send Emails ---------- */
    console.log('--- Starting email delivery to:', guestEmail);
    try {
      const adminEmail = property.adminEmail || property.host?.email;
      const recipients = [guestEmail];
      if (adminEmail && adminEmail !== guestEmail) {
        recipients.push(adminEmail);
      }

      const emailSubject = `Signed Document - ${property.name}`;
      const emailBody = `
        Dear ${guestName},
        
        Please find attached a copy of your signed agreement for ${property.name}.
        
        Property: ${property.name}
        Check-in: ${checkin}
        Check-out: ${checkout}
        
        Thank you for choosing us.
      `;

      sendEmail({
        to: recipients,
        subject: emailSubject,
        text: emailBody,
        attachments: [
          {
            filename: pdfName,
            content: Buffer.from(pdfBytes),
            contentType: 'application/pdf',
          }
        ]
      }).catch(err => console.error('Background email failed:', err));
    } catch (mailError) {
      console.error('Failed to send automated emails:', mailError);
      // Non-blocking: we still returned success for the form submission
    }

    return { success: true, pdfName };
  } catch (error) {
    console.error('Error in saveBooking:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}