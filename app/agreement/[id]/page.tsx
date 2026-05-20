import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import LuxuryAgreement from '@/app/components/LuxuryAgreement';
import { ArrowLeft, FileText, Mail, Download } from 'lucide-react';
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
    travelers: booking.travelers.map((t) => ({
      name: t.name,
      country: t.country,
      idNumber: t.idNumber || '—',
      type: t.type,
    })),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-6 sm:py-12 px-0 sm:px-4 overflow-x-hidden no-scrollbar print:m-0 print:p-0 print:block print:min-h-0 print:bg-white">
      
      {/* ═══ MOBILE: Show elegant redirect message instead of broken preview ═══ */}
      <div className="sm:hidden flex flex-col items-center justify-center min-h-screen px-6 text-center bg-[#FCFBF9]">
        <div className="w-20 h-20 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-8 shadow-lg">
          <FileText size={32} className="text-white" />
        </div>
        
        <h1 
          className="text-2xl font-bold text-[#1A1A1A] mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Digital Stay Agreement
        </h1>
        
        <p className="text-sm text-[#717171] leading-relaxed mb-2 max-w-[300px]">
          <span className="font-semibold text-[#1A1A1A]">{bookingData.guestName}</span>
        </p>
        <p className="text-xs text-[#A8987E] mb-8">
          {propertyData.name} · {bookingData.checkin} — {bookingData.checkout}
        </p>

        <div className="w-full max-w-[320px] space-y-3">
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center">
                <Mail size={18} className="text-[#1A1A1A]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1A1A1A]">Check Your Email</p>
                <p className="text-xs text-[#717171]">PDF attached to your confirmation</p>
              </div>
            </div>
            <p className="text-xs text-[#999] leading-relaxed">
              Your signed stay agreement PDF was sent to <strong>{bookingData.guestEmail}</strong>. 
              Open the attachment to view, download, or print.
            </p>
          </div>

          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center">
                <Download size={18} className="text-[#1A1A1A]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1A1A1A]">Use a Desktop</p>
                <p className="text-xs text-[#717171]">For best viewing experience</p>
              </div>
            </div>
            <p className="text-xs text-[#999] leading-relaxed">
              Open this same link on a computer to view, download, or print the full agreement directly from your browser.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#EEEEEE] w-full max-w-[320px]">
          <p className="text-[10px] text-[#BBBBBB] uppercase tracking-[0.15em]">
            Powered by Checkin-Me
          </p>
        </div>
      </div>

      {/* ═══ DESKTOP: Full agreement viewer with controls ═══ */}
      <div className="hidden sm:flex flex-col items-center w-full">
        {/* Controls - Hidden during print */}
        <div className="no-print w-full max-w-screen-md flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-gray-100 z-10 sticky top-0">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gray-400 hover:text-[#1A1A1A] transition-all"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <PrintButton mode="download" guestName={bookingData.guestName} />
            <PrintButton guestName={bookingData.guestName} />
          </div>
        </div>

        {/* The Printable Document */}
        <div className="w-full max-w-[210mm] bg-white overflow-hidden print:w-auto print:max-w-none print:overflow-visible">
          <LuxuryAgreement 
            property={propertyData as any} 
            booking={bookingData} 
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
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
    </div>
  );
}
