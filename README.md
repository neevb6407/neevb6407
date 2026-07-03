# NEEV — Automotive Photographer

Single-page portfolio for automotive photographer Neev (`@neevboda_`).

## Structure

```
portfolio/
├── index.html          # Markup — semantic sections, GSAP loaded via CDN
├── css/
│   └── styles.css      # All styling + scroll-reveal initial states
├── js/
│   └── main.js         # Lightbox, hero shimmer, scroll UI, GSAP animations
└── images/
    ├── hero.jpg        # Hero background
    └── gallery-01..20.jpg
```

Sections: **Hero → Work (gallery) → About → Services → Contact / Hire Me**.

## Tech stack & animation approach

- **Pure HTML / CSS / JavaScript** — no build step, no framework, and **no external
  libraries**. The whole site runs offline; just open `index.html` or serve the folder
  statically.
- **Animation = CSS transitions + `IntersectionObserver`.** Scroll reveals are plain
  `.reveal` elements that get an `.in` class when they scroll into view; the movement
  itself is a CSS transition. Grouped elements (`[data-stagger]`) get a small cascading
  `transition-delay`. This keeps the JS tiny and the motion GPU-friendly.
- **Progressive enhancement & accessibility.** A tiny inline script adds `html.js` only
  when JS is available and the user hasn't requested reduced motion; the reveal "hidden"
  states are gated on that class. If JS is disabled or `prefers-reduced-motion` is set,
  everything renders fully visible — nothing is trapped behind an animation.

### Animations included

- Cinematic hero entrance (veil fade → staggered rise of eyebrow, title, subtitle, status)
- Chrome-text shimmer that tracks the pointer ("light over metal")
- Subtle hero background parallax on scroll
- Scroll-triggered reveals for headings, gallery, about, services, and contact
- Sticky nav that condenses on scroll + a top scroll-progress bar
- Magnetic hover on the contact buttons
- Animated lightbox for full-size gallery images

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Additions over the original template

- Extracted 21 inline base64 images into `images/` and split the monolithic file into HTML/CSS/JS.
- Added a pulsing **"Available for bookings"** status pill (hero + contact).
- Added a **"What I Shoot" / Services** section (Rolling Shots, Static & Details, Meets & Events, Editing).
