import Link from "next/link";
import { MovieCard } from "@/components/movie-card";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import type { MovieSummary } from "@/lib/types";
import { cn, mediaHref } from "@/lib/utils";

interface MovieRailProps {
  title: string;
  href: string;
  movies: MovieSummary[];
  className?: string;
  actionLabel?: string;
}

export function MovieRail({ title, href, movies, className, actionLabel = "See all" }: MovieRailProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">{title}</h2>
        <Link href={href} className="text-sm font-medium text-white/55 transition hover:text-white">
          {actionLabel}
        </Link>
      </div>

      <HorizontalScroll ariaLabel={`${title} movies`} contentClassName="flex snap-x snap-mandatory gap-4 pb-2">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            href={mediaHref(movie)}
            className="w-[9.75rem] flex-none snap-start sm:w-[11rem] lg:w-[12.5rem]"
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}
