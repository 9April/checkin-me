import { buildPDF } from '@/lib/pdf';
import { getCheckinEmailTemplates } from '@/lib/checkin-i18n';
import { resolveHouseRulesForLang } from '@/lib/house-rules';
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

function guessContentTypeFromFilename(filename: string): string {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'heic') return 'image/heic';
  return 'application/octet-stream';
}

async function downloadStorageObjectAsAttachment(opts: {
  bucket: string;
  objectName: string;
  filename?: string;
  maxBytes?: number;
}): Promise<
  | { ok: true; attachment: { filename: string; content: Buffer; contentType?: string } }
  | { ok: false; reason: string }
> {
  const maxBytes = opts.maxBytes ?? 8 * 1024 * 1024; // 8MB per attachment safety
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(opts.bucket)
      .download(opts.objectName);
    if (error || !data) {
      return { ok: false, reason: error?.message || 'download failed' };
    }
    const buf = Buffer.from(await data.arrayBuffer());
    if (buf.length > maxBytes) {
      return {
        ok: false,
        reason: `attachment too large (${buf.length} bytes)`,
      };
    }
    const filename = opts.filename || opts.objectName.split('/').pop() || opts.objectName;
    return {
      ok: true,
      attachment: {
        filename,
        content: buf,
        contentType: guessContentTypeFromFilename(filename),
      },
    };
  } catch (e: any) {
    return { ok: false, reason: e?.message || String(e) };
  }
}

