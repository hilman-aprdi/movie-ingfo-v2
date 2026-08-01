"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return <main className={cn("mx-auto w-full max-w-[88rem] px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8", className)}>{children}</main>;
}
