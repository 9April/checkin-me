"use client";

import React, { useState } from "react";
import MediaDashboard from "@/app/components/media-slider/MediaDashboard";
import MediaHeaderPreview from "@/app/components/media-slider/MediaHeaderPreview";
import { SliderImage } from "@/app/components/media-slider/StackedCardSlider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MediaPreviewPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [images, setImages] = useState<SliderImage[]>([]);

  const handlePreview = (video: string | null, imgs: SliderImage[]) => {
    setVideoUrl(video);
    setImages(imgs);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1A1A1A] font-sans pb-20">
      {/* Top Nav */}
      <div className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-semibold">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="h-4 w-[1px] bg-gray-200 hidden sm:block"></div>
          <span className="font-serif text-xl italic hidden sm:block">Media Studio</span>
        </div>
        {showPreview && (
          <button 
            onClick={() => setShowPreview(false)}
            className="text-xs uppercase tracking-widest font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
          >
            Edit Configuration
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 mt-10">
        {!showPreview ? (
          <MediaDashboard onPreview={handlePreview} />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="mb-8 text-center">
              <h2 className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">Live Preview</h2>
              <p className="font-serif text-3xl">Header Component</p>
            </div>
            <MediaHeaderPreview videoUrl={videoUrl} images={images} />
          </div>
        )}
      </div>
    </div>
  );
}
