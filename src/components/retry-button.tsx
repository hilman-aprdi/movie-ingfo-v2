"use client";

import { useRouter } from "next/navigation";

export function RetryButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="inline-flex h-10 items-center border border-white/15 px-4 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300"
    >
      Try again
    </button>
  );
}
