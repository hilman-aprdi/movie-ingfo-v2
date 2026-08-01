import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BookmarkButton } from "@/components/bookmark-button";
import { ComingSoonList } from "@/components/coming-soon-list";
import { DiscoverFilters } from "@/components/discover-filters";
import { DiscoverResultsHeading } from "@/components/discover-results-heading";
import { EmptyState } from "@/components/empty-state";
import { GenreTile } from "@/components/genre-tile";
import { MovieCard } from "@/components/movie-card";
import { PageShell } from "@/components/page-shell";
import { PaginationBar } from "@/components/pagination-bar";
import { PopularMovieCard } from "@/components/popular-movie-card";
import { SearchInput } from "@/components/search-input";
import { SectionHeading } from "@/components/section-heading";
import { buildQueryHref, getDiscoverResults, getGenres, getIndonesianDiscover, getTrendingMovies, getTrendingTv, getTvGenres, getUpcomingMoviesIndonesia, getUpcomingTv } from "@/lib/tmdb";
import type { Genre, MovieSummary } from "@/lib/types";
import { mediaHref } from "@/lib/utils";

type SearchParamValue = string | string[] | undefined;
type DiscoverSearchParams = { collection?: SearchParamValue; origin?: SearchParamValue; genre?: SearchParamValue; name?: SearchParamValue; page?: SearchParamValue; type?: SearchParamValue; year?: SearchParamValue; rating?: SearchParamValue; language?: SearchParamValue; sort?: SearchParamValue; allGenres?: SearchParamValue };

function first(value: SearchParamValue) { return Array.isArray(value) ? value[0] : value; }
function positiveNumber(value: string | undefined) { const number = Number(value); return Number.isFinite(number) && number > 0 ? number : undefined; }
function safe<T>(promise: Promise<T>, fallback: T) { return promise.catch(() => fallback); }
function futureMedia(items: MovieSummary[]) {
  const today = new Date().toISOString().slice(0, 10);
  return [...items].filter((item) => item.releaseDate && item.releaseDate >= today).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
}
function hasResultsQuery(params: DiscoverSearchParams) { return Boolean(first(params.collection) || first(params.origin) || first(params.genre) || first(params.year) || first(params.rating) || first(params.language) || (first(params.sort) && first(params.sort) !== "popularity.desc") || positiveNumber(first(params.page)) && positiveNumber(first(params.page))! > 1); }
function titleForGenre(genre: Genre | undefined, fallback?: string) { const name = genre?.name ?? fallback ?? "Filtered results"; return name === "Science Fiction" ? "Sci-Fi" : name; }

export async function generateMetadata({ searchParams }: { searchParams?: Promise<DiscoverSearchParams> }): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const media = first(params.type) === "tv" ? "TV Shows" : "Movies";
  const title = `Discover ${media}`;
  const description = `Explore trending ${media.toLowerCase()}, Indonesian titles, highly rated picks, genres, and more with MINGFO.`;
  return {
    title,
    description,
    alternates: { canonical: "/discover" },
    robots: hasResultsQuery(params) ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: `${title} | MINGFO`, description, url: "/discover", type: "website", images: [{ url: "/og-image.png", alt: "MINGFO discovery" }] },
    twitter: { card: "summary_large_image", title: `${title} | MINGFO`, description, images: ["/og-image.png"] },
  };
}

function MediaTabs({ mediaType, params }: { mediaType: "movie" | "tv"; params: Record<string, string | undefined> }) {
  const movieHref = buildQueryHref("/discover", { ...params, type: "movie", page: 1 });
  const tvHref = buildQueryHref("/discover", { ...params, type: "tv", page: 1 });
  return <div className="flex border-b border-white/10 text-sm" aria-label="Content type"><Link href={movieHref} className={`px-3 py-2 ${mediaType === "movie" ? "border-b border-ember-300 text-white" : "text-white/50 hover:text-white"}`}>Movies</Link><Link href={tvHref} className={`px-3 py-2 ${mediaType === "tv" ? "border-b border-ember-300 text-white" : "text-white/50 hover:text-white"}`}>TV Shows</Link></div>;
}

