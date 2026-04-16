import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import LuxuryAgreement from '@/app/components/LuxuryAgreement';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PrintButton from '@/app/components/PrintButton';
import { resolveHouseRulesForLang } from '@/lib/house-rules';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AgreementPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch booking with property data
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      property: true,
      travelers: true,
    },
  });

  if (!booking) {
    return notFound();
  }

  const rules = resolveHouseRulesForLang(booking.property.houseRules, 'EN');

  // Prepare data for the component
  const propertyData = {
    name: booking.property.name,
    logoUrl: booking.property.logoUrl,
  };

  // The signature is stored in Supabase and served via our proxy API
  const signatureUrl = booking.signatureUrl 
    ? `/api/pdf/${encodeURIComponent(booking.signatureUrl)}` 
    : null;

  const bookingData = {
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    checkin: booking.checkin,
    checkout: booking.checkout,
    checkinHour: booking.checkinHour || undefined,
    signature: signatureUrl,
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center py-12 px-4 no-scrollbar">
      {/* Controls - Hidden during print */}
      <div className="no-print w-full max-w-[210mm] flex justify-between items-center mb-12 bg-white p-5 rounded-2xl shadow-sm border border-gray-200/50">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1A1A1A] transition-all"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <PrintButton />
      </div>

      {/* The Printable Document */}
      <div className="shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden scale-[0.85] sm:scale-100 origin-top bg-white">
        <LuxuryAgreement 
          property={propertyData} 
          booking={bookingData} 
          rules={rules} 
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { margin: 0; padding: 0; background: white !important; }
          .no-print { display: none !important; }
          div { box-shadow: none !important; border-radius: 0 !important; }
        }
        @page {
          size: A4;
          margin: 0;
        }
      `}} />
    </div>
  );
}
