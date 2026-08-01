"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageShell } from "@/components/page-shell";
import { posterUrl } from "@/lib/tmdb";
import { readBookmarks, removeBookmark, sortBookmarks } from "@/lib/bookmarks";
import type { BookmarkMovie } from "@/lib/types";
import { formatRating, formatYear, mediaHref } from "@/lib/utils";

function RemoveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M6 7h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 7V5.8c0-.99.8-1.8 1.8-1.8h2.4c.99 0 1.8.8 1.8 1.8V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m8.5 11 .4 6m6.6-6-.4 6M10 11v6m4-6v6M6.8 7l.6 12.2c.05 1 .87 1.8 1.87 1.8h5.46c1 0 1.82-.8 1.87-1.8L17.2 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SavedMovieCard({ movie, onRemove }: { movie: BookmarkMovie; onRemove: (id: number) => void }) {
  const imageSrc = posterUrl(movie.posterPath);

  return (
    <article className="flex h-full flex-col gap-2">
      <Link
        href={mediaHref(movie)}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
      >
        <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-ink-900/80 shadow-[0_14px_34px_rgba(0,0,0,0.22)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-white/20 group-hover:shadow-[0_22px_48px_rgba(0,0,0,0.34)]">
          <Image
            src={imageSrc}
            alt={movie.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 24vw, 18vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.03)_0%,_rgba(5,8,22,0.08)_54%,_rgba(5,8,22,0.8)_100%)]" />
        </div>
      </Link>

      <div className="flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0 flex-1 space-y-1">
          <p
            className="text-sm font-medium text-white/92"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {movie.title}
          </p>
          <p className="text-[11px] text-white/55">
            {formatYear(movie.releaseDate, "TBA")} • ★ {formatRating(movie.rating)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(movie.id)}
          aria-label={`Remove ${movie.title} from watchlist`}
          className="inline-flex h-8 flex-none items-center gap-1 border border-white/10 bg-ink-900/72 px-2.5 text-[11px] font-medium text-white/75 transition duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          <RemoveIcon />
          <span>Remove</span>
        </button>
      </div>
    </article>
  );
}

export function BookmarksPageClient() {
  const [items, setItems] = useState<BookmarkMovie[]>([]);
  const [sortMode, setSortMode] = useState<"recent" | "az" | "za">("recent");

  useEffect(() => {
    const sync = () => setItems(readBookmarks());
    sync();

    const onStorage = (event: StorageEvent) => {
      if (event.key === "mingfo-bookmarks") {
        sync();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sorted = useMemo(() => sortBookmarks(items, sortMode), [items, sortMode]);

  const handleRemove = (id: number) => {
    const next = removeBookmark(id);
    setItems(next);
  };

  return (
    <PageShell className="space-y-7 pb-32 pt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Saved titles</h1>
          <p className="text-sm text-white/55">{sorted.length} movies</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm text-white/55">Sort</span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as "recent" | "az" | "za")}
            className="h-9 border border-white/10 bg-ink-900/80 px-2.5 text-sm text-white outline-none transition focus:border-aurora-400/60"
          >
            <option value="recent">Recently saved</option>
            <option value="az">Name (A-Z)</option>
            <option value="za">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="No movies saved yet"
          description="Save a movie from the home, discover, or detail page and it will appear here."
          actionLabel="Start exploring"
          actionHref="/discover"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {sorted.map((movie) => (
            <SavedMovieCard key={movie.id} movie={movie} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
