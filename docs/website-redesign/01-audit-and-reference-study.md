# 01 — Audit and reference study

Phase 1 deliverable for the Lily AI website redesign. Date: 2026-11-13.
Everything below was observed directly in the supplied file, the live reference sites, or the tools connected to this Claude session. Nothing here is assumed.

---

## 1. Existing architecture

**There is no repository.** The project folder contains exactly one file: `Lily AI Website.html` (26.9 MB). It is not a git repo and has no `package.json`, build system, or deployment config.

| Aspect | What exists today |
|---|---|
| Framework / build | None. One static HTML file, one inline `<style>` (~27 KB), one inline `<script>` (~12 KB, plain ES5). |
| Routing | Hash routing in a single page. 13 `div.page` views; `showPage()` toggles an `.active` class. Unknown hashes fall back to Home. |
| Styling | CSS custom properties in `:root` (11 tokens), hand-written classes, heavy inline `style=""` overrides. Breakpoints at 900px and 560px only. |
| Fonts | Google Fonts: Sora (400/600/700/800) and Inter (400–700). The only network request the page makes. |
| Assets | 11 unique JPEGs and 3 unique MP4s, all embedded as base64. Several are embedded more than once (the copilot film is in the file 3 times), which is why the file is 27 MB. |
| Dependencies | None. No 3D, no animation library. |
| SEO | One `<title>`, one meta description, 3 Open Graph tags for the whole site. No per-page metadata, canonical, sitemap, or 404. |
| Deployment | None found. |

### Current tokens

`--navy #1D1145` · `--deep #0A0618` · `--deep2 #120A2E` · `--cyan #2E7CF6` (actually blue) · `--cyan2 #A78BFA` (actually lavender) · `--violet #7C3AED` · `--grad linear-gradient(120deg,#8B5CF6,#2E7CF6)` · `--mut #ABA3C9` · `--card #1A1236` · `--radius 18px`.

The current look is violet-led. The brief moves it to navy / electric blue / cyan with violet as a restrained accent.

### Routes (current hash → proposed path)

| Current | Page | Proposed |
|---|---|---|
| `#home` | Home | `/` |
| `#product` | Product | `/product` |
| `#modea` | Mode A — Autonomous Calling Agent | `/mode-a` |
| `#modeb` | Mode B — Live Copilot | `/mode-b` |
| `#how` | How It Works | `/how-it-works` |
| `#solutions` | Solutions | `/solutions` |
| `#technology` | Platform / Technology | `/technology` |
| `#security` | Security & Privacy | `/security` |
| `#about` | About | `/about` |
| `#contact` | Contact | `/contact` |
| `#faq` | FAQs | `/faq` |
| `#privacy` | Privacy Policy | `/privacy` |
| `#terms` | Terms & Conditions | `/terms` |

The brief's list of 13 pages matches the file exactly. Old `#hash` links will be redirected to the new paths.

---

## 2. Content inventory

### Home (12 sections)
1. **Hero** — eyebrow "Real-time conversational intelligence"; H1 "Your identical twin on every call."; lead; "Listening. Thinking. Briefing you live."; CTAs "Explore Lily AI" and "Discover how it works"; a note on two modes and Mode A Beta; background orb video; three floating chips (Listening / Briefing you live / English + Hindi / Hinglish).
2. **Ticker** — 10 capability phrases.
3. **See Lily in action** — two film cards (Mode B copilot, Mode A agent with Beta badge).
4. **Problem** — "Every call leaves value on the table." Four problems.
5. **Meet Lily AI** — auto-playing copilot demo: client lines, private suggestion, captured item.
6. **Two modes** — Mode A / Mode B cards plus a compare switch.
7. **How it works** — Connect, Listen, Understand, Assist, Capture.
8. **Capabilities** — 9 tabs.
9. **Trained on you, not just data** — 3 tabs (voice, playbook, history). States "Not voice cloning".
10. **Use cases** — role explorer with 6 roles and stock photos.
11. **Platform** — 6-step pipeline plus a reliability note on conversation states.
12. **Privacy & security** — 3 cards, then final CTA "Make every conversation count."

