# Vediyukti — Current Status

> Last updated: Iteration 4 — Travelling Light Border
> This file is overwritten each iteration. Only the current state is reflected.

---

## Design Language

Premium dark creative agency. Deep charcoal background (`#0B0D14`) with glassmorphism components and a continuous subtle travelling light border animating around every interactive element. The moving highlight uses purple/pink/violet glow occupying ~15% of the perimeter, smooth 10s rotation, GPU-accelerated via `transform` on `@property`-registered custom angle.

### Visual Identity
- **Base**: `#0B0D14` (warm deep charcoal) — single continuous background across all pages
- **Glass**: `rgba(255,255,255,0.04–0.08)` with `backdrop-filter: blur(12–24px)`, layered shadows
- **Accents**: Purple → Pink gradient (`--grad`) used for glows, highlights only (never floods)
- **Text**: `#F0F0F5` (primary), `#B0B0C0` (secondary), `#8989A0` (muted) — meets WCAG AA

### Typography
- **Display**: Clash Display (headings, hero, stats, section titles, CTAs)
- **Body**: Manrope (all other text)

### Animation Philosophy
- All hover transitions: `250–500ms cubic-bezier(0.16, 1, 0.3, 1)`
- Card hover lift: `translateY(-4px)` max
- Travelling light border: `10s` linear loop, CSS `background` conic-gradient clipped to `border-box`, animated via `@property --border-angle`
- On hover: `animation-duration: 6s` (+40% speed), subtle border-color enhances glow
- Reduced motion: all animations disabled
- No bounce, no flashy effects, no neon, no cyberpunk

### Glass Component Family (One Language)

| Component | Radius | Glass Opacity | Blur | Border Effect |
|---|---|---|---|---|
| Navbar (`.nav`) | 100px | 0.04 | 20px | travelling conic-gradient |
| Nav CTA (`.nav-cta`) | 999px | 0.06 | 16px | travelling conic-gradient |
| Primary Btn (`.btn-primary`) | 999px | 0.06 | 20px | travelling conic-gradient |
| Ghost Btn (`.btn-ghost`) | 999px | 0.04 | 20px | travelling conic-gradient |
| Icon Container (`.btn-icon`) | 50% | 0.06 | 8px | none (too small) |
| Service Cards (`.svc-card`) | 32px | 0.04 | 20px | travelling conic-gradient + corner highlight |
| All Glass Cards | 32px | 0.04 | 20px | travelling conic-gradient |

---

## Implementation Strategy

The travelling light border is implemented as a **multi-layered `background`** on each element, avoiding pseudo-element conflicts entirely:

```
background:
  conic-gradient(from var(--border-angle), ...) border-box,  ← travelling glow (1px rim)
  rgba(255,255,255,0.04) padding-box;                         ← glass background
background-clip: border-box, padding-box;
border: 1px solid transparent;  ← conic-gradient shows through
```

**Why this approach:**
- Works WITH `overflow: hidden` (background isn't clipped like pseudo-elements)
- No DOM overhead
- No pseudo-element conflicts (all existing `::before`/`::after` remain unchanged)
- GPU-accelerated via `@property --border-angle` animation
- Graceful degradation: browsers without `@property` support show a static gradient border

**Refactored elements:**
- `.btn-primary::after` — removed (orbital particle replaced by traveling border)
- `.nav-cta::after` — removed (gradient glow border replaced by traveling border)

---

## Files Modified

### `frontend/assets/css/main.css` — Iteration 4

**Added at top of file:**
- `@property --border-angle` — registers custom angle property for animation
- `@keyframes border-travel` — animates `--border-angle` from 0deg to 360deg
- 6 new `:root` variables: `--border-glow-1/2/3`, `--border-speed`, `--border-width`, `--border-opacity`

**Changed (16 elements):**
| Element | Before | After |
|---|---|---|
| `.btn-primary` | `background: rgba(...)` + `::after` orbit | multi-layer bg incl. conic-gradient, `border: transparent`, no `::after` |
| `.btn-ghost` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.nav-cta` | `background: rgba(...)` + `::after` gradient glow | multi-layer bg, `border: transparent`, no `::after` |
| `.nav` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.nav.scrolled` | `background: rgba(...)` | multi-layer bg |
| `.svc-card` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.svc-card.featured-svc` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.why-card` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.work-card` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.value-card` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.team-card` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.p-step` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.t-card` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.h-card` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.mini-hcard` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.contact-info-card` | `background: rgba(...)` | multi-layer bg, `border: transparent` |
| `.contact-shell` | `background: rgba(...)` | multi-layer bg, `border: transparent` |

**Hover behavior updated on all above elements:**
- `animation-duration: 6s` (faster glow on hover)
- `border-color: rgba(255,255,255,0.04)` (subtle border definition on hover)
- Existing `translateY(-2px to -4px)` lift and deeper shadows preserved

**Removed:**
- `@keyframes orbit-particle` (replaced by `border-travel`)
- `.btn-primary::after` orbit pseudo-element
- `.nav-cta::after` gradient glow pseudo-element
- `.btn-primary:hover::after` rule
- Duplicate `@keyframes scroll` inside marquee section

**`prefers-reduced-motion` updated:**
- Added `animation: none` for all 16 animated elements
- Removed old `.btn-primary::after` rule

### `frontend/assets/js/main.js` — No changes (Iteration 4)

### All 5 HTML pages — No changes (Iteration 4)

---

## Current State Checklist

| Feature | Status |
|---|---|
| Warm deep charcoal background (`#0B0D14`) | ✅ |
| Ambient orbs + vignette + noise | ✅ |
| Navbar floating glass pill + travelling border | ✅ |
| Nav scroll effect | ✅ |
| Primary button + travelling border | ✅ |
| Ghost button + travelling border | ✅ |
| Nav CTA + travelling border | ✅ |
| All glass cards + travelling border | ✅ |
| `@property --border-angle` registered for animation | ✅ |
| Conic-gradient glow (~15% perimeter, purple/pink/violet) | ✅ |
| CSS multi-background layered approach (no pseudo-element conflicts) | ✅ |
| Works with `overflow: hidden` | ✅ |
| Hover: speed increase (10s → 6s) + subtle border | ✅ |
| `prefers-reduced-motion` disables border | ✅ |
| Graceful degradation (static gradient border without @property) | ✅ |
| No duplicate styles or unused keyframes | ✅ |
| All 5 pages linked to CSS + JS | ✅ |
| No HTML modifications needed | ✅ |
| All original functionality preserved | ✅ |

---

## Open / Not Yet Done

- Nothing known. All original functionality, content, and sections preserved.

---

## How to Preview

```bash
cd frontend && python3 -m http.server 8000
# Open http://localhost:8000
# Or use the backend: node backend/server/index.js
```
