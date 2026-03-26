import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";

interface DateProgressBarProps {
  startDate?: string;
  dueDate?: string;
  showBothDates?: boolean;
}

export const DateProgressBar = ({ startDate, dueDate, showBothDates = false }: DateProgressBarProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!startDate || !dueDate) {
    return (
      <span className="text-text-primary text-sm font-medium">
        {dueDate ? formatDate(dueDate) : "-"}
      </span>
    );
  }
  
  const start = new Date(startDate).getTime();
  const due = new Date(dueDate).getTime();
  const today = mounted ? new Date().getTime() : start;
  
  if (due <= start) {
    return (
      <span className="text-text-primary text-sm font-medium">
        {formatDate(dueDate)}
      </span>
    );
  }
  
  const total = due - start;
  const elapsed = today - start;
  
  let percentage = (elapsed / total) * 100;
  if (percentage < 0) percentage = 0;
  
  let colorClass = "bg-[#10B981]"; 
  let bgClass = "bg-[#10B981]/20";
  if (percentage >= 50 && percentage < 85) { 
    colorClass = "bg-[#F59E0B]"; 
    bgClass = "bg-[#F59E0B]/20"; 
  }
  if (percentage >= 85) { 
    colorClass = "bg-danger"; 
    bgClass = "bg-danger/20"; 
  }

  const displayPercent = Math.min(percentage, 100);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${!showBothDates ? 'min-w-[120px] max-w-[150px]' : ''}`} title={`Start: ${formatDate(startDate)} | Due: ${formatDate(dueDate)}`}>
      <div className={`flex items-center text-[11px] font-medium leading-none ${showBothDates ? 'justify-between' : ''}`}>
        {showBothDates && (
          <span className="text-text-secondary">
            {formatDate(startDate)}
          </span>
        )}
        <span className={percentage >= 100 ? "text-danger font-bold" : "text-text-primary"}>
           {formatDate(dueDate)}
        </span>
      </div>
      <div className={`w-full h-1.5 ${bgClass} rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${colorClass} transition-all duration-500 rounded-full`} 
          style={{ width: `${displayPercent}%` }}
        />
      </div>
    </div>
  );
};
