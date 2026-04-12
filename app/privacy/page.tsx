import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DEFAULT_PRIVACY_POLICY } from '@/lib/constants';
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

  // Use customized policy if available, otherwise fallback to default constant
  let htmlContent = property?.privacyPolicy || DEFAULT_PRIVACY_POLICY;

  if (htmlContent) {
    // Always apply the Luxury Gold theme adjustments to any HTML for consistent branding
    htmlContent = htmlContent
      .replace(/--accent:\s*#E85D04/g, '--accent: #C5A059')
      .replace(/--accent-light:\s*#FFF0E6/g, '--accent-light: #F4EBD0')
      .replace(/--bg-primary:\s*#FDFBF7/g, '--bg-primary: #FDFCF9');

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

  // Fallback to the original React version if HTML file is missing
  if (property?.privacyPolicy) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-[#F4EBD0]/30 shadow-[#C5A059]/5">
          {!isModal && (
            <Link 
              href={property ? publicCheckInPath(property) : '/'} 
              className="text-[#C5A059] hover:text-[#B08D43] font-bold flex items-center gap-2 mb-8 transition-colors"
            >
              ← Back to Check-in
            </Link>
          )}

          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2 font-serif italic text-[#C5A059]">Privacy Policy</h1>
          <p className="text-[#6B635C] mb-8 border-b border-[#F4EBD0] pb-8">{property.name}</p>

          <div className="prose prose-amber max-w-none">
            <div className="whitespace-pre-wrap text-[#1A1A1A] leading-relaxed font-medium">
              {property.privacyPolicy}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#F4EBD0] text-center">
            <p className="text-gray-400 text-sm">
              Powered by <strong className="text-[#C5A059]">Checkin-Me</strong> - Secure Guest Registration
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default Template (Original)
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* ... previous default template ... */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12 border border-gray-100 text-center">
          <Link href="/" className="text-blue-600 font-bold">Go to Home</Link>
          <p className="mt-4">Privacy policy file not found.</p>
      </div>
    </div>
  );
}
