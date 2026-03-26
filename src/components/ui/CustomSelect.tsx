import { useState, useRef, useEffect } from "react";
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
}

export function CustomSelect({ value, options, onChange, placeholder = "Select...", className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-text-primary bg-surface shadow-sm hover:shadow-md cursor-pointer outline-none w-full justify-between focus:ring-2 focus:ring-primary/20 hover:bg-surface/80"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown className="w-3 h-3 text-text-secondary shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 min-w-full w-max max-h-64 overflow-y-auto bg-surface/95 backdrop-blur-xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] rounded-xl border border-primary/10 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-page-bg transition-colors"
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
      )}
    </div>
  );
}
