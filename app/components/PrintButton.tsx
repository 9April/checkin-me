"use client";

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10"
    >
      <Printer size={18} />
      Print Agreement
    </button>
  );
}
