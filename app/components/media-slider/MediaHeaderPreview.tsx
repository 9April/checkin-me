"use client";

import React from "react";
import StackedCardSlider, { SliderImage } from "./StackedCardSlider";

interface MediaHeaderPreviewProps {
  videoUrl: string | null;
  images: SliderImage[];
}

export default function MediaHeaderPreview({ videoUrl, images }: MediaHeaderPreviewProps) {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row min-h-[800px]">
      
      {/* Left Column: Video Player */}
      <div className="w-full md:w-1/2 bg-[#FCFBF9] p-8 md:p-16 flex items-center justify-center relative">
        <div className="relative w-full max-w-[400px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-[#1A1A1A]">
          {videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full text-white/50">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                <rect x="3" y="6" width="12" height="12" rx="2" />
              </svg>
              <p className="font-sans text-sm tracking-widest uppercase text-center px-4">No Video Uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Stacked Card Slider */}
      <div className="w-full md:w-1/2 bg-[#FCFBF9] p-8 md:p-16 flex items-center justify-center relative">
        <StackedCardSlider images={images} />
      </div>

    </div>
  );
}
