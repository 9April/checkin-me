'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

export type DocumentCaptureVariant = 'passport' | 'idFront' | 'idBack';

interface CameraCaptureProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
  onCapture?: (file: File) => void;
  mode?: 'user' | 'environment';
  guide?: 'face' | 'document';
  documentVariant?: DocumentCaptureVariant;
  documentHint?: string;
  guideTitle?: string;
  frameCenterLabel?: string;
  hasError?: boolean;
  className?: string;
  lang?: string;
  labels: {
    takeSelfie: string;
    takeDocument: string;
    uploadFromDevice: string;
    confirmPhoto: string;
    retake: string;
    usePhoto: string;
    successfullyCaptured: string;
    /** Used to close the live camera sheet */
    close: string;
  };
}

/** Full-screen live view: dimmed outside frame + white border + corner brackets. */
function DocumentLiveGuides({
  variant,
  frameLabel,
}: {
  variant: DocumentCaptureVariant;
  frameLabel?: string;
}) {
  const isPassport = variant === 'passport';
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-3">
      <div
        className={`relative rounded-xl border-[3px] border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.62)] ${
          isPassport
            ? 'aspect-[3/4] w-[min(78vw,300px)]'
            : 'aspect-[1.586/1] w-[min(92vw,360px)]'
        }`}
      >
        <span className="absolute -left-0.5 -top-0.5 h-7 w-7 rounded-tl-lg border-l-[3px] border-t-[3px] border-white shadow-sm" />
        <span className="absolute -right-0.5 -top-0.5 h-7 w-7 rounded-tr-lg border-r-[3px] border-t-[3px] border-white shadow-sm" />
        <span className="absolute -bottom-0.5 -left-0.5 h-7 w-7 rounded-bl-lg border-b-[3px] border-l-[3px] border-white shadow-sm" />
        <span className="absolute -bottom-0.5 -right-0.5 h-7 w-7 rounded-br-lg border-b-[3px] border-r-[3px] border-white shadow-sm" />
        {frameLabel && (
          <div className="absolute -bottom-11 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
            {frameLabel}
          </div>
        )}
      </div>
    </div>
  );
}