/** Sends check-in PDF (or text-only if PDF missing) to guest and property admin. */
async function sendCheckInEmails(opts: {
  guestEmail: string;
  guestName: string;
  adminEmail: string | null | undefined;
  propertyName: string;
  checkin: string;
  checkout: string;
  checkinHour?: string;
  whatsapp?: string;
  totalTravelers?: number;
  travelers?: Array<{
    name: string;
    country: string;
    idNumber: string;
    type: string;
    idFiles: string[];
  }>;
  pdfAttachment?: PdfAttachment;
  pdfFailedNote?: string;
  guestAttachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
  adminAttachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
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
  const guestBodyHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f6f7fb">
<div style="max-width:640px;margin:0 auto;padding:24px">
  <div style="background:#fff;border:1px solid #eee;border-radius:16px;overflow:hidden">
    <div style="padding:18px 20px;background:linear-gradient(135deg,#111827,#374151);color:#fff">
      <div style="font-size:14px;opacity:.9">Checkin-Me</div>
      <div style="font-size:18px;font-weight:700;margin-top:6px">${escapeHtml(opts.propertyName)}</div>
    </div>
    <div style="padding:20px;font-family:system-ui,-apple-system,sans-serif;line-height:1.55;color:#111827">
      <p style="margin:0 0 12px">${escapeHtml(tm.guestDear(opts.guestName))}</p>
      <p style="margin:0 0 12px">${tm.guestThanksHtml(escapeHtml(opts.propertyName))}</p>
      ${opts.pdfAttachment ? `<div style="margin:14px 0;padding:12px 14px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb"><strong>${tm.guestHtmlAttachment}</strong></div>` : ''}
      ${opts.pdfFailedNote ? `<p style="margin:12px 0"><em>${escapeHtml(opts.pdfFailedNote)}</em></p>` : ''}
      <p style="margin:12px 0 0">${escapeHtml(tm.guestLookForward)}</p>
      <p style="margin:16px 0 0">${escapeHtml(tm.guestBestRegards(opts.propertyName)).replace(/\n/g, '<br/>')}</p>
    </div>
  </div>
  <div style="text-align:center;font-family:system-ui,-apple-system,sans-serif;color:#6b7280;font-size:12px;margin-top:12px">
    This message was sent by Checkin-Me.
  </div>
</div>
</body></html>`;
  const adminAttachmentLine = opts.pdfAttachment
    ? '\n\n' + tm.adminAttachment
    : '';
  const adminDocsLine =
    opts.adminAttachments && opts.adminAttachments.length > 0
      ? '\n\n' + tm.adminExtraDocumentsAttached
      : '';
  const adminBody = `${tm.adminBodyIntro}${adminAttachmentLine}${adminDocsLine}${pdfNote}\n\n${tm.adminProperty} ${opts.propertyName}\n${tm.adminGuest} ${opts.guestName}\n${tm.adminEmailLabel} ${guest || tm.adminNotProvided}\n${tm.adminDates} ${opts.checkin} — ${opts.checkout}\n${
    opts.checkinHour ? `Check-in time: ${opts.checkinHour}\n` : ''
  }${opts.whatsapp ? `WhatsApp: ${opts.whatsapp}\n` : ''}${
    typeof opts.totalTravelers === 'number'
      ? `Travelers: ${opts.totalTravelers}\n`
      : ''
  }`;

  const travelerRowsHtml =
    (opts.travelers || [])
      .map((t, idx) => {
        const doc = (t.type || '').toLowerCase() === 'passport' ? 'Passport' : 'ID';
        const fileCount = Array.isArray(t.idFiles) ? t.idFiles.length : 0;
        return `<tr>
  <td style="padding:10px 12px;border-top:1px solid #eef2f7">${idx + 1}</td>
  <td style="padding:10px 12px;border-top:1px solid #eef2f7"><strong>${escapeHtml(t.name || '')}</strong></td>
  <td style="padding:10px 12px;border-top:1px solid #eef2f7">${escapeHtml(t.country || '')}</td>
  <td style="padding:10px 12px;border-top:1px solid #eef2f7">${escapeHtml(t.idNumber || '')}</td>
  <td style="padding:10px 12px;border-top:1px solid #eef2f7">${escapeHtml(doc)}</td>
  <td style="padding:10px 12px;border-top:1px solid #eef2f7">${fileCount}</td>
</tr>`;
      })
      .join('') || '';

  const adminBodyHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f6f7fb">
<div style="max-width:760px;margin:0 auto;padding:24px">
  <div style="background:#fff;border:1px solid #eee;border-radius:16px;overflow:hidden">
    <div style="padding:18px 20px;background:linear-gradient(135deg,#0f172a,#334155);color:#fff">
      <div style="font-size:14px;opacity:.9">New check-in submission</div>
      <div style="font-size:18px;font-weight:700;margin-top:6px">${escapeHtml(opts.propertyName)}</div>
    </div>
    <div style="padding:20px;font-family:system-ui,-apple-system,sans-serif;line-height:1.55;color:#111827">
      <p style="margin:0 0 12px">${escapeHtml(tm.adminBodyIntro)}</p>
      <div style="display:grid;grid-template-columns:1fr;gap:12px">
        <div style="padding:14px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb">
          <div style="font-size:13px;color:#6b7280;margin-bottom:8px">Summary</div>
          <div style="font-size:14px">
            <div><strong>${escapeHtml(tm.adminGuest)}</strong> ${escapeHtml(opts.guestName)}</div>
            <div><strong>${escapeHtml(tm.adminEmailLabel)}</strong> ${escapeHtml(guest || tm.adminNotProvided)}</div>
            <div><strong>${escapeHtml(tm.adminDates)}</strong> ${escapeHtml(opts.checkin)} → ${escapeHtml(opts.checkout)}</div>
            ${opts.checkinHour ? `<div><strong>Check-in time:</strong> ${escapeHtml(opts.checkinHour)}</div>` : ''}
            ${opts.whatsapp ? `<div><strong>WhatsApp:</strong> ${escapeHtml(opts.whatsapp)}</div>` : ''}
            ${typeof opts.totalTravelers === 'number' ? `<div><strong>Travelers:</strong> ${opts.totalTravelers}</div>` : ''}
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${opts.pdfAttachment ? `<span style="display:inline-block;padding:8px 10px;border-radius:999px;background:#ecfeff;border:1px solid #a5f3fc;color:#0e7490;font-size:12px;font-weight:700">${escapeHtml(tm.adminAttachment)}</span>` : ''}
          ${opts.adminAttachments && opts.adminAttachments.length > 0 ? `<span style="display:inline-block;padding:8px 10px;border-radius:999px;background:#fefce8;border:1px solid #fde68a;color:#92400e;font-size:12px;font-weight:700">${escapeHtml(tm.adminExtraDocumentsAttached)}</span>` : ''}
          ${opts.pdfFailedNote ? `<span style="display:inline-block;padding:8px 10px;border-radius:999px;background:#fff1f2;border:1px solid #fecdd3;color:#9f1239;font-size:12px;font-weight:700">${escapeHtml(opts.pdfFailedNote)}</span>` : ''}
        </div>
        ${
          travelerRowsHtml
            ? `<div style="padding:0;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
                <div style="padding:12px 14px;background:#f9fafb;border-bottom:1px solid #e5e7eb">
                  <strong>Travelers</strong>
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:13px">
                  <thead>
                    <tr style="background:#ffffff">
                      <th align="left" style="padding:10px 12px;color:#6b7280;font-weight:700;font-size:12px">#</th>
                      <th align="left" style="padding:10px 12px;color:#6b7280;font-weight:700;font-size:12px">Name</th>
                      <th align="left" style="padding:10px 12px;color:#6b7280;font-weight:700;font-size:12px">Country</th>
                      <th align="left" style="padding:10px 12px;color:#6b7280;font-weight:700;font-size:12px">ID number</th>
                      <th align="left" style="padding:10px 12px;color:#6b7280;font-weight:700;font-size:12px">Doc</th>
                      <th align="left" style="padding:10px 12px;color:#6b7280;font-weight:700;font-size:12px">Images</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${travelerRowsHtml}
                  </tbody>
                </table>
              </div>`
            : ''
        }
      </div>
    </div>
  </div>
  <div style="text-align:center;font-family:system-ui,-apple-system,sans-serif;color:#6b7280;font-size:12px;margin-top:12px">
    This message was sent by Checkin-Me.
  </div>
</div>
</body></html>`;

  const guestSubject = tm.guestSubject(opts.propertyName);
  const adminSubject = tm.adminSubject(opts.guestName, opts.propertyName);

  const guestAttach =
    (opts.guestAttachments && opts.guestAttachments.length > 0
      ? opts.guestAttachments
      : undefined) ||
    (opts.pdfAttachment ? [opts.pdfAttachment] : undefined);
  const adminAttach =
    (opts.adminAttachments && opts.adminAttachments.length > 0
      ? opts.adminAttachments
      : undefined) ||
    (opts.pdfAttachment ? [opts.pdfAttachment] : undefined);

  const tasks: Promise<{ success: boolean; error?: string }>[] = [];

  const same =
    guest &&
    admin &&
    guest.toLowerCase() === admin.toLowerCase();

  if (same) {
    const mergedAttachments = [
      ...(guestAttach || []),
      ...(adminAttach || []),
    ];
    tasks.push(
      sendEmail({
        to: guest,
        subject: tm.sameSubject(opts.guestName, opts.propertyName),
        text: `${guestBody}${tm.sameAdminSeparator}${adminBody}`,
        html: `${guestBodyHtml}<hr/><p><strong>${escapeHtml(tm.sameAdminCopyHtml)}</strong></p>${adminBodyHtml}`,
        attachments: mergedAttachments.length > 0 ? mergedAttachments : undefined,
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
          attachments: guestAttach,
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
          attachments: adminAttach,
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

export type SaveBookingResult =
  | { success: true; redirectUrl?: string; pdfName?: string; message?: string }
  | { success: false; error: string };

function jsonSafeResult<T extends SaveBookingResult>(r: T): T {
  return JSON.parse(JSON.stringify(r)) as T;
}

/** Shared implementation for check-in submission (used by the server action only). */
export async function executeSaveBooking(
  formData: FormData
): Promise<SaveBookingResult> {
  let pdfName: string | undefined;
  console.log('--- executeSaveBooking called ---');
  try {
    /* ---------- 1. read fields ---------- */
    const propertyId = formData.get('propertyId') as string;
    const signature = formData.get('signature') as string;
    const selfieInput = formData.get('selfie');
    const isFile = (obj: any): obj is File =>
      obj && typeof obj === 'object' && typeof obj.arrayBuffer === 'function';
    const selfieFile = isFile(selfieInput) ? selfieInput : null;
    const lang = normalizeLang(formData.get('lang') as string | null);
    const guestName = ((formData.get('guestName') as string) || '').trim();
    const guestEmail = ((formData.get('guestEmail') as string) || '').trim();
    const checkin = formData.get('checkin') as string;
    const checkout = formData.get('checkout') as string;
    const totalTravelers = Math.max(
      1,
      parseInt(String(formData.get('totalTravelers') ?? '1'), 10) || 1
    );
    const whatsapp = formData.get('whatsapp') as string;
    const checkinHour = formData.get('checkinHour') as string;

    const property = (await prisma.property.findUnique({
      where: { id: propertyId },
      include: { host: true },
    })) as any;
    if (!property) throw new Error('Property not found');

    /* ---------- 2. handle files (parallel uploads) ---------- */
    const timestamp = Date.now();
    const saveToCloud = async (f: File, name: string) => {
      console.log('--- Uploading PLAIN image:', name, 'Size:', f.size);
      const bytes = await f.arrayBuffer();

      // Check if service key is missing — this is a common cause of failure
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing in environment variables. File upload cannot proceed.');
      }

      const { error } = await supabaseAdmin.storage
        .from('checkin-me')
        .upload(name, Buffer.from(bytes), {
          contentType: f.type || 'image/jpeg',
          upsert: true,
        });
      if (error) {
        console.error(`Supabase Upload Error for ${name}:`, error);
        throw new Error(`Supabase Upload Error: ${error.message}${error.message.includes('bucket not found') ? ' (Bucket "checkin-me" might satisfy the error)' : ''}`);
      }
      return name;
    };

    const uploadTasks: Promise<{ key: string; name: string; buffer: Buffer }>[] = [];
    const imageBuffers: Record<string, Buffer> = {};

    const queueUpload = (file: File, prefix: string) => {
      const fileName = `${timestamp}_${prefix}.${file.name.split('.').pop() || 'jpg'}`;
      const task = (async () => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Check if service key is missing
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
          throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
        }

        const { error } = await supabaseAdmin.storage
          .from('checkin-me')
          .upload(fileName, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });
        
        if (error) {
          console.error(`Supabase Upload Error for ${fileName}:`, error);
          throw new Error(`Upload failed for ${prefix}: ${error.message}`);
        }

        imageBuffers[fileName] = buffer;
        return { key: prefix, name: fileName, buffer };
      })();
      
      uploadTasks.push(task);
      return fileName;
    };

    let selfieName: string | undefined;
    if (selfieFile && selfieFile.size > 0) {
      selfieName = queueUpload(selfieFile, 'selfie');
    }

    const travelersData = [];
    for (let i = 0; i < totalTravelers; i++) {
      const tNameInput = formData.get(`traveler_${i}_name`) as string;
      const tName =
        i === 0 && !tNameInput ? guestName || 'Guest' : tNameInput || 'Guest';
      const country = (formData.get(`traveler_${i}_country`) as string) || 'OTHER';
      const idNumber =
        (formData.get(`traveler_${i}_idNumber`) as string) || 'N/A';
      const travelerIdFiles: string[] = [];

      const passportInput = formData.get(`traveler_${i}_passport`);
      const cinFrontInput =
        formData.get(`traveler_${i}_cinFront`) ??
        formData.get(`traveler_${i}_cin_front`);
      const cinBackInput =
        formData.get(`traveler_${i}_cinBack`) ??
        formData.get(`traveler_${i}_cin_back`);

      let docType: string = 'adult';
      if (isFile(passportInput) && passportInput.size > 0) {
        docType = 'passport';
        travelerIdFiles.push(
          queueUpload(passportInput, `traveler_${i}_passport`)
        );
      } else {
        if (isFile(cinFrontInput) && cinFrontInput.size > 0) {
          travelerIdFiles.push(
            queueUpload(cinFrontInput as File, `traveler_${i}_cin_front`)
          );
        }
        if (isFile(cinBackInput) && cinBackInput.size > 0) {
          travelerIdFiles.push(
            queueUpload(cinBackInput as File, `traveler_${i}_cin_back`)
          );
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

    const signatureData = formData.get('signature') as string;
    let signatureName: string | undefined;
    if (signatureData) {
      const sigBuffer = Buffer.from(signatureData.split(',')[1], 'base64');
      const sigFileName = `${timestamp}_signature.png`;
      const task = (async () => {
        const { error } = await supabaseAdmin.storage
          .from('checkin-me')
          .upload(sigFileName, sigBuffer, {
            contentType: 'image/png',
            upsert: true,
          });
        if (error)
          throw new Error(`Signature Upload Error: ${error.message}`);
        return { key: 'signature', name: sigFileName };
      })();
      uploadTasks.push(task);
      signatureName = sigFileName;
    }

    console.log(`--- Starting parallel upload of ${uploadTasks.length} files ---`);
    await Promise.all(uploadTasks);
    console.log(`--- All uploads completed successfully ---`);

    const booking = await prisma.booking.create({
      data: {
        guestName,
        guestEmail,
        checkin,
        checkout,
        propertyId,
        totalTravelers,
        selfieUrl: selfieName,
        checkinHour,
        whatsapp,
        travelers: {
          create: travelersData.map((t) => ({
            name: t.name,
            country: t.country,
            idNumber: t.idNumber,
            idImages: t.idFiles.join(','),
            type: t.type,
          })),
        },
      },
    });

    const rules = resolveHouseRulesForLang(property.houseRules, lang);

    const idFiles = travelersData.flatMap((t) => t.idFiles);

    let pdfBytes: any;
    try {
      const imagesB64 = idFiles.map((f) => {
        const buf = imageBuffers[f];
        if (!buf) return null;
        const ext = f.split('.').pop() || 'jpg';
        const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        return `data:${mime};base64,${buf.toString('base64')}`;
      }).filter((img): img is string => img !== null);

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
        travelers: travelersData.map((t) => ({
          country: t.country,
          idNumber: t.idNumber,
          idFiles: t.idFiles,
        })),
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
        ...(mailError ? { mailError: '1' } : { emailSent: '1' }),
      }).toString();
      return jsonSafeResult({
        success: true,
        message: 'Saved, but PDF failed.',
        redirectUrl: queryString ? `/success?${queryString}` : '/success',
      });
    }

    pdfName = `Booking-${booking.id}.pdf`;
    const { error: pdfUploadError } = await supabaseAdmin.storage
      .from('checkin-me')
      .upload(pdfName, Buffer.from(pdfBytes), {
        contentType: 'application/pdf',
        upsert: true,
      });

    /** Only persist pdfUrl when the object exists — otherwise /api/pdf returns Storage 400 and guests see errors. */
    const pdfStoredInCloud = !pdfUploadError;
    if (pdfUploadError) {
      console.error(
        'Supabase PDF upload error:',
        pdfUploadError.message || String(pdfUploadError)
      );
    } else {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { pdfUrl: pdfName },
      });
    }

    try {
      const adminEmail =
        property.adminEmail?.trim() || property.host?.email?.trim() || null;
      const pdfAttachment: PdfAttachment = {
        filename: pdfName,
        content: Buffer.from(pdfBytes),
        contentType: 'application/pdf',
      };

      // Attach ID document images for admin email (passport / CIN front/back).
      // Note: fetched from Storage as buffers so Nodemailer can attach them.
      const idDocKeys = [...new Set(idFiles)].filter(Boolean);
      const idDocDownloads = await Promise.all(
        idDocKeys.slice(0, 12).map(async (objectName) => {
          const prettyFilename = (() => {
            // Example keys: `${timestamp}_traveler_0_passport.jpg`
            const base = objectName.split('/').pop() || objectName;
            return base.replace(/^\d+_/, ''); // drop timestamp prefix if present
          })();
          const res = await downloadStorageObjectAsAttachment({
            bucket: 'checkin-me',
            objectName,
            filename: prettyFilename,
          });
          if (!res.ok) {
            console.warn('Email attachment download skipped:', objectName, res.reason);
            return null;
          }
          return res.attachment;
        })
      );
      const idDocAttachments = idDocDownloads.filter(Boolean) as Array<{
        filename: string;
        content: Buffer;
        contentType?: string;
      }>;

      const combinedAttachments = [pdfAttachment, ...idDocAttachments];

      const { mailError } = await sendCheckInEmails({
        guestEmail,
        guestName,
        adminEmail,
        propertyName: property.name,
        checkin,
        checkout,
        pdfAttachment,
        guestAttachments: combinedAttachments,
        adminAttachments: combinedAttachments,
        checkinHour,
        whatsapp,
        totalTravelers,
        travelers: travelersData,
        lang,
      });

      const q = new URLSearchParams();
      if (pdfStoredInCloud) q.set('pdf', pdfName);
      if (mailError) q.set('mailError', '1');
      else q.set('emailSent', '1');

      return jsonSafeResult({
        success: true,
        pdfName: pdfStoredInCloud ? pdfName : undefined,
        redirectUrl: `/success?${q.toString()}`,
      });
    } catch (e: unknown) {
      console.error('Check-in email notification failed:', e);
      const q = new URLSearchParams();
      if (pdfStoredInCloud) q.set('pdf', pdfName);
      q.set('mailError', '1');
      return jsonSafeResult({
        success: true,
        pdfName: pdfStoredInCloud ? pdfName : undefined,
        redirectUrl: `/success?${q.toString()}`,
      });
    }
  } catch (e: any) {
    console.error('executeSaveBooking full error stack:', e);
    return jsonSafeResult({
      success: false,
      error: `Submission failed: ${e.message || 'Internal error'}`,
    });
  }
}
