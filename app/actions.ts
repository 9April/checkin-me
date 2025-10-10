'use server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { redirect } from 'next/navigation';

export async function saveBooking(formData: FormData) {
  /* 1. read fields */
  const country  = (formData.get('country') as string) || 'OTHER';
  const noCIN    = !!formData.get('noCIN');        // checkbox exists only for MA
  const isPassport = country === 'OTHER' || noCIN; // passport flow?
  const signature = formData.get('signature') as string;
  /* 2. helper to write files */
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  const save = async (f: File, name: string) => {
    const b = await f.arrayBuffer();
    await writeFile(path.join(dir, name), Buffer.from(b));
  };

 

  /* 3. handle passport OR cin */
  if (isPassport) {
    // Passport flow: country is OTHER OR user selected "no CIN"
    const p = formData.get('passport') as File;
    if (!p || p.size === 0) throw new Error('Passport photo page required');
    await save(p, `${Date.now()}_passport.${p.name.split('.').pop()}`);
  } else {
    // Moroccan CIN flow: country is MA AND user has CIN
    const front = formData.get('cinFront') as File;
    const back  = formData.get('cinBack')  as File;
    if (!front || !back || front.size === 0 || back.size === 0) {
      throw new Error('Both CIN sides required');
    }
    await save(front, `${Date.now()}_cin_front.${front.name.split('.').pop()}`);
    await save(back,  `${Date.now()}_cin_back.${back.name.split('.').pop()}`);
  }

  /* 4. save signature if provided */
  if (signature) {
    const base64Data = signature.replace(/^data:image\/png;base64,/, '');
    await writeFile(path.join(dir, `${Date.now()}_signature.png`), base64Data, 'base64');
  }

  redirect('/');
}