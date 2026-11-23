# Changelog

## v2: runtime-error fix (this version)

**What you saw:** four red "Runtime TypeError: Cannot read properties of null" screens, in `Spark.tsx`, `Loop.tsx`, `Day.tsx` and `Blocking.tsx` (and the same bug was waiting in `ProPreview.tsx`).

**Cause, in plain words:** every scroll animation is driven by one shared helper, `src/hooks/useScrub.ts`. It runs a small repeating "frame" while a section is on screen. Each scene then looked up its own section again on every frame (`ref.current!`). When a page is removed (for example when you click a footer link such as Privacy, or the dev server refreshes), React clears that reference **first** and only stops the helper's frames **a moment later**. A frame that was already queued ran in that gap, found `null`, and crashed.

**How it was fixed**
- `src/hooks/useScrub.ts` rewritten: it now (1) hands each scene its element as a second argument, so scenes never re-read `ref.current`; (2) refuses to run a frame unless the element is still mounted and attached to the page; (3) has a proper "alive" flag, so nothing runs after cleanup; (4) stores the newest callback after rendering, not during it. Scroll-linked behaviour, reverse scrolling, holding still when you stop, and reduced motion are unchanged.
- New `src/hooks/useSceneNodes.ts`: finds a scene's inner elements once per mounted section and again if React re-created them. If something is missing it skips the frame and (in development only) says exactly what is missing, instead of hiding a real bug.
- `Spark.tsx`, `Loop.tsx`, `Day.tsx`, `Blocking.tsx`, `ProPreview.tsx`: use the two helpers above (no more `ref.current!`).
- `src/components/hero/useHeroScroll.ts`: explicit checks at start-up (no unsafe casts) and a stop flag so its frame loop ends when the hero is removed.
- `apps/web/package.json`: `next` and `eslint-config-next` now require at least `^15.5.29`.

**Proof:** a stress test that removes and restores the whole page while the scenes animate (with scroll events arriving during removal) produced **43 errors on the old code** (the exact `reading 'style'` and `reading 'dataset'` messages) and **0 errors on the new code**, over 576 cycles at desktop, phone and reduced-motion. See `docs/TESTING.md`.
