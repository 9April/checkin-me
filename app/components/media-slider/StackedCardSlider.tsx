"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SliderImage {
  id: string;
  url: string;
  name: string;
  role: string;
}

interface StackedCardSliderProps {
  images: SliderImage[];
}

export default function StackedCardSlider({ images }: StackedCardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#f6f7fb] rounded-2xl border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">No images uploaded</p>
      </div>
    );
  }

  // Calculate visible indices
  const getVisibleIndices = () => {
    const count = images.length;
    if (count === 1) return [currentIndex];
    if (count === 2) return [currentIndex, (currentIndex + 1) % count];
    return [
      currentIndex,
      (currentIndex + 1) % count,
      (currentIndex + 2) % count,
    ];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center md:justify-start overflow-visible">
      {/* Cards Container */}
      <div className="relative w-full max-w-[400px] aspect-[9/16] perspective-1000">
        {/* Render cards from back to front to handle z-index naturally */}
        {[...visibleIndices].reverse().map((imageIndex, reverseIdx) => {
          const image = images[imageIndex];
          // reverseIdx: 0 is back, 1 is middle, 2 is front (if 3 items)
          // position: 0 is front, 1 is middle, 2 is back
          const position = visibleIndices.length - 1 - reverseIdx;
          
          let scale = 1;
          let translateY = 0;
          let opacity = 1;
          let zIndex = 30 - position * 10;

          if (position === 1) {
            scale = 0.96;
            translateY = 12;
            opacity = 0.8;
          } else if (position === 2) {
            scale = 0.92;
            translateY = 24;
            opacity = 0.6;
          } else if (position > 2) {
            // Hide cards beyond the 3rd
            scale = 0.8;
            translateY = 40;
            opacity = 0;
          }

          return (
            <div
              key={`${image.id}-${position}`}
              className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-xl select-none"
              style={{
                zIndex,
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundImage: `url(${image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-500">
                <h3 className="font-serif text-3xl font-medium mb-1 drop-shadow-md">
                  {image.name || "Unnamed"}
                </h3>
                <p className="font-sans text-sm tracking-widest uppercase opacity-80 drop-shadow-md">
                  {image.role || "No Role"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-12 z-40">
        <button
          onClick={handlePrev}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white border border-gray-200 hover:border-gray-300 shadow-sm text-gray-600 hover:text-black transition-all hover:scale-105"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        
        <span className="font-mono text-sm tracking-widest text-gray-500">
          {currentIndex + 1} / {images.length}
        </span>
        
        <button
          onClick={handleNext}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white border border-gray-200 hover:border-gray-300 shadow-sm text-gray-600 hover:text-black transition-all hover:scale-105"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
