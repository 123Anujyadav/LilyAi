# 06 — QA and handover

Status on 2026-11-13: **complete build of all pages with one review-and-polish pass, checked in a browser. Not yet a launch candidate** — see "Not tested" and the owner items below. The sections below separate what was actually tested from what was not.

## What changed
The single 27 MB HTML file was rebuilt as a Vite + React + TypeScript project with real routes, a token-based design system, a procedural 3D hero, coded product demos, and per-page metadata. The original file was not modified; it is still at `OneDrive\Desktop\LilyAi-Website\Lily AI Website.html`. A copy with the embedded media stripped is in `reference/original-stripped.html`.

## Routes implemented
`/`, `/product`, `/mode-a`, `/mode-b`, `/how-it-works`, `/solutions`, `/technology`, `/security`, `/about`, `/contact`, `/faq`, `/privacy`, `/terms`, and a 404. Old `/#modea`-style links redirect.

## Content integrity
- All product copy lives in `src/content/site.ts`, carried over from the original site.
- Privacy and Terms wording is preserved verbatim.
- Mode A carries a Beta badge wherever it appears, and the "not yet verified live with a real caller" qualification is on the Mode A hero, the Product page, the home page and the footer status row.
- No customers, statistics, testimonials, certifications, team members or pricing were added.
- Every simulated interface is labelled "Illustrative demo — not a live recording".
- The contact form validates input and then reports "Not sent". It never shows a success message.

**New wording that was not in the original** (short connective copy, written from existing claims — please review): section headings such as "Speak for you, or stay beside you", "Four states. Always interruptible", "In-app only, with consent at the door", "Your call. Your screen only", "A complete post-call brief", "One signal, followed turn by turn", "Supported ways to connect"; the four-step Mode A join flow; the "What you see / What the other participant hears" panel; the sample text inside the post-call brief demo; the "What to expect" list on Contact; the 404 page; and the closing call-to-action lines on interior pages.

## Tools: what was actually used
| Tool | Used? |
|---|---|
| React Bits | Yes: `BlurText` and `SpotlightCard`, TypeScript + CSS variants, fetched from the official registry into `src/reactbits/` |
| MotionSites MCP | Partly: account checked (free plan) and part 1 of the design library read for reference descriptions. No prompts, templates or assets were used. Part 2 not read |
| AI Design Skills | `landing-page-design` read and applied selectively; `figma-designer` not used (no Figma) |
| Fable | No separate Fable tool exists in this environment. The work was done by the Claude Fable 5.2 model directly |
| Unsloth | Not used |
| shadcn MCP server | Not used for this project |

## Tests that were run
| Check | Result |
|---|---|
| `npm run build` (TypeScript + Vite) | Passes |
| `npm run lint` (oxlint) | 0 errors, 6 warnings: 2 in `CoreScene.tsx` (`Math.random` inside `useMemo`, intentional), 4 inside the React Bits components |
| All 14 routes render, with correct title, H1 and robots tag | Pass (scripted check in the browser) |
| Horizontal overflow at 375px (14 routes) and 768px (12 routes) | None |
| Console errors | None. One deprecation warning (`THREE.Clock`) comes from React Three Fiber |
| Every page inspected by screenshot at 1440px wide | Done for all 13 pages. Issues found were fixed: hero gradient line, core size, capability grid, invisible navigation on the three light-hero pages, oversized About photo, legal page spacing, call-state arrows |
| Home hero at 375, 768, 1440 and 1920px | Inspected; core placement and scale adjusted for portrait screens |
| Mode switcher at 768px | Inspected; stacks vertically as designed |
| Mobile menu | Opens, lists all links, Escape closes it and returns focus to the toggle |
| Keyboard on tabs | Arrow and End keys move focus and selection in the role explorer |
| Contact form | Empty submit shows three errors and focuses the first field; a malformed email shows a format error; a valid submit shows "Not sent" and makes no network request |
| Live WebGL core | Seen rendering at 768, 1440 and 1920px with waveform, lattice and both signal paths |

## Motion and 3D pass (2026-11-14)
Checked: build passes; lint 0 errors; no console errors; no horizontal overflow at 391px on 12 routes; the upgraded hero core (equalizer ring, pulse rings, glass rings, floating chips) and the 3D sound field were seen rendering at 1440px.

Not confirmed by screenshot: the pointer tilt, magnetic buttons, cursor light and scroll-in animations. The preview window was in the background during this pass, which pauses animation, so these were verified by code and type-check only. Frame rate was not measured.

## Not tested
- **No Lighthouse or Core Web Vitals measurement.** No performance score is claimed.
- A full keyboard-only walkthrough of every page, and a screen reader pass.
- Colour contrast was designed to meet 4.5:1 but **not measured** with a tool.
- `prefers-reduced-motion` and the no-WebGL fallback were implemented but not exercised in a browser.
- Safari and Firefox. Only the Chromium-based preview was used.
- Real phones and low-power devices.

## Known limitations and remaining work
1. **Initial JavaScript is 153 kB gzipped**, larger than ideal. `motion` is only there for one React Bits text effect and could be replaced with CSS.
2. **Creative-director pass (brief Prompt 9) is only partly done.** A polish pass fixed the items found in review and added signal rings to the text-only dark heroes. Still open: the mobile hero is text-heavy with the core partly behind the kicker; text-only heroes (How It Works, Solutions, Technology, About, Contact, FAQ) are simpler than the three pages that carry the 3D core; the copilot demo is static until it scrolls into view.
3. **Canonical and Open Graph URLs use `https://example.com`** (`SITE_URL` in `src/components/Layout.tsx`). No sitemap was generated. Set the real domain first.
4. **No Open Graph image.**
5. **Metadata is set client-side.** Crawlers that do not run JavaScript see only the home page metadata. Pre-rendering would fix this.
6. **Product claims need owner confirmation** before launch: 30/90-day retention, "no outside AI company receives your audio or transcripts", "every connection is encrypted". They are unchanged from the original site.
7. **Legal pages still need the lawyer review** the original site mentions.
8. **Logo** is a derived transparent PNG at 256px. A vector original would be sharper.
9. **Stock photo licences** were not supplied; the footer credits Pexels as before.
10. The three original films are not used anywhere.

## Run locally
```bash
cd C:\Users\abhik\Projects\lily-ai-website
npm install
npm run dev
```
Build with `npm run build`; preview the build with `npm run preview`.

## Deployment preparation (nothing has been deployed)
1. Set `SITE_URL`, add an Open Graph image, generate `sitemap.xml`.
2. The host must serve `index.html` for every path. `public/_redirects` covers Netlify and Cloudflare Pages; other hosts need their own rewrite rule.
3. Decide whether to connect the contact form to a mail service. Until then it must keep saying "Not sent".

## Files
- `src/content/site.ts` — all copy and metadata
- `src/styles/` — `tokens.css`, `base.css`, `components.css`, `sections.css`
- `src/three/CoreScene.tsx`, `src/components/CoreVisual.tsx` — 3D core and fallback
- `src/components/` — `Layout.tsx`, `ui.tsx`, `demos.tsx`, `blocks.tsx`
- `src/pages/` — `Home.tsx`, `interior.tsx`
- `src/reactbits/` — `BlurText.tsx`, `SpotlightCard.tsx`, `SpotlightCard.css`
- `public/assets/` — logo and six WebP photos
- `docs/website-redesign/` — documents 01 to 06
