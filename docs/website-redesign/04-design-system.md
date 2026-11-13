# 04 — Design system

Source of truth: `src/styles/tokens.css`. Components: `src/styles/components.css`. Section layouts: `src/styles/sections.css`.

## Colour
| Token | Value | Use |
|---|---|---|
| `--midnight` | `#080B18` | Page background, dark sections |
| `--deep-navy` | `#0D1530` | Raised dark sections |
| `--brand-navy` | `#14234A` | End of the depth gradient |
| `--electric` | `#356BFF` | Active controls |
| `--cyan` | `#39D8F2` | Accent; **Mode A** |
| `--lavender` | `#B9AEFF` | **Mode B** |
| `--violet` | `#8065F5` | Depth accent only |
| `--ice` | `#DDF8FF` | Highlights |
| `--canvas` | `#F6F8FC` | Light sections |
| `--ink` | `#11182B` | Text on light |
| `--slate` | `#56617A` | Secondary text on light (darkened from the brief's `#64708A` for contrast) |
| `--mist` | `#AAB6D1` | Secondary text on dark |
| `--amber` | `#FFC46B` | Beta and honest-status markers only |

**Semantic tokens** (`--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`, `--mode-a`, `--mode-b`, `--focus`) are what components use. Adding `.theme-light` to a section remaps them, so every component works on both themes without overrides.

## Gradients (each has one job)
- `--grad-depth`, midnight to navy: dark section backgrounds.
- `--grad-signal`, cyan to electric: active signal (bars, hero accent line).
- `--grad-private`, electric to violet: Mode B signal.
- `--grad-ice`, white to ice: light editorial sections.

## Type
- **Display:** Sora Variable. **Body:** Inter Variable. Both are self-hosted through `@fontsource-variable`, so the site makes no third-party font requests.
- Fluid scale with `clamp()`: `--fs-hero`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-h4`, `--fs-lg`, `--fs-base` (17px), `--fs-sm`, `--fs-xs` (13px minimum).
- Headings use `text-wrap: balance`; body uses `text-wrap: pretty`.

## Space, radius, motion
- Space: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96. Section padding `--section-y` is fluid (72–144px).
- Radius: 8 / 14 / 22 / 32 / full.
- Motion: one curve, `cubic-bezier(0.22, 1, 0.36, 1)`; 200ms for colour, 450ms for layout, 800ms for reveals.

## Components
Button (primary, ghost; md, sm) · Badge (Mode A, Mode B, Beta, neutral) · DemoLabel · Kicker · SectionHead · Reveal · Tabs (pill, segment) · Accordion · Notice · Frame (product window) · Message (other, Lily, suggestion, captured) · Chip · Card grid · Mode cards · Honest status · Page hero · Final CTA · Form · Nav · Footer.

All interactive components have hover, active, focus-visible and disabled states. The minimum touch target is 44px.

## Note on the installed `landing-page-design` skill
That skill bans Inter and background gradients. The brief asks for both, so the brief was followed. The skill's spacing discipline, single motion curve, state requirements and "no invented facts" rule were applied.
