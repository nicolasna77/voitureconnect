import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";

const font = Inter({
  weight: "400",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "DriveMetric - Analyse intelligente de véhicules",
  description: "Fiches techniques complètes, fiabilité notée par IA, estimation de prix et problèmes connus.",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
