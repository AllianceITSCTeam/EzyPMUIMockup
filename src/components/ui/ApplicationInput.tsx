import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useStore } from "@/store/useStore";

interface ApplicationInputProps {
  applications: string[];
  onChange: (apps: string[]) => void;
}

export function ApplicationInput({ applications, onChange }: ApplicationInputProps) {
  const { projects } = useStore();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive unique applications from all projects (if they exist)
  const allApps = Array.from(new Set(projects.flatMap((p) => p.applications || []))).sort();
  const availableApps = allApps.filter((a) => !applications.includes(a));
  
  const filteredSuggestions = availableApps.filter((a) => 
    a.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = (app: string) => {
    const trimmed = app.trim();
    if (trimmed && !applications.includes(trimmed)) {
      onChange([...applications, trimmed]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue) handleAdd(inputValue);
    }
  };

  const removeApp = (appToRemove: string) => {
    onChange(applications.filter((a) => a !== appToRemove));
  };

  return (
    <div className="flex flex-col gap-1 relative" ref={containerRef}>
      <div className="p-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md min-h-[38px] flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-primary/50 relative">
        {applications.map((app) => (
          <div key={app} className="flex items-center bg-primary/10 border border-primary/20 text-primary shadow-sm rounded-md px-2 py-0.5 text-sm font-medium">
            <span className="mr-1">{app}</span>
            <button 
              type="button" 
              onClick={() => removeApp(app)} 
              className="text-primary hover:text-danger focus:outline-none flex items-center justify-center p-0.5 rounded-sm hover:bg-danger/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <div className="flex flex-1 min-w-[150px] relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Type and press Enter to add..."
            className="bg-transparent border-none outline-none text-sm w-full py-0.5 placeholder:text-text-secondary text-text-primary"
          />
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-surface border border-border-color rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border-color bg-page-bg/50">
            Suggested Applications
          </div>
          <div className="flex flex-col">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAdd(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-page-bg hover:text-primary transition-colors focus:bg-page-bg focus:text-primary focus:outline-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
