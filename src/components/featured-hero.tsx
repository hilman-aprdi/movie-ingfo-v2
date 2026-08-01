import Image from "next/image";
import Link from "next/link";
import { BookmarkButton } from "@/components/bookmark-button";
import type { MovieSummary } from "@/lib/types";
import { backdropUrl, posterUrl } from "@/lib/tmdb";
import { formatRating, formatYear, safeText } from "@/lib/utils";

interface FeaturedHeroProps {
  movie: MovieSummary;
  href: string;
}

export function FeaturedHero({ movie, href }: FeaturedHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border border-white/10 bg-ink-900/50">
      <div className="absolute inset-0">
        <Image
          src={backdropUrl(movie.backdropPath)}
          alt=""
          fill
          unoptimized
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.10)_0%,_rgba(5,8,22,0.58)_54%,_rgba(5,8,22,0.96)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(90,141,255,0.18),_transparent_36%),radial-gradient(circle_at_84%_18%,_rgba(255,141,79,0.14),_transparent_26%)]" />
      </div>

      <div className="relative grid min-h-[32rem] gap-8 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:px-8 lg:py-8">
        <div className="flex max-w-3xl flex-col justify-end gap-6">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-ember-300/90">
            <span className="h-2 w-2 rounded-full bg-ember-400" />
            Trending now
          </p>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/60">
              <span>{formatYear(movie.releaseDate)}</span>
              <span aria-hidden="true">•</span>
              <span className="max-w-[30ch] truncate">{movie.genreNames.slice(0, 3).join(" / ") || "Movie"}</span>
              <span aria-hidden="true">•</span>
              <span>★ {formatRating(movie.rating)}</span>
            </div>
            <p
              className="max-w-2xl text-base leading-7 text-white/74 sm:text-lg"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
              }}
            >
              {safeText(movie.overview, "No overview available.")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={href}
              className="inline-flex h-12 items-center border border-white/10 bg-white px-5 text-sm font-semibold text-ink-950 transition duration-200 hover:bg-slate-100"
            >
              View details
            </Link>
            <BookmarkButton
              movie={movie}
              className="inline-flex h-12 items-center gap-2 border border-white/10 bg-ink-950/80 px-4 text-sm font-medium text-white transition duration-200 hover:border-white/20 hover:bg-white/10"
            />
          </div>
        </div>

        <div className="hidden lg:flex lg:items-end lg:justify-end">
          <div className="relative aspect-[2/3] w-full max-w-[24rem] overflow-hidden border border-white/10 bg-ink-950/70 shadow-[0_26px_90px_rgba(0,0,0,0.42)]">
          <Image
            src={posterUrl(movie.posterPath)}
            alt={movie.title}
            fill
            unoptimized
              priority
              sizes="(max-width: 1024px) 0px, 24rem"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.00)_0%,_rgba(5,8,22,0.16)_50%,_rgba(5,8,22,0.86)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
