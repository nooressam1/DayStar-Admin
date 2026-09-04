"use client";

import React from "react";
import { useMediaUpload, UseMediaUploadOptions } from "../hooks/useMediaUpload";

export interface MediaUploadProps extends UseMediaUploadOptions {
  label?: string;
  title?: string;
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
  bucketName = "products",
  maxFileSizeMb = 10,
}: MediaUploadProps) {
  const {
    fileInputRef,
    images,
    isUploading,
    isDragging,
    pendingPreviews,
    uploadError,
    isMaxReached,
    handleInputChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleRemove,
    openFilePicker,
  } = useMediaUpload({
    value,
    images: imagesProp,
    multiple,
    maxFiles,
    bucketName,
    maxFileSizeMb,
    onChange,
    onImagesChange,
    onAddImage,
    onRemoveImage,
  });

  const label = title || labelProp;

  // Compact layout (e.g. single avatar / thumbnail upload box)
  if (layout === "compact") {
    const previewUrl = images[0] || pendingPreviews[0] || "";
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-xs font-bold text-[#6E4B42] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div
          onClick={openFilePicker}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-4 ${
            isDragging
              ? "border-[#004D5A] bg-[#004D5A]/10 scale-[1.01] shadow-sm"
              : "border-[#D1C7BD] hover:border-[#004D5A] bg-[#FAF6F4]/40 hover:bg-[#FAF6F4]"
          } ${isUploading ? "opacity-60 cursor-wait" : ""}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept={accept}
            multiple={multiple}
            disabled={isUploading}
            className="hidden"
          />

          {previewUrl ? (
            <div className="w-16 h-16 rounded-xl border border-[#E9E3DE] overflow-hidden relative group shrink-0">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              {isUploading ? (
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
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
              )}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#FDF6F3] border border-[#E9E3DE] flex items-center justify-center shrink-0 text-[#8A756C]">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-[#004D5A] border-t-transparent rounded-full animate-spin" />
              ) : (
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
              )}
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold text-[#583F37]">
              {isUploading ? "Uploading..." : previewUrl ? "Change Image" : "Upload Image"}
            </h4>
            <p className="text-xs text-[#8A756C] mt-0.5">{helperText}</p>
            <p className="text-xs font-semibold text-[#004D5A] hover:underline mt-1">
              {isDragging ? "Drop image here" : "Click to browse or drag & drop"}
            </p>
          </div>
        </div>

        {uploadError && (
          <p className="text-xs text-red-600 font-medium">{uploadError}</p>
        )}
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
        onClick={openFilePicker}
        onDrop={(e) => {
          if (isMaxReached) {
            e.preventDefault();
            return;
          }
          handleDrop(e);
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center gap-2 ${
          isDragging
            ? "border-[#004D5A] bg-[#004D5A]/10 scale-[1.01] shadow-sm"
            : isMaxReached || isUploading
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
          disabled={isMaxReached || isUploading}
          className="hidden"
        />
        <div
          className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xs mb-1 ${
            isMaxReached ? "bg-[#8A756C]" : "bg-[#004D5A]"
          }`}
        >
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
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
          )}
        </div>
        <p className="text-sm font-semibold text-[#583F37]">
          {isUploading
            ? "Uploading to cloud storage..."
            : isMaxReached
            ? `Maximum ${maxFiles} images reached`
            : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-[#8A756C]">
          {isUploading
            ? "Please wait while your files upload..."
            : isMaxReached
            ? "Remove an image to upload a new one"
            : helperText}
        </p>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          <p className="font-semibold">Upload Error:</p>
          <p>{uploadError}</p>
        </div>
      )}

      {/* Media Thumbnails Strip */}
      {(images.length > 0 || pendingPreviews.length > 0) && (
        <div className="flex items-center gap-3 pt-2 flex-wrap">
          {multiple && (!maxFiles || images.length + pendingPreviews.length < maxFiles) && (
            <button
              type="button"
              onClick={openFilePicker}
              disabled={isUploading}
              className="w-16 h-16 rounded-xl border border-dashed border-[#D1C7BD] hover:border-[#004D5A] bg-[#FAF5F2] flex items-center justify-center text-[#7A6860] hover:text-[#583F37] cursor-pointer text-xl font-bold transition-colors disabled:opacity-50"
            >
              +
            </button>
          )}

          {/* Permanent Uploaded Images */}
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

          {/* Pending Uploading Images (Optimistic Previews with Spinner) */}
          {pendingPreviews.map((previewUrl, idx) => (
            <div
              key={`pending-${idx}`}
              className="w-16 h-16 rounded-xl border border-[#004D5A] overflow-hidden relative shrink-0"
            >
              <img
                src={previewUrl}
                alt="Uploading preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MediaUpload;
