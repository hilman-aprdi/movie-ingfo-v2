"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  ariaLabel: string;
}

export function HorizontalScroll({ children, className, contentClassName, ariaLabel }: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const updateButtons = () => {
      setCanScrollLeft(element.scrollLeft > 4);
      setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
    };

    updateButtons();
    element.addEventListener("scroll", updateButtons, { passive: true });
    const observer = new ResizeObserver(updateButtons);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", updateButtons);
      observer.disconnect();
    };
  }, []);

  const scrollBy = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "right" ? scrollRef.current.clientWidth * 0.75 : -scrollRef.current.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  const buttonClassName = "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/15 bg-ink-950/90 text-lg text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300 md:hidden";

  return (
    <div className={cn("relative", className)}>
      <div ref={scrollRef} className={cn("no-scrollbar overflow-x-auto", contentClassName)} aria-label={ariaLabel}>
        {children}
      </div>
      {canScrollLeft ? <button type="button" aria-label={`Scroll ${ariaLabel} left`} onClick={() => scrollBy("left")} className={cn(buttonClassName, "left-2")}>←</button> : null}
      {canScrollRight ? <button type="button" aria-label={`Scroll ${ariaLabel} right`} onClick={() => scrollBy("right")} className={cn(buttonClassName, "right-2")}>→</button> : null}
    </div>
  );
}
