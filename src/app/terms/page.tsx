import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getSiteUrl } from "@/lib/site";

const lastUpdated = "August 1, 2026";

export const metadata: Metadata = {
  title: { absolute: "Terms of Use | MINGFO" },
  description: "Read the terms for using MINGFO as a movie and TV discovery platform.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | MINGFO",
    description: "Read the terms for using MINGFO as a movie and TV discovery platform.",
    url: "/terms",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MINGFO movie discovery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | MINGFO",
    description: "Read the terms for using MINGFO as a movie and TV discovery platform.",
    images: ["/og-image.png"],
  },
};

export default function TermsPage() {
  const siteUrl = getSiteUrl();
  const termsJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Use | MINGFO",
    url: new URL("/terms", siteUrl).toString(),
    description: "Read the terms for using MINGFO as a movie and TV discovery platform.",
    isPartOf: { "@type": "WebSite", name: "MINGFO", url: siteUrl.toString() },
  };

  return (
    <PageShell className="pb-32 pt-8 sm:pt-12">
      <article className="mx-auto max-w-3xl space-y-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }} />

        <header className="space-y-4 border-b border-white/10 pb-8">
          <p className="text-sm font-medium text-ember-300/90">Legal</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">Terms of Use</h1>
          <p className="text-sm text-white/45">Last updated: {lastUpdated}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Using MINGFO</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO is a movie and TV discovery platform. By using the site, you agree to use it responsibly and in accordance with these Terms of Use and applicable law.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">What MINGFO provides</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO helps users discover movies and TV shows through search, browsing, genres, ratings, release information, trailers, cast details, seasons, and related titles. MINGFO is not a streaming service and does not host, upload, distribute, or provide access to full movies or TV episodes.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Movie and TV information may come from TMDB and media may be embedded or linked from third-party services. Titles, ratings, release dates, cast, trailers, availability, and other information can change or contain errors. MINGFO does not guarantee that displayed information is complete, current, or accurate.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Acceptable use</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">You agree not to:</p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-white/65 sm:text-base">
            <li>use MINGFO for illegal, fraudulent, abusive, or harmful activity;</li>
            <li>scrape or automate requests at a volume that places unreasonable load on MINGFO, TMDB, or other services;</li>
            <li>attempt to bypass security, rate limits, access controls, or technical restrictions;</li>
            <li>reverse engineer or interfere with the site in a way that harms its operation or other users; or</li>
            <li>use the site to infringe the rights of another person or organization.</li>
          </ul>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Watchlist and third-party services</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Watchlist entries are stored locally in your browser and are not a cloud account or backup service. External websites, embedded YouTube media, TMDB, hosting providers, and other third-party services are outside MINGFO&apos;s control and may have separate terms and privacy policies.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Ownership and trademarks</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO&apos;s brand, interface, and original content belong to the project owner unless stated otherwise. TMDB, YouTube, movie titles, logos, images, and other third-party trademarks and materials remain the property of their respective owners. No ownership is transferred by using MINGFO.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Availability and limitations</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO is provided on an availability basis and may change, be interrupted, or become unavailable. To the extent permitted by applicable law, MINGFO is not responsible for indirect loss, third-party outages, inaccurate external information, lost local watchlist data, or issues caused by a user&apos;s device, browser, network, or external service.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Nothing in these Terms is intended to exclude rights or protections that cannot lawfully be excluded.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Changes and access restrictions</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            These Terms may be updated when the application or its practices change. Continued use after an update means the updated Terms will apply to future use. MINGFO may restrict or terminate access when it reasonably believes the site is being abused, attacked, or used in violation of these Terms.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            No specific governing law or legal jurisdiction is stated because MINGFO does not currently publish a formal legal entity or jurisdiction.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Contact</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Questions about these Terms can be sent to <a href="mailto:hilmanok09@gmail.com" className="text-ember-200 underline decoration-ember-400/50 underline-offset-4 hover:text-ember-100">hilmanok09@gmail.com</a> or through <a href="https://instagram.com/mnaprd_" target="_blank" rel="noopener noreferrer" className="text-ember-200 underline decoration-ember-400/50 underline-offset-4 hover:text-ember-100">Instagram @mnaprd_</a>.
          </p>
        </section>

        <nav aria-label="Terms page links" className="flex flex-wrap gap-3 border-t border-white/10 pt-8">
          <Link href="/about" className="inline-flex h-10 items-center border border-white/10 bg-white px-4 text-sm font-semibold text-ink-950 transition hover:bg-slate-100">About MINGFO</Link>
          <Link href="/privacy" className="inline-flex h-10 items-center border border-white/10 px-4 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/5 hover:text-white">Privacy Policy</Link>
          <Link href="/" className="inline-flex h-10 items-center border border-white/10 px-4 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/5 hover:text-white">Home</Link>
        </nav>
      </article>
    </PageShell>
  );
}
