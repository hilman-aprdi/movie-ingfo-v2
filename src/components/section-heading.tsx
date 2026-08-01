"use client";

import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  headingId?: string;
}

export function SectionHeading({ eyebrow, title, description, action, headingId }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-xs font-medium text-ember-300/85">{eyebrow}</p> : null}
        <h2 id={headingId} className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
