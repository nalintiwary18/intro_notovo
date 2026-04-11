# Notovo — Landing Page

> **"Changing how notes are made."**
> A cinematic, scroll-driven marketing landing page for the Notovo AI note-generation platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (`globals.css`) |
| Animations | GSAP + ScrollTrigger |
| Smooth Scroll | `@studio-freight/lenis` |
| Fonts | Josefin Sans · Inter · Epilogue (via `next/font/google`) |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
└── app/
    ├── components/
    │   └── SmoothScrolling.tsx   # Lenis wrapper
    ├── globals.css               # All page styles (730 lines)
    ├── layout.tsx                # Root layout + font loading
    └── page.tsx                  # Full landing page (single file)
public/
└── assets/
    ├── pen2_1.png                # Hero pen image (3.4 MB!)
    ├── screenshot.png            # Working section preview
    ├── arrow1.svg
    ├── container.svg             # Free-plan feature checkmark
    ├── container1.svg            # Pro-plan feature checkmark
    ├── ellipse1.svg              # (unused)
    └── polygon1.svg              # Logo/nav icon
```

---

## Known Bugs & Issues

This section documents every bug found across the codebase, grouped by category.

---

### 🔴 Critical Bugs

#### 1. `@studio-freight/lenis` is Deprecated / Breaks GSAP ScrollTrigger

**File:** `SmoothScrolling.tsx` — line 4  
**File:** `package.json` — line 13

```ts
// ❌ Deprecated package
import Lenis from "@studio-freight/lenis";
```

`@studio-freight/lenis` is the old, unmaintained fork. The canonical package is now `lenis`. More critically, **Lenis is not connected to GSAP's ScrollTrigger** via `ScrollTrigger.normalizeScroll()` or `lenis.on('scroll', ScrollTrigger.update)`. This causes **all `pin:true` scroll animations to stutter, misfire, or not fire at all** because GSAP is reading native scroll position while Lenis intercepts it.

**Fix:**
```bash
npm uninstall @studio-freight/lenis
npm install lenis
```
```ts
// SmoothScrolling.tsx
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

---

#### 2. GSAP `ScrollTrigger` Registered Only on Client — Race Condition

**File:** `page.tsx` — lines 9–11

```ts
// ❌ Called at module scope, outside React lifecycle
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

Registering plugins at module scope in Next.js App Router can cause hydration mismatches and intermittent failures where `ScrollTrigger` is not registered before `useGSAP` runs. The `useGSAP` hook also re-runs its callback after hydration, causing the plugin to be registered twice.

**Fix:** Register inside the `useGSAP` callback or in a `useEffect`:
```ts
useGSAP(() => {
  gsap.registerPlugin(ScrollTrigger);
  // ... rest of animations
}, { scope: container });
```

---

#### 3. `working-slide-content:first-child` CSS Overrides GSAP `autoAlpha: 0`

**File:** `globals.css` — lines 292–295 and 307–310

```css
/* ❌ Forces first slide visible — GSAP then fights this */
.working-slide-content:first-child {
  opacity: 1;
  visibility: visible;
}

.working-slide-image:first-child {
  opacity: 1;
  visibility: visible;
}
```

GSAP sets ALL slides to `autoAlpha: 0` on init (line 40–41 in `page.tsx`), but the CSS `:first-child` rule has higher specificity and keeps the first card visible permanently. This means the first slide **never fades in** (because it's already visible with no `transform` set), and the stagger animation looks broken on load.

**Fix:** Remove the `:first-child` overrides — GSAP's `gsap.set` with `autoAlpha` uses inline styles which have higher specificity than class selectors, so the CSS rule actively interferes.

---

### 🟠 Major Bugs

#### 4. `working-slide-content` Uses `position: absolute` Without a Defined `top` Per Slide

**File:** `globals.css` — lines 278–284

```css
.working-slide-content {
  position: absolute;
  top: 40%;
  /* ... */
}
```

All four `.working-slide-content` divs share the exact same `position: absolute; top: 40%` — they literally stack on top of each other. Only the opacity/visibility toggle differentiates them. If GSAP fails to animate (e.g., SSR, bot, or animation disabled), **all four slides are physically overlapping** and the visible one (due to the `:first-child` bug above) is the only one readable.

**Fix:** Use a single `.working-slide-content` element per slide and swap content via GSAP, or use `transform: translateY` to keep them outside the viewport when hidden.

---

#### 5. Hero Pen Image is 3.4 MB and Not Optimised

**File:** `page.tsx` — line 160

```tsx
// ❌ Raw <img> tag, no Next.js optimisation, 3.4 MB PNG
<img src="/assets/pen2_1.png" alt="Pen" className="hero-pen-img" />
```

`pen2_1.png` is **3,481,717 bytes (3.4 MB)**. It uses a raw `<img>` tag instead of Next.js `<Image>`, which means no automatic:
- WebP/AVIF conversion
- Lazy loading
- Responsive `srcset`
- Size optimisation

This is the **single largest performance bottleneck** on the page and will cause a very poor LCP (Largest Contentful Paint) score.

**Fix:**
```tsx
import Image from "next/image";

