"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Genre } from "@/lib/types";
import type { DiscoverMediaType } from "@/lib/tmdb";

interface DiscoverFiltersProps {
  mediaType: DiscoverMediaType;
  genres: Genre[];
  genre?: string;
  year?: string;
  rating?: string;
  language?: string;
  sort?: string;
  resultsMode?: boolean;
}

interface FilterState {
  genre: string;
  year: string;
  rating: string;
  language: string;
  sort: string;
}

function getInitialState({ genre, year, rating, language, sort }: Pick<DiscoverFiltersProps, "genre" | "year" | "rating" | "language" | "sort">): FilterState {
  return {
    genre: genre ?? "",
    year: year ?? "",
    rating: rating ?? "",
    language: language ?? "",
    sort: sort ?? "popularity.desc",
  };
}

const popularLanguages = [
  ["ar", "Arabic"],
  ["zh", "Chinese"],
  ["en", "English"],
  ["fr", "French"],
  ["de", "German"],
  ["hi", "Hindi"],
  ["id", "Indonesian"],
  ["it", "Italian"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["pt", "Portuguese"],
  ["es", "Spanish"],
  ["th", "Thai"],
] as const;

function FilterFields({ mediaType, genres, values, onChange, includeSort = true }: { mediaType: DiscoverMediaType; genres: Genre[]; values: FilterState; onChange: (field: keyof FilterState, value: string) => void; includeSort?: boolean }) {
  return (
    <>
      <input type="hidden" name="type" value={mediaType} />
      <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs text-white/50">
        <span>Genre</span>
        <select name="genre" value={values.genre} onChange={(event) => onChange("genre", event.target.value)} className="h-10 border border-white/10 bg-ink-900 px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-ember-300"><option value="">All genres</option>{genres.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      </label>
      <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs text-white/50"><span>Year</span><input name="year" type="number" min="1900" max="2100" placeholder="Any year" value={values.year} onChange={(event) => onChange("year", event.target.value)} className="h-10 border border-white/10 bg-ink-900 px-3 text-sm text-white outline-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-ember-300" /></label>
      <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs text-white/50"><span>Minimum rating</span><select name="rating" value={values.rating} onChange={(event) => onChange("rating", event.target.value)} className="h-10 border border-white/10 bg-ink-900 px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-ember-300"><option value="">Any rating</option><option value="6">6+</option><option value="7">7+</option><option value="8">8+</option><option value="9">9+</option></select></label>
      <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs text-white/50"><span>Language</span><select name="language" value={values.language} onChange={(event) => onChange("language", event.target.value)} className="h-10 border border-white/10 bg-ink-900 px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-ember-300"><option value="">Any language</option>{popularLanguages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
      {includeSort ? <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs text-white/50"><span>Sort</span><select name="sort" value={values.sort} onChange={(event) => onChange("sort", event.target.value)} className="h-10 border border-white/10 bg-ink-900 px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-ember-300"><option value="popularity.desc">Popularity</option><option value="vote_average.desc">Highest rated</option><option value="primary_release_date.desc">Newest</option><option value="primary_release_date.asc">Oldest</option></select></label> : null}
      <input type="hidden" name="page" value="1" />
    </>
  );
}

export function DiscoverFilters(props: DiscoverFiltersProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FilterState>(() => getInitialState(props));
  const activeCount = [values.genre, values.year, values.rating, values.language].filter(Boolean).length;
  const clearHref = `/discover?type=${props.mediaType}`;

  useEffect(() => {
    setValues(getInitialState({ genre: props.genre, year: props.year, rating: props.rating, language: props.language, sort: props.sort }));
  }, [props.genre, props.year, props.rating, props.language, props.sort]);

  const onChange = (field: keyof FilterState, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 md:hidden">
        <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 flex-1 items-center justify-center border border-white/10 bg-ink-900 px-4 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">Filters{activeCount > 0 ? ` (${activeCount})` : ""}</button>
        <form action="/discover" method="get" className="min-w-0 flex-1">
          <input type="hidden" name="type" value={props.mediaType} /><input type="hidden" name="genre" value={values.genre} /><input type="hidden" name="year" value={values.year} /><input type="hidden" name="rating" value={values.rating} /><input type="hidden" name="language" value={values.language} /><input type="hidden" name="page" value="1" />
          <label className="sr-only" htmlFor="mobile-sort">Sort results</label>
          <select id="mobile-sort" name="sort" value={values.sort} className="h-11 w-full border border-white/10 bg-ink-900 px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-ember-300" onChange={(event) => { onChange("sort", event.target.value); event.currentTarget.form?.requestSubmit(); }}><option value="popularity.desc">Sort: Popularity</option><option value="vote_average.desc">Sort: Highest rated</option><option value="primary_release_date.desc">Sort: Newest</option><option value="primary_release_date.asc">Sort: Oldest</option></select>
        </form>
      </div>
      {open ? <div className="fixed inset-0 z-50 flex items-end bg-black/70 md:hidden" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><div role="dialog" aria-modal="true" aria-labelledby="mobile-filters-title" className="max-h-[calc(100dvh-4.5rem)] w-full touch-pan-y overscroll-contain overflow-y-auto border-t border-white/15 bg-ink-950 p-4 pb-[calc(1rem+env(safe-area-inset-bottom)+4rem)] shadow-2xl"><div className="sticky top-0 z-10 -mx-4 flex items-center justify-between gap-4 border-b border-white/10 bg-ink-950 px-4 pb-4"><h2 id="mobile-filters-title" className="text-lg font-semibold text-white">Filters</h2><button type="button" onClick={() => setOpen(false)} className="h-9 border border-white/10 px-3 text-sm text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">Close</button></div><form action="/discover" method="get" className="mt-5 space-y-4"><div className="grid gap-3 sm:grid-cols-2"><FilterFields mediaType={props.mediaType} genres={props.genres} values={values} onChange={onChange} includeSort={false} /></div><div className="flex items-center justify-between gap-3"><Link href={clearHref} className="text-sm text-white/55 hover:text-white">Clear filters</Link><button type="submit" className="h-10 bg-white px-4 text-sm font-semibold text-ink-950 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">Apply filters</button></div></form></div></div> : null}
      <form action="/discover" method="get" className="hidden items-end gap-3 border-y border-white/10 py-4 md:flex"><div className="flex min-w-0 flex-1 flex-wrap gap-3"><FilterFields mediaType={props.mediaType} genres={props.genres} values={values} onChange={onChange} /></div><div className="flex items-center gap-3 pb-0.5"><Link href={clearHref} className="text-sm text-white/55 hover:text-white">Clear</Link><button type="submit" className="h-10 bg-white px-4 text-sm font-semibold text-ink-950 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300">Apply</button></div></form>
    </div>
  );
}
