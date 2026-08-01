import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateSearchSafety,
  filterSafeMedia,
  normalizeSafetyText,
} from "../src/lib/content-safety.ts";
import { mediaHref, movieHref } from "../src/lib/utils.ts";

test("normalizes case and common separators", () => {
  assert.equal(normalizeSafetyText("  PORNOGRAPHIC_title  "), "pornographic title");
  assert.equal(normalizeSafetyText("explicit-adult.content"), "explicit adult content");
});

test("blocks conservative restricted exact terms and phrases", () => {
  assert.equal(evaluateSearchSafety("pornography").allowed, false);
  assert.equal(evaluateSearchSafety("explicit adult content").allowed, false);
  assert.equal(evaluateSearchSafety("HENTAI-title").allowed, false);
});

test("allows ambiguous words and substring lookalikes", () => {
  assert.equal(evaluateSearchSafety("Sex Education").allowed, true);
  assert.equal(evaluateSearchSafety("Pornographicography").allowed, true);
  assert.equal(evaluateSearchSafety("XXX").allowed, true);
});

test("filters adult media without mutating the input array", () => {
  const input = [{ id: 1, adult: false }, { id: 2, adult: true }, { id: 3 }];
  const output = filterSafeMedia(input);
  assert.deepEqual(output, [{ id: 1, adult: false }, { id: 3 }]);
  assert.deepEqual(input, [{ id: 1, adult: false }, { id: 2, adult: true }, { id: 3 }]);
});

test("builds canonical movie and TV URLs consistently", () => {
  assert.equal(movieHref({ id: 101, title: "A Film: The Return" }), "/movie/101-a-film-the-return");
  assert.equal(mediaHref({ id: 202, title: "A Series", mediaType: "tv" }), "/tv/202-a-series");
});
