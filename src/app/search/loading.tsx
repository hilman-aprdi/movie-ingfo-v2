import { PageShell } from "@/components/page-shell";

export default function Loading() {
  return (
    <PageShell className="space-y-8 pb-32 pt-4">
      <div className="max-w-3xl space-y-3">
        <div className="h-4 w-24 animate-pulse bg-white/10" />
        <div className="h-12 w-3/4 animate-pulse bg-white/10" />
        <div className="h-4 w-32 animate-pulse bg-white/10" />
      </div>

      <div className="h-12 max-w-5xl animate-pulse border border-white/10 bg-white/5" />

      <div className="space-y-4">
        <div className="h-7 w-48 animate-pulse bg-white/10" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] animate-pulse border border-white/10 bg-white/10" />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
