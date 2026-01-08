'use server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { redirect, RedirectType } from 'next/navigation';

export async function saveBooking(formData: FormData) {
/* ---------- 1. read fields ---------- */
const signature = formData.get('signature') as string;
const selfieFile = formData.get('selfie') as File;
const adults = parseInt(formData.get('adults') as string) || 1;
const kids = parseInt(formData.get('kids') as string) || 0;
const totalTravelers = adults + kids;

/* ---------- 2. helper to write files ---------- */
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
const pdfDir    = path.join(process.cwd(), 'public', 'pdfs');
await mkdir(uploadDir, { recursive: true });
await mkdir(pdfDir,    { recursive: true });

const save = async (f: File, name: string) => {
  const bytes = await f.arrayBuffer();
  await writeFile(path.join(uploadDir, name), Buffer.from(bytes));
};

// Sanitize filename and get extension safely
const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : 'jpg';
};

const timestamp = Date.now();

/* ---------- 3. handle selfie upload ---------- */
let idFiles: string[] = [];

if (!selfieFile || selfieFile.size === 0) {
  throw new Error('Selfie image is required and must not be empty');
}

const selfieName = `${timestamp}_selfie.${getFileExtension(selfieFile.name)}`;
await save(selfieFile, selfieName);
idFiles.push(selfieName);

/* ---------- 4. handle travelers' documents ---------- */
const travelersData: Array<{
  country: string;
  idNumber: string;
  idFiles: string[];
}> = [];

for (let i = 0; i < totalTravelers; i++) {
  const country = formData.get(`traveler_${i}_country`) as string;
  const noCIN = !!formData.get(`traveler_${i}_noCIN`);
  // Passport mode if: no country selected, country is OTHER, or noCIN is checked
  const isPassport = !country || country === 'OTHER' || noCIN;
  
  let travelerIdFiles: string[] = [];
  
  if (isPassport) {
    const p = formData.get(`traveler_${i}_passport`) as File;
    if (!p || p.size === 0) {
      throw new Error(`Traveler ${i + 1}: Passport photo page required`);
    }
    const name = `${timestamp}_traveler_${i}_passport.${getFileExtension(p.name)}`;
    await save(p, name);
    travelerIdFiles.push(name);
    idFiles.push(name);
  } else {
    const front = formData.get(`traveler_${i}_cinFront`) as File;
    const back = formData.get(`traveler_${i}_cinBack`) as File;
    if (!front || !back || front.size === 0 || back.size === 0) {
      throw new Error(`Traveler ${i + 1}: Both CIN sides required`);
    }
    const fName = `${timestamp}_traveler_${i}_cin_front.${getFileExtension(front.name)}`;
    const bName = `${timestamp}_traveler_${i}_cin_back.${getFileExtension(back.name)}`;
    await save(front, fName);
    await save(back, bName);
    travelerIdFiles.push(fName, bName);
    idFiles.push(fName, bName);
  }
  
  const idNumber = formData.get(`traveler_${i}_idNumber`) as string;
  if (!idNumber || !idNumber.trim()) {
    throw new Error(`Traveler ${i + 1}: ID/Passport number is required`);
  }
  
  travelersData.push({
    country,
    idNumber,
    idFiles: travelerIdFiles,
  });
}

/* ---------- 4. signature ---------- */
if (!signature || !signature.trim()) {
  throw new Error('Signature is required');
}
const sigBase64 = signature.replace(/^data:image\/png;base64,/, '');
if (!sigBase64 || sigBase64.length < 100) {
  throw new Error('Invalid signature format');
}
await writeFile(
  path.join(uploadDir, `${timestamp}_signature.png`),
  sigBase64,
  'base64'
);

/* 5. build & save PDF */
const rules = [
  'Animaux domestiques autorisés UNIQUEMENT avec autorisation écrite. Ils doivent être propres, sans puces et peser moins de 10 kg.',
  'Cleanliness & Trash: Guests must wash dishes before check-out. Trash must be sorted and disposed of in designated bins. Excessive mess will result in an additional cleaning fee of 300 MAD. FR: Vaisselle à faire avant le départ. Les poubelles doivent être triées. Un ménage excessif entraîne des frais de 300 MAD.',
  'Damages & Security: Guests are fully liable for any damage caused to the property or its contents. A security deposit of 1,000 MAD is required at check-in and refunded within 48 hours after inspection. FR: Les invités sont responsables de tout dommage. Un dépôt de garantie de 1000 MAD est demandé à l’arrivée.',
  'Off-limit Areas: Roof terrace, utility room, and host’s personal quarters are strictly off-limits. FR: L’accès à la terrasse, la buanderie et les quartiers privés de l’hôte est interdit.',
  'Illegal Activities: Any illegal activity (drugs, unregistered subletting, etc.) will result in immediate eviction and reporting to authorities. FR: Toute activité illégale entraîne l’expulsion immédiate et une déclaration aux autorités.',
  'Force Majeure & Disputes: In case of dispute, Moroccan law applies. Jurisdiction: Courts of the city where the property is located. FR: En cas de litige, le droit marocain s’applique. Juridiction : tribunaux de la ville où se situe le bien.',
];

/* convert images → base64 for PDF embedding */
const imagesB64 = await Promise.all(
  idFiles.map(async (f) => {
    const buf = await import('fs/promises').then(fs => fs.readFile(path.join(uploadDir, f)));
    return `data:image/jpeg;base64,${buf.toString('base64')}`;
  })
);

// Validate required fields before PDF generation
const guestName = formData.get('guestName') as string;
const guestEmail = formData.get('guestEmail') as string;
const checkin = formData.get('checkin') as string;

if (!guestName || !guestName.trim()) {
  throw new Error('Guest name is required');
}
if (!guestEmail || !guestEmail.trim()) {
  throw new Error('Guest email is required');
}
if (!checkin || !checkin.trim()) {
  throw new Error('Check-in date is required');
}

const { buildPDF } = await import('@/lib/pdf');
const pdfBytes = await buildPDF({
  guestName,
  guestEmail,
  checkin,
  travelers: travelersData,
  adults,
  kids,
  rules,
  signature: signature as string,
  idImages: imagesB64 as string[],
});

const pdfName = `Pre-Check-${timestamp}.pdf`;
await writeFile(path.join(pdfDir, pdfName), Buffer.from(pdfBytes));

/* 6. hard redirect to success page */
redirect(`/success?pdf=${pdfName}`, RedirectType.push);
}