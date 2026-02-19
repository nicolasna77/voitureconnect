import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";

import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ReactQueryProvider } from "./react-query-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { Toaster } from "@/components/ui/sonner";
import GoogleAdsense from "@/lib/GoogleAdsense";
import React from "react";

const font = Inter({
  weight: "400",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "DriveMetric - Analyse intelligente de véhicules",
  description: "Fiches techniques complètes, fiabilité notée par IA, estimation de prix et problèmes connus.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9f9" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={font.className}>
        <GoogleAdsense id="8946842704207401" />
        <NextIntlClientProvider>
          <ReactQueryProvider>
            {children}
            <Toaster />
            <AnalyticsProvider />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
