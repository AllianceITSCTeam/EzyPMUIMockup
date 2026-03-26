"use client";

import { useStore } from "@/store/useStore";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconColor = "text-primary";
        let bgColor = "bg-primary-light";
        let borderColor = "border-primary/20";

        if (toast.type === "success") {
          Icon = CheckCircle2;
          iconColor = "text-success";
          bgColor = "bg-success/10";
          borderColor = "border-success/20";
        } else if (toast.type === "error") {
          Icon = AlertCircle;
          iconColor = "text-danger";
          bgColor = "bg-danger/10";
          borderColor = "border-danger/20";
        } else if (toast.type === "warning") {
          Icon = AlertTriangle;
          iconColor = "text-warning";
          bgColor = "bg-warning/10";
          borderColor = "border-warning/20";
        }

        return (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border ${bgColor} ${borderColor} bg-surface backdrop-blur-md animate-in slide-in-from-right-10 fade-in duration-300`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium text-text-primary">
              {toast.message}
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-text-secondary hover:text-text-primary transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
