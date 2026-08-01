import Image from "next/image";
import Link from "next/link";
import type { MovieSummary } from "@/lib/types";
import { posterUrl } from "@/lib/tmdb";
import { formatRating, hasUsableRating, mediaHref } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatReleaseDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

export function ComingSoonList({ movies, mediaType = "movie", actionHref = "/discover?collection=coming-soon", actionLabel = "Discover more →" }: { movies: MovieSummary[]; mediaType?: "movie" | "tv"; actionHref?: string; actionLabel?: string }) {
  if (movies.length === 0) return null;

  return (
    <section className="space-y-5" aria-labelledby="coming-soon-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ember-300/90">Mark the date</p>
          <h2 id="coming-soon-heading" className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">Coming soon</h2>
        </div>
        <Link href={actionHref} className="shrink-0 py-2 text-sm font-medium text-white/65 transition hover:text-ember-200 hover:underline hover:underline-offset-4">{actionLabel}</Link>
      </div>
      <ol className="grid gap-x-8 gap-y-2 border-y border-white/10 py-2 lg:grid-cols-2">
        {movies.map((movie) => (
          <li key={movie.id} className="min-w-0">
            <Link href={mediaHref({ ...movie, mediaType })} className="group grid grid-cols-[72px_minmax(0,1fr)] items-start gap-3 border-b border-white/10 px-1 py-3 transition hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ember-300 sm:gap-4">
              <div className="relative aspect-[2/3] w-16 overflow-hidden border border-white/10 bg-ink-900 sm:w-[72px]">
                <Image src={posterUrl(movie.posterPath, "w185")} alt={movie.title} fill unoptimized sizes="(max-width: 640px) 64px, 72px" className="object-cover transition duration-300 group-hover:scale-[1.02]" />
              </div>
              <div className="min-w-0 self-center py-0.5">
                <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-white transition group-hover:text-ember-200 sm:text-base">{movie.title}</h3>
                <time dateTime={movie.releaseDate} className="mt-1.5 block text-sm text-ember-200/85">{formatReleaseDate(movie.releaseDate)}</time>
                <p className="mt-1 text-xs text-white/45">{movie.genreNames.slice(0, 2).join(" / ") || "Movie"}{hasUsableRating(movie) ? <> <span aria-hidden="true">•</span> ★ {formatRating(movie.rating)}</> : null}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
