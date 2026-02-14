import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CarMetrix - Analyse intelligente de véhicules",
  description:
    "Fiches techniques complètes, fiabilité notée par IA, estimation de prix et problèmes connus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
