import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import PropertiesList from './PropertiesList';

export default async function PropertiesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const properties = await prisma.property.findMany({
    where: { hostId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Properties</h1>
        <p className="text-sm text-[#6B7280] mt-1">Manage all your properties, add new ones, or disable inactive ones.</p>
      </div>

      <PropertiesList initialProperties={properties} />
    </div>
  );
}
