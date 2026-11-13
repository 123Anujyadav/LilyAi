# 06 — QA and handover

Status on 2026-11-13: **first complete build of all pages, checked in a browser, not yet a finished launch candidate.** The sections below separate what was actually tested from what was not.

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
| Horizontal overflow at 375px on all 14 routes | None |
| Console errors | None. One deprecation warning (`THREE.Clock`) comes from React Three Fiber |
| Home page, 1440×900, every section | Inspected by screenshot; issues found were fixed (hero gradient line, core size, capability grid) |
| Mode A and Mode B, 1440×900 | Inspected by screenshot |
| Home hero and Mode A hero at 375×812 | Inspected; core placement and scale fixed |
| Mobile menu | Opens, lists all links, Escape closes it and returns focus to the toggle |
| Live WebGL core | Seen rendering on the home hero, with waveform, lattice and both signal paths |

## Not tested
- **No Lighthouse or Core Web Vitals measurement.** No performance score is claimed.
- Product, How It Works, Solutions, Technology, Security, About, Contact, FAQ, Privacy and Terms were confirmed to render but **were not inspected by screenshot**.
- Tablet (768px) and large desktop (1920px) layouts.
- A full keyboard-only walkthrough and a screen reader pass.
- Colour contrast was designed to meet 4.5:1 but **not measured** with a tool.
- `prefers-reduced-motion` and the no-WebGL fallback were implemented but not exercised in a browser.
- Safari and Firefox. Only the Chromium-based preview was used.
- Real low-power phones.

## Known limitations and remaining work
1. **Initial JavaScript is 153 kB gzipped**, larger than ideal. `motion` is only there for one React Bits text effect and could be replaced with CSS.
2. **Creative-director pass (brief Prompt 9) is only partly done.** Weakest areas still to refine: the interior pages that were not screenshot-reviewed; the copilot demo has empty space on wide screens before the suggestion appears; the call-state chain arrows; the mobile hero is text-heavy with the core partly behind the headline; the final CTA core is dimmed more than it needs to be.
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
