'use server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { redirect, RedirectType } from 'next/navigation';

export async function saveBooking(formData: FormData) {
  /* ---------- 1. read fields ---------- */
  const country  = (formData.get('country') as string) || 'OTHER';
  const noCIN    = !!formData.get('noCIN');
  const isPassport = country === 'OTHER' || noCIN;
  const signature = formData.get('signature') as string;

  /* ---------- 2. helper to write files ---------- */
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const save = async (f: File, name: string) => {
    const bytes = await f.arrayBuffer();
    await writeFile(path.join(uploadDir, name), Buffer.from(bytes));
  };

  /* ---------- 3. handle uploads ---------- */
  if (isPassport) {
    const p = formData.get('passport') as File;
    if (!p || p.size === 0) throw new Error('Passport photo page required');
    await save(p, `${Date.now()}_passport.${p.name.split('.').pop()}`);
  } else {
    const front = formData.get('cinFront') as File;
    const back  = formData.get('cinBack')  as File;
    if (!front || !back || front.size === 0 || back.size === 0) {
      throw new Error('Both CIN sides required');
    }
    await save(front, `${Date.now()}_cin_front.${front.name.split('.').pop()}`);
    await save(back,  `${Date.now()}_cin_back.${back.name.split('.').pop()}`);
  }

  /* ---------- 4. signature ---------- */
  const sigBase64 = signature ? signature.replace(/^data:image\/png;base64,/, '') : '';
  if (sigBase64) {
    await writeFile(
      path.join(uploadDir, `${Date.now()}_signature.png`),
      sigBase64,
      'base64'
    );
  }

  /* ---------- 5. build & save PDF ---------- */
  const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
  await mkdir(pdfDir, { recursive: true });

  const { buildPDF } = await import('@/lib/pdf');
  const pdfBytes = await buildPDF({
    guestName:  formData.get('guestName')  as string,
    guestEmail: formData.get('guestEmail') as string,
    checkin:    formData.get('checkin')    as string,
    idImages:   [],                       // embed files next pass
    signature:  signature as string,
  });

  const pdfName = `${Date.now()}.pdf`;
  await writeFile(path.join(pdfDir, pdfName), Buffer.from(pdfBytes));

  /* ---------- 6. hard redirect to success page ---------- */
  redirect(`/success?pdf=${pdfName}`, RedirectType.push);
}