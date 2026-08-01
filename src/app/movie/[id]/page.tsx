import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CastList } from "@/components/cast-list";
import { BookmarkButton } from "@/components/bookmark-button";
import { MovieDetailsList } from "@/components/movie-details-list";
import { MovieVideos } from "@/components/movie-videos";
import { PageShell } from "@/components/page-shell";
import { MovieRail } from "@/components/movie-rail";
import { backdropUrl, getMovieById, posterUrl, RestrictedMediaError, TmdbRequestError } from "@/lib/tmdb";
import { formatRating, formatRuntime, formatYear, movieHref, safeText, slugify } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site";

function firstSegment(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseMovieId(segment: string | undefined) {
  const match = segment?.match(/^(\d+)(?:-|$)/);
  return match ? Number(match[1]) : NaN;
}

function movieSegment(movie: { id: number; title: string }) {
  return `${movie.id}-${slugify(movie.title)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id?: string | string[] }>;
}): Promise<Metadata> {
  const resolved = (await params) ?? {};
  const rawSegment = firstSegment(resolved.id);
  const id = parseMovieId(rawSegment);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  let movie;
  try {
    movie = await getMovieById(id);
  } catch (error) {
    if (error instanceof RestrictedMediaError || error instanceof TmdbRequestError && error.status === 404 || error instanceof Error && error.message === "MOVIE_NOT_FOUND") {
      notFound();
    }
    return { title: "Movie not found", robots: { index: false, follow: true } };
  }

  const canonical = movieHref(movie);
  const year = formatYear(movie.releaseDate, "");
  const description = `View the synopsis, genres, rating, trailer, and details for ${movie.title}${year ? ` (${year})` : ""} on MINGFO.`;
  const image = backdropUrl(movie.backdropPath, "w1280");

  return {
    title: { absolute: `${movie.title}${year ? ` (${year})` : ""} — Cast, Trailer & Details | MINGFO` },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${movie.title}${year ? ` (${year})` : ""} — Cast, Trailer & Details | MINGFO`,
      description,
      url: canonical,
      images: [{ url: image, alt: `${movie.title} backdrop` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title}${year ? ` (${year})` : ""} | MINGFO`,
      description,
      images: [image],
    },
  };
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id?: string | string[] }>;
}) {
  const resolved = await params;
  const rawSegment = firstSegment(resolved.id);
  const id = parseMovieId(rawSegment);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  let movie;
  try {
    movie = await getMovieById(id);
  } catch (error) {
    if (error instanceof RestrictedMediaError || error instanceof Error && /404|MOVIE_NOT_FOUND/.test(error.message)) {
      notFound();
    }

    throw error;
  }

  const canonicalSegment = movieSegment(movie);
  if (rawSegment !== canonicalSegment) {
    permanentRedirect(movieHref(movie));
  }

  const backdrop = backdropUrl(movie.backdropPath);
  const poster = posterUrl(movie.posterPath);
  const trailerTarget = "#videos";
  const canonicalUrl = new URL(movieHref(movie), getSiteUrl()).toString();
  const director = movie.crew?.find((member) => member.job === "Director");
  const hasYouTubeVideo = movie.videos.some((video) => video.site === "YouTube" && video.key.trim());
  const movieJsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: safeText(movie.overview, `${movie.title} movie details on MINGFO.`),
    image: [backdrop, poster],
    datePublished: movie.releaseDate || undefined,
    genre: movie.genreNames.length > 0 ? movie.genreNames : undefined,
    duration: movie.runtime > 0 ? `PT${movie.runtime}M` : undefined,
    actor: movie.cast?.map((member) => ({ "@type": "Person", name: member.name })),
    director: director && {
      "@type": "Person",
      name: director.name,
    },
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", getSiteUrl()).toString() },
      { "@type": "ListItem", position: 2, name: "Discover", item: new URL("/discover", getSiteUrl()).toString() },
      { "@type": "ListItem", position: 3, name: movie.title, item: canonicalUrl },
    ],
  };

  return (
    <PageShell className="space-y-12 pb-32 pt-4">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/50">
        <Link href="/" className="transition hover:text-white">Home</Link>
        <span aria-hidden="true">→</span>
        <Link href="/discover" className="transition hover:text-white">Discover</Link>
        <span aria-hidden="true">→</span>
        <span className="max-w-[32ch] truncate text-white/75" aria-current="page">{movie.title}</span>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="relative isolate overflow-hidden border border-white/10 bg-ink-900/50">
        <div className="absolute inset-0">
          <Image src={backdrop} alt={`${movie.title} backdrop`} fill priority unoptimized sizes="100vw" className="object-cover opacity-90" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.06)_0%,_rgba(5,8,22,0.58)_52%,_rgba(5,8,22,0.96)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(90,141,255,0.18),_transparent_34%),radial-gradient(circle_at_82%_18%,_rgba(255,141,79,0.12),_transparent_26%)]" />
        </div>

        <div className="relative grid min-h-[34rem] gap-8 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:px-8 lg:py-8">
          <div className="absolute inset-x-5 top-5 z-20 flex items-center justify-between gap-3 sm:inset-x-6 lg:inset-x-8 lg:top-8">
            <Link
              href="/discover"
              className="inline-flex h-10 items-center border border-white/10 bg-ink-950/70 px-4 text-sm font-medium text-white transition duration-200 hover:bg-white/10"
            >
              Back
            </Link>
          </div>

          <div className="flex max-w-3xl flex-col justify-end gap-6 pt-20 lg:pt-0">
            <div className="space-y-4">
              <p className="text-sm text-ember-300/90">Movie detail</p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/62">
                <span>{formatYear(movie.releaseDate)}</span>
                <span aria-hidden="true">•</span>
                <span>{formatRuntime(movie.runtime)}</span>
                <span aria-hidden="true">•</span>
                <span>★ {formatRating(movie.rating)}</span>
                <span aria-hidden="true">•</span>
                <span>{movie.status}</span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-white/55">
                {movie.genreNames.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>
            </div>

            <p
              className="max-w-2xl text-base leading-7 text-white/75 sm:text-lg"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
              }}
            >
              {safeText(movie.tagline, movie.overview)}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {hasYouTubeVideo && (
                <Link
                  href={trailerTarget}
                  className="inline-flex h-12 items-center border border-white/10 bg-white px-5 text-sm font-semibold text-ink-950 transition duration-200 hover:bg-slate-100"
                >
                  Watch trailer
                </Link>
              )}
              <BookmarkButton movie={movie} className="h-12" />
            </div>
          </div>

          <div className="hidden lg:flex lg:items-end lg:justify-end">
            <div className="relative aspect-[2/3] w-full max-w-[24rem] overflow-hidden border border-white/10 bg-ink-950/70 shadow-[0_26px_90px_rgba(0,0,0,0.42)]">
              <Image src={poster} alt={`Poster for ${movie.title}`} fill unoptimized sizes="(max-width: 1024px) 0px, 24rem" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.00)_0%,_rgba(5,8,22,0.16)_50%,_rgba(5,8,22,0.86)_100%)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 border-t border-white/10 pt-8" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="text-2xl font-semibold tracking-[-0.02em] text-white">Overview</h2>
        <p className="max-w-4xl text-base leading-8 text-white/72">{safeText(movie.overview, `${movie.title} movie details on MINGFO.`)}</p>
      </section>

      <MovieDetailsList movie={movie} />
      <CastList cast={movie.cast} />
      <MovieVideos videos={movie.videos} />
      {movie.recommendations && movie.recommendations.length > 0 && (
        <MovieRail
          title="You may also like"
          href="/discover"
          movies={movie.recommendations.filter((recommendation) => recommendation.id !== movie.id && recommendation.posterPath).slice(0, 6)}
        />
      )}
    </PageShell>
  );
}
