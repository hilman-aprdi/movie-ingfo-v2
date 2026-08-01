import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "MINGFO — Discover Movies Worth Watching",
    template: "%s | MINGFO",
  },
  applicationName: "MINGFO",
  description: "Discover trending movies, browse genres, search titles, and save movies to your personal watchlist with MINGFO.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "MINGFO",
    title: "MINGFO — Discover Movies Worth Watching",
    description: "Discover trending movies, browse genres, search titles, and save movies to your personal watchlist with MINGFO.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MINGFO movie discovery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MINGFO — Discover Movies Worth Watching",
    description: "Discover trending movies, browse genres, search titles, and save movies to your personal watchlist with MINGFO.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favico.png",
    shortcut: "/favico.png",
    apple: "/favico.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="relative isolate min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(90,141,255,0.24),_transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.03)_0%,_transparent_16%,_rgba(255,255,255,0.01)_100%)] opacity-70" />
          <SiteNav />
          {children}
          <MobileBottomNav />
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
