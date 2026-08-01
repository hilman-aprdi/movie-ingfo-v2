import { z } from "zod";
import type { BookmarkMovie, MovieDetails, MovieSummary } from "@/lib/types";

const STORAGE_KEY = "mingfo-bookmarks";

const bookmarkMovieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  overview: z.string(),
  posterPath: z.string().nullable(),
  backdropPath: z.string().nullable(),
  releaseDate: z.string(),
  rating: z.number().finite(),
  genreIds: z.array(z.number().int()),
  genreNames: z.array(z.string()),
  mediaType: z.enum(["movie", "tv"]).optional(),
  savedAt: z.string(),
});

const bookmarkListSchema = z.array(bookmarkMovieSchema);

function hasWindow() {
  return typeof window !== "undefined";
}

function normalizeBookmarks(bookmarks: BookmarkMovie[]) {
  const seen = new Set<number>();

  return bookmarks.filter((movie) => {
    if (seen.has(movie.id)) {
      return false;
    }

    seen.add(movie.id);
    return true;
  });
}

export function readBookmarks(): BookmarkMovie[] {
  if (!hasWindow()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    const result = bookmarkListSchema.safeParse(parsed);
    if (!result.success) {
      return [];
    }

    return normalizeBookmarks(result.data);
  } catch {
    return [];
  }
}

export function writeBookmarks(bookmarks: BookmarkMovie[]) {
  if (!hasWindow()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // Storage can be unavailable or full; keep the UI usable without throwing.
  }
}

export function toBookmarkMovie(movie: MovieSummary | MovieDetails): BookmarkMovie {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.posterPath,
    backdropPath: movie.backdropPath,
    releaseDate: movie.releaseDate,
    rating: movie.rating,
    genreIds: movie.genreIds,
    genreNames: movie.genreNames,
    mediaType: movie.mediaType,
    savedAt: new Date().toISOString(),
  };
}

export function isBookmarked(id: number, bookmarks = readBookmarks()) {
  return bookmarks.some((movie) => movie.id === id);
}

export function toggleBookmark(movie: BookmarkMovie) {
  const bookmarks = readBookmarks();
  const exists = bookmarks.some((item) => item.id === movie.id);

  const next = exists
    ? bookmarks.filter((item) => item.id !== movie.id)
    : [movie, ...bookmarks.filter((item) => item.id !== movie.id)];

  writeBookmarks(next);
  return next;
}

export function removeBookmark(id: number) {
  const next = readBookmarks().filter((movie) => movie.id !== id);
  writeBookmarks(next);
  return next;
}

export function sortBookmarks(
  bookmarks: BookmarkMovie[],
  mode: "recent" | "az" | "za" = "recent",
) {
  const copy = [...bookmarks];

  if (mode === "az") {
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (mode === "za") {
    return copy.sort((a, b) => b.title.localeCompare(a.title));
  }

  return copy.sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );
}
