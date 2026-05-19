import React, { useState, useRef, useEffect } from "react";
import StackedCardSlider, { SliderImage } from "./StackedCardSlider";
import { Volume2, VolumeX } from "lucide-react";

interface MediaHeaderPreviewProps {
  videoUrl: string | null;
  images: SliderImage[];
}

export default function MediaHeaderPreview({ videoUrl, images }: MediaHeaderPreviewProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Guarantee standard muted autoplay on initial load, then attempt unmuting if permitted by browser
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    setIsVideoLoading(true);
    video.muted = true;
    setIsMuted(true);

    // Standard HTML-driven autoplay starts muted. Programmatically trigger to guarantee activation.
    video.play()
      .then(() => {
        setIsVideoLoading(false);
        
        // Programmatic unmute attempt
        video.muted = false;
        video.play()
          .then(() => {
            setIsMuted(false);
          })
          .catch(() => {
            // Revert to muted if browser blocks unmuted sound
            video.muted = true;
            setIsMuted(true);
          });
      })
      .catch((error) => {
        console.warn("Autoplay programmatic initiation delayed:", error);
        setIsVideoLoading(false);
      });
  }, [videoUrl]);

  const toggleMute = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100/60 p-6 md:p-10 flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-16 w-full">
        
        {/* Left Column: Video Player */}
        <div 
          onClick={(e) => toggleMute(e)}
          className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg bg-[#1A1A1A] shrink-0 group cursor-pointer"
        >
          {videoUrl ? (
            <>
              {/* Premium Shimmer Loading Skeleton (only if we don't have a poster image to cover it) */}
              {isVideoLoading && (!images || images.length === 0) && (
                <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center z-20 animate-pulse">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/50">Loading Experience</p>
                </div>
              )}

              {/* Pulsing Tap for Sound Banner when muted */}
              {isMuted && !isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-colors z-10">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/75 border border-white/20 text-white font-sans text-xs tracking-wider uppercase font-semibold animate-pulse shadow-xl backdrop-blur-md transition-transform hover:scale-105">
                    <VolumeX size={14} className="animate-bounce" />
                    <span>Tap for Sound</span>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                src={videoUrl}
                poster={images && images.length > 0 ? images[0].url : undefined}
                className="w-full h-full object-cover"
                autoPlay
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                onCanPlay={() => setIsVideoLoading(false)}
              />
              
              {/* Premium Floating Sound Control */}
              <button
                type="button"
                onClick={(e) => toggleMute(e)}
                className="absolute bottom-4 right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all duration-300 z-10 hover:scale-105 shadow-md flex items-center justify-center"
                title={isMuted ? "Unmute sound" : "Mute sound"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </>
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

        {/* Right Column: Stacked Card Slider */}
        <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[360px] flex flex-col items-center justify-center md:justify-start shrink-0">
          <StackedCardSlider images={images} />
        </div>

      </div>
    </div>
  );
}
