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
    ruleLogistics: booking.property.ruleLogistics,
    ruleOccupants: booking.property.ruleOccupants,
    ruleResponsibility: booking.property.ruleResponsibility,
    ruleSecurity: booking.property.ruleSecurity,
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
    <div className="min-h-screen bg-white flex flex-col items-center py-6 sm:py-12 px-0 sm:px-4 no-scrollbar">
      {/* Controls - Hidden during print */}
      <div className="no-print w-full max-w-screen-md flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md p-5 rounded-none sm:rounded-2xl shadow-sm border-b sm:border border-gray-100 z-10 sticky top-0">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gray-400 hover:text-[#1A1A1A] transition-all"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <PrintButton mode="download" />
          <PrintButton />
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (window.location.search.includes('download=1')) {
              window.print();
            }
          `,
        }}
      />

      {/* The Printable Document */}
      <div className="w-full max-w-screen-md bg-white overflow-hidden">
        <LuxuryAgreement 
          property={propertyData as any} 
          booking={bookingData} 
        />
      </div>

      </div>
    </div>
  );
}
