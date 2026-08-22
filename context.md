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
├── index.html          # the main single page
├── work/               # case-study pages (static, NO JS — fast + robust)
│   ├── k12-games.html  # flagship, NDA-safe + Tray Trouble gallery/links
│   ├── fintrack.html   # design figure + public Figma + GitHub links
│   └── exaltride.html  # next-links chain loops k12 → fintrack → exaltride → k12
│                       # (onebanc.html REMOVED at Piyush's request, Aug 2026 —
│                       #  OneBanc is gone from the site entirely)
├── context.md          # THIS FILE — keep updated
├── design.md           # design system: tokens, type, spacing, motion — keep updated
├── css/                # one file per section/concern
│   ├── base.css        # tokens (:root), reset, shared primitives (.btn, .badge,
│   │                   #   .section shell, [data-spec] tooltip, [data-reveal])
│   ├── hero.css        # hero: two layers + seam + Figma-canvas chrome
│   ├── work.css        # Selected Work rows + "also explored" mini-list
│   ├── playground.css  # Playground tiles + confetti toy styles
│   ├── projects.css    # Personal Projects image cards (#projects)
│   ├── about.css       # About: bio, stats strip, design/code split, history
│   ├── contact.css     # Contact + footer
│   └── case.css        # case-study pages (work/*.html): nav bar, meta grid,
│                       #   problem/approach duo, process cards, results, next-link
├── js/                 # one file per feature, all loaded with defer, no globals shared
│   ├── seam.js         # hero seam drag (drives --seam CSS var)
│   ├── reveal.js       # IntersectionObserver scroll-reveal for [data-reveal]
│   ├── confetti.js     # Playground confetti-button toy
│   └── placeholders.js # a[href="#"] links: preventDefault + refusal shake
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
- ⚠️ The design layer has **`inert`** (HTML attribute) + `pointer-events: none`
  (CSS fallback) — it sits ON TOP of the live layer, and without this its
  duplicate links steal every click left of the seam (this bug shipped once).
  Any new element added to the design layer must never be interactive.
- **The seam is HERO-ONLY — intentional.** A full-page draggable seam would
  make every section double-markup (2× maintenance), hurt performance, and
  turn a wink into a gimmick. The concept echoes elsewhere instead: work-row
  hover dot-grid, Playground canvas background, About's static split line,
  section frame-labels, spec tooltips.
- Placeholder links (`href="#"`) don't dead-jump to the top: `placeholders.js`
  intercepts them with a refusal shake. Giving a link a real href opts it out
  automatically.

## 6. Page sections (index.html, in order)

1. **Hero** — "The Seam" (see §5). Nav lives inside both hero layers
   (links: Work / Playground / About / Contact + Resume button).
   ⚠️ Open question: no sticky nav after scrolling past the hero — revisit.
2. **Work** (`#work`, `Frame 02`) — 3 case-study rows (no thumbnails yet),
   each linking to its page in `work/`: K-12 games (flagship, anonymized per
   NDA), FinTrack (MERN), ExaltRide. Descriptions lead with metrics
   (2+ games / 30+ screens / 20+ components — extracted from the old
   portfolio repo `CodeWithPiyush0/PiyushUXPortfolio`, the canonical source
   of the project data). Below the rows: an "Also explored" mini-list —
   Spark (links to its public Figma) and WealthUp (no link, conversation
   bait). Row hover: dot-grid canvas fades in behind the row.
