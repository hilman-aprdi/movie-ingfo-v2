import { PageShell } from "@/components/page-shell";

export default function Loading() {
  return (
    <PageShell className="space-y-12 pb-32 pt-4">
      <section className="surface animate-pulse overflow-hidden">
        <div className="grid min-h-[32rem] gap-8 px-5 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-8">
          <div className="flex flex-col justify-end gap-4">
            <div className="h-4 w-28 bg-white/10" />
            <div className="h-16 w-3/4 bg-white/10" />
            <div className="h-4 w-full bg-white/10" />
            <div className="h-4 w-5/6 bg-white/10" />
            <div className="mt-2 flex gap-3">
              <div className="h-12 w-32 bg-white/10" />
              <div className="h-12 w-28 bg-white/10" />
            </div>
          </div>
          <div className="hidden lg:flex lg:items-end lg:justify-end">
            <div className="aspect-[2/3] w-full max-w-[24rem] bg-white/10" />
          </div>
        </div>
      </section>

      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-8 w-40 bg-white/10" />
            <div className="h-4 w-16 bg-white/10" />
          </div>
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((__, cardIndex) => (
              <div key={cardIndex} className="w-[9.75rem] flex-none sm:w-[11rem] lg:w-[12.5rem]">
                <div className="aspect-[2/3] bg-white/10" />
                <div className="mt-3 h-4 w-4/5 bg-white/10" />
                <div className="mt-2 h-3 w-1/2 bg-white/10" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
