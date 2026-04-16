"use client";

import React from 'react';
import { 
  Clock, 
  Volume2, 
  Flame, 
  Leaf, 
  ShieldCheck, 
  Users, 
  NoSmoking, 
  Music,
  MoveHorizontal
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

export default function LuxuryAgreement({ property, booking, rules }: LuxuryAgreementProps) {
  const accentColor = "#A8987E";
  const textColor = "#1A1A1A";
  const bgColor = "#FCFBF9";

  return (
    <div className="a4-container bg-stay-bg text-stay-text font-sans selection:bg-stay-accent selection:text-white">
      {/* Header */}
      <header className="pt-12 pb-16 text-center">
        <h1 className="font-serif text-5xl tracking-[0.3em] uppercase mb-4 text-stay-text">
          {property.name || "MAMOUNIA 08"}
        </h1>
        <p className="font-sans text-xs tracking-[0.4em] uppercase opacity-60 text-stay-accent">
          Guest Stay Agreement
        </p>
      </header>

      {/* Information Bar */}
      <section className="border-t border-b border-stay-accent/20 py-8 mb-16">
        <div className="grid grid-cols-3 divide-x divide-stay-accent/20">
          <div className="px-6 text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Guest Name</p>
            <p className="font-serif text-lg">{booking.guestName}</p>
          </div>
          <div className="px-6 text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Email Address</p>
            <p className="font-serif text-lg">{booking.guestEmail}</p>
          </div>
          <div className="px-6 text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Stay Period</p>
            <p className="font-serif text-lg">
              {booking.checkin} — {booking.checkout}
            </p>
          </div>
        </div>
      </section>

      {/* The Rules */}
      <section className="mb-20">
        <h2 className="font-serif text-2xl mb-10 text-center italic opacity-80">House Etiquette & Rules</h2>
        <div className="grid grid-cols-2 gap-x-16 gap-y-12">
          {/* Logistics */}
          <div className="flex gap-6">
            <div className="shrink-0 w-10 h-10 rounded-full border border-stay-accent/30 flex items-center justify-center text-stay-accent">
              <Clock size={18} />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-3">Logistics</h3>
              <p className="text-sm leading-relaxed opacity-70">
                Check-in 15:00 / Check-out 11:00. Access is strictly limited to registered guests only to ensure security and privacy.
              </p>
            </div>
          </div>

          {/* Conduct */}
          <div className="flex gap-6">
            <div className="shrink-0 w-10 h-10 rounded-full border border-stay-accent/30 flex items-center justify-center text-stay-accent">
              <Volume2 size={18} />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-3">Conduct</h3>
              <p className="text-sm leading-relaxed opacity-70">
                Quiet hours 22:00–08:00. Strictly non-smoking (balconies only). No parties, events, or unauthorized gatherings.
              </p>
            </div>
          </div>

          {/* Safety */}
          <div className="flex gap-6">
            <div className="shrink-0 w-10 h-10 rounded-full border border-stay-accent/30 flex items-center justify-center text-stay-accent">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-3">Safety</h3>
              <p className="text-sm leading-relaxed opacity-70">
                Fireplace is decorative. No candles or incense. Do not disable or tamper with smoke and carbon monoxide detectors.
              </p>
            </div>
          </div>

          {/* Care */}
          <div className="flex gap-6">
            <div className="shrink-0 w-10 h-10 rounded-full border border-stay-accent/30 flex items-center justify-center text-stay-accent">
              <Leaf size={18} />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-3">Care</h3>
              <p className="text-sm leading-relaxed opacity-70">
                Please do not move furniture. We promote eco-responsibility: kindly turn off lights and AC when leaving the property.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Confirmation */}
      <section className="mb-20 text-center max-w-xl mx-auto">
        <blockquote className="font-serif text-xl italic leading-relaxed opacity-90 border-l-0 pl-0 relative">
          <span className="absolute -left-8 -top-4 text-6xl text-stay-accent/20 font-serif">"</span>
          I confirm that I have read the house rules and I agree to respect them entirely during my stay.
          <span className="absolute -right-8 -bottom-8 text-6xl text-stay-accent/20 font-serif">"</span>
        </blockquote>
      </section>

      {/* Signature Section */}
      <section className="grid grid-cols-3 gap-12 mt-auto">
        <div className="border-b border-stay-accent/40 pb-2">
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Date of Arrival</p>
          <p className="font-serif">{booking.checkin}</p>
        </div>
        <div className="border-b border-stay-accent/40 pb-2">
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Estimated Arrival</p>
          <p className="font-serif">{booking.checkinHour || "—"}</p>
        </div>
        <div className="border-b border-stay-accent/40 pb-2 relative min-h-[60px]">
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Signature</p>
          {booking.signature ? (
            <img 
              src={booking.signature} 
              alt="Guest Signature" 
              className="absolute bottom-0 left-0 h-16 object-contain pointer-events-none grayscale brightness-50" 
            />
          ) : (
            <div className="h-12" />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-12 left-20 right-20 text-center py-8 border-t border-stay-accent/10">
        <p className="text-[9px] uppercase tracking-[0.3em] opacity-40">
          2026 {property.name || "Mamounia 08"} | Secure Digital Registration
        </p>
      </footer>
    </div>
  );
}
