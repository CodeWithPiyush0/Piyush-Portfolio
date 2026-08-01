# Portfolio 2026 — Project Context

> Single source of truth for this project. Read this first — you should rarely
> need to scan every file. **Update this file whenever behaviour, structure,
> decisions, or files change.** Design details (colors, type, spacing, motion)
> live in `design.md` — keep that updated too.

---

## 1. What this is

Personal portfolio website for **Piyush Kumar** — UI/UX designer + frontend
developer (Muzaffarpur, Bihar, India). Built to support a job switch: he is
currently at Direction Educare (via parent company Dreamplex Innovations)
designing + developing educational games for K–12, but is leaving due to
unpaid salary. Target roles: **Product Designer / Design Engineer / UX
Engineer / frontend-with-design** — positioning is
**"Designer who ships. Developer who designs."**

- Old portfolio (being replaced): https://piyush-ux-portfolio.vercel.app/
  (Vite + React SPA — felt generic, and being client-rendered it has no
  SEO/link-preview content. Its case-study copy can be ported from its source,
  which Piyush has locally.)
- **Stack: vanilla HTML + CSS + JS. No framework, no build step, no Tailwind,
  no npm.** Deliberate: (a) the signature interactions are low-level DOM work,
  (b) static HTML = perfect SEO + link previews + instant load, (c) "no
  framework, just the platform" is the on-brand flex for a designer-developer,
  (d) React skill is already proven by the FinTrack project itself.
