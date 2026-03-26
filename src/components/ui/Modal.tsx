"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-surface w-full max-w-lg rounded-xl shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 pt-6 pb-4 shrink-0">
          <h2 className="text-lg font-bold text-text-primary tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-danger transition-colors p-1.5 rounded-md hover:bg-page-bg -mr-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
