'use client';
import { useState, useRef } from 'react';

interface CameraCaptureProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
  onCapture?: (file: File) => void;
  mode?: 'user' | 'environment';
  guide?: 'face' | 'document';
  lang?: string;
  labels: {
    takeSelfie: string;
    takeDocument: string;
    uploadFromDevice: string;
    confirmPhoto: string;
    retake: string;
    usePhoto: string;
    successfullyCaptured: string;
  };
}

export default function CameraCapture({
  name,
  required = false,
  disabled = false,
  onCapture,
  mode = 'user',
  guide = 'face',
  lang = 'EN',
  labels,
}: CameraCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCamera = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || !fileInputRef.current) return;
    
    // Set capture attribute to open native camera
    fileInputRef.current.setAttribute('capture', mode === 'user' ? 'user' : 'environment');
    fileInputRef.current.click();
  };

  const openGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || !fileInputRef.current) return;
    
    // Remove capture attribute to open gallery
    fileInputRef.current.removeAttribute('capture');
    fileInputRef.current.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPendingImage(imageUrl);
      setShowPreview(true);
      setError(null);
    }
  };

  const confirmPhoto = async () => {
    if (!pendingImage || !fileInputRef.current?.files?.[0]) return;
    
    const file = fileInputRef.current.files[0];
    setCapturedImage(pendingImage);
    setShowPreview(false);
    setPendingImage(null);

    if (onCapture) {
      onCapture(file);
    }
  };

  const cancelPreview = () => {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage);
    }
    setPendingImage(null);
    setShowPreview(false);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        disabled={disabled}
        onChange={handleFileUpload}
        className="hidden"
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {!capturedImage && !showPreview && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={openCamera}
            disabled={disabled}
            className="w-full py-4 px-6 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <span className="text-lg tracking-wide uppercase">
                {mode === 'user' ? labels.takeSelfie : labels.takeDocument}
            </span>
          </button>
          
          <button
            type="button"
            onClick={openGallery}
            disabled={disabled}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50 text-sm tracking-widest uppercase border border-gray-200"
          >
            {labels.uploadFromDevice}
          </button>
        </div>
      )}

      {/* Confirmation Preview Popup */}
      {showPreview && pendingImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-widest">{labels.confirmPhoto}</h3>
              <button
                type="button"
                onClick={cancelPreview}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-gray-100/50">
              <img
                src={pendingImage}
                alt="Capture Preview"
                className="max-w-full max-h-[55vh] object-contain rounded-2xl shadow-2xl border-4 border-white"
              />
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50/50">
              <button
                type="button"
                onClick={cancelPreview}
                className="flex-1 py-4 px-6 bg-white hover:bg-gray-50 text-gray-600 font-bold rounded-2xl transition-all border-2 border-gray-200 active:scale-95 uppercase tracking-widest text-xs"
              >
                {labels.retake}
              </button>
              <button
                type="button"
                onClick={confirmPhoto}
                className="flex-1 py-4 px-6 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold rounded-lg transition-all shadow-md active:scale-95 uppercase tracking-widest text-xs"
              >
                {labels.usePhoto}
              </button>
            </div>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 space-y-4 shadow-inner">
          <div className="relative group aspect-[3/4] max-h-[300px] overflow-hidden rounded-xl border-4 border-white shadow-lg mx-auto w-fit">
            <img
              src={capturedImage}
              alt="Captured result"
              className="max-h-full w-auto object-contain"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-2">
                <span className="text-white text-xs font-bold uppercase tracking-widest">{labels.successfullyCaptured}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={retakePhoto}
              className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all border border-gray-200 text-xs tracking-widest uppercase active:scale-95"
            >
              {labels.retake} / Change 
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