- Must be responsive: mobile / tablet / desktop.
- Hard goal: must NOT feel generic or AI-made. No purple gradients, no
  glassmorphism cards, no stock copy ("crafting intuitive digital
  experiences"), no template rhythm.

## 2. ⚠️ NDA constraints (legal — do not violate)

Piyush signed an NDA with Dreamplex Innovations Pvt. Ltd. (parent of Direction
Educare), valid to 31 Mar 2027, ₹1L penalty. Consequences for this site:

- **NEVER name the client** he was deployed to, anywhere on the site.
  ("Direction Educare" as employer is fine — public employment fact.)
- **NEVER show real game assets, screenshots, video, or source code** from the
  client work. The K-12 games case study must be written process-only and
  anonymized ("an EdTech client").
- **NEVER copy code from the work project** (`F:\CG Game\...` on this machine
  is client work — reference for skill level only, never for code or assets).
- The planned **demo game must be built from scratch**: new concept, theme,
  art, code — clearly distinct from the client game (which is a robot/battery/
  number-combining drag-drop game — so the demo should avoid robots/batteries/
  number-splitting).

## 3. The design concept — "The Seam"

The whole site lives on the boundary between design file and shipped product
(= Piyush's actual job). Chosen over two alternatives (a kids-toybox theme —
too niche; a dark workbench theme — too crowded/dev-leaning).

- **Signature interaction (hero):** a draggable vertical **seam** splits the
  hero. LEFT of the seam = the same hero rendered as a **Figma canvas**
  (dot grid, wireframe outlines, cyan selection box + corner handles, layer
  labels, a redline measurement, `hero.fig`/`hero.html` filename tags on the
  seam). RIGHT = the real, polished, live site. Visitors drag the seam and
  watch design become code.
- **Carried through the rest of the site quietly:** mono layer-labels on
  section headers (`Frame 02 · Selected Work`), spec tooltips on hover
  (`data-spec` attribute — element documents its own padding/radius/hex),
  dot-grid peeking through on Work-row hover, a static seam line splitting
  the About skills columns (design side / code side).
- **Navigation stays boringly conventional** (recruiters give 30–60s; the
  game-feel is in the details, never blocking content). Playfulness is
  concentrated in the Playground section.
- Research check (Aug 2026): before/after sliders are a very common primitive
  (good — zero learning curve), but no portfolio was found using
  "live site vs its own design file" as the site's whole identity.

## 4. Folder structure & conventions

```
Portfolio_2026/
├── index.html          # single page (case-study pages will be separate .html later)
├── context.md          # THIS FILE — keep updated
├── design.md           # design system: tokens, type, spacing, motion — keep updated
├── css/                # one file per section/concern
│   ├── base.css        # tokens (:root), reset, shared primitives (.btn, .badge,
│   │                   #   .section shell, [data-spec] tooltip, [data-reveal])
│   ├── hero.css        # hero: two layers + seam + Figma-canvas chrome
│   ├── work.css        # Selected Work rows
│   ├── playground.css  # Playground tiles + confetti toy styles
│   ├── about.css       # About: bio, design/code split columns, experience
│   └── contact.css     # Contact + footer
├── js/                 # one file per feature, all loaded with defer, no globals shared
│   ├── seam.js         # hero seam drag (drives --seam CSS var)
│   ├── reveal.js       # IntersectionObserver scroll-reveal for [data-reveal]
│   └── confetti.js     # Playground confetti-button toy
└── assets/             # images, resume PDF, (later: self-hosted fonts, game)
```

- Naming: BEM-ish (`.hero__title`, `.work-row`, modifier `.btn--primary`).
- All design tokens are CSS custom properties in `css/base.css :root` —
  change the look from one place. Documented in `design.md`.
- Fonts: Google Fonts (Space Grotesk + JetBrains Mono). TODO: self-host in
  `assets/fonts/` before launch (performance + offline dev).
- JS files are IIFEs, `"use strict"`, no cross-file globals needed so far.

## 5. The hero / seam — implementation facts

- Two **geometrically identical layers** of the same hero markup inside
  `#seam-stage`: `.layer--live` (base) and `.layer--design` (on top,
  `aria-hidden="true"`, clipped to the LEFT of the seam via
  `clip-path: inset(0 calc(100% - var(--seam)) 0 0)`).
- `--seam` (0%–100%, % from left) is set on `#seam-stage` by `js/seam.js`.
  The `.seam` handle (`role="slider"`, keyboard arrows work, Shift = ×10)
  sits at `left: var(--seam)`.
- Entrance: page loads fully live (`--seam: 0%`), seam sweeps to REST=38%
  (ease-out cubic, 1.4s), then "breathes" ±1.5% (sine) until first
  interaction. `prefers-reduced-motion` → jumps straight to 38%, no motion.
- Drag uses Pointer Events + `setPointerCapture` (mouse/touch/pen);
  `touch-action: none` on the handle.
- ⚠️ **LAYER GEOMETRY RULE:** layout rules live on shared classes; skins are
  scoped under `.layer--live` / `.layer--design`. Anything that affects flow
  in ONE layer must be compensated in the other, or the layers drift and the
  seam illusion breaks (visible "ghosting"). Existing compensations:
  - design layer's in-flow `.redline` (height 32px) ↔ live layer's
    `.hero__sub { margin-top: 32px }` (design sub has `margin-top: 0`);
  - `.badge` has `border: 1px solid transparent` in base so the design
    layer's 1px dashed border adds no height.
  When adding/changing hero content, verify alignment by dragging the seam
  slowly — text must flow continuously across it.
- The design layer is duplicate markup (kept in sync BY HAND in index.html —
  edit both copies).

## 6. Page sections (index.html, in order)

1. **Hero** — "The Seam" (see §5). Nav lives inside both hero layers
   (links: Work / Playground / About / Contact + Resume button).
   ⚠️ Open question: no sticky nav after scrolling past the hero — revisit.
2. **Work** (`#work`, `Frame 02`) — 4 case-study rows (no thumbnails yet):
   K-12 game-based learning (flagship, anonymized per NDA), FinTrack (MERN),
   ExaltRide (e-commerce ecosystem), OneBanc (wealth-management UX challenge).
   Rows link to future case-study pages (hrefs are `#` placeholders).
   Hover: dot-grid canvas fades in behind the row (design layer "peeking
   through the paper").
3. **Playground** (`#playground`, `Frame 03`) — where the game-feel lives.
   Big tile = placeholder slot for the **original demo game** (to be built
   from scratch, NDA-safe — this is the portfolio's future centerpiece).
   Small tile = working confetti-button toy (js/confetti.js). Second small
   tile = wireframe "more experiments" placeholder.
4. **About** (`#about`, `Frame 04`) — short bio; skills split into two
   columns ("Design side" / "Code side") separated by a static seam line;
   experience + education list.
5. **Contact** (`#contact`, `Frame 05`) — big CTA heading, email button,
   LinkedIn/GitHub links, resume. Footer: "Designed & built by hand — no
   frameworks, no templates."

## 7. Copy status — ⚠️ mostly PLACEHOLDER

- Hero headline/tagline/sub: draft, to be workshopped with Piyush.
- Work row descriptions: drafted from old portfolio content; rewrite in
  "build-log" voice (real decisions/trade-offs, first person) for case pages.
- About bio, experience dates: **UNCONFIRMED** — old portfolio says
  "Software Design Engineer - UX/UI"; NDA says title "Figma Designer";
  a "Jan 2026 - Mar 2026" range appeared in the old bundle (CeroED?).
  Confirm all dates/titles with Piyush before launch.
- Contact email is a placeholder (`hello@piyushkumar.design` is NOT real).
  Socials link to `#`. Resume PDF not yet in assets/.

## 8. Roadmap / open TODOs

- [ ] Approve full-page design → iterate on feel with Piyush
- [ ] Real copy everywhere (kill placeholders, confirm dates/titles/email)
- [ ] Case-study pages (separate HTML files, build-log format)
- [ ] **Original demo game** for the Playground (from scratch, NDA-safe;
      subject TBD — avoid robots/batteries/number-splitting)
- [ ] Real project thumbnails/artifacts for Work rows
- [ ] Self-host fonts; add favicon + OG meta tags + social preview image
- [ ] Resume PDF in assets/
- [ ] Sticky/return nav decision
- [ ] Deploy (Vercel, keep or replace old URL) — remember lowercase asset
      paths (Linux servers are case-sensitive; bit us on the game project)

## 9. Verification workflow — use `?static`

The site has a built-in **screenshot/test mode**: append `?static` to the URL
(also auto-triggers when `navigator.webdriver` is true). It:
- reveals all `[data-reveal]` elements immediately (IntersectionObserver does
  NOT fire reliably under headless virtual time — without this the page
  captures blank);
- skips the seam entrance/breathing (seam sits at REST 38%);
- sets `scroll-behavior: auto`;
- adds `.static-mode` to `<html>`, which pins the hero to a fixed 900px
  height (`hero.css`) so ONE tall capture shows the whole page — headless
  fragment-scrolling (`#work` URLs) proved unreliable, don't rely on it.

Full-page capture (no dev server needed — plain file):

```
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu \
  --hide-scrollbars --screenshot=<out.png> --window-size=1400,6400 \
  --virtual-time-budget=6000 "file:///F:/Portfolio_2026/index.html?static"
```

(Page height ≈ 6400px at 1400 wide as of Aug 2026 — grow the window height as
sections are added.) Judge motion in a real browser; screenshots only verify
layout. Markup gotcha: children of `<a>` rows are `<span>`s — give them
`display: block` in CSS when they must stack (already done in work.css).
