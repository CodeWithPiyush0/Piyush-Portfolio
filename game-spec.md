# The Invention Workshop — Game Design Spec (v1)

> Design spec for the original demo game embedded in the portfolio Playground.
> Lives here until the game gets its own repo — then this file moves with it.
> Author: Piyush (learning design + UI + code — first game owned end-to-end,
> including the LXD role). NDA guardrails: see portfolio `context.md` §2 —
> no robots, no batteries, no "fix the broken thing", no feed-N-objects-into-
> machine counting, all-new art and code.

---

## 1. Pitch

**Professor Poppy's Invention Workshop** — a cozy workshop where kids (age
5–8 / KG–grade 2) help the Professor **build brand-new inventions** by
completing learning challenges at different machines. Every finished
invention goes on the **Invention Shelf** — the kid's growing collection.

- Kids **create**, never repair. The emotional beat is "I made that!"
- One game, many machines: an **expandable anthology**. v1 ships with two
  machines; more get added over time (each new machine = a portfolio update
  + a "new content" beat for the case study).

## 2. Learning design principles

1. **The concept drives the mechanic.** Each machine teaches ONE concept
   through its interaction — never a quiz with scenery.
2. **No fail states, no timers, no scores.** Mistakes bounce back gently;
   mastery is the win condition. (Age-appropriate; also modern LXD practice.)
3. **Show, don't tell.** Kids this age don't read instructions: every machine
   opens with a ghost-hand demo, not text. Any text is decorative/for parents.
4. **Layered guidance** (proven pattern from my professional work):
   - wrong drop → gentle bounce home + soft "try again" wobble (no red X)
   - 2 consecutive mistakes → ghost-hand demonstrates the correct move
   - ~12s idle → subtle nudge animation on the correct tray/piece
