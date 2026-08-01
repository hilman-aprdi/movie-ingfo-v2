import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CastList } from "@/components/cast-list";
import { MovieRail } from "@/components/movie-rail";
import { MovieVideos } from "@/components/movie-videos";
import { PageShell } from "@/components/page-shell";
import { TvDetailsList } from "@/components/tv-details-list";
import { TvSeasonsList } from "@/components/tv-seasons-list";
import { backdropUrl, getTvById, posterUrl, RestrictedMediaError, TmdbRequestError } from "@/lib/tmdb";
import { getSiteUrl } from "@/lib/site";
import { formatRating, formatYear, mediaHref, safeText, slugify } from "@/lib/utils";

function firstSegment(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseTvId(segment: string | undefined) {
  const match = segment?.match(/^(\d+)(?:-|$)/);
  return match ? Number(match[1]) : NaN;
}

function tvSegment(show: { id: number; title: string }) {
  return `${show.id}-${slugify(show.title)}`;
}

export async function generateMetadata({ params }: { params: Promise<{ id?: string | string[] }> }): Promise<Metadata> {
  const rawSegment = firstSegment((await params).id);
  const id = parseTvId(rawSegment);
  if (!Number.isFinite(id) || id <= 0) notFound();

  try {
    const show = await getTvById(id);
    const canonical = mediaHref(show);
    const year = formatYear(show.releaseDate, "");
    const description = `View the synopsis, cast, seasons, episode count, rating, and details for ${show.title}${year ? ` (${year})` : ""} on MINGFO.`;
    const image = backdropUrl(show.backdropPath, "w1280");
    return {
      title: { absolute: `${show.title}${year ? ` (${year})` : ""} — Seasons, Cast & Episodes | MINGFO` },
      description,
      alternates: { canonical },
      openGraph: { type: "website", title: `${show.title}${year ? ` (${year})` : ""} — Seasons, Cast & Episodes | MINGFO`, description, url: canonical, images: [{ url: image, alt: `${show.title} backdrop` }] },
      twitter: { card: "summary_large_image", title: `${show.title}${year ? ` (${year})` : ""} — Seasons, Cast & Episodes | MINGFO`, description, images: [image] },
    };
  } catch (error) {
    if (error instanceof RestrictedMediaError || error instanceof TmdbRequestError && error.status === 404) {
      notFound();
    }
    return { title: "TV show not found", robots: { index: false, follow: true } };
  }
}

export default async function TvDetailPage({ params }: { params: Promise<{ id?: string | string[] }> }) {
  const rawSegment = firstSegment((await params).id);
  const id = parseTvId(rawSegment);
  if (!Number.isFinite(id) || id <= 0) notFound();

  let show;
  try {
    show = await getTvById(id);
  } catch (error) {
    if (error instanceof RestrictedMediaError) notFound();
    notFound();
  }

  if (rawSegment !== tvSegment(show)) permanentRedirect(mediaHref(show));

  const canonicalUrl = new URL(mediaHref(show), getSiteUrl()).toString();
  const backdrop = backdropUrl(show.backdropPath);
  const poster = posterUrl(show.posterPath);
  const hasYouTubeVideo = show.videos.some((video) => video.site === "YouTube" && video.key.trim());
  const tvJsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.title,
    description: safeText(show.overview, `${show.title} TV series details on MINGFO.`),
    image: [backdrop, poster],
    dateCreated: show.releaseDate || undefined,
    genre: show.genreNames.length > 0 ? show.genreNames : undefined,
    actor: show.cast?.map((member) => ({ "@type": "Person", name: member.name })),
    creator: show.creators?.map((creator) => ({ "@type": "Person", name: creator })),
    numberOfSeasons: show.numberOfSeasons || undefined,
    numberOfEpisodes: show.numberOfEpisodes || undefined,
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", getSiteUrl()).toString() },
      { "@type": "ListItem", position: 2, name: "TV Shows", item: new URL("/discover?type=tv", getSiteUrl()).toString() },
      { "@type": "ListItem", position: 3, name: show.title, item: canonicalUrl },
    ],
  };

  return (
    <PageShell className="space-y-12 pb-32 pt-4">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/50">
        <Link href="/" className="transition hover:text-white">Home</Link><span aria-hidden="true">→</span>
        <Link href="/discover?type=tv" className="transition hover:text-white">TV Shows</Link><span aria-hidden="true">→</span>
        <span className="max-w-[32ch] truncate text-white/75" aria-current="page">{show.title}</span>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tvJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="relative isolate overflow-hidden border border-white/10 bg-ink-900/50">
        <div className="absolute inset-0">
          <Image src={backdrop} alt={`${show.title} backdrop`} fill priority unoptimized sizes="100vw" className="object-cover opacity-90" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.08)_0%,_rgba(5,8,22,0.62)_52%,_rgba(5,8,22,0.97)_100%)]" />
        </div>
        <div className="relative grid min-h-[34rem] gap-8 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:px-8 lg:py-8">
          <div className="absolute inset-x-5 top-5 z-20 flex items-center justify-between gap-3 sm:inset-x-6 lg:inset-x-8 lg:top-8">
            <Link href="/discover?type=tv" className="inline-flex h-10 items-center border border-white/10 bg-ink-950/70 px-4 text-sm font-medium text-white transition hover:bg-white/10">Back</Link>
          </div>
          <div className="flex max-w-3xl flex-col justify-end gap-6 pt-20 lg:pt-0">
            <div className="space-y-4">
              <p className="text-sm text-ember-300/90">TV series</p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">{show.title}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/65">
                <span>{formatYear(show.releaseDate)}</span><span aria-hidden="true">•</span>
                <span>{show.numberOfSeasons ? `${show.numberOfSeasons} seasons` : "TV series"}</span><span aria-hidden="true">•</span>
                <span>{show.numberOfEpisodes ? `${show.numberOfEpisodes} episodes` : "Series"}</span><span aria-hidden="true">•</span>
                <span>★ {formatRating(show.rating)}</span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-white/55">{show.genreNames.map((genre) => <span key={genre}>{genre}</span>)}</div>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/75 sm:text-lg" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, overflow: "hidden" }}>{safeText(show.tagline, show.overview)}</p>
            <div className="flex flex-wrap items-center gap-3">
              {hasYouTubeVideo && <Link href="#videos" className="inline-flex h-12 items-center border border-white/10 bg-white px-5 text-sm font-semibold text-ink-950 transition hover:bg-slate-100">Watch trailer</Link>}
            </div>
          </div>
          <div className="hidden lg:flex lg:items-end lg:justify-end"><div className="relative aspect-[2/3] w-full max-w-[22rem] overflow-hidden border border-white/10 bg-ink-950/70 shadow-[0_26px_90px_rgba(0,0,0,0.42)]"><Image src={poster} alt={`Poster for ${show.title}`} fill unoptimized sizes="(max-width: 1024px) 0px, 22rem" className="object-cover" /></div></div>
        </div>
      </section>

      <section className="space-y-4 border-t border-white/10 pt-8" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="text-2xl font-semibold tracking-[-0.02em] text-white">Overview</h2>
        <p className="max-w-4xl text-base leading-8 text-white/72">{safeText(show.overview, `${show.title} TV series details on MINGFO.`)}</p>
      </section>
      <TvDetailsList show={show} />
      <CastList cast={show.cast} />
      <TvSeasonsList tvId={show.id} tvSlug={slugify(show.title)} seasons={show.seasons} />
      <MovieVideos videos={show.videos} />
      {show.recommendations && <MovieRail title="You may also like" href="/discover?type=tv" actionLabel="Browse TV shows" movies={show.recommendations.filter((recommendation) => recommendation.id !== show.id && recommendation.posterPath).slice(0, 6)} />}
    </PageShell>
  );
}
