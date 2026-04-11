import { buildPDF } from '@/lib/pdf';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/crypto';
import { sendEmail } from '@/lib/mail';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function saveBooking(formData: FormData) {
  let pdfName: string | undefined;
  console.log('--- saveBooking (Stability Fix) called ---');
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
    const checkin = formData.get('checkin') as string;
    const checkout = formData.get('checkout') as string;
    const totalTravelers = parseInt(formData.get('totalTravelers') as string || '1');
    const whatsapp = formData.get('whatsapp') as string;
    const checkinHour = formData.get('checkinHour') as string;

    const property = await prisma.property.findUnique({ 
      where: { id: propertyId },
      include: { host: true }
    }) as any;
    if (!property) throw new Error('Property not found');

    /* ---------- 2. handle files ---------- */
    const timestamp = Date.now();
    const saveToCloud = async (f: File, name: string) => {
      console.log('--- Uploading PLAIN image:', name, 'Size:', f.size);
      const bytes = await f.arrayBuffer();
      const { error } = await supabaseAdmin.storage
        .from('checkin-me')
        .upload(name, Buffer.from(bytes), { 
          contentType: f.type || 'image/jpeg',
          upsert: true 
        });
      if (error) throw new Error(`Supabase Upload Error: ${error.message}`);
      return name;
    };

    let idFiles: string[] = [];
    let selfieName: string | undefined;
    if (selfieFile && selfieFile.size > 0) {
      selfieName = await saveToCloud(selfieFile, `${timestamp}_selfie.${selfieFile.name.split('.').pop()}`);
      idFiles.push(selfieName);
    }

    const travelersData = [];
    for (let i = 0; i < totalTravelers; i++) {
        const tName = formData.get(`traveler_${i}_name`) as string;
        const country = formData.get(`traveler_${i}_country`) as string;
        const idNumber = formData.get(`traveler_${i}_idNumber`) as string;
        const idType = formData.get(`traveler_${i}_idType`) as string || 'adult';
        const travelerIdFiles: string[] = [];

        const isPassport = idType === 'passport';
        if (isPassport) {
          const pInput = formData.get(`traveler_${i}_passport`);
          if (isFile(pInput) && pInput.size > 0) {
            const name = await saveToCloud(pInput, `${timestamp}_traveler_${i}_passport.${pInput.name.split('.').pop()}`);
            travelerIdFiles.push(name);
            idFiles.push(name);
          }
        } else {
          const fInput = formData.get(`traveler_${i}_cin_front`);
          const bInput = formData.get(`traveler_${i}_cin_back`);
          if (isFile(fInput) && fInput.size > 0) {
            const fName = await saveToCloud(fInput, `${timestamp}_traveler_${i}_cin_front.${fInput.name.split('.').pop()}`);
            travelerIdFiles.push(fName);
            idFiles.push(fName);
          }
          if (isFile(bInput) && bInput.size > 0) {
            const bName = await saveToCloud(bInput, `${timestamp}_traveler_${i}_cin_back.${bInput.name.split('.').pop()}`);
            travelerIdFiles.push(bName);
            idFiles.push(bName);
          }
        }
        travelersData.push({ 
          name: tName, 
          country, 
          idNumber, 
          idFiles: travelerIdFiles,
          type: idType 
        });
    }

    /* ---------- 3. save booking ---------- */
    const booking = await prisma.booking.create({
      data: {
        guestName,
        guestEmail,
        checkin,
        checkout,
        propertyId,
        totalTravelers,
        selfieUrl: selfieName,
        travelers: {
          create: travelersData.map(t => ({
            name: t.name,
            country: t.country,
            idNumber: t.idNumber,
            idImages: t.idFiles.join(','),
            type: t.type
          }))
        }
      }
    });

    /* ---------- 4. house rules ---------- */
    let rules = ["Please respect the house rules."];
    try {
      rules = JSON.parse(property.houseRules || '[]');
    } catch (e) { console.error('Rules parse failed', e); }

    /* ---------- 5. signature ---------- */
    const sigBase64 = signature.replace(/^data:image\/png;base64,/, '');
    const sigBuffer = Buffer.from(sigBase64, 'base64');
    const sigName = `${timestamp}_signature.png`;
    const { error: sigError } = await supabaseAdmin.storage
      .from('checkin-me')
      .upload(sigName, sigBuffer, { contentType: 'image/png', upsert: true });

    /* ---------- 6. generate PDF ---------- */
    let pdfBytes: any;
    try {
      const imagesB64 = await Promise.all(
        idFiles.map(async (f) => {
          try {
            const { data, error } = await supabaseAdmin.storage.from('checkin-me').download(f);
            if (error || !data) throw new Error(`Download failed`);
            const buf = Buffer.from(await data.arrayBuffer());
            const ext = f.split('.').pop();
            const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
            return `data:${mime};base64,${buf.toString('base64')}`;
          } catch (e) { return null; }
        })
      ).then(res => res.filter(img => img !== null) as string[]);

      pdfBytes = await buildPDF({
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
    } catch (pdfErr) {
      console.error('PDF Crash Protection:', pdfErr);
      return { success: true, message: 'Saved, but PDF failed.' };
    }

    pdfName = `Booking-${booking.id}.pdf`;
    await supabaseAdmin.storage.from('checkin-me').upload(pdfName, Buffer.from(pdfBytes), { contentType: 'application/pdf', upsert: true });
    await prisma.booking.update({ where: { id: booking.id }, data: { pdfUrl: pdfName } });

    /* ---------- 7. emails ---------- */
    try {
      const adminEmail = property.adminEmail || property.host?.email;
      const pdfAttachment = { filename: pdfName, content: Buffer.from(pdfBytes), contentType: 'application/pdf' };
      const emailPromises = [
        sendEmail({ to: guestEmail, subject: `Signed Agreement - ${property.name}`, text: `Dear ${guestName},\nAttached is your agreement.`, attachments: [pdfAttachment] })
      ];
      if (adminEmail) {
        emailPromises.push(
          sendEmail({ to: adminEmail, subject: `New Registration: ${guestName}`, text: `New guest: ${guestName} for ${property.name}`, attachments: [pdfAttachment] })
        );
      }
      await Promise.allSettled(emailPromises);
    } catch (e) { console.error('Emails failed', e); }

    return { success: true, pdfName };
  } catch (error) {
    console.error('saveBooking error:', error);
    return { success: false, error: 'Submission failed' };
  }
}