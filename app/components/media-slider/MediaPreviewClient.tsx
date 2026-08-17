"use client";

import React, { useState } from "react";
import MediaDashboard from "./MediaDashboard";
import MediaHeaderPreview from "./MediaHeaderPreview";
import { SliderImage } from "./StackedCardSlider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MediaPreviewClientProps {
  propertyId: string;
  propertyName: string;
  initialVideoUrl: string | null;
  initialImages: { url: string; id: string; name: string; role: string }[];
}

export default function MediaPreviewClient({ propertyId, propertyName, initialVideoUrl, initialImages }: MediaPreviewClientProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl);
  const [images, setImages] = useState<{ file?: File; url: string; id: string; name: string; role: string }[]>(
    initialImages.map(img => ({ url: img.url, id: img.id, name: img.name, role: img.role }))
  );
  const [triggerSave, setTriggerSave] = useState(0);

  const handlePreview = () => {
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
          <span className="font-serif text-xl italic hidden sm:block">Media Studio : {propertyName}</span>
        </div>
        {showPreview && (
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPreview(false)}
              className="text-xs uppercase tracking-widest font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
            >
              Back to Edit
            </button>
            <button 
              onClick={() => setTriggerSave(t => t + 1)}
              className="text-xs uppercase tracking-widest font-semibold bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              Save to Form
            </button>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 mt-10">
        <div className={showPreview ? "hidden" : "block"}>
          <MediaDashboard 
            propertyId={propertyId} 
            videoFile={videoFile}
            setVideoFile={setVideoFile}
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
            images={images}
            setImages={setImages}
            onPreview={handlePreview} 
            triggerSave={triggerSave}
            onSaveComplete={() => setShowPreview(false)}
          />
        </div>
        
        {showPreview && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="mb-8 text-center">
              <h2 className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">Live Preview</h2>
              <p className="font-serif text-3xl">Header Component</p>
            </div>
            <MediaHeaderPreview 
              videoUrl={videoUrl} 
              images={images.map(img => ({ id: img.id, url: img.url, name: img.name, role: img.role }))} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