<Image
  src="/assets/pen2_1.png"
  alt="Pen illustration"
  fill
  priority
  className="hero-pen-img"
  style={{ objectFit: "cover" }}
/>
```
Also compress `pen2_1.png` before deploying (target < 300 KB).

---

#### 6. External Images from `picsum.photos` Are Not Allowed by Next.js Config

**File:** `page.tsx` — lines 202–208  
**File:** `next.config.ts` — (missing `images.remotePatterns`)

```tsx
// ❌ External domain not whitelisted
<img src={`https://picsum.photos/seed/noto1/1000/600`} ... />
```

If these were `<Image>` tags (they should be), Next.js would throw a runtime error because `picsum.photos` is not listed in `next.config.ts` under `images.remotePatterns`. Even as raw `<img>` tags, fetching from a third-party CDN in production is an unreliable placeholder dependency.

**Fix:** Add to `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }],
  },
};
```
And replace placeholder images with real product screenshots before launch.

---

#### 7. `card-inner-element` Starts Partially Animated — Inconsistent Initial State

**File:** `globals.css` — lines 488–492

```css
.card-inner-element {
  opacity: 100;       /* ❌ Should be 0 */
  transform: translateY(20px);
}
```

`opacity: 100` is **not valid CSS** — `opacity` accepts a value between `0` and `1` (or `0%–100%`). Browsers clamp it to `1` (fully visible). GSAP then tries to animate it from opacity `1` to `1`, meaning no fade-in occurs for the card inner content. The `transform: translateY(20px)` is also never reset by CSS — only GSAP resets it — so on mobile/reduced-motion environments, the content is permanently shifted down 20px.

**Fix:**
```css
.card-inner-element {
  opacity: 0;
  transform: translateY(20px);
}
```

---

#### 8. `useGSAP` `scope: container` — `document.querySelector` Calls Escape the Scope

**File:** `page.tsx` — lines 33–36

```ts
// ❌ These ignore the GSAP scope and query the global document
const workingSection = document.querySelector(".working-scroll-container");
const timelineIndicator = document.querySelector(".working-timeline-indicator");
```

When `useGSAP` is given `{ scope: container }`, GSAP expects selector-based queries to be scoped to the `container` ref. Using raw `document.querySelector` bypasses this scoping, which can cause issues in Strict Mode (double-mounts) or if multiple instances of this component exist.

**Fix:** Use `container.current?.querySelector(...)` instead:
```ts
const workingSection = container.current?.querySelector(".working-scroll-container");
```

---

### 🟡 Design Bugs

#### 9. `hero-logo-large` Has Hardcoded `style={{ transform: "translate(-50%, -50%)" }}`

**File:** `page.tsx` — line 157  
**File:** `globals.css` — lines 110–120

```tsx
// ❌ Inline style conflicts with absolute positioning
<h1 className="hero-logo-large gsap-text" style={{ transform: "translate(-50%, -50%)" }}>
```

The `.hero-logo-large` class uses `position: absolute; top: 358px; left: 316px` — these are pixel-precise values. The inline `transform: translate(-50%, -50%)` shifts the element an additional half its own width/height, making its actual position **unrelated to the visual design intent** and causing it to clip incorrectly on viewports narrower than ~1400px.

**Fix:** Remove the inline `style` and handle positioning purely in CSS, or use `transform: translateX(-50%)` with `left: 50%` for centering.

---

#### 10. Pricing Section Has a Duplicate "Menu" Label with Logo Icon

**File:** `page.tsx` — lines 247–250

```tsx
// ❌ "Menu" text appears twice on the page — nav + pricing section
<Image src="/assets/polygon1.svg" alt="" width={50} height={50} />
<span style={{ fontFamily: 'var(--primary-font)', fontSize: 48, fontWeight: 600 }}>Menu</span>
```

The pricing section header inexplicably contains a logo icon and the text "Menu" styled identically to the navbar. This appears to be a design artifact left from layout construction — it is visible to users and makes no semantic sense in a pricing context.

**Fix:** Remove or replace with appropriate branding/CTA content.

---

#### 11. Footer `footer-logo` Text Overflows and Is Clipped on Smaller Screens

**File:** `globals.css` — lines 717–730

```css
.footer-logo {
  font-size: 400px;   /* ❌ Fixed giant size, no clamp() */
  white-space: nowrap;
  bottom: -40px;
}
```

The 400px `Notovo` text in the footer relies on `overflow: hidden` on `.footer-inner` to clip it. On viewports below ~1100px wide, the clipping cuts off more of the text than intended, and on very small screens the word extends far beyond the visible area. There is no `clamp()` or `vw`-based sizing.

**Fix:**
```css
.footer-logo {
  font-size: clamp(120px, 28vw, 400px);
}
```

---

#### 12. `nav-menu` Is `position: absolute` — Scrolls Away With Page

**File:** `globals.css` — lines 75–89

```css
.nav-menu {
  position: absolute;  /* ❌ Should be fixed for a sticky nav */
  top: 36px;
  right: 68px;
}
```

The navigation menu scrolls away with the page content. On a landing page with multiple pinned scroll sections (the page pins both the Working section and the Features section), the nav disappears completely while the user is in a pinned zone. It should be `position: fixed` to remain accessible.

**Fix:**
```css
.nav-menu {
  position: fixed;
  top: 36px;
  right: 68px;
  z-index: 1000;
}
```

---

#### 13. Hero Section Uses Fixed `height: 1117px` — Crops on Small/Large Screens

**File:** `globals.css` — line 69

```css
.hero-section {
  height: 1117px; /* ❌ Hardcoded pixel height */
}
```

On screens shorter than 1117px (e.g. 13" laptops, tablets), the tagline and CTA button positioned at `bottom: 50px` are cut off. On 4K screens, the hero has excessive whitespace. No `min-height` or `clamp()` is used.

**Fix:**
```css
.hero-section {
  min-height: 100svh;
  height: clamp(700px, 80vw, 1117px);
}
```

---

#### 14. `flow-step` Active State Set Via GSAP Inline Style — Not Reversible

**File:** `page.tsx` — line 67

```ts
// ❌ GSAP sets background/color inline — no reversal logic
tl.to(flowSteps[index], { background: "#3e3e3e", color: "#fff", duration: 1 }, "<");
```

When a flow step becomes active, GSAP sets its background to `#3e3e3e`. But when the timeline reverses (user scrolls back up), GSAP reverses to the original `background` — which is `#d9d9d9` (from CSS). GSAP's inline style will always win over the CSS class `.flow-step.active`, meaning the `.active` CSS class is completely unused dead code.

