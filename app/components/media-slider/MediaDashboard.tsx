"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Trash2, Image as ImageIcon, Video, X } from "lucide-react";
import { SliderImage } from "./StackedCardSlider";
import { saveMediaStudio } from "@/app/media-actions";

interface MediaDashboardProps {
  propertyId: string;
  initialVideoUrl?: string | null;
  initialImages?: { url: string; id: string; name: string; role: string }[];
  onPreview: (videoUrl: string | null, images: SliderImage[]) => void;
  triggerSave?: number;
  onSaveComplete?: () => void;
}

export default function MediaDashboard({ propertyId, initialVideoUrl, initialImages, onPreview, triggerSave, onSaveComplete }: MediaDashboardProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl || null);
  
  const [images, setImages] = useState<{ file?: File; url: string; id: string; name: string; role: string }[]>(initialImages || []);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Load text data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem("mediaSliderMetadata");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // We cannot restore Files from localStorage, only the text data
        // For a full persistence, IndexedDB would be required.
        console.log("Found saved metadata:", parsed);
      } catch (e) {
        console.error("Failed to parse metadata", e);
      }
    }
  }, []);

  // Save metadata to localStorage when images change
  useEffect(() => {
    const metadataToSave = images.map(img => ({ id: img.id, name: img.name, role: img.role }));
    localStorage.setItem("mediaSliderMetadata", JSON.stringify(metadataToSave));
  }, [images]);

  // Listen for save triggers from parent
  useEffect(() => {
    if (triggerSave && triggerSave > 0) {
      handleSave();
    }
  }, [triggerSave]);

  // Video Handlers
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Limit to 20MB (Next.js serverActions bodySizeLimit is 20MB)
      if (file.size > 20 * 1024 * 1024) {
        alert("Video size must be less than 20MB to be successfully processed.");
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoUrl(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  // Image Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>, filesToUpload?: FileList) => {
    let files = filesToUpload;
    if (!files && "target" in e && (e.target as HTMLInputElement).files) {
      files = (e.target as HTMLInputElement).files as FileList;
    }

    if (files) {
      const validFiles = Array.from(files).filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`Image "${file.name}" is too large. Each image must be under 5MB.`);
          return false;
        }
        return true;
      });

      const newImages = validFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(7),
        name: "",
        role: ""
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const updateImageMetadata = (id: string, field: "name" | "role", value: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, [field]: value } : img));
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e, e.dataTransfer.files);
    }
  };

  const handleGeneratePreview = () => {
    onPreview(videoUrl, images.map(img => ({ id: img.id, url: img.url, name: img.name, role: img.role })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("propertyId", propertyId);
      
      if (videoFile) {
        formData.append("videoFile", videoFile);
      }
      
      formData.append("imagesCount", images.length.toString());
      images.forEach((img, i) => {
        if (img.file) formData.append(`image_${i}_file`, img.file);
        if (img.url && !img.file) formData.append(`image_${i}_url`, img.url); // Use existing URL if no new file
        formData.append(`image_${i}_name`, img.name);
        formData.append(`image_${i}_role`, img.role);
      });

      const res = await saveMediaStudio(formData);
      if (res.success) {
        alert("Media saved successfully and is now visible on your Check-in Form!");
        if (onSaveComplete) onSaveComplete();
      } else {
        throw new Error(res.error);
      }
    } catch (e: any) {
      alert(`Failed to save: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-2">Media Configuration</h1>
        <p className="text-gray-500">Upload your portrait video and images to generate the slider.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Video Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium flex items-center gap-2 border-b pb-2">
            <Video size={18} /> Portrait Video
          </h2>
          
          {!videoUrl ? (
            <div 
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <UploadCloud className="text-gray-400 mb-3" size={32} />
              <p className="text-sm font-medium">Click to upload video</p>
              <p className="text-xs text-gray-400 mt-1">MP4, WebM, MOV (9:16)</p>
              <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" ref={videoInputRef} onChange={handleVideoUpload} />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden h-64 bg-black border border-gray-200 group">
              <video src={videoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" autoPlay loop muted />
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={removeVideo} className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                {videoFile?.name} ({(videoFile?.size! / (1024 * 1024)).toFixed(2)} MB)
              </div>
            </div>
          )}
        </div>

        {/* Image Upload Zone */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium flex items-center gap-2 border-b pb-2">
            <ImageIcon size={18} /> Portrait Images
          </h2>
          
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <UploadCloud className="text-gray-400 mb-3" size={32} />
            <p className="text-sm font-medium">Drag & drop images here</p>
            <p className="text-xs text-gray-400 mt-1">or click to browse (JPG, PNG, WebP)</p>
            <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>
        </div>
      </div>

      {/* Image Data Input Section */}
      {images.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              Image Data ({images.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50 flex flex-col gap-3 relative group shadow-sm">
                <button onClick={() => removeImage(img.id)} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm">
                  <X size={14} />
                </button>
                <div className="h-40 w-full rounded-lg overflow-hidden bg-gray-200">
                  <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-2">
                  <input 
                    type="text" 
                    placeholder="Name (e.g. John Doe)" 
                    value={img.name}
                    onChange={(e) => updateImageMetadata(img.id, "name", e.target.value)}
                    className="w-full text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input 
                    type="text" 
                    placeholder="Role (e.g. Host)" 
                    value={img.role}
                    onChange={(e) => updateImageMetadata(img.id, "role", e.target.value)}
                    className="w-full text-sm p-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <span className="text-[10px] text-gray-400 font-mono mt-1">
                    {img.file ? `${(img.file.size / 1024).toFixed(0)} KB` : "Saved to Cloud"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
        <button 
          onClick={handleGeneratePreview}
          disabled={(!videoUrl && images.length === 0) || isSaving}
          className="bg-gray-100 text-gray-800 border border-gray-200 px-8 py-3 rounded-md font-medium text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Preview
        </button>
        <button 
          onClick={handleSave}
          disabled={(!videoUrl && images.length === 0) || isSaving}
          className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-md font-medium text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
          {isSaving ? "Saving..." : "Save to Form"}
        </button>
      </div>
    </div>
  );
}
