"use client";

import React from 'react';
import { Printer, Download } from 'lucide-react';

interface PrintButtonProps {
  mode?: 'print' | 'download';
  className?: string;
}

export default function PrintButton({ mode = 'print', className = "" }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  const isDownload = mode === 'download';

  return (
    <button
      onClick={handlePrint}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-black/10 ${
        isDownload 
          ? "bg-white text-[#1A1A1A] border border-[#1A1A1A]/10 hover:bg-gray-50" 
          : "bg-[#1A1A1A] text-white hover:bg-black"
      } ${className}`}
    >
      {isDownload ? <Download size={18} /> : <Printer size={18} />}
      {isDownload ? "Download PDF" : "Print Agreement"}
    </button>
  );
}
