"use client";

import { useEffect, useState } from "react";
import { LandingMovieCard } from "@/components/landing-movie-card";
import { SectionHeading } from "@/components/section-heading";
import { readBookmarks, sortBookmarks } from "@/lib/bookmarks";
import type { BookmarkMovie } from "@/lib/types";
import Link from "next/link";
import { mediaHref } from "@/lib/utils";

export function WatchlistPreview() {
  const [movies, setMovies] = useState<BookmarkMovie[] | null>(null);

  useEffect(() => {
    setMovies(sortBookmarks(readBookmarks(), "recent").slice(0, 4));
  }, []);

  if (movies === null) {
    return (
      <section className="space-y-5" aria-labelledby="watchlist-preview-heading">
        <SectionHeading headingId="watchlist-preview-heading" title="Your watchlist" description="Saved movies stay in your browser and appear here." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="aspect-[2/3] animate-pulse bg-white/10" />)}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5" aria-labelledby="watchlist-preview-heading">
      <SectionHeading
        headingId="watchlist-preview-heading"
        title="Your watchlist"
        description={movies.length > 0 ? "The latest movies you saved for another night." : "Save a movie and keep it close for later."}
        action={<Link href={movies.length > 0 ? "/watchlist" : "/discover"} className="shrink-0 py-2 text-sm font-medium text-white/65 transition hover:text-ember-200 hover:underline hover:underline-offset-4">{movies.length > 0 ? "Open watchlist →" : "Find movies →"}</Link>}
      />
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {movies.map((movie) => <LandingMovieCard key={movie.id} movie={movie} href={mediaHref(movie)} />)}
        </div>
      ) : (
        <div className="flex items-center gap-4 border border-dashed border-white/15 px-5 py-5 text-sm text-white/60">
          <span className="grid h-10 w-10 flex-none place-items-center border border-ember-300/30 text-ember-200" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M6.5 4.75A2.25 2.25 0 0 1 8.75 2.5h6.5a2.25 2.25 0 0 1 2.25 2.25V21l-5.5-3.5L6.5 21V4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-white">No saved movies yet.</p>
            <p className="mt-1 text-xs leading-5 text-white/50">Save a movie while browsing and it will appear here.</p>
          </div>
          <Link href="/discover" className="inline-flex h-10 flex-none items-center border border-white/15 px-3 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">Explore movies</Link>
        </div>
      )}
    </section>
  );
}
