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
    <div className="min-h-screen bg-white flex flex-col items-center py-0 px-0 overflow-x-hidden no-scrollbar print:m-0 print:p-0 print:block print:min-h-0 print:bg-white">
      {/* Controls - Hidden during print */}
      <div className="no-print w-full max-w-[210mm] flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md p-5 rounded-none shadow-sm border-b border-gray-100 z-10 sticky top-0">
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

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          html, body { 
            height: 100vh !important; 
            overflow: hidden !important; 
            margin: 0 !important; 
            padding: 0 !important; 
          }
          @page { margin: 0 !important; }
        }
      `}} />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (window.location.search.includes('download=1')) {
              window.print();
            }
          `,
        }}
      />

      {/* The Printable Document - Locked to 210mm Width for Universal Parity */}
      <div className="w-[210mm] bg-white overflow-hidden print:w-auto print:max-w-none print:overflow-visible">
        <LuxuryAgreement 
          property={propertyData as any} 
          booking={bookingData} 
        />
      </div>
    </div>
  );
}
