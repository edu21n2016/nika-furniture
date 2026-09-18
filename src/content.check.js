// Lightweight copy assertions — no test harness required.
// Run with: npm run check:content
//
// Reads content.ts as text and asserts on V1 showroom structure and wording, so
// copy regressions are caught without a bundler or test runner.
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "content.ts"), "utf8");

// Sections that must exist for the V1 showroom homepage.
for (const symbol of [
  "export const heroSlides",
  "export const signaturePieces",
  "export const latestCreations",
  "export const craftsmanshipSteps",
  "export const achievements",
  "export const workshopCaptions",
  "export const navItems",
  " const contact",
]) {
  assert.ok(src.includes(symbol), `content.ts must export ${symbol}`);
}

// Banned V1 commerce wording — must never ship in a showroom build.
for (const term of ["Buy now", "Add to cart", "Checkout", "Quick View", "Inquire"]) {
  assert.ok(!src.includes(term), `commerce wording "${term}" must not appear in V1 copy`);
}

// Headings required by the brief.
for (const heading of ["DESIGNED FOR", "LET'S CREATE SOMETHING BEAUTIFUL."]) {
  assert.ok(src.includes(heading), `required heading "${heading}" is missing`);
}

// Four achievement counters, kept as placeholders until the client confirms numbers.
const counters = src.split("Years of Craftsmanship").length - 1;
assert.strictEqual(counters, 1, "achievements must define the Years of Craftsmanship counter");
for (const label of ["Completed Projects", "Clients", "Collections & Designs"]) {
  assert.ok(src.includes(label), `achievements is missing the "${label}" counter`);
}

console.log("[content.check] ok — content shape and showroom wording verified");
