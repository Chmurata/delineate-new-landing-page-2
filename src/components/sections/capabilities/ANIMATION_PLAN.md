# Capabilities Section — Animation Rebuild Plan

**Architecture:** Framer Motion "Tall Parent + Sticky Child + `useTransform`"  
**Target Layouts:** `SpecimenCards.jsx`, `WorkflowTheater.jsx`, `ScrollytellingCinema.jsx`  
**Illustrations:** Untouched — their `active` prop will be set at the right scroll moment.

---

## 1. Core Architecture Philosophy

All three layouts share the same foundational pattern learned from the Curi Landing Page.

### The Pattern: Tall Parent + Sticky Child

```
<section ref={containerRef} className="relative h-[500vh]">
  <div className="sticky top-0 h-screen overflow-hidden">
    {/* All animated content lives here */}
  </div>
</section>
```

- The **parent `<section>`** is given a large `h-[Nvh]` height. This determines the total scroll travel — the user spends `N viewports` scrolling through the section.
- The **child `<div>`** is `sticky top-0 h-screen`. It locks to the screen for the duration of the parent's scroll height.
- `useScroll({ target: containerRef, offset: ["start start", "end end"] })` gives a `scrollYProgress` MotionValue from `0` to `1`.
- `useTransform(scrollYProgress, [inputRange], [outputRange])` maps that progress directly to CSS properties (`opacity`, `x`, `scale`, `pathLength`, etc.) — **no React state, no re-renders during scroll**.

### Why This is Better Than the Old Approach
| Old Approach | New Approach |
|---|---|
| GSAP `ScrollTrigger` with `pin: true` — fights React lifecycle | Pure CSS `position: sticky` — browser-native, zero conflict |
| `window.addEventListener('scroll')` + `getBoundingClientRect()` → layout thrashing | `useScroll` MotionValue → GPU compositor path, no layout reads |
| React `setState` inside scroll callbacks → full re-renders | `useTransform` writes directly to DOM style → 0 re-renders |
| `requestAnimationFrame` loops reading+writing DOM each frame | MotionValues are batched and written once per frame by Framer |

---

## 2. Layout A: `SpecimenCards.jsx` — The "Deck Stack" Rebuild

### Visual Goal
Five capability cards sit in a deck. As the user scrolls, each card slides up from below, pins in a stacked position (overlapping the previous card, leaving just a "peek" strip visible), and the active illustration plays. After the last card lands, the section exits.

### Scroll Architecture
- Parent height: `h-[550vh]` (5 cards × ~90vh each, plus 50vh intro/outro buffer)
- The sticky container holds the full viewport.

### Scroll Segments (scrollYProgress 0→1)

```
0.00 → 0.08   Section intro: heading fades in from below
0.08 → 1.00   Card stacking phase (5 cards, each ~18% of total progress)

Per-card segment breakdown (card i, 0-indexed):
  Enter start:  0.08 + i * 0.18
  Enter end:    0.08 + i * 0.18 + 0.10  ← card slides to pin position
  Peek visible: entire remaining scroll
```

### Card Entry Animation (per card i)
```js
// Card translates from 100% below viewport to its final stacked position
const cardY = useTransform(scrollYProgress,
  [enterStart, enterEnd],
  ['100vh', `${i * PEEK_HEIGHT}px`]  // PEEK_HEIGHT ~80px
)

// Each stacked card scales down slightly to give depth
const cardScale = useTransform(scrollYProgress,
  [enterEnd, 1.0],
  [1.0, 1.0 - (0.04 * (CARD_COUNT - 1 - i))]  // deeper cards shrink more
)

// Card brightness dims as more cards stack on top
const cardBrightness = useTransform(scrollYProgress,
  [enterEnd, 1.0],
  [1.0, 1.0 - (0.15 * (CARD_COUNT - 1 - i))]
)

// active prop: flip to true once the card enters its slot
// use useMotionValueEvent to derive discrete state, only fires once
```

### Heading Animation
```js
const headingOpacity = useTransform(scrollYProgress, [0.0, 0.06], [0, 1])
const headingY = useTransform(scrollYProgress, [0.0, 0.06], [32, 0])
```

### Illustration Activation
- Each `<Illustration active={active}>` receives a boolean derived from scroll progress.
- Use `useMotionValueEvent` to flip `activeIndex` state when scroll progress crosses an `enterEnd` threshold.
- Only updates React state once per card (not continuously), so re-renders are minimal.

### Implementation Steps
1. Add `containerRef` to the outer `<section>` and set `h-[550vh]`.
2. Wrap content in `sticky top-0 h-screen overflow-hidden flex flex-col justify-center`.
3. Add `useScroll` + `useTransform` hooks for heading entrance.
4. For each card: compute `cardY`, `cardScale`, `cardBrightness` using `useTransform`.
5. Apply these values to `<motion.div style={{ y: cardY, scale: cardScale }}>`.
6. Use `useMotionValueEvent` to set `activeIndex` for illustration activation.

