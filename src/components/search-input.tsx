"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SearchSortOption {
  value: string;
  label: string;
}

interface SearchInputProps {
  action: string;
  label: string;
  buttonLabel?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  debounce?: boolean;
  sort?: string;
  sortOptions?: SearchSortOption[];
  showButtonLabel?: boolean;
  extraParams?: Record<string, string | undefined>;
  focusOnMount?: boolean;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="11" cy="11" r="5.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15.3 15.3 20 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M7 7 17 17M17 7 7 17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SubmitIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M5 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchInput({
  action,
  label,
  buttonLabel = "Search",
  defaultValue,
  placeholder = "Search movies",
  className,
  debounce = false,
  sort,
  sortOptions,
  showButtonLabel = false,
  extraParams,
  focusOnMount = false,
}: SearchInputProps) {
  const id = useId();
  const inputId = `search-${id}`;
  const [value, setValue] = useState(defaultValue ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

  useEffect(() => {
    if (!debounce || value.trim() === (defaultValue ?? "").trim()) return;

    debounceRef.current = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      for (const [key, paramValue] of Object.entries(extraParams ?? {})) {
        if (paramValue) params.set(key, paramValue);
      }
      if (sort) params.set("sort", sort);
      params.set("page", "1");
      router.replace(`${action}?${params.toString()}`, { scroll: false });
    }, 450);

    return () => {
      if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    };
  }, [action, debounce, defaultValue, extraParams, router, sort, value]);

  return (
    <form
      role="search"
      action={action}
      method="get"
      onSubmit={() => {
        if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
      }}
      className={cn("w-full", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-2 border border-white/10 bg-ink-900/78 px-3 shadow-[0_10px_32px_rgba(0,0,0,0.16)] transition focus-within:border-aurora-400/55 focus-within:bg-ink-900/88 sm:h-12">
        <span className="flex-none text-white/42">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          id={inputId}
          name="q"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            className="flex h-7 w-7 flex-none items-center justify-center border border-white/10 text-white/55 transition duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            <ClearIcon />
          </button>
        ) : null}
        <button
          type="submit"
          aria-label={buttonLabel}
          className="inline-flex h-8 flex-none items-center gap-1.5 border border-white/10 bg-white px-2.5 text-xs font-semibold text-ink-950 transition duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
        >
          <SubmitIcon />
          {showButtonLabel ? <span>{buttonLabel}</span> : null}
        </button>
        </div>
        {sortOptions && sortOptions.length > 0 ? (
          <label className="flex h-11 items-center gap-2 border border-white/10 bg-ink-900/78 px-3 text-sm text-white/55 transition focus-within:border-aurora-400/55 sm:h-12 sm:w-48">
            <span className="sr-only">Sort search results</span>
            <select
              name="sort"
              defaultValue={sort ?? sortOptions[0].value}
              onChange={(event) => {
                if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
                const params = new URLSearchParams();
                if (value.trim()) params.set("q", value.trim());
                for (const [key, paramValue] of Object.entries(extraParams ?? {})) {
                  if (paramValue) params.set(key, paramValue);
                }
                params.set("sort", event.target.value);
                params.set("page", "1");
                router.replace(`${action}?${params.toString()}`, { scroll: false });
              }}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-ink-900 text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      {Object.entries(extraParams ?? {}).map(([key, paramValue]) => paramValue ? <input key={key} type="hidden" name={key} value={paramValue} readOnly /> : null)}
      <input type="hidden" name="page" value="1" readOnly />
    </form>
  );
}
