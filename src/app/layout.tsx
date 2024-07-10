import type {Metadata} from "next";
import {Buenard} from "next/font/google";
import "./globals.css";
import {App} from "@/app/components/App";

const inter = Buenard({ subsets: ["latin"], weight:["400", "700"] });


export const metadata: Metadata = {
  icons:"/er-icon.svg",
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
      <body className={inter.className}>
        <App>
          {children}
        </App>
      </body>
    </html>
  );
}