**Fix:** Use GSAP's `className` toggle or consistently manage state only through GSAP (not a hybrid of CSS class + inline style tweening).

---

### 🔵 Code Quality Issues

#### 15. `any` Type Used Throughout GSAP Callbacks

**File:** `page.tsx` — lines 19, 53, 58, 67, 73, 93

```ts
texts.forEach((text: any) => { ... });
workingSlides.forEach((slide: any, index: number) => { ... });
```

`gsap.utils.toArray()` returns `any[]` by default, but GSAP ships with its own types. Using the typed overload eliminates all `any` casts:
```ts
const texts = gsap.utils.toArray<HTMLElement>(".gsap-text");
```

---

#### 16. `eslint` Script Has No Entry Point

**File:** `package.json` — line 9

```json
"lint": "eslint"
```

Running `npm run lint` will fail with `No files to lint` or similar because no glob pattern or directory is specified.

**Fix:**
```json
"lint": "next lint"
```

---

#### 17. `useGSAP` `registerPlugin` Missing From Hook

`@gsap/react`'s `useGSAP` requires `gsap.registerPlugin(useGSAP)` to be called before use (once). The code only calls it for `ScrollTrigger` but not for the `useGSAP` hook itself. While it may work in some environments due to auto-registration, it's not reliable.

