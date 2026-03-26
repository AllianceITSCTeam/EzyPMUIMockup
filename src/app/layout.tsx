import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "../components/layout/AppLayout";
import { ToastContainer } from "../components/ui/Toast";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EzyPM - Project Management",
  description: "Modern Enterprise SaaS Project Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastContainer />
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
