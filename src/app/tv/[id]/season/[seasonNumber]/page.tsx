import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { backdropUrl, getTvById, getTvSeasonById, posterUrl } from "@/lib/tmdb";
import { getSiteUrl } from "@/lib/site";
import { mediaHref, slugify } from "@/lib/utils";

function parseId(value: string | undefined) {
  const match = value?.match(/^(\d+)(?:-|$)/);
  return match ? Number(match[1]) : NaN;
}

export async function generateMetadata({ params }: { params: Promise<{ id?: string; seasonNumber?: string }> }): Promise<Metadata> {
  const resolved = await params;
  const tvId = parseId(resolved.id);
  const seasonNumber = Number(resolved.seasonNumber);
  if (!Number.isFinite(tvId) || tvId <= 0 || !Number.isInteger(seasonNumber) || seasonNumber <= 0) {
    return { title: { absolute: "TV season not found | MINGFO" }, robots: { index: false, follow: true } };
  }

  try {
    const show = await getTvById(tvId);
    const season = show.seasons?.find((item) => item.seasonNumber === seasonNumber);
    const seasonName = season?.name || `Season ${seasonNumber}`;
    const description = `${seasonName} of ${show.title}: air date, episode count, overview, and episode details on MINGFO.`;
    const canonical = `${mediaHref(show)}/season/${seasonNumber}`;
    return {
      title: { absolute: `${show.title} — ${seasonName} Episodes | MINGFO` },
      description,
      alternates: { canonical },
      openGraph: { title: `${show.title} — ${seasonName} Episodes | MINGFO`, description, url: canonical, type: "website", images: [{ url: "/og-image.png", alt: `${show.title} ${seasonName}` }] },
      twitter: { card: "summary_large_image", title: `${show.title} — ${seasonName} Episodes | MINGFO`, description, images: ["/og-image.png"] },
    };
  } catch {
    return { title: { absolute: "TV season not found | MINGFO" }, robots: { index: false, follow: true } };
  }
}

export default async function TvSeasonPage({ params }: { params: Promise<{ id?: string; seasonNumber?: string }> }) {
  const resolved = await params;
  const tvId = parseId(resolved.id);
  const seasonNumber = Number(resolved.seasonNumber);
  if (!Number.isFinite(tvId) || tvId <= 0 || !Number.isInteger(seasonNumber) || seasonNumber <= 0) notFound();

  let show;
  try {
    show = await getTvById(tvId);
  } catch {
    notFound();
  }

  const canonicalTvSegment = `${show.id}-${slugify(show.title)}`;
  if (resolved.id !== canonicalTvSegment) permanentRedirect(`${mediaHref(show)}/season/${seasonNumber}`);

  let season;
  try {
    season = await getTvSeasonById(tvId, seasonNumber);
  } catch {
    notFound();
  }

  const canonicalUrl = `${mediaHref(show)}/season/${seasonNumber}`;
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl.toString() },
      { "@type": "ListItem", position: 2, name: show.title, item: new URL(mediaHref(show), siteUrl).toString() },
      { "@type": "ListItem", position: 3, name: season.name, item: new URL(canonicalUrl, siteUrl).toString() },
    ],
  };

  return (
    <PageShell className="space-y-10 pb-32 pt-4">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white/50">
        <Link href="/" className="hover:text-white">Home</Link><span aria-hidden="true">→</span>
        <Link href={mediaHref(show)} className="hover:text-white">{show.title}</Link><span aria-hidden="true">→</span>
        <span className="text-white/75" aria-current="page">{season.name || `Season ${seasonNumber}`}</span>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="relative isolate overflow-hidden border border-white/10 bg-ink-900/50">
        <div className="absolute inset-0"><Image src={backdropUrl(show.backdropPath)} alt={`${show.title} backdrop`} fill priority unoptimized sizes="100vw" className="object-cover opacity-35" /><div className="absolute inset-0 bg-ink-950/80" /></div>
        <div className="relative grid gap-8 px-5 py-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:px-8 sm:py-10">
          <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-ink-950"><Image src={posterUrl(season.posterPath)} alt={`${season.name} poster for ${show.title}`} fill unoptimized sizes="9rem" className="object-cover" /></div>
          <div className="self-center"><p className="text-sm text-ember-300/90">TV season</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{season.name}</h1><p className="mt-4 text-sm text-white/60">{season.airDate || "Air date unavailable"}{season.episodeCount ? ` • ${season.episodeCount} episodes` : ""}</p>{season.overview && <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">{season.overview}</p>}</div>
        </div>
      </section>
      {season.episodes.length > 0 && <section className="space-y-4" aria-labelledby="episodes-heading"><h2 id="episodes-heading" className="text-2xl font-semibold text-white">Episodes</h2><div className="divide-y divide-white/10 border-y border-white/10">{season.episodes.map((episode) => <article key={episode.id} className="grid gap-3 py-5 sm:grid-cols-[5rem_minmax(0,1fr)]"><p className="text-sm font-medium text-ember-300">Episode {episode.episodeNumber}</p><div><h3 className="text-base font-semibold text-white">{episode.name}</h3>{episode.airDate && <p className="mt-1 text-sm text-white/50">{episode.airDate}{episode.runtime ? ` • ${episode.runtime} min` : ""}</p>}{episode.overview && <p className="mt-2 text-sm leading-6 text-white/65">{episode.overview}</p>}</div></article>)}</div></section>}
    </PageShell>
  );
}
