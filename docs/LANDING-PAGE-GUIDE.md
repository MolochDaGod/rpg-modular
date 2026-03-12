# Betta Warlords — Landing Page Guide

## Architecture
`src/components/LandingPage.jsx` is a single-file React component that renders the full marketing/promo page at `/`. It uses:
- **Inline styles** — no CSS framework; all styling is JS objects
- **Dynamic CSS injection** — scroll reveal animations and bubble keyframes injected via `<style>` tags on mount, cleaned up on unmount
- **IntersectionObserver** — elements with classes `lp-reveal`, `lp-reveal-left`, `lp-reveal-right`, `lp-reveal-scale` animate in on scroll
- **Bubble particles** — 35 floating bubble elements with randomized size, position, and timing
- **PWA install prompt** — captures `beforeinstallprompt` event and shows an Install button when available

## Fonts
- **Cinzel** — headings, buttons, titles (serif)
- **Jost** — body text (sans-serif)
Both loaded via `index.html` Google Fonts link.

## Section Map
| Section | Anchor ID | Data Array |
|---------|-----------|------------|
| Nav bar | — | — |
| Exclusive strip | — | — |
| Web platform badges | — | inline |
| Hero | — | — |
| Full-width battle image | — | — |
| Video Showcase | — | inline (2 mp4 + 1 gif) |
| Lore / Prologue | `#lore` | inline paragraphs |
| Three Vessels | — | `VESSELS` |
| Breeds | `#breeds` | `BREEDS` |
| Classes | — | `CLASSES` |
| Gorgon Sirens (lore) | — | `BOSSES` |
| TCG Boss Cards | — | `BOSS_CARDS` |
| TCG Cards gallery | — | `TCG_CARDS`, `TCG_BACKS` |
| World Locations | `#world` | `LOCATIONS` |
| Creatures | — | `ENEMIES` |
| Buildings | — | `BUILDINGS` |
| Attributes | — | `ATTRIBUTES` |
| cNFT Breeding | `#cnft` | `BREEDS` (images) |
| Grudge Gameplay | `#grudge` | `ENEMIES` subset |
| GBuX Ecosystem | `#gbux` | `ECO_CARDS` |
| PWA Install | `#install` | — |
| Mystery Clues | — | `MYSTERY_CLUES` |
| Final CTA | — | — |
| Footer | — | inline links |

## How to Edit

### Add a new breed
Add an object to the `BREEDS` array at the top of the file:
```js
{ name: 'NewBreed', color: '#hex', sprite: '/images/races/filename.png', trait: 'Trait Name — +X STAT', desc: 'Description.' }
```

### Add a new location
Add an object to the `LOCATIONS` array:
```js
{ name: 'Location Name', tag: 'Subtitle', quote: '"Lore quote."', img: '/map_nodes/filename.png', vessel: '#colorHex' }
```

### Add a new enemy
Add the filename (without extension/path) to the `ENEMIES` array. Place the sprite at `public/images/enemies/name.png`.

### Add a video
In the Videos section, add another object to the inline array:
```js
{ src: '/videos/filename.mp4', title: 'Title', desc: 'Short description', color: '#hex', border: 'rgba(...)' }
```
Place the video file in `public/videos/`.

### Change scroll animation
The CSS classes control reveal behavior:
- `lp-reveal` — fade up from below
- `lp-reveal-left` — slide in from left
- `lp-reveal-right` — slide in from right
- `lp-reveal-scale` — scale up from 85%

Apply any of these as a `className` on the element you want animated.

## Videos
- `public/videos/intro_cinematic.mp4` — Opening cinematic
- `public/videos/hero_creation_cinematic.mp4` — Hero creation walkthrough
- `public/videos/beta_intro.gif` — Beta gameplay preview

## Images
- `public/images/races/` — Breed sprites (pixel art)
- `public/images/enemies/` — Enemy sprites (pixel art)
- `public/images/buildings/` — Building sprites
- `public/images/attributes/` — Attribute icons
- `public/images/cards/` — TCG card images
- `public/images/bosses/` — Gorgon siren artwork
- `public/backgrounds/` — Full-width battle backgrounds
- `public/map_nodes/` — Location node images

## Local Development
```bash
npm install
npm run dev        # Vite dev server on port 5173
```

## Build & Deploy
```bash
npm run build      # Vite production build → dist/
node server.prod.js  # Express serves dist/ on port 5000
```

Render auto-deploys from the `main` branch. Config is in `render.yaml`:
- Build: `npm install --include=dev && npm run build`
- Start: `node server.prod.js`
- Port: 5000

## Helper Components
- `STitle` — Section title with gradient text
- `SSub` — Section subtitle (gray, centered)
- `Divider` — Gradient horizontal rule
- `FullImg` — Full-width image with overlay text
- `Btn` — Styled anchor button
- `Bubbles` — Floating bubble particle background
