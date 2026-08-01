import Image from "next/image";
import Link from "next/link";
import type { MovieSummary } from "@/lib/types";
import { backdropUrl } from "@/lib/tmdb";
import { formatRating, formatYear, hasUsableRating, mediaHref } from "@/lib/utils";

export function RankedMediaList({ items }: { items: MovieSummary[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.slice(0, 5).map((item, index) => (
        <Link key={item.id} href={mediaHref(item)} className="group grid grid-cols-[2.25rem_7rem_minmax(0,1fr)] items-center gap-3 border-b border-white/10 py-3 transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">
          <span className="text-sm font-semibold text-ember-300/80">{String(index + 1).padStart(2, "0")}</span>
          <div className="relative aspect-[16/10] overflow-hidden bg-ink-900"><Image src={backdropUrl(item.backdropPath, "w780")} alt={`${item.title} backdrop`} fill unoptimized sizes="7rem" className="object-cover transition duration-300 group-hover:scale-[1.02]" /></div>
          <div className="min-w-0"><h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-ember-200">{item.title}</h3><p className="mt-1 text-xs text-white/50">{formatYear(item.releaseDate, "TBA")}{hasUsableRating(item) ? ` • ★ ${formatRating(item.rating)}` : ""}</p></div>
        </Link>
      ))}
    </div>
  );
}
