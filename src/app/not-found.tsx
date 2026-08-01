import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageShell } from "@/components/page-shell";

export default function NotFound() {
  return (
    <PageShell className="pb-32 pt-4">
      <EmptyState
        title="Page not found"
        description="The route you requested does not exist in the new Next.js app."
        actionLabel="Back home"
        actionHref="/"
      />
      <div className="mt-6 text-left text-sm text-white/45">
        <Link href="/discover" className="underline decoration-white/25 underline-offset-4 hover:text-white/70">
          Explore genres instead
        </Link>
      </div>
    </PageShell>
  );
}
