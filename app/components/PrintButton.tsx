"use client";

import React, { useState } from 'react';
import { Printer, Download, Loader2 } from 'lucide-react';
import { generateAgreementPDF } from '@/lib/generate-pdf';

interface PrintButtonProps {
  mode?: 'print' | 'download';
  className?: string;
  guestName?: string;
}

export default function PrintButton({ 
  mode = 'print', 
  className = "", 
  guestName = "Guest" 
}: PrintButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAction = async () => {
    setIsGenerating(true);
    try {
      const filename = `Agreement_${guestName.replace(/\s+/g, '_')}.pdf`;
      await generateAgreementPDF('print-area', filename);
    } finally {
      setIsGenerating(false);
    }
  };

  const isDownload = mode === 'download';

  return (
    <button
      onClick={handleAction}
      disabled={isGenerating}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed ${
        isDownload 
          ? "bg-white text-[#1A1A1A] border border-[#1A1A1A]/10 hover:bg-gray-50" 
          : "bg-[#1A1A1A] text-white hover:bg-black"
      } ${className}`}
    >
      {isGenerating ? (
        <Loader2 size={18} className="animate-spin" />
      ) : isDownload ? (
        <Download size={18} />
      ) : (
        <Printer size={18} />
      )}
      {isGenerating ? "Processing..." : isDownload ? "Download PDF" : "Print Agreement"}
    </button>
  );
}

