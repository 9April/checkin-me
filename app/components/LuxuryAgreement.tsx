"use client";

import React from 'react';
import { 
  Clock, 
  Users, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

interface LuxuryAgreementProps {
  property: {
    name: string;
    logoUrl?: string | null;
    ruleLogistics?: string | null;
    ruleOccupants?: string | null;
    ruleResponsibility?: string | null;
    ruleSecurity?: string | null;
  };
  booking: {
    guestName: string;
    guestEmail: string;
    checkin: string;
    checkout: string;
    checkinHour?: string;
    signature?: string | null;
  };
}

export default function LuxuryAgreement({ property, booking }: LuxuryAgreementProps) {
  // Helper to format YYYY-MM-DD -> DD-MM-YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    const shortYear = y.slice(-2);
    return `${d}/${m}/${shortYear}`;
  };

  const logistics = property.ruleLogistics || "L'arrivée est prévue à partir de 15:00 et le départ doit impérativement être effectué avant 11:00.";
  const occupants = property.ruleOccupants || "Le logement est strictement réservé aux personnes mentionnées. Toute personne supplémentaire doit être déclarée à l'hôte.";
  const responsibility = property.ruleResponsibility || "Prendre soin du logement et le restituer en bon état. Tout dommage causé devra être signalé immédiatement.";
  const security = property.ruleSecurity || "Les clés sont confiées aux voyageurs ; leur perte entraîne des frais. Toute activité illégale entraînera l'annulation du séjour.";

  return (
    <div id="print-area" className="a4-container bg-white text-[#1A1A1A] font-sans selection:bg-[#A8987E] selection:text-white box-border flex flex-col justify-between mx-auto h-full min-h-[100svh] sm:min-h-[297mm]">
      <style>{`
        @media print {
          @page { 
            size: auto; 
            margin: 0mm !important; 
          }
          html, body {
            width: 100% !important;
            height: 100vh !important;
            margin: 0 !important; 
            padding: 0 !important; 
            overflow: hidden !important;
            min-height: 0 !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          #print-area {
            width: 210mm !important;
            max-width: 210mm !important;
            height: 297mm !important;
            margin: 0 auto !important;
            float: none !important;
            overflow: hidden !important;
            padding-bottom: 0 !important;
            transform: scale(0.82) !important; /* Scale exactly to fit A4 paper logic */
            -webkit-transform: scale(0.82) !important;
            transform-origin: top center !important;
            -webkit-transform-origin: top center !important;
          }
          
          .no-print { display: none !important; }
          
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
        
        /* Mobile Screen Scaling: Force the desktop layout to fit on mobile viewports without wrapping */
        @media screen and (max-width: 768px) {
          #print-area {
            transform: scale(0.45); /* Scale down the 210mm container to fit a small phone screen */
            transform-origin: top center;
            margin-top: -25%; /* Pull up to avoid gap caused by scaling */
            margin-bottom: -150%; /* Adjust bottom margin for scale artifacts */
          }
          .a4-container {
            width: 210mm !important;
            min-width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
          }
        }
      `}</style>
      
      {/* Top Content Group */}
      <div className="flex flex-col gap-10">
        {/* Header */}
        <header className="text-center py-6 whitespace-nowrap">
          <h1 className="font-serif text-5xl tracking-[0.2em] uppercase mb-4 text-[#1A1A1A] text-center whitespace-nowrap">
            {property.name || "MAMOUNIA 08"}
          </h1>
          <p className="font-sans text-xs tracking-[0.4em] uppercase opacity-50 text-[#A8987E] text-center whitespace-nowrap">
            Guest Stay Agreement
          </p>
        </header>

        {/* Information Bar */}
        <section className="agreement-info-bar grid grid-cols-[1fr_1.6fr_0.8fr] gap-0 border-t border-b border-[#A8987E]/20 py-8">
          <div className="info-bar-item flex flex-col items-center border-r border-[#A8987E]/20 px-6 min-w-0">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3">Guest Name</p>
            <p className="font-serif text-[12pt] text-center leading-tight truncate w-full">{booking.guestName}</p>
          </div>
          <div className="info-bar-item flex flex-col items-center border-r border-[#A8987E]/20 px-6 min-w-0">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3">Email Address</p>
            <p className="font-serif text-[12pt] text-center leading-tight w-full truncate">
              {booking.guestEmail}
            </p>
          </div>
          <div className="info-bar-item flex flex-col items-center px-6 min-w-0">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3">Stay Period</p>
            <p className="font-serif text-[12pt] text-center leading-tight whitespace-nowrap">
              {formatDate(booking.checkin)} — {formatDate(booking.checkout)}
            </p>
          </div>
        </section>

        {/* House Etiquette & Rules */}
        <section className="agreement-house-etiquette flex flex-col gap-8 break-inside-avoid">
          <h2 className="font-serif text-2xl text-center italic opacity-80 decoration-[#A8987E]/20 underline underline-offset-8 mb-4">House Etiquette</h2>
          <div className="house-etiquette-grid grid grid-cols-2 gap-x-12 gap-y-10">
            {/* Logistics */}
            <div className="etiquette-item flex gap-5">
              <div className="shrink-0 w-10 h-10 rounded-full border border-[#A8987E]/30 flex items-center justify-center text-[#A8987E]">
                <Clock size={18} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#A8987E]">Logistics</h3>
                <p className="text-[13px] leading-relaxed opacity-70">
                  {logistics}
                </p>
              </div>
            </div>

            {/* Occupants & accès */}
            <div className="etiquette-item flex gap-5">
              <div className="shrink-0 w-10 h-10 rounded-full border border-[#A8987E]/30 flex items-center justify-center text-[#A8987E]">
                <Users size={18} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#A8987E]">Occupants & accès</h3>
                <p className="text-[13px] leading-relaxed opacity-70">
                  {occupants}
                </p>
              </div>
            </div>

            {/* Responsabilité & Propreté */}
            <div className="etiquette-item flex gap-5">
              <div className="shrink-0 w-10 h-10 rounded-full border border-[#A8987E]/30 flex items-center justify-center text-[#A8987E]">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#A8987E]">Responsabilité & Propreté</h3>
                <p className="text-[13px] leading-relaxed opacity-70">
                  {responsibility}
                </p>
              </div>
            </div>

            {/* Accès & conformité */}
            <div className="etiquette-item flex gap-5">
              <div className="shrink-0 w-10 h-10 rounded-full border border-[#A8987E]/30 flex items-center justify-center text-[#A8987E]">
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#A8987E]">Accès & conformité</h3>
                <p className="text-[13px] leading-relaxed opacity-70">
                  {security}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pinned Bottom Content Group (Signature & Footer) */}
      <div className="agreement-pinned-bottom flex flex-col gap-10 pt-12 w-full break-inside-avoid">
        {/* Confirmation & Signature Section */}
        <section className="agreement-signature-row flex flex-col gap-10 break-inside-avoid">
          <div className="text-center max-w-xl mx-auto">
            <p className="font-serif text-lg italic leading-relaxed opacity-90 border-b border-[#A8987E]/10 pb-6">
              Je confirme avoir pris connaissance du règlement intérieur et m'engage à le respecter durant mon séjour.
            </p>
          </div>

          <div className="signature-grid grid grid-cols-3 gap-10 items-end break-inside-avoid">
            <div className="signature-field border-b border-[#A8987E]/40 pb-3 break-inside-avoid">
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Date of Arrival</p>
              <p className="font-serif text-[12pt] leading-none">{formatDate(booking.checkin)}</p>
            </div>
            <div className="signature-field border-b border-[#A8987E]/40 pb-3 break-inside-avoid">
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Estimated Arrival</p>
              <p className="font-serif text-[12pt] leading-none">{booking.checkinHour || "—"}</p>
            </div>
            <div className="signature-field border-b border-[#A8987E]/40 pb-3 relative min-h-[60px] flex flex-col justify-end break-inside-avoid">
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2 absolute top-0 left-0">Signature</p>
              {booking.signature ? (
                <img 
                  src={booking.signature} 
                  alt="Guest Signature" 
                  className="h-16 w-auto object-contain pointer-events-none grayscale brightness-50" 
                />
              ) : (
                <div className="h-12 border-b border-[#1A1A1A]/10 border-dashed" />
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-4 border-t border-[#1A1A1A]/5 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] opacity-40">
            2026 {property.name || "Mamounia 08"} | Secure Digital Registration
          </p>
        </footer>
      </div>
    </div>
  );
}
