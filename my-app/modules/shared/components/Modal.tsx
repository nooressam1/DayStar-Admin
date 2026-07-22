"use client";

import React, { useEffect } from "react";
import { Button } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "secondary" | "danger" | "ghost" | "danger-outline";
  isSubmitting?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  children,
  footer,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  isSubmitting = false,
  maxWidth = "md",
  showCloseButton = true,
  className = "",
}: ModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Max width style mapping
  const maxWidthMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  };

  // Render built-in footer buttons if no custom footer is passed
  const renderFooter = () => {
    if (footer !== undefined) return footer;
    if (!onConfirm && !cancelText) return null;

    return (
      <div className="bg-[#FAF6F4] px-6 py-4 border-t border-[#E9E3DE] flex justify-end items-center gap-3 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          {cancelText}
        </Button>
        {onConfirm && (
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : confirmText}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      {/* Backdrop overlay click handler */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Window */}
      <div
        className={`bg-white rounded-2xl border border-[#E9E3DE] ${maxWidthMap[maxWidth]} w-full shadow-2xl overflow-hidden flex flex-col relative z-10 my-auto max-h-[90vh] ${className}`}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="bg-[#FAF6F4] px-6 py-4 border-b border-[#E9E3DE] flex justify-between items-start shrink-0">
            <div>
              {title && (
                <h3 className="text-xl font-bold font-serif text-[#583F37]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#7A6860] mt-0.5">{subtitle}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer transition-colors p-1 rounded-md"
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Modal Body / Children */}
        {children && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">{children}</div>
        )}

        {/* Modal Footer */}
        {renderFooter()}
      </div>
    </div>
  );
}

export default Modal;
