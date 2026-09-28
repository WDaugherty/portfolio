# wdm-portfolio

Founder, researcher and developer profile for William Daugherty-Miller.

## Design decisions (and why)

- **Japandi palette** sampled from a reference board: sage ground `#B2B9AA`, cream sheets `#F3F0E9`, white `#FFFFFF`
  for mats, cards, the nav and the figure,
  deep sage `#636C5C` (the one accent, dark panels), greige frame lines `#CBC8BB`, clay `#9A7556` for
  highlights inside illustrations only. One warm-green temperature throughout.
- **Bento of sheets:** every section is a rounded cream sheet floating on the sage ground.
- **Arched project windows** on the home page (framed, labels set into the frame line) link straight to
  each project's row on the Work page (`#/work/<slug>`), which scrolls to and highlights it.
- **No gradients.** Depth comes from SVG film grain (6% on paper, 16% overlay on the sumi bands),
  translucency with backdrop blur, and hairlines.
- **Type:** Outfit (a geometric sans, close to the reference headings) for everything, DM Mono only for numbers, dates and stacks.
  Light weight appears only at display sizes. No italics, nothing above bold.
- **Layout:** titles left and notes offset right; no centered sections, no rows of identical cards.
- **Sumi bands with translucent white type** (research and footer) break the page into chapters.
- **Motion:** the hero trace has a pause button (WCAG 2.2.2), stops off-screen, and is static under
  `prefers-reduced-motion`. Reveals use IntersectionObserver, never scroll listeners.
- **Copy:** sentence case, no em dashes, no hype verbs, no invented numbers or testimonials. Tests enforce
  the worst of these.

## Structure

A researcher's personal site, written for PIs and recruiters. No sales language: no call-to-action
buttons, no announcement bar, no slogans. A test fails if that language creeps back.

Home follows the reference board panel for panel: project windows (top left), interests carousel
(top right), earlier-work item row with the footer attached beneath it (bottom left), the intro band
(middle right) and manuscripts row (bottom right). On phones the intro band comes first.

Pages: `#/` home,
`#/research` (programs, manuscripts in preparation, the interactive figure, methods graph),
`#/projects` and `#/projects/<slug>` (all projects, filterable; windows on the home page jump to a row),
and `#/cv` (CV, news and bio). Tool specs (`#/specs`) are built but hidden behind `FEATURES.openSourceSpecs` in `src/config.ts`.

### Before publishing, fill in `src/data/cv.ts`
- Confirm lines marked `VERIFY` (current title and start date, manuscript working titles).
- Add posters to `POSTERS` (format: `Authors. Title. Conference, City, Month Year.`); the section appears once it has entries.
- Add `public/cv.pdf` and set `CV_PDF_READY = true` to show the PDF link.
- Add ORCID and Google Scholar URLs if you have them; the links appear automatically.

## Stack

React 18, TypeScript, Vite. Hash routing on `useSyncExternalStore` with View Transitions, a seeded canvas
monitor, scroll-spy via IntersectionObserver, a measured SVG connections graph, and 17 Vitest tests
(server-rendered structure, landmarks, routing, data integrity, copy hygiene).

```bash
npm install
npm run dev          # local
npm test             # 17 tests
npm run build        # dist/ for GitHub Pages (adds CSP meta tag and 404.html)
npm run build:single # dist-single/index.html, fully inlined preview
```

## Deploy to GitHub Pages (now)

1. Create a repository named `WDaugherty.github.io` (exactly your username) and push this project to `main`.
2. Settings, Pages, Source: **GitHub Actions**. The included workflow tests, builds and deploys on every push.
3. The site is live at `https://wdaugherty.github.io`.

## Move to a .dev domain (later)

1. **Buy the domain** at an at-cost registrar (Cloudflare Registrar or Porkbun). Check availability of a few:
   `williamdaughertymiller.dev`, `wdaughertymiller.dev`, `wdm.dev` is almost certainly taken.
   .dev is on the HSTS preload list, so it only works over HTTPS; GitHub Pages provides the certificate.
2. **Verify the domain with GitHub first** (Profile settings, Pages, Add a domain, then add the TXT record it
   gives you). This stops anyone else claiming it on GitHub Pages.
3. **DNS records** at the registrar (turn off Cloudflare's proxy, the orange cloud, until HTTPS is issued):
   - `A` `@` 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `AAAA` `@` 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
   - `CNAME` `www` wdaugherty.github.io
   - No wildcard records.
4. **Repository settings**, Pages, Custom domain: enter the apex domain, save, wait for the DNS check, then tick
   **Enforce HTTPS** (can take up to 24 hours). With the Actions workflow, a `CNAME` file is not needed.
5. **Check:** `dig yourdomain.dev +noall +answer -t A` should list the four GitHub addresses.

## Before you share the link

- No secrets anywhere in the repo or its history (`git log -p | grep -i -E "key|secret|token"`).
- Open it on an old phone on a slow connection.
- Turn wifi off and reload: fonts should fall back cleanly and nothing should break.
- No patient data belongs anywhere in this repository.

## Editing content

Projects `src/data/projects.ts` · specs `src/data/specs.ts` · research lists `src/components/Research.tsx` ·
"Now" strip `src/components/Hero.tsx` · case studies `src/components/CaseStudies.tsx` · announcement `src/components/Chrome.tsx`.
