import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display, Source_Serif_4 } from "next/font/google";
import { SiteHeader } from "@/components/Chrome";
import { SITE_DESCRIPTION, SITE_URL, websiteJsonLd } from "@/lib/seo";
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

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#f6f3ec",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Names of Note",
    template: "%s — Names of Note",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: "Names of Note",
    title: "Names of Note",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Names of Note",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${ghost.variable} ${body.variable} ${ui.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
        <main className="flex-1 pb-[calc(5.25rem+env(safe-area-inset-bottom))] sm:pb-[4.75rem]">{children}</main>
        <SiteHeader />
      </body>
    </html>
  );
}
