import type { Metadata } from "next";
import Link from "next/link";
import { BookmarkButton } from "@/components/bookmark-button";
import { MovieCard } from "@/components/movie-card";
import { PageShell } from "@/components/page-shell";
import { PaginationBar } from "@/components/pagination-bar";
import { RetryButton } from "@/components/retry-button";
import { SearchInput, type SearchSortOption } from "@/components/search-input";
import { RestrictedSearchError, searchMulti } from "@/lib/tmdb";
import { evaluateSearchSafety } from "@/lib/content-safety";
import type { MovieSummary } from "@/lib/types";
import { mediaHref } from "@/lib/utils";

type SearchParamValue = string | string[] | undefined;
type SearchPageParams = { q?: SearchParamValue; sort?: SearchParamValue; page?: SearchParamValue };
type SortMode = "relevance" | "popularity" | "rating" | "newest";

const sortOptions: SearchSortOption[] = [
  { value: "relevance", label: "Relevance" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest" },
];

export async function generateMetadata({ searchParams }: { searchParams?: Promise<SearchPageParams> }): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const query = (first(params.q) ?? "").trim();
  const restricted = query.length > 0 && !evaluateSearchSafety(query).allowed;
  const title = restricted ? "Search restricted" : query ? `Search results for "${query}"` : "Search movies and TV shows";
  const description = restricted ? "MINGFO does not support searches related to explicit adult content." : query ? `Search movies and TV shows for ${query} on MINGFO.` : "Search for a movie or TV show with MINGFO.";
  return {
    title,
    description,
    alternates: { canonical: "/search" },
    robots: query ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: `${title} | MINGFO`, description, url: "/search", type: "website", images: [{ url: "/og-image.png", alt: "MINGFO search" }] },
    twitter: { card: "summary_large_image", title: `${title} | MINGFO`, description, images: ["/og-image.png"] },
  };
}

function first(value: SearchParamValue) { return Array.isArray(value) ? value[0] : value; }
function parseSort(value: SearchParamValue): SortMode { const candidate = first(value); return sortOptions.some((option) => option.value === candidate) ? candidate as SortMode : "relevance"; }

function sortResults(results: MovieSummary[], sort: SortMode) {
  const copy = [...results];
  if (sort === "popularity") return copy.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  if (sort === "newest") return copy.sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""));
  if (sort === "rating") {
    const weightedRating = (movie: MovieSummary) => {
      const votes = movie.voteCount ?? 0;
      const priorWeight = 100;
      const baseline = 6.5;
      return ((votes / (votes + priorWeight)) * movie.rating) + ((priorWeight / (votes + priorWeight)) * baseline);
    };
    return copy.sort((a, b) => weightedRating(b) - weightedRating(a));
  }
  return copy;
}

function SearchHeader({ query, sort, showSort = false, title }: { query?: string; sort: SortMode; showSort?: boolean; title: string }) {
  return <header className="space-y-5"><h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{title}</h1><SearchInput action="/search" label="Search movies and TV shows" defaultValue={query} placeholder="Search movies or TV shows..." buttonLabel="Search" debounce sort={showSort ? sort : undefined} sortOptions={showSort ? sortOptions : undefined} className="max-w-5xl" /></header>;
}

function PosterGrid({ movies }: { movies: MovieSummary[] }) {
  return <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">{movies.map((movie) => <MovieCard key={`${movie.mediaType}-${movie.id}`} className="h-full" movie={movie} href={mediaHref(movie)} hideInvalidRating actionSlot={<BookmarkButton movie={movie} className="inline-flex h-7 items-center gap-1 border border-white/10 bg-ink-950/82 px-2 text-[10px] font-medium text-white transition hover:bg-white/10" />} />)}</div>;
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<SearchPageParams> }) {
  const params = (await searchParams) ?? {};
  const query = (first(params.q) ?? "").trim();
  const sort = parseSort(params.sort);
  const page = Math.max(1, Number(first(params.page) ?? 1) || 1);

  if (query && !evaluateSearchSafety(query).allowed) {
    return <PageShell className="space-y-8 pb-32 pt-4"><SearchHeader query={query} sort={sort} title="Search restricted" /><section className="max-w-2xl space-y-3" aria-live="polite"><h2 className="text-lg font-semibold text-white">Search restricted</h2><p className="text-sm leading-7 text-white/65">This search may contain terms related to explicit adult content, which is not supported on MINGFO. Please try a different movie, TV series, actor, or genre.</p><SearchInput action="/search" label="Edit search" defaultValue="" placeholder="Try another title..." buttonLabel="Search" focusOnMount /></section></PageShell>;
  }

  if (!query) return <PageShell className="space-y-8 pb-32 pt-4"><SearchHeader sort={sort} title="Search" /><section className="space-y-3 pt-3" aria-live="polite"><div className="space-y-2"><h2 className="text-lg font-semibold text-white">Search for a movie or TV show.</h2><p className="text-sm text-white/60">Type a title to begin.</p></div><Link href="/discover" className="inline-flex py-2 text-sm font-medium text-white/70 transition hover:text-ember-200 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">Not sure what to search for? Explore movies →</Link></section></PageShell>;

  let results;
  try {
    results = await searchMulti(query, page);
  } catch (error) {
    if (error instanceof RestrictedSearchError) {
      return <PageShell className="space-y-8 pb-32 pt-4"><SearchHeader query={query} sort={sort} title="Search restricted" /><section className="space-y-3" aria-live="polite"><h2 className="text-lg font-semibold text-white">Search restricted</h2><p className="text-sm leading-7 text-white/65">This search may contain terms related to explicit adult content, which is not supported on MINGFO. Please try a different movie, TV series, actor, or genre.</p></section></PageShell>;
    }
    return <PageShell className="space-y-8 pb-32 pt-4"><SearchHeader query={query} sort={sort} title={`Results for “${query}”`} /><section className="space-y-3" aria-live="polite"><h2 className="text-lg font-semibold text-white">Search is temporarily unavailable</h2><p className="text-sm text-white/60">Something went wrong while searching. Please try again.</p><RetryButton /></section></PageShell>;
  }

  const sortedResults = sortResults(results.results, sort);
  const hasResults = sortedResults.length > 0;
  return <PageShell className="space-y-8 pb-32 pt-4"><SearchHeader query={query} sort={sort} showSort={hasResults} title={`Results for “${query}”`} /><p className="text-sm text-white/55">{results.total_results.toLocaleString()} results</p>{hasResults ? <PosterGrid movies={sortedResults} /> : <section className="space-y-2 pt-1"><p className="text-lg font-semibold tracking-[-0.02em] text-white">No results found.</p><p className="text-sm text-white/60">Try another title or keyword.</p></section>}<PaginationBar basePath="/search" page={page} totalPages={hasResults ? results.total_pages : 0} params={{ q: query, sort }} /></PageShell>;
}
