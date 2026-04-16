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
  const [scale, setScale] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Scaling logic to fit 210mm width into mobile viewport
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const targetWidth = 210 * 3.7795275591; // 210mm in pixels (approx)
      if (width < targetWidth + 40) {
        setScale((width - 40) / targetWidth);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="a4-wrapper no-scrollbar">
      <div 
        id="print-area" 
        ref={containerRef}
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          margin: scale < 1 ? '0 auto' : '0 auto'
        }}
        className="a4-container bg-white text-[#1A1A1A] font-sans box-border p-[10mm] shadow-2xl print:shadow-none print:transform-none print:m-0 print:p-[10mm]"
      >
        <style>{`
          @media print {
            @page { 
              size: A4; 
              margin: 0 !important; 
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              height: 297mm !important;
              max-height: 297mm !important;
              overflow: hidden !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print { display: none !important; }
            #print-area {
              transform: none !important;
              margin: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              max-height: 297mm !important;
              padding: 10mm !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              overflow: hidden !important;
              background: white !important;
              z-index: 9999 !important;
              box-shadow: none !important;
            }
            /* Reset any parents that might have height/overflow issues */
            div { overflow: visible !important; }
            .a4-wrapper { 
              height: 100% !important; 
              overflow: visible !important; 
              padding: 0 !important;
              margin: 0 !important; 
            }

            /* Compact spacing for print to ensure 1 page */
            .print-compact-gap { gap: 1.25rem !important; }
            .print-text-sz { font-size: 11pt !important; }
          }
        `}</style>
        
        <div className="flex flex-col h-full justify-between print-compact-gap">
          {/* Top Content Group */}
          <div className="flex flex-col gap-5 sm:gap-7 print-compact-gap">
            {/* Header */}
            <header className="text-center py-2 sm:py-4">
              <h1 className="font-serif text-4xl sm:text-5xl tracking-[0.2em] uppercase mb-2 sm:mb-3 text-[#1A1A1A] whitespace-nowrap overflow-hidden text-ellipsis">
                {property.name || "MAMOUNIA 08"}
              </h1>
              <p className="font-sans text-[9px] sm:text-xs tracking-[0.4em] uppercase opacity-50 text-[#A8987E]">
                Guest Stay Agreement
              </p>
            </header>

            {/* Information Bar */}
            <section className="grid grid-cols-[1fr_1.6fr_0.8fr] border-t border-b border-[#A8987E]/20 py-4 sm:py-6">
              <div className="flex flex-col items-center border-r border-[#A8987E]/20 px-3 min-w-0">
                <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1 lg:mb-2">Guest Name</p>
                <p className="font-serif text-[11pt] sm:text-[12pt] text-center leading-tight truncate w-full font-medium">{booking.guestName}</p>
              </div>
              <div className="flex flex-col items-center border-r border-[#A8987E]/20 px-3 min-w-0">
                <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1 lg:mb-2">Email Address</p>
                <p className="font-serif text-[11pt] sm:text-[12pt] text-center leading-tight w-full truncate font-medium">
                  {booking.guestEmail}
                </p>
              </div>
              <div className="flex flex-col items-center px-3 min-w-0">
                <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1 lg:mb-2">Stay Period</p>
                <p className="font-serif text-[11pt] sm:text-[12pt] text-center leading-tight whitespace-nowrap font-medium">
                  {formatDate(booking.checkin)} — {formatDate(booking.checkout)}
                </p>
              </div>
            </section>

            {/* House Etiquette & Rules */}
            <section className="flex flex-col gap-4 sm:gap-6">
              <h2 className="font-serif text-lg sm:text-xl text-center italic opacity-80 decoration-[#A8987E]/20 underline underline-offset-8 mb-2">House Etiquette</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:gap-y-7">
                {[
                  { icon: <Clock size={16} />, title: "Logistics", text: logistics },
                  { icon: <Users size={16} />, title: "Occupants & accès", text: occupants },
                  { icon: <Sparkles size={16} />, title: "Responsabilité", text: responsibility },
                  { icon: <ShieldCheck size={16} />, title: "Sécurité", text: security }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full border border-[#A8987E]/30 flex items-center justify-center text-[#A8987E]">
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#A8987E]">{item.title}</h3>
                      <p className="text-[11px] sm:text-[12px] leading-relaxed opacity-75 line-clamp-4">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Pinned Bottom Content Group (Signature & Footer) */}
          <div className="flex flex-col gap-5 sm:gap-8 pt-4 border-t border-[#A8987E]/10">
            {/* Confirmation Section */}
            <div className="text-center max-w-lg mx-auto mb-2">
              <p className="font-serif text-[14px] sm:text-[16px] italic leading-relaxed opacity-90">
                Je confirme avoir pris connaissance du règlement intérieur et m'engage à le respecter durant mon séjour.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 items-end">
              <div className="border-b border-[#A8987E]/40 pb-2">
                <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1">Date of Arrival</p>
                <p className="font-serif text-[11pt] leading-tight font-medium">{formatDate(booking.checkin)}</p>
              </div>
              <div className="border-b border-[#A8987E]/40 pb-2">
                <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1">Estimated Arrival</p>
                <p className="font-serif text-[11pt] leading-tight font-medium">{booking.checkinHour || "—"}</p>
              </div>
              <div className="border-b border-[#A8987E]/40 pb-2 relative min-h-[50px] flex flex-col justify-end">
                <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1 absolute top-0 left-0">Signature</p>
                {booking.signature ? (
                  <img 
                    src={booking.signature} 
                    alt="Guest Signature" 
                    crossOrigin="anonymous"
                    className="h-12 w-auto object-contain pointer-events-none" 
                  />
                ) : (
                  <div className="h-8 border-b border-[#1A1A1A]/10 border-dashed" />
                )}
              </div>
            </div>

            {/* Footer */}
            <footer className="pt-2 text-center">
              <p className="text-[8px] uppercase tracking-[0.3em] opacity-40">
                2026 {property.name || "Mamounia 08"} | Secure Digital Registration
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
