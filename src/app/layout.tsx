import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "DriveMetric - Analyse intelligente de véhicules",
    template: "%s | DriveMetric",
  },
  description:
    "Fiches techniques complètes, fiabilité notée par IA, estimation de prix et problèmes connus.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DriveMetric",
  },
  openGraph: {
    type: "website",
    siteName: "DriveMetric",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
