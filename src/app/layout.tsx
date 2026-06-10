import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalShortcuts } from "@/components/GlobalShortcuts";
import { DisableZoom } from "@/components/DisableZoom";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Juara PettyCash",
  description: "Petty Cash Management System by JEF GROUP ID",
  icons: {
    icon: [
      { url: '/images/logomark-light.svg', media: '(prefers-color-scheme: light)' },
      { url: '/images/logomark-dark.svg', media: '(prefers-color-scheme: dark)' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 dark:bg-[#070D07] touch-pan-x touch-pan-y`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <GlobalShortcuts />
          <DisableZoom />
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
