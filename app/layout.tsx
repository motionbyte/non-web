import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display, Source_Serif_4 } from "next/font/google";
import { SiteHeader } from "@/components/Chrome";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const ghost = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500", "600"],
  variable: "--font-ghost",
});
const body = Source_Serif_4({ subsets: ["latin"], variable: "--font-body" });
const ui = Inter({ subsets: ["latin"], variable: "--font-ui" });

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://namesofnote.com";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Names of Note",
    template: "%s — Names of Note",
  },
  description: "A free encyclopedia of people worth knowing. File a page. Ranking is organic. Sponsored slots are labeled.",
  openGraph: {
    type: "website",
    siteName: "Names of Note",
    title: "Names of Note",
    description: "A free encyclopedia of people worth knowing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Names of Note",
    description: "A free encyclopedia of people worth knowing.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${ghost.variable} ${body.variable} ${ui.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <main className="flex-1 pb-[4.75rem]">{children}</main>
        <SiteHeader />
      </body>
    </html>
  );
}
