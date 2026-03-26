import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { SkillTag } from "@/components/ui/SkillTag";

interface SkillInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillInput({ skills, onChange }: SkillInputProps) {
  const { users } = useStore();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive unique skills from all users
  const allSkills = Array.from(new Set(users.flatMap((u) => u.skills))).sort();
  const availableSkills = allSkills.filter((s) => !skills.includes(s));
  
  const filteredSuggestions = availableSkills.filter((s) => 
    s.toLowerCase().includes(inputValue.toLowerCase())
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

  const handleAdd = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
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

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="flex flex-col gap-1 relative" ref={containerRef}>
      <div className="p-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md min-h-[80px] flex flex-wrap gap-2 items-start focus-within:ring-2 focus-within:ring-primary/50 transition-shadow relative">
        {skills.map((skill) => (
          <div key={skill} className="flex items-center bg-surface shadow-[0_2px_8px_rgb(0,0,0,0.04)] rounded px-2 py-1 pr-1">
            <SkillTag skill={skill} className="text-[13px] mr-1" />
            <button 
              type="button" 
              onClick={() => removeSkill(skill)} 
              className="text-text-secondary hover:text-danger focus:outline-none flex items-center justify-center p-0.5 rounded-sm hover:bg-danger/10"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <div className="flex items-center flex-1 min-w-[150px] relative">
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
            className="bg-transparent border-none outline-none text-sm w-full px-2 py-1 placeholder:text-text-secondary text-text-primary"
          />
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-surface border border-border-color rounded-md shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-border-color bg-page-bg/50">
            Suggested Skills
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
