"use client";

import { useEffect, useState } from "react";
import type { MovieSummary } from "@/lib/types";
import { isBookmarked, toBookmarkMovie, toggleBookmark } from "@/lib/bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  movie: MovieSummary;
  className?: string;
}

function BookmarkIcon({ saved }: { saved: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} className="h-4 w-4" aria-hidden="true">
      <path d="M6.5 4.75A1.75 1.75 0 0 1 8.25 3h7.5a1.75 1.75 0 0 1 1.75 1.75v16.1l-5.5-3.2-5.5 3.2V4.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function BookmarkButton({ movie, className }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isBookmarked(movie.id));
    sync();

    const onStorage = (event: StorageEvent) => {
      if (event.key === "mingfo-bookmarks") {
        sync();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [movie.id]);

  const handleToggle = () => {
    const next = toggleBookmark(toBookmarkMovie(movie));
    setSaved(next.some((entry) => entry.id === movie.id));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${movie.title} from watchlist` : `Save ${movie.title} to watchlist`}
      className={cn(
        "inline-flex items-center gap-2 border border-white/10 px-4 text-sm font-medium text-white transition duration-200 hover:border-white/20",
        saved ? "bg-white text-ink-950 hover:bg-slate-100" : "bg-ink-950/80 hover:bg-white/10",
        className,
      )}
    >
      <BookmarkIcon saved={saved} />
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
