import type { TvDetails } from "@/lib/types";
import { formatYear } from "@/lib/utils";

export function TvDetailsList({ show }: { show: TvDetails }) {
  const details = [
    show.releaseDate && ["First air date", formatYear(show.releaseDate, show.releaseDate)] as const,
    show.lastAirDate && ["Last air date", formatYear(show.lastAirDate, show.lastAirDate)] as const,
    show.status !== "Unknown" && show.status && ["Status", show.status] as const,
    show.numberOfSeasons && show.numberOfSeasons > 0 && ["Seasons", String(show.numberOfSeasons)] as const,
    show.numberOfEpisodes && show.numberOfEpisodes > 0 && ["Episodes", String(show.numberOfEpisodes)] as const,
    show.runtime > 0 && ["Episode runtime", `${show.runtime} min`] as const,
    show.genreNames.length > 0 && ["Genres", show.genreNames.join(", ")] as const,
    show.originalLanguage && ["Original language", show.originalLanguage.toUpperCase()] as const,
    show.originCountries?.length && ["Origin country", show.originCountries.join(", ")] as const,
    show.networks?.length && ["Networks", show.networks.join(", ")] as const,
    show.creators?.length && ["Created by", show.creators.join(", ")] as const,
    show.productionCompanies?.length && ["Production", show.productionCompanies.join(", ")] as const,
  ].filter(Boolean) as Array<readonly [string, string]>;

  if (details.length === 0) return null;

  return (
    <section className="space-y-5 border-t border-white/10 pt-8" aria-labelledby="series-details-heading">
      <h2 id="series-details-heading" className="text-2xl font-semibold tracking-[-0.02em] text-white">Series details</h2>
      <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {details.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-[0.12em] text-white/42">{label}</dt>
            <dd className="mt-1 break-words text-sm leading-6 text-white/78">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
