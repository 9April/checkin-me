import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Film } from 'lucide-react';

export default async function MediaPreviewSelectionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const properties = await prisma.property.findMany({
    where: { hostId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  if (properties.length === 0) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#F4EBD0] rounded-2xl flex items-center justify-center text-[#B08D43] shadow-sm">
            <Film size={24} />
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tighter font-serif italic text-[#C5A059]">Media Studio</h1>
        </div>
        <p className="text-[#6B635C] font-medium opacity-60 max-w-2xl text-sm ml-15">
          Select a property below to open its Media Studio and manage its photos and videos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
        {properties.map((property) => (
          <Link 
            href={`/media-preview/${property.id}`} 
            key={property.id}
            className={`bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#B08D43] transition-all flex flex-col gap-4 group ${!property.isActive ? 'opacity-70 grayscale' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#F4EBD0] group-hover:text-[#B08D43] transition-colors">
                <Film size={24} />
              </div>
              {!property.isActive && (
                <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-lg">Disabled</span>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-900 truncate">{property.name}</h3>
              <p className="text-sm text-gray-500">Edit Media & Videos</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
