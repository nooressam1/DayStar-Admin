import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface UseMediaUploadOptions {
  value?: string | string[];
  images?: string[];
  multiple?: boolean;
  maxFiles?: number;
  bucketName?: string;
  maxFileSizeMb?: number;
  onChange?: (value: any) => void;
  onImagesChange?: (images: string[]) => void;
  onAddImage?: (url: string) => void;
  onRemoveImage?: (index: number) => void;
}

export function useMediaUpload({
  value,
  images: imagesProp,
  multiple = false,
  maxFiles = 3,
  bucketName = "products",
  maxFileSizeMb = 10,
  onChange,
  onImagesChange,
  onAddImage,
  onRemoveImage,
}: UseMediaUploadOptions = {}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const effectiveValue = imagesProp !== undefined ? imagesProp : value;

  // Normalize images to array, filtering out null/undefined/empty
  const normalizedImages: string[] = Array.isArray(effectiveValue)
    ? effectiveValue.filter(Boolean)
    : effectiveValue
      ? [effectiveValue]
      : [];

  const [localImages, setLocalImages] = useState<string[]>(normalizedImages);

  React.useEffect(() => {
    const nextImages = Array.isArray(effectiveValue)
      ? effectiveValue.filter(Boolean)
      : effectiveValue
        ? [effectiveValue]
        : [];
    setLocalImages(nextImages);
  }, [effectiveValue]);

  const images = localImages;

  const handleImageUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    // Filter strictly for image files only
    const imageFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      setUploadError("Please select valid image files (JPG, PNG, WEBP, GIF, SVG).");
      return;
    }

    const limit = multiple ? maxFiles : 1;
    const remainingSlots = multiple ? Math.max(0, limit - images.length) : 1;
    if (remainingSlots <= 0) return;

    const imageFilesToUpload = imageFiles.slice(0, remainingSlots);

    // Validate maximum file size (default 10MB limit per image)
    const maxBytes = maxFileSizeMb * 1024 * 1024;
    const oversizedFile = imageFilesToUpload.find((file) => file.size > maxBytes);
    if (oversizedFile) {
      setUploadError(
        `"${oversizedFile.name}" exceeds the ${maxFileSizeMb}MB size limit. Please upload a smaller image.`
      );
      return;
    }

    // Instant optimistic previews while uploading
    const tempPreviews = imageFilesToUpload.map((file) =>
      URL.createObjectURL(file)
    );
    setPendingPreviews(tempPreviews);
    setIsUploading(true);
    setUploadError(null);

    try {
      console.log(`🚀 [useMediaUpload] Starting upload to Supabase bucket "${bucketName}":`, imageFilesToUpload.map(f => f.name));
      const supabase = createClient();

      // Upload all images in parallel for maximum speed
      const uploadPromises = imageFilesToUpload.map(async (imageFile) => {
        const fileExt = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const cleanName = imageFile.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .substring(0, 30);
        const fileName = `${Date.now()}_${cleanName}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        console.log(`Uploading file ${fileName} to bucket "${bucketName}"...`);
        const { data: uploadData, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type,
          });

        if (error) {
          console.error(`❌ [useMediaUpload] Upload error for "${imageFile.name}":`, error);
          throw new Error(`Upload failed for "${imageFile.name}": ${error.message}`);
        }

        const { data: publicData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        console.log(`✅ [useMediaUpload] File uploaded successfully! URL:`, publicData?.publicUrl);
        return publicData?.publicUrl || null;
      });

      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.filter((url): url is string => Boolean(url));

      if (uploadedUrls.length > 0) {
        if (multiple) {
          const updated = [...images, ...uploadedUrls];
          if (onAddImage) {
            uploadedUrls.forEach((url) => onAddImage(url));
          } else if (onImagesChange) {
            onImagesChange(updated);
          } else if (onChange) {
            onChange(updated);
          }
        } else {
          const singleUrl = uploadedUrls[0];
          if (onAddImage) {
            onAddImage(singleUrl);
          } else if (onImagesChange) {
            onImagesChange([singleUrl]);
          } else if (onChange) {
            onChange(singleUrl);
          }
        }
      }
    } catch (err: any) {
      console.error("Media upload error:", err);
      setUploadError(
        err.message ||
        "Failed to upload image. Please verify your Supabase Storage bucket exists and is public."
      );
    } finally {
      tempPreviews.forEach((url) => URL.revokeObjectURL(url));
      setPendingPreviews([]);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragging && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
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

  const openFilePicker = () => {
    if (!isMaxReached && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return {
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
  };
}