### Interior pages
- **Product** — positioning, two mode cards, before/during/after, personalization playground (3 toggles, 8 reply variants), "Honest status" notice.
- **Mode A** — demo with a 4-state machine (Listening, Thinking, Speaking, Interrupted), owner controls, 3 cards, joining and Beta note.
- **Mode B** — demo (transcript, suggestion, retrieved knowledge), 3 cards.
- **How It Works** — 5 detailed stages.
- **Solutions** — role explorer, 4 individual cards, 5 team cards.
- **Technology** — 5-step flow, 6 cards including "Honest scope" and "Get the app".
- **Security** — 6 cards.
- **About** — photo, "The room is where Lily works", Vision, Mission, Philosophy, Where it's heading.
- **Contact** — 5-field form with a notice that it is not connected.
- **FAQ** — 12 questions.
- **Privacy** — 4 short sections. **Terms** — 3 short sections. Both say a lawyer review is still needed.
- **Footer** — logo tile, tagline, 3 link columns, status line, "Photography: Pexels".

### Product-truth statements that must be preserved word-for-word in meaning
- Mode A is **Beta**: "built, but it has not yet been verified live with a real caller."
- Calling regular phone numbers needs a separate carrier arrangement and **is not live**.
- Lily **does not capture ordinary mobile call audio** — "no phone app can."
- Mode A is **in-app only**: room code or browser guest link, with a consent notice.
- Lily **announces itself as AI** at the start of Mode A calls.
- Mode B **never speaks to the other party**.
- Languages: designed for English and Hindi/Hinglish; **Hindi voice quality not verified live**.
- Personalization is **not voice cloning** and "does not rebuild Lily itself" (no model training implied).
- On-device processing **not available yet**. **No app-store listing** yet; early access is arranged directly.
- Contact form is **not connected** and says so.
- No customers, testimonials, statistics, certifications, team members, or pricing appear anywhere. Photos are labelled illustrative.

### Assets

| Asset | Details | Use today |
|---|---|---|
| Logo mark | JPEG 780×730, mascot (face, lily flower, headset, phone, sound bars) on a white background | Nav logo and favicon |
| Logo lockup | JPEG 1254×1254, mascot + "Lily Ai" + "Your Call Assistant", white background | Footer |
| Hero film | MP4 1280×720, 10 s, 24 fps, H.264, no audio, 3.9 MB — wireframe sphere with a waveform and orbit rings | Hero background |
| Copilot film | MP4 1280×720, 10 s, 2.6 MB — woman on a video call with a floating orb and suggestion card | Home ×2, Mode B |
| Agent film | MP4 1280×720, 10 s, 3.1 MB — glass call panel with orb, woman listening | Home, Mode A |
| 3 posters | JPEG 1280×720, one per film | Video posters |
| 6 photos | JPEG 1600px wide, Pexels stock | Role explorer, About |

---

## 3. Working interactions (all verified by reading the script)

- Hash router with active nav state; mobile menu toggle with `aria-expanded`.
- Header changes on scroll; scroll progress bar.
- Scroll reveal via `IntersectionObserver`, with a 1.6 s safety fallback.
- Copilot demo that auto-plays once in view, with replay.
- Capability tabs, differentiator tabs, Mode A / Mode B compare switch.
- Role explorer (shared by Home and Solutions) with cross-fade.
- Mode A state machine that auto-cycles and can be set by hand.
- Personalization playground: 3 toggles producing 8 replies.
- FAQ accordion with `aria-expanded`.
- Honest contact form: submit shows "Not sent".
- Videos play only when visible, pause off-screen, click to toggle; `prefers-reduced-motion` shows the poster instead.

**Reusable as-is (content and logic):** all copy, the 8 playground replies, state-machine text, 12 FAQs, role data, honest-status notices, form behaviour.

---

## 4. Weaknesses and opportunities

