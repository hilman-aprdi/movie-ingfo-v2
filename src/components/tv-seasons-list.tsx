import Image from "next/image";
import Link from "next/link";
import type { TvSeason } from "@/lib/types";
import { posterUrl } from "@/lib/tmdb";
import { formatYear } from "@/lib/utils";

export function TvSeasonsList({ tvId, tvSlug, seasons }: { tvId: number; tvSlug: string; seasons?: TvSeason[] }) {
  const visibleSeasons = seasons?.filter((season) => season.seasonNumber > 0).slice(0, 12) ?? [];
  if (visibleSeasons.length === 0) return null;

  return (
    <section className="space-y-5 border-t border-white/10 pt-8" aria-labelledby="seasons-heading">
      <div>
        <h2 id="seasons-heading" className="text-2xl font-semibold tracking-[-0.02em] text-white">Seasons</h2>
        <p className="mt-2 text-sm text-white/55">Season information provided by TMDB.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSeasons.map((season) => (
          <Link
            key={season.id}
            href={`/tv/${tvId}-${tvSlug}/season/${season.seasonNumber}`}
            className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border border-white/10 bg-ink-950/40 p-3 transition hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-ink-900">
              <Image src={posterUrl(season.posterPath, "w342")} alt={`${season.name} poster for ${tvSlug}`} fill unoptimized sizes="5rem" className="object-cover transition duration-300 group-hover:scale-[1.02]" />
            </div>
            <div className="min-w-0 self-center">
              <h3 className="line-clamp-2 text-base font-semibold text-white transition group-hover:text-ember-200">{season.name}</h3>
              <p className="mt-2 text-sm text-white/60">{formatYear(season.airDate, "Air date unknown")}</p>
              {season.episodeCount > 0 && <p className="mt-1 text-sm text-white/55">{season.episodeCount} episodes</p>}
              {season.overview && <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/45">{season.overview}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
