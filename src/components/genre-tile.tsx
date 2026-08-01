import Link from "next/link";
import Image from "next/image";
import type { Genre } from "@/lib/types";
import { backdropUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

const tileBackgrounds = [
  "linear-gradient(180deg, rgba(90, 141, 255, 0.20) 0%, rgba(5, 8, 22, 0.96) 100%)",
  "linear-gradient(180deg, rgba(255, 141, 79, 0.18) 0%, rgba(5, 8, 22, 0.96) 100%)",
  "linear-gradient(180deg, rgba(123, 184, 255, 0.18) 0%, rgba(5, 8, 22, 0.96) 100%)",
  "linear-gradient(180deg, rgba(255, 207, 155, 0.16) 0%, rgba(5, 8, 22, 0.96) 100%)",
];

function genreLabel(name: string) {
  return name === "Science Fiction" ? "Sci-Fi" : name;
}

export function GenreTile({ genre, index, showDescription = true, imagePath = null, mediaType = "movie" }: { genre: Genre; index: number; showDescription?: boolean; imagePath?: string | null; mediaType?: "movie" | "tv" }) {
  const href = `/discover?genre=${genre.id}&name=${encodeURIComponent(genre.name)}&type=${mediaType}&page=1`;
  const background = tileBackgrounds[index % tileBackgrounds.length];

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-28 items-end overflow-hidden border border-white/10 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300",
      )}
      style={{ backgroundImage: background }}
    >
      {imagePath ? <Image src={backdropUrl(imagePath, "w780")} alt="" fill unoptimized sizes="(max-width: 640px) 45vw, 25vw" className="object-cover opacity-65 transition duration-500 group-hover:scale-[1.03]" /> : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_30%)] opacity-70" />
      {imagePath ? <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,8,22,0.12),_rgba(5,8,22,0.92))]" /> : null}
      <div className="relative flex w-full items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className={cn("truncate font-semibold text-white", imagePath ? "text-xl" : "text-lg")}>{genreLabel(genre.name)}</h3>
          {showDescription ? <p className="mt-1 text-xs text-white/45">Browse films</p> : null}
        </div>
        <span className="grid h-10 w-10 flex-none place-items-center border border-white/10 bg-white/5 text-lg text-white/80 transition duration-300 group-hover:bg-white/10 group-hover:text-white">
          →
        </span>
      </div>
    </Link>
  );
}
