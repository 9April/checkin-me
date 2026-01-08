'use client';
import { useState, useRef, useEffect } from 'react';

interface CameraCaptureProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
  onCapture?: (file: File) => void;
}

export default function CameraCapture({
  name,
  required = false,
  disabled = false,
  onCapture,
}: CameraCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsStarting(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front-facing camera for selfie
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      
      // Set streaming state immediately to show the UI
      setIsStreaming(true);
      setIsStarting(false);
      
      // Wait a bit for the UI to render, then set video source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Ensure video plays immediately
          videoRef.current.play()
            .then(() => {
              // Video is playing
              if (videoRef.current) {
                videoRef.current.style.display = 'block';
                videoRef.current.style.visibility = 'visible';
              }
            })
            .catch((err) => {
              console.error('Error playing video:', err);
              setError('Failed to start camera preview. Please try again.');
              stopCamera();
            });
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(
        'Unable to access camera. Please check permissions or use the file upload option.'
      );
      setIsStreaming(false);
      setIsStarting(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    setIsStreaming(false);
    setIsStarting(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert canvas to blob and create File
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setPendingImage(imageUrl);
          setShowPreview(true);
          stopCamera();
        }
      },
      'image/jpeg',
      0.9
    );
  };

  const confirmPhoto = async () => {
    if (!pendingImage) return;

    try {
      // Convert the image URL back to a File
      const response = await fetch(pendingImage);
      const blob = await response.blob();
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      
      setCapturedImage(pendingImage);
      setShowPreview(false);
      setPendingImage(null);

      if (onCapture) {
        onCapture(file);
      }

      // Note: We don't set the file input directly anymore
      // The file is passed via onCapture callback and will be added to FormData in the form submission
    } catch (error) {
      console.error('Error confirming photo:', error);
      setError('Failed to process photo. Please try again.');
    }
  };

  const cancelPreview = () => {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage);
    }
    setPendingImage(null);
    setShowPreview(false);
    startCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      setShowPreview(false);
      setPendingImage(null);
      setError(null);
      
      if (onCapture) {
        onCapture(file);
      }
      
      // File is already set by the browser input, which is good for form submission
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        capture="user"
        required={required}
        disabled={disabled}
        onChange={handleFileUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {!capturedImage && !isStreaming && !showPreview && !isStarting && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disabled) {
                startCamera();
              }
            }}
            disabled={disabled}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Take Selfie with Camera
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disabled && fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            disabled={disabled}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Or Upload from Gallery
          </button>
        </div>
      )}

      {(isStreaming || isStarting) && !capturedImage && !showPreview && (
        <div 
          className="fixed inset-0 bg-black flex flex-col" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999
          }}
        >
          {isStarting && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Starting camera...</p>
              </div>
            </div>
          )}
          <div 
            className="flex-1 flex items-center justify-center relative"
            style={{ 
              width: '100%', 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              flex: 1
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
                backgroundColor: '#000',
                zIndex: 1
              }}
            />
            <div 
              className="absolute inset-0 border-8 border-white pointer-events-none" 
              style={{ zIndex: 10 }}
            />
            <div 
              className="absolute top-4 left-4 right-4 flex justify-between items-center"
              style={{ zIndex: 20 }}
            >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopCamera();
              }}
              className="p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors backdrop-blur-sm cursor-pointer"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div 
            className="bg-black p-6 pb-8"
            style={{ 
              position: 'relative',
              zIndex: 20,
              width: '100%'
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                capturePhoto();
              }}
              className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full"></div>
            </button>
            <p className="text-white text-center mt-4 text-sm">Tap to capture</p>
          </div>
        </div>
      )}

      {/* Confirmation Preview Popup */}
      {showPreview && pendingImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Your Selfie</h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  cancelPreview();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex items-center justify-center p-6 bg-gray-100">
              <img
                src={pendingImage}
                alt="Preview"
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                style={{ transform: 'scaleX(-1)' }} // Mirror effect for selfie
              />
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  cancelPreview();
                }}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
              >
                Retake
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  confirmPhoto();
                }}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Confirm & Use This Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="space-y-3">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={capturedImage}
              alt="Captured selfie"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                retakePhoto();
              }}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Change Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

