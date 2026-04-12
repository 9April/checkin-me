'use server';

import { buildPDF } from '@/lib/pdf';
import { getCheckinEmailTemplates } from '@/lib/checkin-i18n';
import { parseHouseRulesForLang } from '@/lib/house-rules';
import type { Lang } from '@/lib/lang';
import { normalizeLang } from '@/lib/lang';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';
import { supabaseAdmin } from '@/lib/supabase';

type PdfAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Sends check-in PDF (or text-only if PDF missing) to guest and property admin. */
async function sendCheckInEmails(opts: {
  guestEmail: string;
  guestName: string;
  adminEmail: string | null | undefined;
  propertyName: string;
  checkin: string;
  checkout: string;
  pdfAttachment?: PdfAttachment;
  pdfFailedNote?: string;
  lang: Lang;
}): Promise<{ mailError: string }> {
  const tm = getCheckinEmailTemplates(opts.lang);
  const guest = opts.guestEmail.trim();
  const admin =
    (opts.adminEmail && String(opts.adminEmail).trim()) ||
    '';

  const pdfNote = opts.pdfFailedNote
    ? `\n\n${opts.pdfFailedNote}\n`
    : '';
  const attachmentLine = opts.pdfAttachment ? tm.guestAttachmentLine : '';
  const guestBody = `${tm.guestDear(opts.guestName)}\n\n${tm.guestThanks(opts.propertyName)}${attachmentLine}${pdfNote}\n\n${tm.guestLookForward}\n\n${tm.guestBestRegards(opts.propertyName)}`;
  const guestBodyHtml = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#222;max-width:560px">
<p>${escapeHtml(tm.guestDear(opts.guestName))}</p>
<p>${tm.guestThanksHtml(escapeHtml(opts.propertyName))}</p>
${opts.pdfAttachment ? `<p>${tm.guestHtmlAttachment}</p>` : ''}
${opts.pdfFailedNote ? `<p><em>${escapeHtml(opts.pdfFailedNote)}</em></p>` : ''}
<p>${escapeHtml(tm.guestLookForward)}</p>
<p>${escapeHtml(tm.guestBestRegards(opts.propertyName)).replace(/\n/g, '<br/>')}</p>
</body></html>`;
  const adminAttachmentLine = opts.pdfAttachment
    ? '\n\n' + tm.adminAttachment
    : '';
  const adminBody = `${tm.adminBodyIntro}${adminAttachmentLine}${pdfNote}\n\n${tm.adminProperty} ${opts.propertyName}\n${tm.adminGuest} ${opts.guestName}\n${tm.adminEmailLabel} ${guest || tm.adminNotProvided}\n${tm.adminDates} ${opts.checkin} — ${opts.checkout}\n`;
  const adminBodyHtml = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#222">
<p>${tm.adminBodyIntro}</p>
${opts.pdfAttachment ? `<p>${tm.adminAttachment}</p>` : ''}
${opts.pdfFailedNote ? `<p><em>${escapeHtml(opts.pdfFailedNote)}</em></p>` : ''}
<p><strong>${tm.adminProperty}</strong> ${escapeHtml(opts.propertyName)}<br/>
<strong>${tm.adminGuest}</strong> ${escapeHtml(opts.guestName)}<br/>
<strong>${tm.adminEmailLabel}</strong> ${escapeHtml(guest || tm.adminNotProvided)}<br/>
<strong>${tm.adminDates}</strong> ${escapeHtml(opts.checkin)} → ${escapeHtml(opts.checkout)}</p>
</body></html>`;

  const guestSubject = tm.guestSubject(opts.propertyName);
  const adminSubject = tm.adminSubject(opts.guestName, opts.propertyName);

  const attach = opts.pdfAttachment ? [opts.pdfAttachment] : undefined;

  const tasks: Promise<{ success: boolean; error?: string }>[] = [];

  const same =
    guest &&
    admin &&
    guest.toLowerCase() === admin.toLowerCase();

  if (same) {
    tasks.push(
      sendEmail({
        to: guest,
        subject: tm.sameSubject(opts.guestName, opts.propertyName),
        text: `${guestBody}${tm.sameAdminSeparator}${adminBody}`,
        html: `${guestBodyHtml}<hr/><p><strong>${escapeHtml(tm.sameAdminCopyHtml)}</strong></p>${adminBodyHtml}`,
        attachments: attach,
      })
    );
  } else {
    if (guest) {
      tasks.push(
        sendEmail({
          to: guest,
          subject: guestSubject,
          text: guestBody,
          html: guestBodyHtml,
          attachments: attach,
        })
      );
    }
    if (admin) {
      tasks.push(
        sendEmail({
          to: admin,
          subject: adminSubject,
          text: adminBody,
          html: adminBodyHtml,
          attachments: attach,
          replyTo: guest || undefined,
        })
      );
    }
  }

  if (tasks.length === 0) {
    console.warn(
      'sendCheckInEmails: no recipients (missing guest email and admin email).'
    );
    return { mailError: 'No email recipients.' };
  }

  const results = await Promise.allSettled(tasks);
  const failures = results.filter(
    (r) =>
      r.status === 'rejected' ||
      (r.status === 'fulfilled' && !r.value.success)
  );
  let mailError = '';
  if (failures.length > 0) {
    mailError = failures
      .map((f) =>
        f.status === 'rejected'
          ? String((f as PromiseRejectedResult).reason?.message ?? f.reason)
          : (f as PromiseFulfilledResult<{ error?: string }>).value.error ?? ''
      )
      .filter(Boolean)
      .join('; ');
  }
  return { mailError };
}

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
    const lang = normalizeLang(formData.get('lang') as string | null);
    const guestName = (formData.get('guestName') as string || '').trim();
    const guestEmail = (formData.get('guestEmail') as string || '').trim();
    const checkin = formData.get('checkin') as string;
    const checkout = formData.get('checkout') as string;
    const totalTravelers = Math.max(
      1,
      parseInt(String(formData.get('totalTravelers') ?? '1'), 10) || 1
    );
    const whatsapp = formData.get('whatsapp') as string;
    const checkinHour = formData.get('checkinHour') as string;

    const property = await prisma.property.findUnique({ 
      where: { id: propertyId },
      include: { host: true }
    }) as any;
    if (!property) throw new Error('Property not found');

    /* ---------- 2. handle files (parallel uploads) ---------- */
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

    // We'll collect all upload promises here to run them in parallel
    const uploadTasks: Promise<{ key: string; name: string }>[] = [];
    
    const queueUpload = (file: File, prefix: string) => {
      const fileName = `${timestamp}_${prefix}.${file.name.split('.').pop()}`;
      const task = saveToCloud(file, fileName).then(name => ({ key: prefix, name }));
      uploadTasks.push(task);
      return fileName; // Return the anticipated name immediately
    };

    // 1. Queue Selfie
    let selfieName: string | undefined;
    if (selfieFile && selfieFile.size > 0) {
      selfieName = queueUpload(selfieFile, 'selfie');
    }

    // 2. Queue Traveler Files (field names must match CheckInForm / CameraCapture: cinFront, cinBack, passport)
    const travelersData = [];
    for (let i = 0; i < totalTravelers; i++) {
        const tNameInput = formData.get(`traveler_${i}_name`) as string;
        const tName = (i === 0 && !tNameInput) ? (guestName || "Guest") : (tNameInput || "Guest");
        const country = formData.get(`traveler_${i}_country`) as string || 'OTHER';
        const idNumber = formData.get(`traveler_${i}_idNumber`) as string || 'N/A';
        const travelerIdFiles: string[] = [];

        const passportInput = formData.get(`traveler_${i}_passport`);
        const cinFrontInput =
          formData.get(`traveler_${i}_cinFront`) ?? formData.get(`traveler_${i}_cin_front`);
        const cinBackInput =
          formData.get(`traveler_${i}_cinBack`) ?? formData.get(`traveler_${i}_cin_back`);

        let docType: string = 'adult';
        if (isFile(passportInput) && passportInput.size > 0) {
          docType = 'passport';
          travelerIdFiles.push(queueUpload(passportInput, `traveler_${i}_passport`));
        } else {
          if (isFile(cinFrontInput) && cinFrontInput.size > 0) {
            travelerIdFiles.push(queueUpload(cinFrontInput as File, `traveler_${i}_cin_front`));
          }
          if (isFile(cinBackInput) && cinBackInput.size > 0) {
            travelerIdFiles.push(queueUpload(cinBackInput as File, `traveler_${i}_cin_back`));
          }
        }

        travelersData.push({
          name: tName,
          country,
          idNumber,
          idFiles: travelerIdFiles,
          type: docType,
        });
    }

    // 3. Queue Signature
    const signatureData = formData.get('signature') as string;
    let signatureName: string | undefined;
    if (signatureData) {
      const sigBuffer = Buffer.from(signatureData.split(',')[1], 'base64');
      const sigFileName = `${timestamp}_signature.png`;
      const task = (async () => {
        const { error } = await supabaseAdmin.storage.from('checkin-me').upload(sigFileName, sigBuffer, { contentType: 'image/png', upsert: true });
        if (error) throw new Error(`Signature Upload Error: ${error.message}`);
        return { key: 'signature', name: sigFileName };
      })();
      uploadTasks.push(task);
      signatureName = sigFileName;
    }

    // WAIT FOR ALL UPLOADS IN PARALLEL
    console.log(`--- Starting parallel upload of ${uploadTasks.length} files ---`);
    await Promise.all(uploadTasks);
    console.log(`--- All uploads completed successfully ---`);

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

    /* ---------- 4. house rules (legacy array or { EN, FR, SP } lists) ---------- */
    const rules = parseHouseRulesForLang(property.houseRules, lang);

    const idFiles = travelersData.flatMap((t) => t.idFiles);

    /* ---------- 5. generate PDF ---------- */
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
      const adminEmail =
        property.adminEmail?.trim() || property.host?.email?.trim() || null;
      const tmFail = getCheckinEmailTemplates(lang);
      const { mailError } = await sendCheckInEmails({
        guestEmail,
        guestName,
        adminEmail,
        propertyName: property.name,
        checkin,
        checkout,
        pdfFailedNote: tmFail.pdfFailedNote,
        lang,
      });
      const queryString = new URLSearchParams({
        ...(mailError
          ? { mailError: '1' }
          : { emailSent: '1' }),
      }).toString();
      return {
        success: true,
        message: 'Saved, but PDF failed.',
        redirectUrl: queryString ? `/success?${queryString}` : '/success',
      };
    }

    pdfName = `Booking-${booking.id}.pdf`;
    await supabaseAdmin.storage.from('checkin-me').upload(pdfName, Buffer.from(pdfBytes), { contentType: 'application/pdf', upsert: true });
    await prisma.booking.update({ where: { id: booking.id }, data: { pdfUrl: pdfName } });

    /* ---------- 6. emails (guest + dashboard admin) ---------- */
    try {
      const adminEmail =
        property.adminEmail?.trim() || property.host?.email?.trim() || null;
      const pdfAttachment: PdfAttachment = {
        filename: pdfName,
        content: Buffer.from(pdfBytes),
        contentType: 'application/pdf',
      };

      const { mailError } = await sendCheckInEmails({
        guestEmail,
        guestName,
        adminEmail,
        propertyName: property.name,
        checkin,
        checkout,
        pdfAttachment,
        lang,
      });

      const queryString = new URLSearchParams({
        pdf: pdfName,
        ...(mailError
          ? { mailError: '1' }
          : { emailSent: '1' }),
      }).toString();

      return { success: true, pdfName, redirectUrl: `/success?${queryString}` };
    } catch (e: unknown) {
      console.error('Check-in email notification failed:', e);
      return {
        success: true,
        pdfName,
        redirectUrl: `/success?pdf=${encodeURIComponent(pdfName)}&mailError=1`,
      };
    }
  } catch (error) {
    console.error('saveBooking error:', error);
    return { success: false, error: 'Submission failed' };
  }
}