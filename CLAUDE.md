# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the site

No build step — open `index.html` directly in a browser:

```bash
open index.html
```

For a local server (avoids any file:// quirks):

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Architecture

Pure static site: one HTML file, one CSS file, one JS file. No framework, no bundler, no dependencies beyond Google Fonts (loaded via CDN).

```
index.html              ← single-page site, all sections inline
assets/
  css/styles.css        ← all styling
  js/script.js          ← all interactivity
  images/               ← renamed slugs (see mapping below)
  docs/presentation.pdf
```

## Bilingual system (SV/EN)

All translatable text carries `data-sv` and `data-en` attributes directly on the element:

```html
<h2 data-sv="OM MIG" data-en="ABOUT">OM MIG</h2>
```

`script.js → applyLanguage(lang)` iterates every `[data-sv]` element and sets `el.textContent` to the matching attribute value. It skips elements that have child elements (`el.children.length > 0`) to avoid clobbering icons or nested markup. Language preference is stored in `localStorage` under key `badass_lang`, defaulting to `'sv'`.

**Rule:** always add both `data-sv` and `data-en` when adding any visible text node. HTML-encode `&` as `&amp;` inside attribute values — `getAttribute()` decodes it correctly, and `textContent` then renders the literal `&`.

## CSS design tokens

All colours, spacing, and typography are CSS custom properties on `:root` in `styles.css`. Key tokens:

| Variable | Value | Use |
|---|---|---|
| `--gold` | `#c9a060` | Headings, borders, accents |
| `--bg-deep` | `#060b06` | Deepest background (hero, footer) |
| `--bg-dark` | `#0a110a` | Default section background |
| `--bg-alt` | `#0f180f` | Alternate section background |
| `--font-display` | Cormorant Garamond | All headings |
| `--font-body` | Jost | All body text |

Responsive breakpoints: `≤ 900px` (tablet, hamburger menu appears) and `≤ 560px` (mobile).

## Scroll animations

Elements with class `fade-up` start at `opacity:0; transform:translateY(28px)` and transition to visible when an `IntersectionObserver` adds class `visible`. Stagger delay is set via inline CSS custom property: `style="--delay: 0.2s"`.

## Image inventory

| File | Used in section |
|---|---|
| `logo-dark.png` | Nav + Footer |
| `logo-combined.png` | Not currently used in HTML |
| `hero-cocktail.png` | Hero (arch frame, right column) |
| `services-cocktail.png` | Services (decorative left image) |
| `services-martini.png` | Not currently used in HTML |
| `ann-sofie-about.jpeg` | About (oval frame) |
| `ann-sofie-consulting.jpg` | Process (full-bleed background) |
| `ann-sofie-match.jpeg` | Match section (portrait frame) |

## Contact form

Submits via `mailto:` — no backend. The form handler in `script.js` constructs a `mailto:` URI with subject and pre-filled body and redirects to it. Form labels and the success message are also bilingual via `data-sv`/`data-en`.
