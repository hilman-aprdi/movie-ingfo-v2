"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageShell } from "@/components/page-shell";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <PageShell className="pb-32 pt-4">
      <EmptyState
        title="Something went wrong"
        description="The page hit an unexpected error. Try again or navigate somewhere else in the app."
        actionLabel="Back home"
        actionHref="/"
      />
      <div className="mt-6 flex justify-start">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center border border-white/10 bg-white px-4 text-sm font-semibold text-ink-950 transition duration-200 hover:bg-slate-100"
        >
          Try again
        </button>
      </div>
    </PageShell>
  );
}
