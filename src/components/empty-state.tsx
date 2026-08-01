"use client";

import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <section className="flex min-h-[18rem] flex-col items-start justify-center border border-white/10 bg-ink-900/50 px-5 py-10 sm:px-8">
      <div className="h-10 w-10 border border-white/10 bg-[linear-gradient(180deg,rgba(90,141,255,0.18),rgba(255,255,255,0.03))]" />
      <div className="mt-6 max-w-2xl space-y-3">
        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">{title}</h3>
        <p className="text-sm leading-7 text-white/60 sm:text-base">{description}</p>
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex h-11 items-center border border-white/10 bg-white px-4 text-sm font-semibold text-ink-950 transition duration-200 hover:bg-slate-100"
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
