import type { Metadata } from "next";
import { Barlow_Condensed, Geist } from "next/font/google";
import "@/app/globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--next-font-sans",
  display: "swap",
});

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--next-font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://msjh.io"),
  title: { default: "MSJH.io", template: "%s · MSJH.io" },
  description: "Your unofficial Mission San Jose High School hub.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-world="cream" className={`${sans.variable} ${display.variable}`}>
      <head>
        <meta name="theme-color" content="#ECE7D6" />
      </head>
      <body>{children}</body>
    </html>
  );
}
