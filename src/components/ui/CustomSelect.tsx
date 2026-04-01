import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  testId?: string;
  closeOnSelect?: boolean;
}

export function CustomSelect({ value, options, onChange, placeholder = "Select...", className = "", testId = "", closeOnSelect = true }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value) || options[0];

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
      data-testid={testId ? `${testId}-dropdown` : "custom-select-dropdown"}
      className="absolute z-[99999] mt-2 overflow-y-auto bg-surface/95 backdrop-blur-xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] rounded-xl border border-primary/10 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        maxHeight: '256px'
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          data-testid={testId ? `${testId}-option-${option.value}` : `custom-select-option-${option.value}`}
          onClick={(e) => {
            e.preventDefault();
            onChange(option.value);
            if (closeOnSelect) {
              setIsOpen(false);
            }
          }}
          className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-page-bg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            {option.icon}
            <span className={`truncate ${option.value === value ? "font-medium text-primary" : "text-text-primary"}`}>
              {option.label}
            </span>
          </div>
          {option.value === value && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div ref={ref} className={`relative ${className}`} data-testid={testId ? `${testId}-container` : "custom-select-container"}>
      <button
        type="button"
        data-testid={testId || "custom-select-trigger"}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-text-primary bg-surface shadow-sm hover:shadow-md cursor-pointer outline-none w-full justify-between focus:ring-2 focus:ring-primary/20 hover:bg-surface/80"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown className="w-3 h-3 text-text-secondary shrink-0" />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(dropdownList, document.body)}
    </div>
  );
}
