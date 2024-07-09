import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BossTrackER",
  description: "An Elden Ring Boss tracker, where you can see the location and drops of all the bosses/invasions present in the game.",
  authors:[{
    name: "Luca Francesco Macera",
    url: "https://github.com/LucaFraMacera"
  }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
