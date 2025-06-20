import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FightForge - Programme d'entraînement pour boxeurs",
  description:
    "Programme d'entraînement scientifique personnalisé pour boxeurs. Périodisation intelligente, suivi adaptatif, résultats garantis.",
  keywords: "boxe, entraînement, programme, fitness, combat, force, cardio",
  authors: [{ name: "FightForge Team" }],
  openGraph: {
    title: "FightForge - Forge ton potentiel",
    description:
      "Le programme d'entraînement scientifique conçu par des champions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
