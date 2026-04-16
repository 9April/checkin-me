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
  };
  booking: {
    guestName: string;
    guestEmail: string;
    checkin: string;
    checkout: string;
    checkinHour?: string;
    signature?: string | null;
  };
  rules: string[];
}

export default function LuxuryAgreement({ property, booking }: LuxuryAgreementProps) {
  return (
    <div className="a4-container bg-stay-bg text-stay-text font-sans selection:bg-stay-accent selection:text-white p-12 box-border flex flex-col gap-16 max-w-screen-md mx-auto min-h-screen sm:min-h-[297mm]">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="font-serif text-5xl tracking-[0.2em] uppercase mb-4 text-stay-text">
          {property.name || "MAMOUNIA 08"}
        </h1>
        <p className="font-sans text-xs tracking-[0.4em] uppercase opacity-50 text-stay-accent">
          Guest Stay Agreement
        </p>
      </header>

      {/* Information Bar - Clearly Separated Containers */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 border-t border-b border-stay-accent/20 py-10">
        <div className="flex flex-col items-center md:border-r border-stay-accent/20 px-4 min-w-0">
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3">Guest Name</p>
          <p className="font-serif text-xl text-center leading-tight truncate w-full">{booking.guestName}</p>
        </div>
        <div className="flex flex-col items-center md:border-r border-stay-accent/20 px-4 min-w-0">
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3">Email Address</p>
          <p className="font-serif text-lg text-center leading-tight truncate w-full" title={booking.guestEmail}>
            {booking.guestEmail}
          </p>
        </div>
        <div className="flex flex-col items-center px-4 min-w-0">
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3">Stay Period</p>
          <p className="font-serif text-xl text-center leading-tight whitespace-nowrap">
            {booking.checkin} — {booking.checkout}
          </p>
        </div>
      </section>

      {/* House Etiquette & Rules - 2x2 Grid */}
      <section className="flex flex-col gap-10">
        <h2 className="font-serif text-2xl text-center italic opacity-80 decoration-stay-accent/20 underline underline-offset-8">House Etiquette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Logistics */}
          <div className="flex gap-5">
            <div className="shrink-0 w-10 h-10 rounded-full border border-stay-accent/30 flex items-center justify-center text-stay-accent">
              <Clock size={18} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stay-accent">Logistics</h3>
              <p className="text-[13px] leading-relaxed opacity-70">
                L'arrivée est prévue à partir de 15:00 et le départ doit impérativement être effectué avant 11:00.
              </p>
            </div>
          </div>

          {/* Occupants & accès */}
          <div className="flex gap-5">
            <div className="shrink-0 w-10 h-10 rounded-full border border-stay-accent/30 flex items-center justify-center text-stay-accent">
              <Users size={18} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stay-accent">Occupants & accès</h3>
              <p className="text-[13px] leading-relaxed opacity-70">
                Le logement est strictement réservé aux personnes mentionnées. Toute personne supplémentaire doit être déclarée à l'hôte.
              </p>
            </div>
          </div>

          {/* Responsabilité & Propreté */}
          <div className="flex gap-5">
            <div className="shrink-0 w-10 h-10 rounded-full border border-stay-accent/30 flex items-center justify-center text-stay-accent">
              <Sparkles size={18} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stay-accent">Responsabilité & Propreté</h3>
              <p className="text-[13px] leading-relaxed opacity-70">
                Prendre soin du logement et le restituer en bon état. Tout dommage causé devra être signalé immédiatement.
              </p>
            </div>
          </div>

          {/* Accès & conformité */}
          <div className="flex gap-5">
            <div className="shrink-0 w-10 h-10 rounded-full border border-stay-accent/30 flex items-center justify-center text-stay-accent">
              <ShieldCheck size={18} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stay-accent">Accès & conformité</h3>
              <p className="text-[13px] leading-relaxed opacity-70">
                Les clés sont confiées aux voyageurs ; leur perte entraîne des frais. Toute activité illégale entraînera l'annulation du séjour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation & Signature Section */}
      <section className="mt-auto flex flex-col gap-12">
        <div className="text-center max-w-xl mx-auto">
          <p className="font-serif text-lg italic leading-relaxed opacity-90 border-b border-stay-accent/10 pb-6 mb-6">
            Je confirme avoir pris connaissance du règlement intérieur et m'engage à le respecter durant mon séjour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
          <div className="border-b border-stay-accent/40 pb-3">
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2">Date of Arrival</p>
            <p className="font-serif text-lg leading-none">{booking.checkin}</p>
          </div>
          <div className="border-b border-stay-accent/40 pb-3">
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2">Estimated Arrival</p>
            <p className="font-serif text-lg leading-none">{booking.checkinHour || "—"}</p>
          </div>
          <div className="border-b border-stay-accent/40 pb-3 relative min-h-[60px] flex flex-col justify-end">
            <p className="text-[9px] uppercase tracking-widest opacity-40 mb-2 absolute top-0 left-0">Signature</p>
            {booking.signature ? (
              <img 
                src={booking.signature} 
                alt="Guest Signature" 
                className="h-16 w-auto object-contain pointer-events-none grayscale brightness-50" 
              />
            ) : (
              <div className="h-12 border-b border-stay-text/10 border-dashed" />
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-10 border-t border-stay-text/5 text-center">
        <p className="text-[9px] uppercase tracking-[0.3em] opacity-40">
          2026 {property.name || "Mamounia 08"} | Secure Digital Registration
        </p>
      </footer>
    </div>
  );
}
