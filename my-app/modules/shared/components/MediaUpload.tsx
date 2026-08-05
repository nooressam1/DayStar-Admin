"use client";

import React, { useRef } from "react";

export interface MediaUploadProps {
  label?: string;
  value?: string | string[];
  images?: string[];
  onChange?: (value: any) => void;
  onImagesChange?: (images: string[]) => void;
  onAddImage?: (url: string) => void;
  onRemoveImage?: (index: number) => void;
  title?: string;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  helperText?: string;
  layout?: "card" | "dropzone" | "compact";
  className?: string;
}

export function MediaUpload({
  label: labelProp = "Upload Media",
  title,
  value,
  images: imagesProp,
  onChange,
  onImagesChange,
  onAddImage,
  onRemoveImage,
  multiple = false,
  maxFiles = 3,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  helperText = "SVG, PNG, JPG or GIF (max. 800×400px)",
  layout = "card",
  className = "",
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const label = title || labelProp;
  const effectiveValue = imagesProp !== undefined ? imagesProp : value;

  // Normalize images to array
  const images: string[] = Array.isArray(effectiveValue)
    ? effectiveValue
    : effectiveValue
    ? [effectiveValue]
    : [];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const limit = multiple ? maxFiles : 1;
    const remainingSlots = limit - images.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const newUrls: string[] = filesToProcess.map((file) => URL.createObjectURL(file));

    if (multiple) {
      const updated = [...images, ...newUrls];
      if (onAddImage) {
        newUrls.forEach((url) => onAddImage(url));
      } else if (onImagesChange) {
        onImagesChange(updated);
      } else if (onChange) {
        onChange(updated);
      }
    } else {
      const singleUrl = newUrls[0];
      if (onAddImage) {
        onAddImage(singleUrl);
      } else if (onImagesChange) {
        onImagesChange([singleUrl]);
      } else if (onChange) {
        onChange(singleUrl);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemove = (index: number) => {
    const filtered = images.filter((_, i) => i !== index);
    if (onRemoveImage) {
      onRemoveImage(index);
    } else if (onImagesChange) {
      onImagesChange(filtered);
    } else if (onChange) {
      if (multiple) {
        onChange(filtered);
      } else {
        onChange("");
      }
    }
  };

  const isMaxReached = multiple && maxFiles ? images.length >= maxFiles : false;

  // Compact layout (e.g. single avatar / thumbnail upload box)
  if (layout === "compact") {
    const previewUrl = images[0] || "";
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-[#D1C7BD] hover:border-[#004D5A] bg-[#FAF6F4]/40 hover:bg-[#FAF6F4] rounded-2xl p-4 transition-colors cursor-pointer flex items-center gap-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept={accept}
            multiple={multiple}
            className="hidden"
          />

          {previewUrl ? (
            <div className="w-16 h-16 rounded-xl border border-[#E9E3DE] overflow-hidden relative group shrink-0">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(0);
                }}
                className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#FDF6F3] border border-[#E9E3DE] flex items-center justify-center shrink-0 text-[#8A756C]">
              <svg
                className="w-7 h-7 text-[#7A6860]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold text-[#583F37]">
              {previewUrl ? "Change Image" : "Upload Image"}
            </h4>
            <p className="text-xs text-[#8A756C] mt-0.5">{helperText}</p>
            <p className="text-xs font-semibold text-[#004D5A] hover:underline mt-1">
              Click to browse or drag & drop
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Standard Card / Dropzone layout
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        {label && <h2 className="text-base font-bold text-[#583F37]">{label}</h2>}
        {multiple && maxFiles && (
          <span className="text-xs font-semibold text-[#8A756C] bg-[#FAF6F4] px-2.5 py-1 rounded-full border border-[#E9E3DE]">
            {images.length} / {maxFiles} images
          </span>
        )}
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => !isMaxReached && fileInputRef.current?.click()}
        onDrop={(e) => {
          if (isMaxReached) {
            e.preventDefault();
            return;
          }
          handleDrop(e);
        }}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors flex flex-col items-center justify-center gap-2 ${
          isMaxReached
            ? "border-[#E9E3DE] bg-[#FAF6F4]/20 cursor-not-allowed opacity-75"
            : "border-[#D1C7BD] hover:border-[#004D5A] bg-[#FAF6F4]/40 hover:bg-[#FAF6F4] cursor-pointer"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept={accept}
          multiple={multiple}
          disabled={isMaxReached}
          className="hidden"
        />
        <div
          className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xs mb-1 ${
            isMaxReached ? "bg-[#8A756C]" : "bg-[#004D5A]"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#583F37]">
          {isMaxReached
            ? `Maximum ${maxFiles} images reached`
            : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-[#8A756C]">
          {isMaxReached ? "Remove an image to upload a new one" : helperText}
        </p>
      </div>

      {/* Media Thumbnails Strip */}
      {images.length > 0 && (
        <div className="flex items-center gap-3 pt-2 flex-wrap">
          {multiple && (!maxFiles || images.length < maxFiles) && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-xl border border-dashed border-[#D1C7BD] hover:border-[#004D5A] bg-[#FAF5F2] flex items-center justify-center text-[#7A6860] hover:text-[#583F37] cursor-pointer text-xl font-bold transition-colors"
            >
              +
            </button>
          )}
          {images.map((img, idx) => (
            <div
              key={idx}
              className="w-16 h-16 rounded-xl border border-[#E9E3DE] overflow-hidden relative group shrink-0"
            >
              <img
                src={img}
                alt={`Media preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MediaUpload;

