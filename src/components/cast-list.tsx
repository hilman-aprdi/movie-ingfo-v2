import Image from "next/image";
import type { CastMember } from "@/lib/types";
import { profileUrl } from "@/lib/tmdb";

export function CastList({ cast }: { cast?: CastMember[] }) {
  const members = cast?.filter((member) => member.name.trim()).slice(0, 12) ?? [];
  if (members.length === 0) return null;

  return (
    <section className="space-y-5 border-t border-white/10 pt-8" aria-labelledby="cast-heading">
      <h2 id="cast-heading" className="text-2xl font-semibold tracking-[-0.02em] text-white">Cast</h2>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-8">
        {members.map((member) => {
          const image = profileUrl(member.profilePath);
          return (
            <div key={member.id} className="w-24 shrink-0 sm:w-auto">
              <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-ink-900">
                {image ? (
                  <Image src={image} alt={`Portrait of ${member.name}`} fill unoptimized sizes="(max-width: 640px) 6rem, 10vw" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center px-3 text-center text-xl font-semibold text-white/35" aria-hidden="true">
                    {member.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-medium leading-5 text-white/85">{member.name}</p>
              <p className="line-clamp-2 text-xs leading-5 text-white/45">{member.character}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
