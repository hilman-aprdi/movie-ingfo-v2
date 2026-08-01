"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { posterUrl } from "@/lib/tmdb";
import type { MovieSummary } from "@/lib/types";
import { cn, formatRating, formatYear } from "@/lib/utils";
import { hasUsableRating } from "@/lib/utils";

interface MovieCardProps {
  movie: MovieSummary;
  href: string;
  actionSlot?: ReactNode;
  className?: string;
  hideInvalidRating?: boolean;
}

export function MovieCard({ movie, href, actionSlot, className, hideInvalidRating = false }: MovieCardProps) {
  const imageSrc = posterUrl(movie.posterPath);

  return (
    <article className={cn("relative", className)}>
      <Link href={href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950">
        <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-ink-900/80 shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition duration-300 group-hover:-translate-y-1 group-hover:border-white/20 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.36)]">
          <Image
            src={imageSrc}
            alt={movie.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 18vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            priority={false}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.02)_0%,_rgba(5,8,22,0.12)_45%,_rgba(5,8,22,0.88)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p
              className="text-sm font-semibold text-white"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {movie.title}
            </p>
            <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-white/62">
              <span>{formatYear(movie.releaseDate, "TBA")}</span>
              {!hideInvalidRating || hasUsableRating(movie) ? <span>★ {formatRating(movie.rating)}</span> : null}
            </div>
          </div>
        </div>
      </Link>

      {actionSlot ? <div className="absolute right-1 top-1 z-20">{actionSlot}</div> : null}
    </article>
  );
}
