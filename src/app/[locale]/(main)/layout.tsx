import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CompareFab } from "@/components/compare-fab";

const font = Inter({
  weight: "400",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "DriveMetric - Analyse intelligente de véhicules",
  description: "Fiches techniques, score de fiabilité, problèmes connus et estimation de prix pour chaque véhicule. Achetez en confiance.",
};
export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main" className="flex-1 pt-16">{children}</main>
      {modal}
      <CompareFab />
      <Footer />
    </div>
  );
}
