const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelSiteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();

function parseHttpUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return parseHttpUrl(configuredSiteUrl) ?? parseHttpUrl(vercelSiteUrl) ?? new URL("http://localhost:3000");
}