3. **Playground** (`#playground`, `Frame 03`) — where the game-feel lives.
   Big tile = **Tray Trouble** (assets/tray-trouble.jpg thumbnail, links out to
   https://tray-trouble.vercel.app + repo github.com/CodeWithPiyush0/Tray_trouble).
   **Permission situation (Aug 2026):** Piyush's team lead VERBALLY approved
   reusing one of his shipped work games with the character changed; he built
   the reskin ("Tray Trouble", candy-chef mascot, was "Trouble in Treat Town").
   **Public framing (Piyush's decision, Aug 2026):** the site does NOT mention
   the work/DE origin — Tray Trouble is presented neutrally as "a learning
   game I designed and built end-to-end" (TRUE — he did design and build it;
   the site simply omits provenance). ⚠️ NEVER escalate the public claim to
   "personal project built from scratch on my own time" — that's inaccurate
   and would UNDERMINE the permission defense. ⚠️ The written permission from
   the team lead is now MORE important, not less — it's the private proof
   that publishing the game is authorized. Keep chasing it.
   Small tile = working confetti-button toy (js/confetti.js). Second small
   tile = wireframe "more experiments" placeholder.
4. **Projects** (`#projects`, `Frame 04`) — TWO groups (per Piyush):
   **Design** (cards link to public Figma files, real screenshots):
   PocketPlan (personal budgeting WEB app — dashboard/transactions/budget/
   calendar/reports) and Frenley Dating App (= the project the old portfolio
   called "Spark"). Images were exported via the Figma MCP from nodes inside
   the WORK file "Trouble-in-trat-town" (lvxL0z2g1KJBgdBbd1T5rT) where
   Piyush parked copies — nodes 357:1011 (PocketPlan), 357:4338 (FinTrack
   Main UI), 357:7094 (Frenley). The FinTrack design card was REMOVED as a
   duplicate (it has a full case study) — its Figma dashboard render now
   lives on work/fintrack.html as "The design side" figure
   (assets/projects/fintrack-design.jpg). SpeedyMart (first college project)
   still ON HOLD — personal file, no MCP access yet; include only if strong.
   **Development** (cards link live + GitHub): FitTrack, 3D Solar System.
   (Healthcare Dashboard + Sapna Studio removed at Piyush's request; their
   jpgs remain unreferenced in assets/projects/.)
   `.project-card__shot--pending` (dashed dot-grid placeholder) stays in
   projects.css for future not-yet-exported cards.
5. **About** (`#about`, `Frame 05`) — short bio + stats strip; skills split
   into two columns separated by a static seam line; **Toolbox** (scannable
   tool chips: design/code tools row + "ai stack" row — mirrors the resumes'
   AI & Prompting line); experience + education.
6. **Contact** (`#contact`, `Frame 06`) — big CTA heading, email button,
   LinkedIn/GitHub links, resume. Footer: "Designed & built by hand."

Case-page extra: `work/k12-games.html` has a 2×2 **Tray Trouble gallery**
(`assets/game/*.jpg`, captured from the live game via its `#N` hash deep
links — FLOW index; e.g. #4 top view, #5 tutorial, #12 level) + buttons:
Play / **public Figma file** (Tray_trouble_game, nusnrquk5KE91XFymSqwl2) /
GitHub. ⚠️ The ORIGINAL client Figma ("Trouble in trat town") must never be
linked publicly — only the public Tray_trouble_game copy.

## 7. Copy & data status

CONFIRMED (by Piyush, Aug 2026):
- Experience: Direction Educare (Software Design Engineer — UX/UI,
  Apr 2026 – present) · ExaltRide (UI/UX Designer, Jan 2026 – Mar 2026) ·
  CeroED Technologies (UI/UX Designer, Aug 2025 – Oct 2025).
- Email: piyush0codes@gmail.com ·
  LinkedIn: linkedin.com/in/piyush-kumar-9b9618289 ·
  GitHub: github.com/CodeWithPiyush0
- Resume: `assets/Piyush_Kumar_UX_Resume.pdf` (⚠️ mixed-case filename —
  always reference with exact case; deployed host is case-sensitive).
- Deployed on Vercel (Aug 2026).

CONFIRMED VIA OLD PORTFOLIO REPO (github.com/CodeWithPiyush0/PiyushUXPortfolio —
clone it for the canonical project data, `src/pages/CaseStudy.jsx` + `About.jsx`):
- Titles: Direction Educare = "UI/UX Designer & Developer" · ExaltRide =
  "UI/UX Designer (Intern)" · CeroED = "Software Design Engineer — UX/UI"
  (an earlier version of this site had DE/CeroED titles swapped — fixed).
- Education: MCA Chandigarh 2023–2025 (7.2 CGPA) · BCA Nitishwar 2019–2022 (80.78%).
- Metrics used across the site (UPDATED by Piyush, Aug 2026): **4+ games,
  2+ interactive story flipbooks** (DE — a flipbook is the end product: a
  complete story with games woven in; replaces the old "2+ games, 6+
  modules" everywhere, including both resumes) · 13+ admin modules, 8+
  vendor features, 30+ screens (ExaltRide) · 10+ workflows, 30+ components
  (CeroED).
- Public artifact links: FinTrack Figma + fintrack-frontend/-backend GitHub
  repos, Frenley Figma, Pocket_Plan Figma, Tray_trouble_game Figma.
  (OneBanc was removed from the site entirely, Aug 2026.)

STILL DRAFT (mine, to workshop with Piyush):
- Hero headline/tagline/sub and About bio wording (facts are real now,
  the voice hasn't been workshopped).
- Case-page prose is my rewrite of the old portfolio's copy in first-person
  build-log voice — Piyush should read and personalize.

## 8. Roadmap / open TODOs

- [x] Real contact/email/social links + resume PDF wired (Aug 2026)
- [x] Favicon: `assets/favicon.svg` (the seam motif: canvas left / ink right /
      blue seam + grip) + `favicon-32.png` + `apple-touch-icon.png` (rendered
      from the SVG at 512px via headless Chrome — it ignores window sizes
      below ~500px! — then downscaled with PowerShell System.Drawing)
- [x] Basic OG meta tags (og:image with a real preview picture still TODO)
- [x] Deployed to Vercel
- [x] Responsive pass: mobile (390) + tablet (768) verified via screenshots.
      Breakpoints: 640 (nav links hide, seam tag hides), 720 (work rows lose
      index), 800 (about stacks), 900 (playground stacks). Section padding is
      fluid clamp(72px,14vw,120px); seam hit-area widens on coarse pointers.
      ⚠️ Headless can't render <500px windows — capture mobile via a 390px
      IFRAME wrapper page (see scratchpad technique) or test on a real phone.
- [x] Case-study pages ×4 in `work/` (build-log voice; k12 NDA-safe)
- [x] og:image (assets/og-image.png, seam-styled 1200×630, rendered like the
      favicon) — ⚠️ **meta tag still has a RELATIVE path; needs the deployed
      domain to become absolute or LinkedIn won't show it. ASK PIYUSH for the
      Vercel URL.**
- [x] Stats strip in About + metric-led work descriptions
- [ ] Hero copy + bio: workshop real voice with Piyush
- [x] **Playable game in the Playground**: solved by **Tray Trouble** (see §6.3)
      — a permitted reskin of shipped work, live + linked from the k12 case page.
- [ ] "The Invention Workshop" (`game-spec.md`) — **PARKED, optional**: was the
      from-scratch demo-game plan before Tray Trouble existed. Still valuable
      as the "first game where I own the learning design too" story + fresh
      portfolio content; build later if/when time allows. Spec stays current.
- [ ] ⚠️ Frontend resume lists "The Invention Workshop (in development)" as a
      project — either start that build or swap the entry for Tray Trouble
      (live link!) before sending that resume out.
- [ ] Real project thumbnails/artifacts for Work rows + case pages
- [ ] Self-host fonts
- [ ] Sticky/return nav decision (case pages have one; index doesn't)
- [ ] 404 page ("unmerged branch")
- [ ] Real-device QA (iOS Safari especially — seam drag, 100dvh)
- [ ] ⚠️ FLAGGED TO PIYUSH (Aug 2026): his personal GitHub publicly hosts
      what look like CLIENT game repos (Bot-show-LBD-1/2, Game_Zone_LBD_1-3,
      Trouble_in_treat_town_LBD1, Bot-Show-Flipbook + live Vercel deploys) —
      likely an NDA problem; recommended making them private. The portfolio
      must NOT link to any of them either way.

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
