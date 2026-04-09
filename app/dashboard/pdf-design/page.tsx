import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PdfEditor from './PdfEditor';
import { FileText } from 'lucide-react';

export default async function PdfDesignPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const property = await prisma.property.findFirst({
    where: { hostId: session.user.id }
  });

  if (!property) redirect('/dashboard/settings');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#F4EBD0] rounded-2xl flex items-center justify-center text-[#B08D43] shadow-sm">
            <FileText size={24} />
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tighter font-serif italic text-[#C5A059]">PDF Designer</h1>
        </div>
        <p className="text-[#6B635C] font-medium opacity-60 max-w-2xl text-sm ml-15">
           Fully customize the layout, branding, and content of your guest agreement PDF using HTML and CSS. Use placeholders to dynamically inject guest data.
        </p>
      </div>

      <PdfEditor 
        propertyId={property.id} 
        propertyName={property.name}
        houseRules={property.houseRules || ''}
        initialTemplate={property.pdfTemplate || ''} 
        initialFooter={property.pdfFooter || ''} 
        logoUrl={property.logoUrl}
      />
    </div>
  );
}
