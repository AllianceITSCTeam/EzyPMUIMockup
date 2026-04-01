"use client";

import { useEffect, useState } from "react";

interface DateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

/** Convert raw digits (8 chars) "DDMMYYYY" → display "DD/MM/YYYY" */
function digitsToDisplay(digits: string): string {
  const d = digits.slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Convert ISO "YYYY-MM-DD" → raw digits "DDMMYYYY" */
function isoToDigits(iso: string): string {
  if (!iso || iso.length < 10) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return "";
  return `${parts[2]}${parts[1]}${parts[0]}`;
}

/** Convert raw digits "DDMMYYYY" → ISO "YYYY-MM-DD" or "" if invalid */
function digitsToIso(digits: string): string {
  if (digits.length !== 8) return "";
  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 8);
  const day = parseInt(d, 10);
  const month = parseInt(m, 10);
  const year = parseInt(y, 10);
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2099) return "";
  return `${y}-${m}-${d}`;
}

export function DateInput({
  value,
  onChange,
  required,
  className,
  placeholder = "DD/MM/YYYY",
}: DateInputProps) {
  const [digits, setDigits] = useState(() => isoToDigits(value));

  // Sync when value prop changes from outside
  useEffect(() => {
    const fromProp = isoToDigits(value);
    if (fromProp !== digits) setDigits(fromProp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = digits.slice(0, -1);
      setDigits(next);
      if (next.length === 0) onChange("");
      return;
    }
    if (e.key === "Delete") {
      e.preventDefault();
      setDigits("");
      onChange("");
      return;
    }
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault();
      if (digits.length >= 8) return;
      const next = digits + e.key;
      setDigits(next);
      const iso = digitsToIso(next);
      if (iso) onChange(iso);
      return;
    }
    // Allow Tab, Arrow keys, etc. to pass through
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={digitsToDisplay(digits)}
      onChange={() => {}} // controlled via onKeyDown
      onKeyDown={handleKeyDown}
      required={required}
      maxLength={10}
      className={className}
    />
  );
}