function PosterRow({ movies, mediaType }: { movies: MovieSummary[]; mediaType: "movie" | "tv" }) {
  if (movies.length === 0) return null;
  return <div className="no-scrollbar grid grid-flow-col auto-cols-[9.5rem] gap-4 overflow-x-auto pb-2 sm:auto-cols-[11rem] lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-4 xl:grid-cols-5 min-[1400px]:grid-cols-6">{movies.slice(0, 8).map((movie) => { const item = { ...movie, mediaType }; return <MovieCard key={movie.id} movie={item} href={mediaHref(item)} className="h-full" hideInvalidRating />; })}</div>;
}

function BrowseGrid({ movies }: { movies: MovieSummary[] }) {
  return <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">{movies.map((movie) => <MovieCard key={`${movie.mediaType}-${movie.id}`} movie={movie} href={mediaHref(movie)} hideInvalidRating actionSlot={<BookmarkButton movie={movie} className="inline-flex h-7 items-center gap-1 border border-white/10 bg-ink-950/82 px-2 text-[10px] font-medium text-white transition hover:border-white/20 hover:bg-white/10" />} />)}</div>;
}

function FilterSummary({ genre, year, rating, language }: { genre?: Genre; year?: number; rating?: number; language?: string }) {
  const parts = [genre?.name === "Science Fiction" ? "Sci-Fi" : genre?.name, year ? String(year) : undefined, rating ? `Rating ${rating}+` : undefined, language ? language.toUpperCase() : undefined].filter(Boolean);
  if (parts.length === 0) return null;
  return <p className="text-sm text-white/55">{parts.join(" · ")}</p>;
}

