import Link from "next/link";
import { LandingDiscoveryShortcuts } from "@/components/landing-discovery-shortcuts";
import { LandingFeatureGrid } from "@/components/landing-feature-grid";
import { LandingHero } from "@/components/landing-hero";
import { LandingMovieRail } from "@/components/landing-movie-rail";
import { LandingNav } from "@/components/landing-nav";
import { PageShell } from "@/components/page-shell";
import { getMovieById, getPopularMovies, getTrendingMovies } from "@/lib/tmdb";
import type { MovieSummary, PagedResponse } from "@/lib/types";
import { getSiteUrl } from "@/lib/site";

export const metadata = {
  title: { absolute: "MINGFO — Find Your Next Movie or Series" },
  description: "Find trending movies and TV series, browse genres, search titles, and save what you want to watch next with MINGFO.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "MINGFO — Find Your Next Movie or Series",
    description: "Find trending movies and TV series, browse genres, search titles, and save what you want to watch next with MINGFO.",
    url: "/",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MINGFO movie discovery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MINGFO — Find Your Next Movie or Series",
    description: "Find trending movies and TV series, browse genres, search titles, and save what you want to watch next with MINGFO.",
    images: ["/og-image.png"],
  },
};

const emptyMovies: PagedResponse<MovieSummary> = {
  page: 1,
  total_pages: 0,
  total_results: 0,
  results: [],
};

function fulfilled<T>(result: PromiseSettledResult<T>, fallback: T) {
  return result.status === "fulfilled" ? result.value : fallback;
}

export default async function LandingPage() {
  const [trendingResult, popularResult] = await Promise.allSettled([
    getTrendingMovies(),
    getPopularMovies(),
  ]);

  const trending = fulfilled(trendingResult, emptyMovies);
  const popular = fulfilled(popularResult, emptyMovies);
  const featured = trending.results[0] ?? popular.results[0];

  if (!featured) return null;

  const siteUrl = getSiteUrl();
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MINGFO",
    url: siteUrl.toString(),
    description: "A movie and TV discovery application for finding titles worth watching.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl.toString().replace(/\/$/, "")}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  let featuredDetails = null;
  try {
    featuredDetails = await getMovieById(featured.id);
  } catch {
    // The summary keeps the landing page usable if the optional detail fetch fails.
  }

  return (
    <>
      <LandingNav />
      <PageShell className="space-y-14 pb-24 pt-0 sm:space-y-16 lg:space-y-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <LandingHero
          movie={featured}
          genreNames={featuredDetails?.genreNames ?? featured.genreNames}
          runtime={featuredDetails?.runtime}
        />

        <LandingFeatureGrid />

        <LandingMovieRail
          title="Trending this week"
          href="/discover?collection=trending"
          movies={trending.results.slice(0, 6)}
          actionLabel="Explore all titles"
        />

        <LandingDiscoveryShortcuts movies={trending.results.slice(0, 4)} />

        <section className="space-y-4 border-t border-white/10 pt-10 text-center sm:pt-12" aria-labelledby="final-cta-heading">
          <h2 id="final-cta-heading" className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Not sure what to watch next?
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-7 text-white/55 sm:text-base">
            Browse titles, search for something specific, or save it for later.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/discover" className="inline-flex h-11 items-center border border-white/10 bg-white px-5 text-sm font-semibold text-ink-950 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">
              Explore movies
            </Link>
            <Link href="/search" className="inline-flex h-11 items-center border border-white/10 px-5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">
              Search titles
            </Link>
          </div>
        </section>
      </PageShell>
    </>
  );
}
