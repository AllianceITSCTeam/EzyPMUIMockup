"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, Check } from "lucide-react";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectWithSearchProps {
  value: string; // Currently typing/searching
  options: MultiSelectOption[];
  selectedIds: string[];
  onSearch: (value: string) => void;
  onSelect: (optionId: string) => void;
  onRemove: (optionId: string) => void;
  placeholder?: string;
  className?: string;
  getSelectedLabel?: (id: string) => string;
}

export function MultiSelectWithSearch({
  value,
  options,
  selectedIds,
  onSearch,
  onSelect,
  onRemove,
  placeholder = "Search and select...",
  className = "",
  getSelectedLabel = (id) => id,
}: MultiSelectWithSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateCoords = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      inputRef.current?.focus();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords, true);
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownList = isOpen ? (
    <div
      ref={dropdownRef}
      className="absolute z-[99999] mt-2 overflow-y-auto bg-surface/95 backdrop-blur-xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] rounded-xl border border-primary/10 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        maxHeight: "256px",
      }}
    >
      {options.length > 0 ? (
        options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSelect(option.value);
            }}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-page-bg transition-colors cursor-pointer"
          >
            <span
              className={`truncate ${
                selectedIds.includes(option.value)
                  ? "font-medium text-primary"
                  : "text-text-primary"
              }`}
            >
              {option.label}
            </span>
            {selectedIds.includes(option.value) && (
              <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
            )}
          </button>
        ))
      ) : (
        <div className="px-3 py-4 text-center text-sm text-text-secondary">
          No items found
        </div>
      )}
    </div>
  ) : null;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center flex-wrap gap-1.5 px-3 py-2 rounded-lg text-sm transition-all text-text-primary bg-surface shadow-sm hover:shadow-md cursor-text outline-none w-full focus-within:ring-2 focus-within:ring-primary/20 hover:bg-surface/80 min-h-[38px]"
      >
        {selectedIds.length > 0 && (
          <>
            {selectedIds.map((id) => (
              <div
                key={id}
                className="flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded-md text-[12px] font-medium border border-primary/20 whitespace-nowrap"
              >
                <span>{getSelectedLabel(id)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(id);
                  }}
                  className="hover:text-danger transition-colors flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </>
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedIds.length === 0 ? placeholder : "Add more..."}
          className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-secondary min-w-[100px]"
        />
      </div>

      {isOpen && typeof document !== "undefined" && createPortal(dropdownList, document.body)}
    </div>
  );
}
