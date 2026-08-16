import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import DashboardClientLayout from './components/DashboardClientLayout';
import { cookies } from 'next/headers';
import { ACTIVE_PROPERTY_COOKIE } from '@/lib/active-property';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const properties = await prisma.property.findMany({
    where: { hostId: session.user.id },
    select: { id: true, name: true, isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  const cookieStore = await cookies();
  const activePropertyId = cookieStore.get(ACTIVE_PROPERTY_COOKIE)?.value;

  return (
    <DashboardClientLayout 
      properties={properties} 
      activePropertyId={activePropertyId}
    >
      {children}
    </DashboardClientLayout>
  );
}