---

## 3. Layout B: `WorkflowTheater.jsx` — The "Thread Draw" Rebuild

### Visual Goal
A vertical timeline with 5 stages. As the user scrolls, a glowing "thread" draws itself downward through a spine column. As the thread reaches each numbered node, the node lights up and the corresponding illustration and text fade in from the side.

### Scroll Architecture
- Parent height: `h-[600vh]` (5 stages × 100vh each, plus 50vh header intro)
- Sticky child holds the full viewport, inner content scrolls with `y` transforms driven by scroll progress.

### What Stays Sticky vs What Moves
The sticky child shows a **single active stage** at a time. The camera "pans" through the stages by translating the inner stage list vertically.

```
Sticky container (h-screen, overflow: hidden)
  └── motion.div (translateY driven by scrollYProgress)
       ├── Stage 0
       ├── Stage 1
       ├── Stage 2
       ├── Stage 3
       └── Stage 4
```

### Scroll Segments (scrollYProgress 0→1)

```
0.00 → 0.08   Section heading fades in, thread begins drawing
0.08 → 1.00   Stage progression (5 stages × ~18.4% each)

Per-stage segment (stage i):
  Visible from:  0.08 + i * 0.184
  Visible until: 0.08 + (i+1) * 0.184
```

### Camera Pan (Inner Stage List)
```js
// Translate the inner list to "scroll" through stages
// Each stage takes up one viewport height (100vh)
const stageListY = useTransform(
  scrollYProgress,
  [0.08, 1.0],
  ['0vh', `-${(STAGE_COUNT - 1) * 100}vh`]
)
```

### Thread Path Drawing
```js
// pathLength draws the SVG thread from 0 to 1 across the full scroll
const threadProgress = useTransform(scrollYProgress, [0.05, 0.98], [0, 1])

<motion.path
  d={threadPath}
  style={{ pathLength: threadProgress }}
  stroke="url(#wt-thread-gradient)"
/>
```

### Per-Stage Content Fade
Each stage's text and illustration fades in as it enters the viewport:
```js
// For stage i:
const stageOpacity = useTransform(scrollYProgress,
  [stageStart - 0.05, stageStart + 0.05],
  [0, 1]
)
const stageY = useTransform(scrollYProgress,
  [stageStart - 0.05, stageStart + 0.05],
  [24, 0]
)
```

### Node Lighting
```js
// Numeral node lights up when its stage becomes active
// Derive activeStageIndex using useMotionValueEvent (one integer, not five booleans)
useMotionValueEvent(scrollYProgress, "change", (latest) => {
  const stage = Math.floor((latest - 0.08) / 0.184)
  const bounded = Math.max(0, Math.min(STAGE_COUNT - 1, stage))
  if (bounded !== activeStage) setActiveStage(bounded)
})
```

### Implementation Steps
1. Restructure into `<section h-[600vh]>` → `<div sticky h-screen overflow-hidden>`.
2. Add inner `<motion.div style={{ y: stageListY }}>` wrapping all stages.
3. Add `<motion.path style={{ pathLength: threadProgress }}>` for the thread.
4. Per-stage: wrap content in `<motion.div style={{ opacity, y }}>`.
5. `useMotionValueEvent` → `setActiveStage(i)` → pass `active={activeStage === i}` to each stage.

---

## 4. Layout C: `ScrollytellingCinema.jsx` — The "Sticky Split" Rebuild

### Visual Goal
A split-screen layout. The right column (illustration) is pinned to the screen while the left column (text) scrolls through all 5 capabilities. As each new text block scrolls into view, the right column illustration cross-fades to the corresponding one. The layout is a single continuous narrative — no page jumps.

### Scroll Architecture
- Parent height: `h-[600vh]` (5 stages, each 100vh of scroll, plus 50vh header)
- Sticky child: full viewport, split into left/right columns.

### Left Column (Text)
- The inner text list translates vertically, driven by scroll progress (same camera-pan technique).
- Each text block occupies 100vh of scroll travel.

### Right Column (Illustration)
- The illustration container is completely stationary (no transforms).
- `activeIndex` is derived from scroll progress using `useMotionValueEvent`.
- The active illustration is rendered using Framer Motion's `AnimatePresence` for cross-fades.

### Scroll Segments (scrollYProgress 0→1)

```
0.00 → 0.08   Section heading fades in
0.08 → 1.00   Content scrolls (5 stages × ~18.4% each)

Left column Y travel:
  start: 0vh  (stage 0 text visible)
  end:   -400vh (stage 4 text visible, 4 × 100vh)
```

### Left Column Camera Pan
```js
const textPanY = useTransform(
  scrollYProgress,
  [0.08, 1.0],
  ['0vh', `-${(STAGE_COUNT - 1) * 100}vh`]
)
```

