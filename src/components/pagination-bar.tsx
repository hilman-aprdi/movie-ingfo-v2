"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildQueryHref } from "@/lib/tmdb";

interface PaginationBarProps {
  basePath: string;
  page: number;
  totalPages: number;
  params: Record<string, string | number | undefined>;
}

type PageItem = number | "ellipsis";

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (page >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
}

export function PaginationBar({ basePath, page, totalPages, params }: PaginationBarProps) {
  const router = useRouter();
  const [pageInput, setPageInput] = useState(String(page));
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    setPageInput(String(page));
    setInputError("");
  }, [page]);

  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (nextPage: number) => {
    const safePage = Math.min(totalPages, Math.max(1, Math.floor(nextPage)));
    router.push(buildQueryHref(basePath, { ...params, page: safePage }), { scroll: false });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(pageInput);

    if (!pageInput.trim() || !Number.isFinite(parsed)) {
      setInputError("Enter a page number.");
      return;
    }

    setInputError("");
    goToPage(parsed);
  };

  const buttonBase = "inline-flex min-h-10 min-w-10 items-center justify-center border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300";
  const pageItems = getPageItems(page, totalPages);

  return (
    <nav aria-label="Pagination" className="flex flex-col gap-5 border-t border-white/10 pt-5 text-white/65">
      <div className="flex items-center justify-between gap-2 sm:justify-center sm:gap-3">
        <p className="order-2 whitespace-nowrap text-sm text-white/70 sm:order-1">Page {page} of {totalPages}</p>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          aria-label="Go to previous page"
          className={`${buttonBase} order-1 ${page <= 1 ? "cursor-not-allowed border-white/5 bg-white/5 text-white/30 sm:order-2" : "border-white/10 bg-ink-900/80 text-white hover:border-white/20 hover:bg-white/10 sm:order-2"}`}
        >
          <span aria-hidden="true">←</span>
          <span className="ml-1">Previous</span>
        </button>

        <div className="order-3 hidden items-center gap-2 sm:flex">
          {pageItems.map((item, index) => item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="inline-flex min-h-10 min-w-10 items-center justify-center text-white/40" aria-hidden="true">…</span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => goToPage(item)}
              aria-current={item === page ? "page" : undefined}
              aria-label={`Go to page ${item}`}
              className={`${buttonBase} ${item === page ? "border-ember-300 bg-ember-300 text-ink-950" : "border-white/10 bg-ink-900/80 text-white hover:border-white/20 hover:bg-white/10"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          aria-label="Go to next page"
          className={`${buttonBase} order-3 ${page >= totalPages ? "cursor-not-allowed border-white/5 bg-white/5 text-white/30 sm:order-4" : "border-white/10 bg-ink-900/80 text-white hover:border-white/20 hover:bg-white/10 sm:order-4"}`}
        >
          <span className="mr-1">Next</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-start justify-center gap-2" aria-label="Go to page form">
        <label htmlFor="pagination-page" className="flex min-h-10 items-center text-sm text-white/65">Go to page</label>
        <input
          id="pagination-page"
          type="number"
          min={1}
          max={totalPages}
          inputMode="numeric"
          value={pageInput}
          onChange={(event) => { setPageInput(event.target.value); setInputError(""); }}
          aria-describedby={inputError ? "pagination-page-error" : undefined}
          className="h-10 w-24 border border-white/10 bg-ink-900 px-3 text-sm text-white outline-none focus-visible:border-ember-300 focus-visible:ring-2 focus-visible:ring-ember-300"
        />
        <button type="submit" className={`${buttonBase} border-white/10 bg-white text-ink-950 hover:bg-slate-100`}>Go</button>
        {inputError ? <p id="pagination-page-error" className="basis-full text-center text-xs text-ember-200" role="alert">{inputError}</p> : null}
      </form>
    </nav>
  );
}
