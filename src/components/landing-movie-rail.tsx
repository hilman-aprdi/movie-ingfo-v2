import Link from "next/link";
import type { MovieSummary } from "@/lib/types";
import { LandingMovieCard } from "@/components/landing-movie-card";
import { movieHref } from "@/lib/utils";

interface LandingMovieRailProps {
  title: string;
  href: string;
  movies: MovieSummary[];
  actionLabel?: string;
}

export function LandingMovieRail({ title, href, movies, actionLabel = "View all" }: LandingMovieRailProps) {
  if (movies.length === 0) return null;

  return (
    <section className="space-y-5" aria-labelledby="landing-trending-heading">
      <div className="flex items-end justify-between gap-4">
        <h2 id="landing-trending-heading" className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">{title}</h2>
        <Link href={href} className="shrink-0 py-2 text-sm font-medium text-white/65 transition hover:text-ember-200 hover:underline hover:underline-offset-4">
          {actionLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="no-scrollbar grid grid-flow-col auto-cols-[9.4rem] gap-4 overflow-x-auto pb-2 sm:auto-cols-[11rem] lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-4 xl:grid-cols-5 min-[1400px]:grid-cols-6">
        {movies.map((movie) => <LandingMovieCard key={movie.id} movie={movie} href={movieHref(movie)} />)}
      </div>
    </section>
  );
}
