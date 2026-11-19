# Atharv — Portfolio

React + Vite · Three.js (React Three Fiber) · GSAP ScrollTrigger · Lenis · Framer Motion · Lucide

    npm install
    npm run dev        # development
    npm run build      # production build -> dist/

## Things you'll want to edit
- `src/data.js` — email, GitHub / LinkedIn links (still placeholders), projects, stack, lab items.

## Where things live
- `src/lib/mood.js` — the section "mood" system: accent + background colours, driven by one scroll value.
- `src/components/Scene.jsx` — the 3D scene (metal + glass artifact, particles). Edit `KF_WIDE` / `KF_NARROW` to move the object per section.
- `src/components/Rails.jsx` — the signature two-rails-and-diagonals pattern (`gap`, `pitch`, `slant`, `speed` props).
- `src/lib/scroll.js` — Lenis smooth scrolling wired to GSAP.
