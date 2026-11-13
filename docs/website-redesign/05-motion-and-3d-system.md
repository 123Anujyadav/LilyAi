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
