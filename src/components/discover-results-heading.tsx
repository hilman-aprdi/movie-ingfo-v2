"use client";

import { useEffect, useRef } from "react";

export function DiscoverResultsHeading({ title, count, page }: { title: string; count: number; page?: number }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start" });
  }, [title, count, page]);
  return <h1 ref={headingRef} tabIndex={-1} className="text-4xl font-semibold tracking-[-0.04em] text-white outline-none focus-visible:ring-2 focus-visible:ring-ember-300 sm:text-5xl">{title}</h1>;
}