export default async function DiscoverPage({ searchParams }: { searchParams?: Promise<DiscoverSearchParams> }) {
  const params = (await searchParams) ?? {};
  const mediaType = first(params.type) === "tv" ? "tv" : "movie";
  const requestedPage = Math.max(1, Math.floor(Number(first(params.page) ?? 1) || 1));
  const page = Math.min(requestedPage, 500);
  const genreValue = first(params.genre);
  const genreId = positiveNumber(genreValue);
  const year = positiveNumber(first(params.year));
  const minRating = positiveNumber(first(params.rating));
  const sort = first(params.sort) || "popularity.desc";
  const language = first(params.language);
  const collection = first(params.collection);
  const origin = first(params.origin);
  const mediaLabel = mediaType === "tv" ? "TV Shows" : "Movies";
  const resultsMode = hasResultsQuery(params);

  const genres = await safe(mediaType === "tv" ? getTvGenres() : getGenres(), []);
  const selectedGenre = genres.find((genre) => genre.id === genreId);
  const filterParams = { type: mediaType, collection, origin, genre: genreValue, name: first(params.name), year: first(params.year), rating: first(params.rating), language, sort };

  if (resultsMode) {
    let results;
    if (collection === "trending") results = await safe(mediaType === "tv" ? getTrendingTv(page) : getTrendingMovies(page), { page, total_pages: 0, total_results: 0, results: [] });
    else if (collection === "top-rated") results = await safe(getDiscoverResults(mediaType, { sort: "vote_average.desc", minRating: 7, minVotes: 200, page }), { page, total_pages: 0, total_results: 0, results: [] });
    else if (collection === "coming-soon") {
      const upcoming = await safe(mediaType === "tv" ? getUpcomingTv(page) : getUpcomingMoviesIndonesia(page), { page, total_pages: 0, total_results: 0, results: [] });
      results = { ...upcoming, results: futureMedia(upcoming.results) };
    }
    else results = await safe(getDiscoverResults(mediaType, { genre: genreId, originCountry: origin, year, minRating, language, sort, page }), { page, total_pages: 0, total_results: 0, results: [] });
    const totalPages = Math.min(results.total_pages, 500);
    if (totalPages > 0 && requestedPage > totalPages) {
      redirect(buildQueryHref("/discover", { ...filterParams, page: totalPages }));
    }
    const resultTitle = collection === "trending" ? "Trending now" : collection === "top-rated" ? "Highly rated" : collection === "coming-soon" ? "Coming soon" : origin === "ID" ? "Indonesian cinema" : titleForGenre(selectedGenre, first(params.name));
    const mappedResults: MovieSummary[] = results.results.map((item) => ({ ...item, mediaType }));

    return <PageShell className="space-y-8 pb-32 pt-4">
      <header className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><Link href={buildQueryHref("/discover", { type: mediaType })} className="text-sm text-white/55 transition hover:text-ember-200">← Back to Discover</Link><div className="mt-3"><DiscoverResultsHeading title={resultTitle} count={results.total_results} page={page} /></div><p className="mt-2 text-sm text-white/55">{results.total_results.toLocaleString()} results</p><FilterSummary genre={selectedGenre} year={year} rating={minRating} language={language} /></div><MediaTabs mediaType={mediaType} params={filterParams} /></div><SearchInput action="/search" label={`Search ${mediaLabel}`} placeholder={`Search ${mediaLabel.toLowerCase()}...`} buttonLabel="Search" showButtonLabel className="max-w-3xl" /><DiscoverFilters mediaType={mediaType} genres={genres} genre={genreValue} year={first(params.year)} rating={first(params.rating)} language={language} sort={sort} resultsMode /></header>
      <section className="space-y-5" aria-labelledby="browse-results-heading"><div className="sr-only"><h2 id="browse-results-heading">Browse results</h2></div>{mappedResults.length > 0 ? <BrowseGrid movies={mappedResults} /> : <EmptyState title="No titles found" description="Try removing a filter or choosing another genre." actionLabel="Back to Discover" actionHref={`/discover?type=${mediaType}`} />}<PaginationBar basePath="/discover" page={page} totalPages={totalPages} params={filterParams} /></section>
    </PageShell>;
  }

  const [trending, indonesian, comingSoon] = await Promise.all([
    safe(mediaType === "tv" ? getTrendingTv() : getTrendingMovies(), { page: 1, total_pages: 0, total_results: 0, results: [] }),
    safe(getIndonesianDiscover(mediaType), { page: 1, total_pages: 0, total_results: 0, results: [] }),
    safe(mediaType === "tv" ? getUpcomingTv() : getUpcomingMoviesIndonesia(), { page: 1, total_pages: 0, total_results: 0, results: [] }),
  ]);
  return <PageShell className="space-y-12 pb-32 pt-4">
    <header className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-ember-300/85">Movie and TV discovery</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Discover</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">Explore what is trending, find highly rated titles, and narrow your next watch by genre or year.</p></div><MediaTabs mediaType={mediaType} params={{ type: mediaType }} /></div><SearchInput action="/search" label={`Search ${mediaLabel}`} placeholder={`Search ${mediaLabel.toLowerCase()}...`} buttonLabel="Search" showButtonLabel className="max-w-3xl" /><DiscoverFilters mediaType={mediaType} genres={genres} sort={sort} /></header>
    <section className="space-y-5" aria-labelledby="trending-heading"><SectionHeading title="Trending now" headingId="trending-heading" action={<Link href={buildQueryHref("/discover", { type: mediaType, collection: "trending", page: 1 })} className="py-2 text-sm font-medium text-white/65 hover:text-ember-200 hover:underline hover:underline-offset-4">View all →</Link>} /><PosterRow movies={trending.results} mediaType={mediaType} /></section>
    <section className="space-y-5" aria-labelledby="indonesian-heading"><SectionHeading title="Indonesian cinema" headingId="indonesian-heading" action={<Link href={buildQueryHref("/discover", { type: mediaType, origin: "ID", page: 1 })} className="py-2 text-sm font-medium text-white/65 hover:text-ember-200 hover:underline hover:underline-offset-4">View all →</Link>} /><div className="grid gap-3 md:grid-cols-2">{indonesian.results.slice(0, 6).map((movie) => <PopularMovieCard key={movie.id} movie={{ ...movie, mediaType }} />)}</div></section>
    <ComingSoonList movies={futureMedia(comingSoon.results).slice(0, 5)} mediaType={mediaType} actionHref={buildQueryHref("/discover", { type: mediaType, collection: "coming-soon", page: 1 })} actionLabel="View all →" />
    <section id="genres" className="space-y-5" aria-labelledby="genres-heading"><SectionHeading title="Explore by genre" headingId="genres-heading" /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{genres.map((item, index) => <GenreTile key={item.id} genre={item} index={index} mediaType={mediaType} showDescription={false} imagePath={trending.results[index % Math.max(trending.results.length, 1)]?.backdropPath ?? null} />)}</div></section>
  </PageShell>;
}
