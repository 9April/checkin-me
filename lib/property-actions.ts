'use server';

import { cookies } from 'next/headers';
import { ACTIVE_PROPERTY_COOKIE } from './active-property';

export async function setActiveProperty(id: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PROPERTY_COOKIE, id, { path: '/' });
}
