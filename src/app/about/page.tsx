import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About MINGFO — Movie Discovery Made Simple" },
  description: "Learn what MINGFO is, how it helps people discover movies and TV shows, and how its data is provided.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About MINGFO — Movie Discovery Made Simple",
    description: "Learn what MINGFO is, how it helps people discover movies and TV shows, and how its data is provided.",
    url: "/about",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MINGFO movie discovery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About MINGFO — Movie Discovery Made Simple",
    description: "Learn what MINGFO is, how it helps people discover movies and TV shows, and how its data is provided.",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  const siteUrl = getSiteUrl();
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About MINGFO — Movie Discovery Made Simple",
    url: new URL("/about", siteUrl).toString(),
    description: "Learn what MINGFO is, how it helps people discover movies and TV shows, and how its data is provided.",
    isPartOf: { "@type": "WebSite", name: "MINGFO", url: siteUrl.toString() },
  };

  return (
    <PageShell className="pb-32 pt-8 sm:pt-12">
      <article className="mx-auto max-w-3xl space-y-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />

        <header className="space-y-4 border-b border-white/10 pb-8">
          <p className="text-sm font-medium text-ember-300/90">About</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">About MINGFO</h1>
          <p className="max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            MINGFO is an independent movie and TV discovery application for finding something worth watching without an endless scroll.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">What MINGFO does</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO brings the practical parts of movie discovery into one focused place. You can explore trending titles, browse genres and filters, search across movies and TV shows, open detailed pages, and save titles for later.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            The project is designed for a global audience and is currently noncommercial. It does not offer subscriptions, paid accounts, or in-app purchases.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">A discovery tool, not a streaming service</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO does not host, stream, upload, or distribute movies or TV episodes. It displays discovery information and links users to information or media hosted by third parties.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Data and attribution</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Movie and TV metadata, ratings, imagery, and related video information are provided through TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO is an independent project and is not an official TMDB product. Information can change over time and may not always be complete or accurate.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Watchlist</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Saved titles are stored locally in your browser using localStorage. MINGFO does not automatically upload the watchlist to a MINGFO database, and it does not synchronize the list between devices.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Contact</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            For questions, feedback, or project information, contact the MINGFO maintainer by email or Instagram.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href="mailto:hilmanok09@gmail.com" className="text-ember-200 underline decoration-ember-400/50 underline-offset-4 hover:text-ember-100">hilmanok09@gmail.com</a>
            <a href="https://instagram.com/mnaprd_" target="_blank" rel="noopener noreferrer" className="text-ember-200 underline decoration-ember-400/50 underline-offset-4 hover:text-ember-100">Instagram @mnaprd_</a>
          </div>
        </section>

        <nav aria-label="About page links" className="flex flex-wrap gap-3 border-t border-white/10 pt-8">
          <Link href="/" className="inline-flex h-10 items-center border border-white/10 bg-white px-4 text-sm font-semibold text-ink-950 transition hover:bg-slate-100">Home</Link>
          <Link href="/privacy" className="inline-flex h-10 items-center border border-white/10 px-4 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/5 hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="inline-flex h-10 items-center border border-white/10 px-4 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/5 hover:text-white">Terms of Use</Link>
        </nav>
      </article>
    </PageShell>
  );
}