5. **Celebration is the curriculum's ally**: the reward moment *restates the
   learning* (the finished rocket's parts flash one by one: "triangle!
   rectangle! circle!").

## 3. Core loop

```
Title → Workshop hub (pick a machine · see the Shelf)
      → Machine intro (Professor bubble + ghost demo)
      → 4 rounds, ramping difficulty
      → Invention assembles + celebration
      → invention lands on the Shelf → back to hub
```

Session length target: 2–4 min per machine. Recruiter reality: they'll play
~60 seconds — so round 1 of every machine must be instantly playable with
zero onboarding friction.

## 4. The machines

### Machine A — Shape Builder  *(v1 launch)*
- **Teaches:** shape recognition + spatial composition (part–whole thinking,
  geometry vocabulary) — deliberately number-free.
- **Mechanic:** an invention's blueprint (dashed silhouette) on the bench; a
  tray of shape parts below. Drag each shape into its place in the
  silhouette; correct piece snaps + clicks, invention gradually appears in
  full color.
- **Ramp (4 rounds):**
  1. Kite — 2 shapes (triangle + line/tail)
  2. Rocket — 3 shapes (triangle nose, rectangle body, 2 triangle fins = 4 drops)
  3. Ice-cream cart — 5 shapes, mixed sizes (same shape, different sizes —
     size discrimination)
  4. Rocket-dog-house (silly = memorable) — 5 shapes **+ 2 distractor shapes
     in the tray that belong to nothing** (discrimination under noise)
- **Professor bubble names each shape as it snaps** ("A circle for the
  wheel!") — vocabulary reinforcement.

### Machine B — Pattern Machine  *(v1 launch)*
- **Teaches:** patterns & sequencing (pre-algebra thinking).
- **Mechanic:** a conveyor belt carries a sequence of parts toward the
  stamping machine; one slot is empty. 3 candidate parts sit in the tray —
  drag (or tap) the right one into the gap. Belt rolls on, machine goes
  *ka-chunk*, next round.
- **Ramp (4 rounds):** AB → AAB → ABC → attribute pattern (same shape,
  alternating color/size — "the pattern can live in a property").
- **Feedback:** the belt itself is the feedback — it only rolls when the
  pattern is true. Wrong part: belt shudders, part hops back.

### Machine C — Sorting Machine  *(post-v1)*
- **Teaches:** classification + the key insight that *the same objects can be
  sorted more than one way*.
- **Mechanic:** parts parade in; two (later three) bins with attribute labels
  (icon-based). Mid-game **rule switch**: same objects, new sorting rule
  ("now by size!"). The rule switch is the learning moment.

### Machine D — Logic Machine  *(post-v1)*
- **Teaches:** categorical reasoning (odd-one-out).
- **Mechanic:** 4 objects ride up on a platform; tap the one that doesn't
  belong; it parachutes away, the rest power the machine. Ramp: obvious
  category (3 animals + 1 vehicle) → subtle (3 flying things + 1 not).

## 5. Collection meta — the Invention Shelf

- Every completed Shape Builder invention (and a "golden part" from each
  other machine) lands on a wooden shelf in the hub, with a little name tag.
- Persistent via `localStorage` (no accounts, no backend).
- Shelf full-view = the "look what I made" moment kids show parents; in the
  portfolio context, it quietly demonstrates state persistence + empty-state
  design (shelf starts with cobwebs + one curious spider that waves).

## 6. World & art direction

- **Style: flat paper-cutout geometry.** ALL art — characters included — is
  built from basic geometric shapes (SVG/CSS). Self-referential (a game
  about shapes drawn in shapes), fast to produce, and visually nothing like
  the rendered look of my professional work.
- **Palette:** warm cream workshop `#FFF6E9`, wood `#C58B52`, plus bright
  primaries for parts: red `#FF5C5C`, blue `#4DA3FF`, yellow `#FFC93C`,
  green `#4ECB71`, purple `#B084F5`. Ink `#3A2E28`. (Final tokens TBD in
  the game's own design.md.)
- **Professor Poppy:** built from shapes — circle head, triangle coat,
  spectacles = two circles. Speech via a rounded banner, mostly emoji-level
  pictures + short words.
- **Type:** a rounded kid-friendly display face (Fredoka or Baloo 2) for the
  game — deliberately different from the portfolio's Space Grotesk.
- **Sound (stretch):** tiny WebAudio synth bleeps (snap, ka-chunk, fanfare)
  with a mute button. No audio files = no asset weight.

## 7. Screens

1. **Title** — logo built live out of falling shapes (a self-demo), PLAY.
2. **Workshop hub** — the two machines (+ silhouetted "coming soon" machines
   with a friendly `?`), the Shelf, settings (mute).
3. **Machine scene** — bench/conveyor, tray, Professor banner, back-to-hub
   door, round progress as bolts that tighten (not a progress bar).
4. **Celebration overlay** — invention assembles itself center-stage,
   confetti burst, name tag stamps on, flies to shelf.

## 8. Tech architecture (proven patterns, new code)

- Vanilla HTML/CSS/JS, no build step. **Own public repo + own Vercel deploy**;
  embedded in the portfolio Playground via iframe + full-screen link.
- Fixed-aspect 16:9 stage scaling as one unit; positions in stage-relative
  units; big touch targets (≥8% stage width).
- Pointer Events with capture (mouse/touch/pen identical); animate only
  transform/opacity; `prefers-reduced-motion` respected.
- `?static` test mode for headless screenshot verification (same workflow as
  the portfolio).
- **Machine registry:** each machine is one JS module implementing
  `{ id, setup(stage, round), teardown(), onComplete }` — the hub reads the
  registry. Adding a machine = adding one file + one hub tile. This
  architecture IS the case-study headline: *"designed as a platform,
  shipped machine by machine."*
- Save format versioned from day one: `{ v: 1, shelf: [...] }`.

## 9. v1 cut-line (ship this, nothing more)

- Hub + Shelf (localStorage) + Shape Builder (4 rounds) + Pattern Machine
  (4 rounds) + celebrations + ghost-demo/hint system + mute-less silence.
- Explicitly OUT of v1: sound, Sorting/Logic machines, shape rotation,
  parent dashboard, i18n, accounts.

## 10. Case-study hooks (log as we build)

- First project where I own the **learning design** end-to-end (previously an
  LXD teammate ideated; I designed + built).
- Platform architecture decision + why.
- Every guidance-system decision (bounce/ghost/nudge thresholds) and how
  they were tuned.
- Before/after of anything that got cut for scope — honest build-log voice.

## 11. Open decisions (need Piyush)

1. **Title:** "The Invention Workshop" (safe) · "Professor Poppy's Workshop"
   (warmer) · something with his own stamp? (Note: avoid "Wonder Workshop" —
   real robotics-toy company; avoid "Spark" — already used by the dating
   case study.)
2. Professor's identity: Poppy (from the ChatGPT riff) or a new name/animal
   mascot?
3. Hindi/English or English-only for the few words that appear?
4. Which two post-v1 machines matter more to him: Sorting or Logic first?
