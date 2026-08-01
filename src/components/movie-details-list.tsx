import type { MovieDetails } from "@/lib/types";
import { formatRuntime, formatYear } from "@/lib/utils";

function money(value: number) {
  return `$${new Intl.NumberFormat("en-US").format(value)}`;
}

export function MovieDetailsList({ movie }: { movie: MovieDetails }) {
  const director = movie.crew?.find((member) => member.job === "Director")?.name;
  const details = [
    movie.releaseDate && ["Release date", formatYear(movie.releaseDate, movie.releaseDate)] as const,
    movie.runtime > 0 && ["Runtime", formatRuntime(movie.runtime)] as const,
    movie.genreNames.length > 0 && ["Genres", movie.genreNames.join(", ")] as const,
    movie.status && movie.status !== "Unknown" && ["Status", movie.status] as const,
    movie.originalLanguage && ["Original language", movie.originalLanguage.toUpperCase()] as const,
    movie.productionCountries?.length && ["Country", movie.productionCountries.join(", ")] as const,
    director && ["Director", director] as const,
    movie.productionCompanies?.length && ["Production", movie.productionCompanies.join(", ")] as const,
    movie.budget && movie.budget > 0 && ["Budget", money(movie.budget)] as const,
    movie.revenue && movie.revenue > 0 && ["Revenue", money(movie.revenue)] as const,
  ].filter(Boolean) as Array<readonly [string, string]>;

  if (details.length === 0) return null;

  return (
    <section className="space-y-5 border-t border-white/10 pt-8" aria-labelledby="movie-details-heading">
      <h2 id="movie-details-heading" className="text-2xl font-semibold tracking-[-0.02em] text-white">
        Movie details
      </h2>
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