/** Compact preview before opening camera (no huge box-shadow — parent is small). */
function StaticDocumentGuides({
  variant,
  children,
}: {
  variant: DocumentCaptureVariant;
  children: React.ReactNode;
}) {
  const isPassport = variant === 'passport';
  return (
    <div
      className={`relative mx-auto flex items-center justify-center rounded-xl bg-white/90 shadow-inner ring-2 ring-[#FF385C]/30 ${
        isPassport
          ? 'aspect-[3/4] max-h-[140px] w-[min(100%,200px)]'
          : 'aspect-[1.586/1] max-h-[120px] w-[min(100%,220px)]'
      }`}
    >
      <div className="absolute inset-2 rounded-lg border-2 border-dashed border-[#FF385C]/80" />
      <span className="absolute left-2 top-2 h-5 w-5 rounded-tl-md border-l-[3px] border-t-[3px] border-[#FF385C]" />
      <span className="absolute right-2 top-2 h-5 w-5 rounded-tr-md border-r-[3px] border-t-[3px] border-[#FF385C]" />
      <span className="absolute bottom-2 left-2 h-5 w-5 rounded-bl-md border-b-[3px] border-l-[3px] border-[#FF385C]" />
      <span className="absolute bottom-2 right-2 h-5 w-5 rounded-br-md border-b-[3px] border-r-[3px] border-[#FF385C]" />
      <div className="relative z-[1] flex items-center justify-center px-2 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default function CameraCapture({
  name,
  disabled = false,
  onCapture,
  mode,
  guide = 'face',
  documentVariant,
  documentHint,
  guideTitle,
  frameCenterLabel,
  hasError = false,
  className = '',
  labels,
}: CameraCaptureProps) {
  const resolvedMode: 'user' | 'environment' =
    mode ?? (guide === 'document' ? 'environment' : 'user');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liveOpen, setLiveOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  useEffect(() => {
    if (!liveOpen || !videoRef.current || !streamRef.current) return;
    const v = videoRef.current;
    v.srcObject = streamRef.current;
    v.setAttribute('playsinline', '');
    v.play().catch(() => {});
  }, [liveOpen]);

  const assignFileToInput = (file: File) => {
    const input = fileInputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
  };

  const openNativePicker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || !fileInputRef.current) return;
    fileInputRef.current.setAttribute(
      'capture',
      resolvedMode === 'user' ? 'user' : 'environment'
    );
    fileInputRef.current.click();
  };

  const openLiveDocumentCamera = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      openNativePicker(e);
      return;
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setLiveOpen(true);
    } catch {
      openNativePicker(e);
    }
  };

  const closeLive = () => {
    setLiveOpen(false);
    stopStream();
  };

  const captureLiveFrame = () => {
    const v = videoRef.current;
    if (!v || v.readyState < 2) return;
    const w = v.videoWidth;
    const h = v.videoHeight;
    if (!w || !h) return;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `document-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });
        assignFileToInput(file);
        const imageUrl = URL.createObjectURL(blob);
        setPendingImage(imageUrl);
        setShowPreview(true);
        closeLive();
        setError(null);
      },
      'image/jpeg',
      0.92
    );
  };

  const openCamera = (e: React.MouseEvent) => {
    if (guide === 'document' && documentVariant) {
      void openLiveDocumentCamera(e);
      return;
    }
    openNativePicker(e);
  };

  const openGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || !fileInputRef.current) return;
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

  const centerLabel =
    frameCenterLabel ??
    (documentVariant === 'passport'
      ? 'PASSPORT'
      : documentVariant === 'idBack'
        ? 'BACK'
        : 'FRONT');

  return (
    <div
      className={`space-y-3 rounded-xl p-1 -m-1 transition-colors ${
        hasError ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-[#F7F7F7]' : ''
      } ${className}`}
    >
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

      {liveOpen && guide === 'document' && documentVariant && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            muted
            autoPlay
          />
          <DocumentLiveGuides
            variant={documentVariant}
            frameLabel={frameCenterLabel}
          />
          <div className="relative z-10 mt-auto flex gap-3 border-t border-white/10 bg-black/55 px-4 py-4 pb-safe backdrop-blur-md">
            <button
              type="button"
              onClick={closeLive}
              className="shrink-0 rounded-xl border border-white/35 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white"
            >
              {labels.close}
            </button>
            <button
              type="button"
              onClick={captureLiveFrame}
              className="min-w-0 flex-1 rounded-xl bg-[#FF385C] px-4 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg"
            >
              {labels.takeDocument}
            </button>
          </div>
        </div>
      )}

      {!capturedImage && !showPreview && (
        <div className="space-y-3">
          {guide === 'document' && documentVariant && (
            <div className="rounded-2xl border-2 border-dashed border-[#FF385C]/40 bg-[#FFF5F6] p-4 space-y-2">
              {guideTitle && (
                <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#FF385C]">
                  {guideTitle}
                </p>
              )}
              <StaticDocumentGuides variant={documentVariant}>
                {documentVariant === 'passport' ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#717171] text-center leading-tight">
                    {centerLabel}
                  </span>
                ) : frameCenterLabel ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#717171] text-center">
                    {frameCenterLabel}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#717171]">
                    {documentVariant === 'idBack' ? '◀ ▶' : '▶ ◀'}
                  </span>
                )}
              </StaticDocumentGuides>
              {documentHint && (
                <p className="text-center text-xs font-semibold text-[#222222] leading-snug px-1">
                  {documentHint}
                </p>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={openCamera}
            disabled={disabled}
            className="w-full py-4 px-6 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-lg tracking-wide uppercase">
              {resolvedMode === 'user' ? labels.takeSelfie : labels.takeDocument}
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

      {showPreview && pendingImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-widest">
                {labels.confirmPhoto}
              </h3>
              <button
                type="button"
                onClick={cancelPreview}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label={labels.close}
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
              <span className="text-white text-xs font-bold uppercase tracking-widest">
                {labels.successfullyCaptured}
              </span>
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
