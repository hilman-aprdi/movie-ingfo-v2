"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/types";

const typeOrder = ["Trailer", "Teaser", "Clip", "Featurette", "Behind the Scenes"];

function rank(video: Video) {
  const typeRank = typeOrder.indexOf(video.type);
  const officialRank = video.official ? 0 : 1;
  const officialTrailerRank = video.name.toLowerCase().includes("official trailer") ? 0 : 1;
  return [officialRank, typeRank === -1 ? typeOrder.length : typeRank, officialTrailerRank];
}

function normalizeVideos(videos: Video[]) {
  const seen = new Set<string>();
  return videos
    .filter((video) => video.site === "YouTube" && video.key.trim())
    .filter((video) => !seen.has(video.key) && seen.add(video.key))
    .sort((a, b) => {
      const left = rank(a);
      const right = rank(b);
      return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
    });
}

function thumbnailUrl(key: string) {
  return `https://i.ytimg.com/vi/${key}/hqdefault.jpg`;
}

function VideoThumbnail({ video, onSelect, featured = false }: { video: Video; onSelect: () => void; featured?: boolean }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative block w-full overflow-hidden border border-white/10 bg-ink-900 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300 ${featured ? "aspect-video" : "aspect-video"}`}
      aria-label={`Play ${video.name}`}
    >
      <Image src={thumbnailUrl(video.key)} alt={`${video.name} thumbnail`} fill unoptimized sizes={featured ? "(max-width: 1024px) 100vw, 65vw" : "(max-width: 768px) 100vw, 33vw"} className="object-cover transition duration-300 group-hover:scale-[1.02]" />
      <span className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-950 shadow-lg transition group-hover:scale-105" aria-hidden="true">
          <span className="ml-1 text-lg">▶</span>
        </span>
      </span>
      <span className="absolute inset-x-4 bottom-3 line-clamp-2 text-sm font-medium text-white">{video.name}</span>
    </button>
  );
}

export function MovieVideos({ videos }: { videos: Video[] }) {
  const playable = normalizeVideos(videos);
  const [selected, setSelected] = useState<Video | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected) return;

    const frame = window.requestAnimationFrame(() => {
      const player = playerRef.current;
      if (!player) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      player.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
        inline: "nearest",
      });
      player.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selected]);

  if (playable.length === 0) return null;

  const featured = selected ?? playable[0];
  const moreVideos = playable.filter((video) => video.key !== featured.key).slice(0, 7);

  return (
    <section id="videos" className="space-y-6 border-t border-white/10 pt-8" aria-labelledby="videos-heading">
      <div>
        <h2 id="videos-heading" className="text-2xl font-semibold tracking-[-0.02em] text-white">Videos</h2>
        <p className="mt-2 text-sm text-white/55">Official trailers and clips from TMDB.</p>
      </div>

      <div ref={playerRef} tabIndex={-1} className="scroll-my-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">
        {selected ? (
          <div className="aspect-video overflow-hidden border border-white/10 bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selected.key}`}
              title={selected.name}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : (
          <VideoThumbnail video={featured} onSelect={() => setSelected(featured)} featured />
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/60">
          <span className="font-medium text-white/85">{featured.name}</span>
          <span aria-hidden="true">•</span>
          <span>{featured.type}</span>
          {featured.official && <span className="text-ember-300">Official</span>}
        </div>
      </div>

      {moreVideos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">More videos</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moreVideos.map((video) => (
              <div key={video.key} className="min-w-0">
                <VideoThumbnail video={video} onSelect={() => setSelected(video)} />
                <div className="mt-2 flex flex-wrap gap-x-2 text-xs text-white/50">
                  <span>{video.type}</span>
                  {video.official && <span className="text-ember-300">Official</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