| Area | Weakness | Opportunity |
|---|---|---|
| Hero | A looping stock-style video behind the text; no real 3D, no interaction | Custom WebGL conversational core with two signal paths, pointer and scroll response, static fallback |
| Rhythm | Every section is the same dark band with a heading and cards | Alternate cinematic dark sections with bright editorial sections |
| Layout | `grid3` of identical cards used on almost every page | Varied compositions: split layouts, timelines, product frames, bento grids |
| Interior pages | Each is a heading plus cards; none has its own visual identity | Distinct hero and signature interaction per page |
| Films | The three videos look AI-generated; on-screen text is garbled (for example "Suggestist"). The site presents them as films of "Lily in action" | Label them clearly as illustrative, or replace them with accurate, legible interface simulations built in code |
| Logo | Low-resolution JPEG on a white box; reads as a consumer mascot, and the lockup says "Your Call Assistant" | Needs a transparent/vector version. Any change to the mark itself is an owner decision |
| Palette | Violet-dominant, close to a generic "purple AI SaaS" look | Navy / electric blue / cyan system from the brief, violet as an accent |
| Performance | 27 MB single file, videos set to `preload="auto"`/`metadata` but shipped inline, duplicated assets | Separate optimized files, lazy loading, code splitting |
| SEO | One title and description for 13 pages, hash URLs | Real routes with per-page metadata |
| Accessibility | Tabs lack `role="tab"`/`aria-selected` and arrow-key support; `aria-controls` missing on accordion; some muted text on dark is low contrast; mobile menu has no focus trap or Escape handling | Fix in the component system |
| Responsive | Only two breakpoints; 5-step grid and pipeline flow collapse abruptly | Mobile-first layouts with a tablet tier |
| Code | Inline styles throughout; content built with `innerHTML` strings | Component architecture with typed content data |

---

## 5. Reference site study

Both sites were opened live in a browser on 2026-11-13 at 1440×900.

### myequal.ai ("Equal AI — Every call, understood")
- **Structure:** one long scroll-driven page (about 12,500 px tall), 3 `<canvas>` elements, 1 video.
- **Nav:** minimal — logo, About, Contact.
- **Hero:** near-black with slow vertical green light beams; small eyebrow "MEET EQUAL"; a short two-line promise; two app-store buttons; a "SCROLL" cue.
- **Feature sequence:** a pinned phone mockup that glows and changes as you scroll through five numbered features (01/05 to 05/05), each with a short caps title and one sentence.
- **Proof:** three large statistics. *(Lily has no verified numbers, so this pattern is not used.)*
- **Footer:** Product / Company / Support / Social columns, FAQs, legal links.
- **Useful patterns:** one promise in the hero; one pinned object that transforms through a numbered story; extreme restraint in copy; a single accent colour on black.

### equal.in ("India's Largest Data Sharing Platform")
- **Structure:** bright, enterprise page (about 6,500 px), 1 video.
- **Nav:** four dropdowns (About Us, Products, Usecases, Resources) plus one CTA.
- **Sections in order:** hero → "Trusted by industry leaders" logos → "I'm looking for:" audience selector → "A fully-integrated suite of data sharing products" → product family blocks (each a left-hand intro with stats and CTAs, right-hand grid of product cards) → a full-bleed colour block for the consumer AI product → purpose-built solutions → governance board → leadership → "Made in Hyderabad" → large corporate footer.
- **Useful patterns:** product-family blocks with an intro column and a card grid; an audience selector; a strong coloured feature block that breaks the page rhythm; a deep footer.
- **Not transferable:** client logos, statistics, board and leadership sections. Lily has no verified equivalents and the brief forbids inventing them.

### Recommended Lily AI home section map