### Illustration Cross-Fade (Right Column)
```js
// Derive active index
useMotionValueEvent(scrollYProgress, "change", (latest) => {
  const idx = Math.floor((latest - 0.08) / 0.184)
  const bounded = Math.max(0, Math.min(STAGE_COUNT - 1, idx))
  if (bounded !== activeIndex) setActiveIndex(bounded)
})

// In JSX — AnimatePresence handles exit animations
<AnimatePresence mode="wait">
  <motion.div
    key={activeIndex}
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
  >
    <CurrentIllustration active={true} />
  </motion.div>
</AnimatePresence>
```

### Progress Indicator
A thin vertical progress bar on the right edge of the left column, drawn using `pathLength`:
```js
const progressBarHeight = useTransform(scrollYProgress, [0.08, 0.98], [0, 1])

<motion.div
  style={{ scaleY: progressBarHeight, transformOrigin: 'top' }}
  className="absolute right-0 top-0 w-[2px] h-full bg-accent"
/>
```

### Implementation Steps
1. Restructure into `<section h-[600vh]>` → `<div sticky h-screen overflow-hidden>`.
2. Left column: `<motion.div style={{ y: textPanY }}>` wrapping all 5 text blocks.
3. Right column: stationary `<div>` with `AnimatePresence` + illustration cross-fade.
4. `useMotionValueEvent` → `setActiveIndex` → feed to `AnimatePresence` key.
5. Add vertical progress indicator bar.

---

## 5. Shared Utilities & Hooks

### `useCapabilitiesScroll(containerRef, stageCount)`
A custom hook to be written once and shared by all three layouts:
```js
// Returns:
// - scrollYProgress: MotionValue (0-1)
// - activeIndex: number (0 to stageCount-1, updated via useMotionValueEvent)
// - stageRanges: array of { start, end } for each stage's scroll segment
const HEADER_FRACTION = 0.08  // 8% of scroll reserved for header

function getStageRanges(stageCount) {
  const stageSize = (1 - HEADER_FRACTION) / stageCount
  return Array.from({ length: stageCount }, (_, i) => ({
    start: HEADER_FRACTION + i * stageSize,
    end: HEADER_FRACTION + (i + 1) * stageSize,
  }))
}
```

### Visibility Pausing (IntersectionObserver)
All three layouts will implement `isVisible` state via `IntersectionObserver` (same technique as Curi `QuadrantSection`). This pauses continuous CSS animations (gradient shifts) when the section is off-screen.

```js
const [isVisible, setIsVisible] = useState(false)

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { threshold: 0.05, rootMargin: '200px' }
  )
  if (containerRef.current) observer.observe(containerRef.current)
  return () => observer.disconnect()
}, [])
```

---

## 6. Mobile Strategy

On mobile (`< 768px`), the "Tall Parent" approach would result in extremely long pages. The mobile fallback is simpler and uses `IntersectionObserver` instead of scroll transforms:

- Remove the `h-[Nvh]` parent height — section returns to natural height.
- Remove all `useTransform` scroll-based values.
- Replace with Framer Motion `whileInView` for entrance animations.
- For `ScrollytellingCinema`: collapse to a single column, stacking text above illustration.
- For `SpecimenCards`: show cards as a simple vertical list.
- For `WorkflowTheater`: show stages as a simple vertical list with thread as a decorative static line.

The desktop-only breakpoint will be `md:` (≥768px).

---

## 7. Reduced Motion

All three layouts must check `useReducedMotion()` from Framer Motion:
- If `true`: skip scroll-driven transforms entirely, render all content visible by default.
- Remove `AnimatePresence` transitions, show all illustrations as `active={true}` immediately.
- Keep static layout structure — just no animation.

---

## 8. File-by-File Implementation Order

| Step | File | Action |
|------|------|--------|
| 1 | `hooks/useCapabilitiesScroll.js` | Create shared scroll hook |
| 2 | `layouts/SpecimenCards.jsx` | Implement card-stacking scroll |
| 3 | `layouts/WorkflowTheater.jsx` | Implement thread-draw + camera-pan |
| 4 | `layouts/ScrollytellingCinema.jsx` | Implement sticky split + cross-fade |

---

## 9. Performance Checklist

- [ ] `will-change: transform` on all `motion.div` elements receiving `y` or `scale` transforms.
- [ ] `useMotionValueEvent` used only for discrete state (active index) — never for continuous values.
- [ ] All illustration components passed `active` prop at the correct scroll moment (not immediately).
- [ ] `IntersectionObserver` pauses gradient CSS animations when section is off-screen.
- [ ] `containerRef` attached to the outer section, not the sticky child.
- [ ] No `getBoundingClientRect()` inside scroll callbacks — all layout is pre-calculated.
- [ ] `React.memo` on `Stage`/`Card` sub-components — prevent re-render from parent `activeIndex` state updates.
- [ ] Test with Chrome DevTools Performance tab — verify no "Layout" entries during scroll.
