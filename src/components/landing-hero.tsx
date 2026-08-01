import Image from "next/image";
import Link from "next/link";
import type { MovieSummary } from "@/lib/types";
import { backdropUrl, posterUrl } from "@/lib/tmdb";
import { formatRating, formatRuntime, formatYear, movieHref, safeText } from "@/lib/utils";

interface LandingHeroProps {
  movie: MovieSummary;
  genreNames: string[];
  runtime?: number;
}

export function LandingHero({ movie, genreNames, runtime = 0 }: LandingHeroProps) {
  const labels = genreNames.slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <Image src={backdropUrl(movie.backdropPath)} alt="" fill priority unoptimized sizes="100vw" className="object-cover opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(5,8,22,0.96)_0%,_rgba(5,8,22,0.76)_34%,_rgba(5,8,22,0.30)_72%,_rgba(5,8,22,0.52)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.12)_0%,_rgba(5,8,22,0.16)_46%,_rgba(5,8,22,0.96)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(90,141,255,0.16),_transparent_34%),radial-gradient(circle_at_84%_18%,_rgba(255,141,79,0.12),_transparent_25%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[clamp(34rem,calc(100svh-4.5rem),46rem)] w-full max-w-[88rem] gap-10 px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1.32fr)_minmax(17rem,0.68fr)] lg:gap-8 lg:px-8 lg:pb-14 lg:pt-14 xl:gap-12">
        <div className="flex max-w-[42rem] flex-col justify-end gap-6">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-ember-300/90">
            <span className="h-2 w-2 rounded-full bg-ember-400" />
            Trending now
          </p>

          <p className="max-w-[34rem] text-sm leading-6 text-white/65 sm:text-base">
            Find something worth watching, without the endless scroll.
          </p>

          <div className="space-y-4">
            <h1 className="max-w-[12ch] text-balance text-[clamp(3rem,6vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white [text-shadow:0_4px_28px_rgba(0,0,0,0.28)]">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/62 sm:text-[15px]">
              <span>{formatYear(movie.releaseDate)}</span>
              <span aria-hidden="true">•</span>
              <span className="max-w-[32ch] truncate">{labels.join(" / ") || "Movie"}</span>
              <span aria-hidden="true">•</span>
              <span>{formatRuntime(runtime)}</span>
              <span aria-hidden="true">•</span>
              <span>★ {formatRating(movie.rating)}</span>
            </div>
            <p
              className="max-w-[38rem] text-base leading-7 text-white/78 sm:text-lg"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
              }}
            >
              {safeText(movie.overview, "Discover trending movies, browse genres, and save the titles you want to remember.")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/discover"
              className="inline-flex h-12 items-center border border-white/10 bg-white px-5 text-sm font-semibold text-ink-950 transition duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
            >
              Explore movies
            </Link>
            <Link
              href={movieHref(movie)}
              className="inline-flex h-12 items-center border border-white/15 bg-ink-950/72 px-5 text-sm font-medium text-white transition duration-200 hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
            >
              View details
            </Link>
          </div>
        </div>

        <div className="relative flex items-end justify-center lg:justify-end">
          <div className="relative aspect-[2/3] w-full max-w-[17rem] overflow-hidden border border-white/10 bg-ink-950/60 shadow-[0_28px_100px_rgba(0,0,0,0.42)] sm:max-w-[18rem] lg:max-w-[17rem] xl:max-w-[19rem]">
            <div className="absolute inset-0">
              <Image
                src={posterUrl(movie.posterPath)}
                alt={movie.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 74vw, (max-width: 1024px) 18rem, 19rem"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.00)_0%,_rgba(5,8,22,0.20)_48%,_rgba(5,8,22,0.88)_100%)]" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">Featured movie</p>
              <h2 className="mt-3 text-3xl font-semibold leading-[1] tracking-[-0.04em] text-white sm:text-4xl">{movie.title}</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
