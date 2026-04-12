import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getPrivacyPolicyHtml } from '@/lib/privacy-policy-html';
import { publicCheckInPath } from '@/lib/property-slug';

export default async function PrivacyPolicy({
  searchParams,
}: {
  searchParams: Promise<{ propertyId?: string; is_modal?: string }>;
}) {
  const { propertyId, is_modal } = await searchParams;
  const isModal = is_modal === 'true';

  let property = null;
  if (propertyId) {
    property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
  }

  const htmlContent = getPrivacyPolicyHtml(property?.privacyPolicy);

  return (
    <div className="relative min-h-screen bg-[#FDFCF9]">
      {!isModal && (
        <div className="absolute top-4 left-4 z-[110]">
          <Link
            href={property ? publicCheckInPath(property) : '/'}
            className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md border border-[#F4EBD0] rounded-full text-[#B08D43] font-bold text-sm shadow-xl hover:bg-white transition-all duration-300"
          >
            ← Back to Check-in
          </Link>
        </div>
      )}

      <div
        className="luxury-privacy-container"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
