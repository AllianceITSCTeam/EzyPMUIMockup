"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useStore } from "@/store/useStore";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { isLoading, initialize } = useStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (pathname === "/login") {
    return (
      <div className="flex h-screen overflow-hidden bg-page-bg relative selection:bg-primary/20 transition-colors duration-500">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-success/10 blur-[100px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" />
        <main className="flex-1 w-full h-full relative z-10 flex items-center justify-center p-4">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-page-bg relative selection:bg-primary/20 transition-colors duration-500">
      {/* Premium Decorative Light Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-success/10 blur-[100px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen" />
      
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        <Header />
        <main className="flex-1 overflow-auto p-6 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-page-bg/50 backdrop-blur-sm z-50">
              <div className="flex flex-col items-center gap-3 text-text-secondary">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="font-medium text-sm">Loading workspace...</p>
              </div>
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
