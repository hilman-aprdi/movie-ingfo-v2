import Image from "next/image";
import Link from "next/link";
import type { MovieSummary } from "@/lib/types";
import { backdropUrl } from "@/lib/tmdb";
import { formatRating, formatYear, hasUsableRating, mediaHref } from "@/lib/utils";

export function PopularMovieCard({ movie }: { movie: MovieSummary }) {
  return (
    <Link
      href={mediaHref(movie)}
      className="group grid grid-cols-[8rem_minmax(0,1fr)] gap-4 border border-white/10 bg-ink-900/55 p-2.5 transition duration-300 hover:border-white/20 hover:bg-ink-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300 sm:grid-cols-[10rem_minmax(0,1fr)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-950">
        <Image src={backdropUrl(movie.backdropPath, "w780")} alt={`${movie.title} backdrop`} fill unoptimized sizes="(max-width: 640px) 8rem, 10rem" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="min-w-0 self-center">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-white group-hover:text-ember-200">{movie.title}</h3>
        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-white/52">
          <span>{formatYear(movie.releaseDate, "TBA")}</span>
          {hasUsableRating(movie) ? <><span aria-hidden="true">•</span><span>★ {formatRating(movie.rating)}</span></> : null}
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/45">{movie.genreNames.slice(0, 2).join(" / ") || "Movie"}</p>
      </div>
    </Link>
  );
}
