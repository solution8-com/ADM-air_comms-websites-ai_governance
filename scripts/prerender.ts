/**
 * Post-build SSG: emits per-route static HTML with route-specific meta tags.
 * Run after `vite build`.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pillars, categories } from "../src/data/governanceData";

const SITE_ORIGIN = "https://ai-governance.dk";
const SITE_NAME = "AI Governance";
const DIST = "dist";

const template = readFileSync(join(DIST, "index.html"), "utf-8");

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, " ")
    .trim();

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

function generatePage(
  routePath: string,
  meta: { title: string; description: string; canonical: string }
) {
  const outDir = join(DIST, routePath);
  mkdirSync(outDir, { recursive: true });

  let html = template;
  const t = esc(meta.title);
  const d = esc(truncate(meta.description, 200));
  const c = esc(meta.canonical);

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${d}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${c}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${t}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${d}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${c}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${t}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${d}" />`
  );

  writeFileSync(join(outDir, "index.html"), html);
}

let count = 0;

for (const pillar of pillars) {
  generatePage(pillar.id, {
    title: `${pillar.name} — ${SITE_NAME}`,
    description: pillar.description,
    canonical: `${SITE_ORIGIN}/${pillar.id}`,
  });
  count++;
}

for (const cat of categories) {
  generatePage(`${cat.pillar}/${cat.id}`, {
    title: `${cat.name} — ${SITE_NAME}`,
    description: cat.description,
    canonical: `${SITE_ORIGIN}/${cat.pillar}/${cat.id}`,
  });
  count++;

  for (const sub of cat.subcategories) {
    generatePage(`${cat.pillar}/${cat.id}/${sub.id}`, {
      title: `${sub.name} — ${cat.name} | ${SITE_NAME}`,
      description: sub.description,
      canonical: `${SITE_ORIGIN}/${cat.pillar}/${cat.id}/${sub.id}`,
    });
    count++;
  }
}

console.log(`✓ Prerendered ${count} routes into dist/`);