| # | Section | Borrowed logic | Lily treatment |
|---|---|---|---|
| 1 | Navigation | equal.in dropdowns | Product dropdown (Overview, Mode A, Mode B, How It Works); transparent over hero, glass on scroll |
| 2 | Hero | myequal.ai single promise | 3D conversational core, two signal paths, existing headline and CTAs |
| 3 | See Lily in action | myequal.ai film moment | Two labelled illustrative demos, Mode A with Beta badge |
| 4 | Problem | — | One strong composition for four problems, not four cards |
| 5 | Meet Lily AI | myequal.ai pinned object | Pinned conversation demo: listen → understand → assist → capture |
| 6 | Two modes | equal.in product family | Split composition with the mode switcher |
| 7 | How it works | myequal.ai numbered sequence | Scroll-linked 5-stage signal path; vertical on mobile |
| 8 | Capabilities | equal.in card grid | Bento grid with varied cell types |
| 9 | Personalization | — | Playground with three toggles (moved up from Product, kept there too) |
| 10 | Use cases | equal.in "I'm looking for" | Audience selector driving the role explorer |
| 11 | Platform | — | Interactive pipeline diagram |
| 12 | Security | equal.in colour block | Bright editorial section |
| 13 | Honest status | equal.in trust section (replaced) | Verifiable facts only: Beta status, in-app only, consent-first |
| 14 | Final CTA + footer | Both | 3D closing visual; multi-column footer |

---

## 6. Tools, skills and MCP availability

| Resource | Status in this session | Used in Phase 1? |
|---|---|---|
| **React Bits** | Repo inspected. It is a React component library installed per component through the shadcn CLI. The shadcn MCP server was added to a different workspace (`AE-Claude-Studio/.mcp.json`); it will need adding to this project once it exists. | Inspected only |
| **MotionSites MCP** | **Connected.** Account is on the **free plan**: no premium prompts, sections, DESIGN.md files, background videos, gradients, or templates. 3 free prompts available through the MCP, 0 used. | Account checked. Library search is planned for Phase 2 |
| **AI Design Skills** | `landing-page-design` and `figma-designer` are installed at user level. Note: `landing-page-design` bans Inter and background gradients, which conflicts with this brief. The brief wins; the skill will be used selectively for structure, spacing and motion rules. | Read in full |
| **Fable** | There is no Fable MCP, skill, or design tool connected. "Fable" here is the Claude model running this session (Claude Fable 5.2). It does the design and engineering work directly; no separate Fable tool will be claimed. | The model is doing the work |
| **Unsloth** | Installed on this PC as a desktop app earlier. Not a web design tool. | Not used, and will not be |
| **Browser** | Built-in browser available for live inspection and screenshots. | Yes, for both reference sites |
| **Local tooling** | Node 22.22, npm 10.9, Python 3.12, ffmpeg/ffprobe, uv. | Yes, for asset extraction and analysis |
| **Figma MCP** | Not authorized. | No |

---

## 7. Risks and unknowns

1. **No source project.** The site must be rebuilt as a proper project from one HTML file. Recommended stack: Vite + React + TypeScript, React Router, Three.js via React Three Fiber, GSAP ScrollTrigger. React is required for React Bits.
2. **Project location.** The folder is inside OneDrive. A Node project puts tens of thousands of small files in `node_modules`, which OneDrive will try to sync. Building outside OneDrive (or excluding `node_modules` from sync) avoids this. **Owner decision.**
3. **No approved product documentation was supplied.** The current site is the only source of truth. Claims that the brief says need confirmation — retention of 30 days (EU) / 90 days (elsewhere), "no outside AI company receives your audio or transcripts", "every connection is encrypted" — will be carried over unchanged and not strengthened. They should be confirmed by the owner before launch.
4. **Legal pages** state that a lawyer review is still needed. Wording will be preserved exactly.
5. **Films** appear AI-generated with garbled interface text. They will be labelled illustrative or replaced with coded simulations. Whether to keep them at all is a judgement call that will be made in Phase 2.
6. **Logo** exists only as JPEGs on white. A clean transparent version can be derived, but redrawing or changing the mark is an owner decision.
7. **No deployment domain is known**, so canonical URLs, sitemap, and robots rules can only be prepared with a placeholder.
8. **MotionSites free plan** limits reference material to free items and 3 prompts.
9. **Stock photos** are credited to Pexels in the footer; individual licences were not supplied.
10. **3D performance** on low-power devices is a real risk; a static fallback and a reduced-motion path are mandatory, not optional.
