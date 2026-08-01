"use client";

import Image from "next/image";
import Link from "next/link";
import type { MovieSummary } from "@/lib/types";
import { posterUrl } from "@/lib/tmdb";
import { cn, formatRating, formatYear, hasUsableRating } from "@/lib/utils";

interface LandingMovieCardProps {
  movie: MovieSummary;
  href: string;
  className?: string;
}

export function LandingMovieCard({ movie, href, className }: LandingMovieCardProps) {
  return (
    <article className={cn("min-w-0", className)}>
      <Link
        href={href}
        className="group block rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-400/70 focus-visible:ring-offset-4 focus-visible:ring-offset-ink-950"
      >
        <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-ink-900/80 transition duration-300 group-hover:-translate-y-0.5 group-hover:border-white/20 group-hover:shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <Image
            src={posterUrl(movie.posterPath)}
            alt={movie.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 44vw, (max-width: 1024px) 28vw, 18vw"
            className="object-cover transition duration-500 group-hover:scale-[1.015]"
          />
        </div>
        <div className="pt-3">
          <p className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-5 text-white transition group-hover:text-ember-200">{movie.title}</p>
          <div className="mt-1.5 flex min-h-4 items-center justify-between gap-2 text-[11px] text-white/52">
            <span>{formatYear(movie.releaseDate, "TBA")}</span>
            {hasUsableRating(movie) ? <span>★ {formatRating(movie.rating)}</span> : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
