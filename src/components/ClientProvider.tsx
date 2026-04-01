"use client";

import { ThemeProvider } from "@/lib/themeContext";
import { ToastContainer } from "./ui/Toast";
import AppLayout from "./layout/AppLayout";

export function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ToastContainer />
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  );
}
