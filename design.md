# Portfolio 2026 — Design System

> Every design decision lives here: tokens, type, spacing, components, motion,
> and the reasoning behind them. **Update whenever anything visual changes.**
> Tokens are implemented as CSS custom properties in `css/base.css :root`.

---

## 1. Design principles

1. **The Seam** — the site's identity is the boundary between design file and
   shipped product. Design-canvas motifs (dot grid, wireframes, selection
   chrome, redlines, mono labels) may appear anywhere, but always *quietly*.
2. **Boring structure, crafted details.** Conventional IA and navigation;
   all creative budget goes into micro-interactions and finish.
3. **One accent.** A single blue does all accent work on both sides of the
   seam. If something needs emphasis, use weight/size/space first.
4. **Anti-generic.** Banned: purple/blue gradients, glassmorphism, drop-in
   icon libraries, emoji headers, stock UX copy, default Tailwind-looking
   shadows/radii. Custom or nothing.
5. **Self-documenting UI.** Components can expose their own specs (tooltips
   with padding/hex) — the site behaves like a design system.

## 2. Color

### Live side (the shipped site)
| Token | Value | Use |
|---|---|---|
| `--paper` | `#FAF8F3` | page background (warm off-white, not pure white) |
| `--ink` | `#1B1813` | primary text (warm near-black, not #000) |
| `--muted` | `#6E675C` | secondary text (warm grey) |
| `--accent` | `#0D99FF` | THE accent — Figma selection blue. Links, primary CTA, seam, tagline |

### Design side (the Figma canvas)
| Token | Value | Use |
|---|---|---|
| `--canvas` | `#F2F0EA` | canvas background |
| `--canvas-dot` | `#CFCAC0` | dot grid dots |
| `--wire` | `#B7B1A5` | wireframe borders (dashed) |
| `--wire-text` | `#8D867A` | all text on the design side (muted, "unstyled") |

### Functional
- Availability dot: `#2FB344` (green) with `rgba(47,179,68,.2)` halo ring.
- Tooltip/dark chip background: `--ink`, white text.
- Hairline dividers: `rgba(27,24,19,.12)`.

Rationale: warm paper + warm ink reads "crafted print"; the cool Figma blue
pops against it precisely because everything else is warm. Green is reserved
for "available/success" only.

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display + body | **Space Grotesk** (400/500/700) | characterful grotesque; display uses tight tracking |
| Mono / "spec" layer | **JetBrains Mono** (400/500) | ALL design-canvas chrome, labels, tags, tooltips, badges |

Loaded from Google Fonts (TODO: self-host). The mono font IS the design-file
voice — any text that "belongs to the canvas" (layer names, measurements,
filenames, section frame-labels) is mono, small, and often uppercase.

### Scale (fluid, clamp-based)
| Style | Size | Weight / spacing |
|---|---|---|
| Hero H1 | `clamp(52px, 9vw, 128px)` | 700, `-0.03em`, line-height 0.98 |
| Hero tagline | `clamp(20px, 2.6vw, 32px)` | 500, `-0.01em`, accent color |
| Section title | `clamp(40px, 5vw, 72px)` | 700, `-0.02em` |
| Body / hero sub | `clamp(15px, 1.4vw, 18px)` | 400, line-height 1.6, muted |
| Buttons | 16px (small: 14px) | 500 |
| Mono labels/badges | 10–12px | 400–500, `letter-spacing 0.04–0.08em`, uppercase for badges/labels |

## 4. Spacing & layout

- Page side padding: `--edge: clamp(20px, 5vw, 72px)`.
- Nav height: `--nav-h: 76px`.
- Section vertical padding: `120px` top/bottom (`.section`).
- Section inner max-width: `1200px`, centered (`.section__inner`).
- Hero inner max-width: `1100px`; hero sub max-width `560px` (measure).
- Dot grid: `24px × 24px`, 1px dots.
- Content gaps: 16 / 24 / 36 px steps — prefer these before inventing new ones.

## 5. Radii & shadows

- Pills (buttons, badges, chips): `border-radius: 999px`.
- Small chips/labels/tooltips: `4–6px`.
- Tiles/cards: `16px`.
- Shadows: used ONLY for accent-colored glows and tooltips, never for
  "card elevation" (that's the template look):
  - primary CTA hover: `0 6px 20px rgba(13,153,255,.35)`
  - seam line: `0 0 12px rgba(13,153,255,.45)`
  - seam grip: `0 4px 16px rgba(13,153,255,.4)`

## 6. Components

### Buttons (`.btn`)
- Base: pill, `padding 14px 28px`, 16px/500, transition 0.15s.
- `--primary`: accent bg, white text; hover lifts `-2px` + blue glow.
- `--ghost`: `1.5px solid var(--ink)` outline; hover lifts.
- `--small`: `10px 20px`, 14px (nav resume button).
- Design-layer versions: transparent bg, `1.5px dashed` borders
  (accent for primary, `--wire` for others), `--wire-text` text.

### Badge (`.badge`)
- Mono 12px uppercase pill, `padding 8px 14px`, green pulse dot.
- Has `border: 1px solid transparent` in base — reserves the height that the
  design layer's dashed border occupies (LAYER GEOMETRY RULE, see context.md §5).

### Spec tooltip (`[data-spec]`)
- Any element with a `data-spec` attribute shows a dark mono tooltip above
  itself on hover: e.g. `data-spec="padding 14 × 28 · radius 999 · #0D99FF"`.
- 11px mono, ink bg, 6px radius, fades/slides in 0.18s.
- Use sparingly — 1–2 per screen; it's a wink, not a system requirement.

### Figma-canvas chrome (design layer only)
- `.wire-frame`: `1px dashed var(--wire)` outline, `outline-offset: 6px`,
  layer-name label via `::before attr(data-layer)` — 10px mono accent-blue,
  above the element (below for the nav).
- `.sel` (selected element): `1.5px solid var(--accent)` outline,
  offset 8px; four `8px` white corner handles with accent border
  (`.sel__h--tl/tr/bl/br`); dims chip (`.sel__dims`) bottom-right — accent
  bg, white mono 10px.
- `.redline`: 1px accent vertical line, 9px end ticks, number label chip.
- Seam filename tags (`.seam__tag`): mono 11px chips at the seam top —
  left = accent bg (`hero.fig`), right = ink bg (`hero.html`).

### Section shell
- `.section__label`: mono 12px accent, `Frame 0N · Name` — the design-file
  voice naming each section. Numbering must match document order.
- `.section__title` + optional `.section__intro` (muted, max 560px).

## 7. Motion

| Thing | Spec |
|---|---|
| Seam entrance | 0 → 38% in 1.4s, ease-out cubic, then sine breathe ±1.5% until touched |
| Hover lifts | `translateY(-2px)`, 0.15s ease |
| Spec tooltip | 0.18s opacity + 4px rise |
| Seam grip hover/drag | scale 1.12, 0.15s |
| Scroll reveal (`[data-reveal]`) | opacity 0→1 + 24px rise, 0.6s ease, staggered by markup order (0.08s steps via `--d`) |
| Confetti toy | WAAPI, 36 particles, 700–1400ms, physics-ish fall + spin |
| Placeholder-link refusal | WAAPI shake: x 0 → −6 → 5 → −3 → 0 px, 300ms ease-out |

Rules: animate only `transform`/`opacity`/`clip-path` (compositor-friendly —
lesson carried over from the game project). Everything must respect
`prefers-reduced-motion: reduce` (global kill in base.css + JS checks where
motion is JS-driven; also forces `scroll-behavior: auto`). `?static` in the
URL disables all entrance motion (screenshot/test mode — see context.md §9).

## 8. Voice & copy

- First person, concrete, decision-focused ("I rebuilt the drag system three
  times" not "passionate about user-centric solutions").
- Mono text = the design file talking (labels, specs, filenames) — lowercase
  filenames, `·` separators.
- Positioning line: **"Designer who ships. Developer who designs."** (draft).
- Never: "crafting", "passionate", "pixel-perfect solutions", emoji in headers.
