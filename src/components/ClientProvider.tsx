"use client";

import { ThemeProvider } from "next-themes";
import { ToastContainer } from "./ui/Toast";
import AppLayout from "./layout/AppLayout";

export function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastContainer />
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  );
}
