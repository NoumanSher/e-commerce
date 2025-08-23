"use client";

import React, { useState, useRef } from "react";
import { X, UploadCloud } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesChange }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    // Append new files to existing ones
    const updatedFiles = [...files, ...validFiles].slice(0, 5); // Limit to 5 files
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="w-full">
      {/* Upload Box */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-gray-500">images to upload</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <Image
                src={url}
                height={96}
                width={96}
                alt={`Preview ${index}`}
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
