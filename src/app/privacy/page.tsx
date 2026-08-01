import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getSiteUrl } from "@/lib/site";

const lastUpdated = "August 1, 2026";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | MINGFO" },
  description: "Read how MINGFO handles local watchlist data, technical data, third-party services, and privacy-related requests.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | MINGFO",
    description: "Read how MINGFO handles local watchlist data, technical data, third-party services, and privacy-related requests.",
    url: "/privacy",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MINGFO movie discovery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | MINGFO",
    description: "Read how MINGFO handles local watchlist data, technical data, third-party services, and privacy-related requests.",
    images: ["/og-image.png"],
  },
};

export default function PrivacyPage() {
  const siteUrl = getSiteUrl();
  const privacyJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy | MINGFO",
    url: new URL("/privacy", siteUrl).toString(),
    description: "Read how MINGFO handles local watchlist data, technical data, third-party services, and privacy-related requests.",
    isPartOf: { "@type": "WebSite", name: "MINGFO", url: siteUrl.toString() },
  };

  return (
    <PageShell className="pb-32 pt-8 sm:pt-12">
      <article className="mx-auto max-w-3xl space-y-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }} />

        <header className="space-y-4 border-b border-white/10 pb-8">
          <p className="text-sm font-medium text-ember-300/90">Privacy</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">Privacy Policy</h1>
          <p className="text-sm text-white/45">Last updated: {lastUpdated}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Overview</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO is a movie and TV discovery application. This policy explains what information may be processed when you use the site and how the application currently handles watchlist data and third-party services.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Information MINGFO does not request</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO does not currently provide user accounts, authentication, a MINGFO database, a contact form, a newsletter, advertising, or an analytics SDK. The application does not ask you to submit your name, phone number, address, or payment information to use its main features.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            If you contact the maintainer by email or Instagram, that communication is handled by the relevant provider under its own privacy policy.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Technical information</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            When a website is requested, the hosting provider, CDN, network infrastructure, or other service providers may process ordinary technical information. Depending on the provider and request, this may include an IP address, browser type, device type, operating system, approximate region, visited pages, referring page, timestamps, request information, and performance or diagnostic data.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            This information may be used to deliver the site, maintain security, diagnose failures, understand service performance, and keep the application available. MINGFO does not sell personal data.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Watchlist and local storage</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            When you save a title, the watchlist is stored locally in your browser using localStorage under a MINGFO watchlist key. The saved titles are not automatically uploaded to a MINGFO database and are not synchronized across devices.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Clearing browser storage, using private browsing, changing browsers, or device/browser settings can remove or prevent access to saved titles. MINGFO does not provide cloud backup for the watchlist.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Cookies and similar technologies</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Based on the current codebase, MINGFO does not intentionally set cookies for its core features. It uses browser localStorage for the watchlist instead. Hosting infrastructure, embedded media, or other third-party services may handle cookies or similar technologies under their own policies.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Third-party services</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO uses TMDB to request movie and TV metadata, ratings, images, and related video information. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO is deployed using Vercel-compatible hosting. Movie trailers and clips may be embedded from YouTube using its privacy-enhanced embed domain. When an embedded player or external link is used, the relevant provider may process information according to its own privacy policy.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO does not currently use JustWatch or a watch-provider integration.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Data retention</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Watchlist data remains in your browser until you remove it or clear browser storage. Technical request and hosting logs, if created by infrastructure providers, are retained according to their own operational and legal policies. MINGFO does not control those retention periods.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">International visitors and privacy rights</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO is intended for a global audience. Privacy rights vary by location and may include rights to request access, correction, deletion, restriction, objection, or information about processing. Because MINGFO does not maintain user accounts or a server-side watchlist database, there may be little or no user profile data held by MINGFO itself to retrieve or delete.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Requests or questions can be sent using the contact details below. This policy does not claim that MINGFO is fully GDPR or CCPA compliant.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Children&apos;s privacy</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            MINGFO is not designed to intentionally collect personal information from children. No account or child-specific profile feature is currently provided.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Security and changes</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            Reasonable care is taken to keep the application and its server-side configuration protected, but no online service or browser storage system can be guaranteed completely secure. Do not use the watchlist to store sensitive personal information.
          </p>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            This policy may change when the application&apos;s data practices change. The date above indicates the latest revision.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">Contact</h2>
          <p className="text-sm leading-7 text-white/65 sm:text-base">
            For questions about this policy, contact the MINGFO maintainer at <a href="mailto:hilmanok09@gmail.com" className="text-ember-200 underline decoration-ember-400/50 underline-offset-4 hover:text-ember-100">hilmanok09@gmail.com</a> or through <a href="https://instagram.com/mnaprd_" target="_blank" rel="noopener noreferrer" className="text-ember-200 underline decoration-ember-400/50 underline-offset-4 hover:text-ember-100">Instagram @mnaprd_</a>.
          </p>
        </section>

        <nav aria-label="Privacy page links" className="flex flex-wrap gap-3 border-t border-white/10 pt-8">
          <Link href="/about" className="inline-flex h-10 items-center border border-white/10 bg-white px-4 text-sm font-semibold text-ink-950 transition hover:bg-slate-100">About MINGFO</Link>
          <Link href="/terms" className="inline-flex h-10 items-center border border-white/10 px-4 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/5 hover:text-white">Terms of Use</Link>
          <Link href="/" className="inline-flex h-10 items-center border border-white/10 px-4 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/5 hover:text-white">Home</Link>
        </nav>
      </article>
    </PageShell>
  );
}
