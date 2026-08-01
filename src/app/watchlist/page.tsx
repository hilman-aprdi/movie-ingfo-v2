import { BookmarksPageClient } from "@/components/bookmarks-page-client";

export const metadata = {
  title: { absolute: "Watchlist | MINGFO" },
  description: "Your locally saved movie watchlist in MINGFO.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/watchlist" },
  openGraph: { title: "Watchlist | MINGFO", description: "Your locally saved movie watchlist in MINGFO.", url: "/watchlist", type: "website", images: [{ url: "/og-image.png", alt: "MINGFO watchlist" }] },
  twitter: { card: "summary_large_image", title: "Watchlist | MINGFO", description: "Your locally saved movie watchlist in MINGFO.", images: ["/og-image.png"] },
};

export default function WatchlistPage() {
  return <BookmarksPageClient />;
}
