import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Hedvig_Letters_Serif, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { LanguageProvider } from "./context/LanguageContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const hedvig = Hedvig_Letters_Serif({
  variable: "--font-hedvig",
  subsets: ["latin"],
  weight: "400",
});

// Closest Google Fonts match to freight-display-pro (elegant display serif, light weight)
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gia Jashvili — Violinist",
  description: "Official website of Gia Jashvili, international concert violinist.",
  icons: {
    icon: [{ url: "/favicon-gia.png", type: "image/png" }],
    shortcut: "/favicon-gia.png",
    apple: "/favicon-gia.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${hedvig.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <LanguageProvider>
          <SmoothScroll />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
