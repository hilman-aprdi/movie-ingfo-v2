import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number) {
  return Number.isFinite(rating) ? rating.toFixed(1) : "0.0";
}

export function hasUsableRating(movie: { rating: number; voteCount?: number }) {
  return Number.isFinite(movie.rating) && movie.rating > 0 && (movie.voteCount === undefined || movie.voteCount > 0);
}

export function formatRuntime(runtime: number) {
  if (!Number.isFinite(runtime) || runtime <= 0) {
    return "Unknown";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

export function formatYear(releaseDate: string | null | undefined, fallback = "Unknown") {
  const value = releaseDate?.trim();
  return value ? value.slice(0, 4) : fallback;
}

export function safeText(value: string | null | undefined, fallback = "Unknown") {
  const text = value?.trim();
  return text ? text : fallback;
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "movie";
}

export function movieHref(movie: { id: number; title: string }) {
  return `/movie/${movie.id}-${slugify(movie.title)}`;
}

export function mediaHref(media: { id: number; title: string; mediaType?: "movie" | "tv" }) {
  const prefix = media.mediaType === "tv" ? "tv" : "movie";
  return `/${prefix}/${media.id}-${slugify(media.title)}`;
}

export function clampPage(page: number, totalPages: number) {
  const safeTotalPages = Math.max(1, Math.floor(totalPages));
  return Math.min(safeTotalPages, Math.max(1, Math.floor(page)));
}