**Fix:**
```ts
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger);
```

---

#### 18. Footer Links Are Non-Interactive (`<li>` With No `<a>` Tags)

**File:** `page.tsx` — lines 311–323

```tsx
<li>Terms of Use</li>  {/* ❌ Not a link */}
<li>Company</li>
<li>Email</li>
<li>LinkedIn</li>
```

All footer navigation items are plain text inside `<li>` elements. None have `href` attributes or are wrapped in `<a>` tags. They are effectively dead UI elements — clicking them does nothing.

**Fix:** Wrap with anchor tags:
```tsx
<li><a href="/terms">Terms of Use</a></li>
```

---

#### 19. Missing `aria-label` on Icon-Only Buttons

**File:** `page.tsx` — lines 162–167

```tsx
<div className="try-now-btn">        {/* ❌ div, not a button */}
  <div className="icon-circle">
    <Image src="/assets/arrow1.svg" alt="Arrow" ... />
  </div>
  <span>Try Now</span>
</div>
```

The "Try Now" CTA and the nav "Menu" button are `<div>` elements, not `<button>` elements. They receive no keyboard focus by default, are not accessible to screen readers as interactive controls, and do not receive `Enter`/`Space` keypresses.

**Fix:**
```tsx
<button className="try-now-btn" aria-label="Try Notovo for free">
  ...
</button>
```

---

## Bug Summary

| # | Severity | Category | Description |
|---|---|---|---|
| 1 | 🔴 Critical | Loading | Lenis not connected to GSAP — all pinned scroll breaks |
| 2 | 🔴 Critical | Loading | ScrollTrigger registered at module scope — race condition |
| 3 | 🔴 Critical | Animation | CSS `:first-child` overrides GSAP `autoAlpha: 0` |
| 4 | 🟠 Major | Animation | All slides share same `position: absolute; top: 40%` — overlap |
| 5 | 🟠 Major | Performance | 3.4 MB hero image not optimised, raw `<img>` tag |
| 6 | 🟠 Major | Config | External `picsum.photos` domain not in `next.config.ts` |
| 7 | 🟠 Major | Animation | `opacity: 100` is invalid CSS — card fade-in never fires |
| 8 | 🟠 Major | Code | `document.querySelector` bypasses GSAP scope |
| 9 | 🟡 Design | Layout | Inline `transform` on hero logo conflicts with absolute positioning |
| 10 | 🟡 Design | UI | Duplicate "Menu" label rendered in pricing section |
| 11 | 🟡 Design | Responsive | Footer logo 400px fixed size — clips badly on small screens |
| 12 | 🟡 Design | Navigation | Nav uses `position: absolute`, scrolls away in pinned sections |
| 13 | 🟡 Design | Responsive | Hero section `height: 1117px` is fixed — crops on small screens |
| 14 | 🟡 Design | Animation | Flow step active state not properly reversible |
| 15 | 🔵 Quality | TypeScript | `any` used throughout GSAP callbacks |
| 16 | 🔵 Quality | DX | `eslint` script has no target — fails to run |
| 17 | 🔵 Quality | GSAP | `useGSAP` plugin not registered with `gsap.registerPlugin` |
| 18 | 🔵 Quality | Accessibility | Footer links are plain `<li>` with no `<a>` tags |
| 19 | 🔵 Quality | Accessibility | CTA buttons are `<div>` elements — not keyboard accessible |

---

## Deployment

```bash
npm run build
npm run start
```

For production deployment, the recommended platform is [Vercel](https://vercel.com). Ensure `pen2_1.png` is compressed before deploying to avoid excessive bandwidth costs.
