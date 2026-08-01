export type SafetyDecision =
  | { allowed: true }
  | { allowed: false; reason: "restricted-query" | "adult-result" };

// Keep this list intentionally small. Ambiguous terms such as "xxx" or "sex"
// are excluded because they can describe mainstream titles.
const restrictedExactTerms = new Set(["hentai", "porn", "pornographic", "pornography"]);
const restrictedPhrases = ["explicit adult content", "hardcore pornography"];

export function normalizeSafetyText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .replace(/[._:/\\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function evaluateSearchSafety(query: string): SafetyDecision {
  const normalized = normalizeSafetyText(query);
  if (!normalized) return { allowed: true };

  const tokens = new Set(normalized.split(" "));
  if ([...restrictedExactTerms].some((term) => tokens.has(term))) {
    return { allowed: false, reason: "restricted-query" };
  }

  if (restrictedPhrases.some((phrase) => normalized.includes(phrase))) {
    return { allowed: false, reason: "restricted-query" };
  }

  return { allowed: true };
}

export function filterSafeMedia<T extends { adult?: boolean }>(items: readonly T[]) {
  return items.filter((item) => item.adult !== true);
}

export function filterSafeSummaryResults<T extends { adult?: boolean }>(items: readonly T[]) {
  return filterSafeMedia(items);
}

export function isAdultMedia(media: { adult?: boolean }) {
  return media.adult === true;
}
