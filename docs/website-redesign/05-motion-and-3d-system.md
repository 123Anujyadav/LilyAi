# 05 — Motion and 3D system

## Libraries
| Library | Why | Loaded |
|---|---|---|
| `three` and `@react-three/fiber` | The conversational core | Lazy chunk, only when a core scrolls near the viewport |
| `motion` | Required by the React Bits `BlurText` component | Main bundle |
| React Bits `BlurText` | Hero tagline reveal | Main bundle |
| React Bits `SpotlightCard` | Mode cards and technology cards | Main bundle |

Not used, on purpose: GSAP, Lenis, Drei, post-processing. Scroll effects use `IntersectionObserver` and one scroll listener throttled with `requestAnimationFrame`. Native scrolling is never hijacked.

## The core (`src/three/CoreScene.tsx`)
Fully procedural; there are no downloaded models or textures.
- **Shell:** icosahedron with simplex-noise displacement and a fresnel shader.
- **Waveform:** a camera-facing line inside the shell.
- **Lattice:** a slow wireframe shell.
- **Sound rings:** line loops whose radius carries a travelling wave.
- **Signal paths:** particles flowing along two curves — cyan outward for Mode A, lavender returning for Mode B.
- **Context nodes** and **dust**.
- Glow is done with additive billboards rather than a bloom pass.

Variants: `both` (home, product, 404), `a` (Mode A), `b` (Mode B). Pointer movement tilts the rig on desktop. On the home hero, scrolling rotates, lifts and shrinks it.

## Fallbacks (`src/components/CoreVisual.tsx`)
1. A **CSS-only core** renders immediately and stays under the canvas while the 3D chunk loads, so the hero is never empty and text never waits on WebGL.
2. With **`prefers-reduced-motion`** or **no WebGL**, the CSS core is the final state and the 3D chunk is never downloaded.
3. On **low-power or small screens** (760px or narrower, 4 cores or fewer, 4 GB or less, or Save-Data), quality drops: about a third of the particles, a lower pixel ratio, one fewer ring.
4. **Off-screen**, the render loop stops.

## Motion language
- **Entrance:** hero words rise and de-blur in sequence, about one second in total. Nothing blocks content.
- **Reveal:** sections rise 28px and fade in once. Content already in view on load is never hidden.
- **Signal:** in the mode diagram, dashed lines flow in the direction information travels.
- **State:** demos change state with a short pop. The agent demo cycles until the user picks a state.
- **Hover:** buttons lift; cards brighten their border. There is no custom cursor.
- A global reduced-motion rule disables animations and transitions.

## Budget (measured from the production build)
| Asset | Size | Gzip |
|---|---|---|
| Initial JS | 476 kB | 153 kB |
| Interior pages chunk | 23 kB | 6 kB |
| 3D chunk (lazy) | 930 kB | 247 kB |
| CSS | 57 kB | 12 kB |
| Fonts (Latin subsets) | 82 kB woff2 | — |
| Photos | 21–77 kB each, WebP, lazy-loaded | — |
| Video | none | — |

The whole `dist` folder is 2.5 MB, against 27 MB for the original single file.

## Motion and 3D additions (2026-11-14)

Added at the owner's request for more motion and more 3D.

**In the core (`CoreScene.tsx`)**
- **Equalizer ring:** 96 instanced bars around the core that move like a live audio spectrum (48 on low quality).
- **Pulse rings:** expanding rings that leave the core, like words being spoken.
- **Glass orbit rings:** two solid torus rings with a fresnel edge and a travelling highlight.
- A slow breathing scale on the whole rig.

**New scene (`FieldScene.tsx`)**
- **Sound field:** a plane of about 8,300 points carrying travelling waves, seen at a low angle. The pointer sends a ripple through it. Used behind "Meet Lily" and "Platform" on the home page, behind the pipeline sections, and in the six text-only dark page heroes. It is lazy-loaded, paused off-screen, reduced to about 2,500 points on low-power devices, and not rendered at all for reduced motion, Save-Data, or without WebGL.

**Pointer depth (`components/motion.tsx`)**
- **Tilt:** mode cards and the two "in action" cards tilt in 3D toward the pointer, with a moving highlight and inner content lifted on the Z axis.
- **Hero chips:** three glass status chips float around the core and shift at different depths with the pointer. Hidden below 1180px.
- **Magnetic buttons:** the hero and closing calls to action lean toward the pointer.
- **Cursor light:** a soft glow follows the pointer across the page.
- All four are disabled on touch devices and for reduced motion.

**Scroll motion (`styles/motion.css`)**
- Section headings flip up word by word in 3D; kicker lines draw in.
- Product frames tilt up from the page as they enter; paired cards swing in from left and right; capability cells stagger in.
- A reading progress bar along the top edge, and a short fade between pages.
- Small living details: call states light up in sequence, active step dots pulse, orbs bob, role photos drift slowly, primary buttons get a light sweep on hover.

**Cost:** the home page now creates up to four WebGL canvases (hero core, two fields, closing core). Only the ones on screen render. This has not been profiled on a low-power device.

## Orb film look (2026-11-14, later)

The owner supplied `gemini_generated_video_e93e1c08.mp4` (the orb film from the original hero) and asked for that effect in the hero and wherever it fits. The core was rebuilt in WebGL to match it rather than embedding the video file, because a live scene stays sharp at any size, reacts to the pointer and scroll, weighs nothing extra, and carries no generator watermark.

What the core is now (`CoreScene.tsx`, rewritten):
- **Glass sphere** with soft studio reflections and a **geodesic wireframe**.
- **Energy ribbon:** 22 closed loops that together read as the wavy woven band inside the sphere.
- **Waveform** across the middle with a light flare behind it; its amplitude rises and falls like speech.
- **Orbit rings:** two crossing thin rings and one faint outer ring.
- **Bokeh:** soft out-of-focus particles at different depths that drift upward and twinkle.
- Kept from before: pulse rings and the two mode signal paths. Removed: the equalizer bar ring and the noise-displaced shell.

Colour follows the film on the pages that show both modes (violet and blue). Mode A keeps a cyan core and Mode B a lavender one, so the mode colour rule still holds. The hero background, the headline accent line, the closing section, the static fallback and the small orbs inside the product demos were retinted to match.

Where it appears: home hero, home closing section, Product, Mode A, Mode B, every interior closing section, and the 404 page. The video file itself is not used anywhere on the site.

## Hero uses the owner's video (2026-11-14, final)

At the owner's request the home hero now plays the supplied film itself instead of the WebGL core.

- Source: `gemini_generated_video_e93e1c08.mp4`, re-encoded without audio to `public/assets/hero-orb.mp4` (1280x720, H.264, 1.8 MB, was 5.3 MB) with a poster frame `hero-orb-poster.jpg` (50 kB).
- It plays muted and looped, pauses when the hero is off-screen, and shows only the still poster for reduced motion. The poster is also the background if the file fails to load.
- It sits to the right of the headline with soft faded edges. The floating chips, pointer light and headline animation remain on top.
- **The generator's sparkle watermark is part of the footage and is faintly visible near the lower right of the orb.** It was not removed. A clean export from the owner would be needed to lose it.
- The 10-second loop has a visible jump where it restarts.
- The WebGL core built to match the film is still used on Product, Mode A, Mode B, the closing sections and the 404 page. The home page therefore no longer loads the 3D chunk until the reader scrolls to a sound-field section.
