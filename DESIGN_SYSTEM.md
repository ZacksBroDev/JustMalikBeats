# JustMalikBeats Design System — Implementation Spec

## Exact Palette

```css
:root {
  /* Dark Surfaces — Primary */
  --obsidian: #0a0a0a;
  --carbon: #121212;
  --graphite: #1a1a1a;
  --charcoal: #262626;
  --slate: #404040;
  
  /* Light Surfaces — Accent Sections */
  --bone: #f8f8f6;
  --ivory: #f0f0ed;
  --stone: #e3e3df;
  
  /* Violet Accent — Primary Brand Color */
  --violet: #a855f7;
  --violet-hover: #9333ea;
  --violet-pressed: #7c3aed;
  --violet-muted: rgba(168, 85, 247, 0.15);
  
  /* Steel — Secondary/Metadata */
  --steel: #a1a1aa;
  --steel-light: #d4d4d8;
  --steel-dark: #71717a;
  
  /* Text */
  --text-primary: #fafafa;
  --text-secondary: #d4d4d8;
  --text-tertiary: #a1a1aa;
  --text-on-light: #0a0a0a;
  --text-on-light-muted: #52525b;
  
  /* Semantic */
  --success: #22c55e;
  --error: #ef4444;
  --warning: #f59e0b;
}
```

## Typography System

**Font:** DM Sans (400, 500, 600, 700)

```css
:root {
  /* Font Families */
  --font-base: 'DM Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  
  /* Sizes */
  --text-hero: clamp(2.5rem, 5vw, 3.75rem);    /* 40-60px */
  --text-h1: clamp(2rem, 4vw, 3rem);           /* 32-48px */
  --text-h2: clamp(1.5rem, 3vw, 2.25rem);      /* 24-36px */
  --text-h3: 1.5rem;                           /* 24px */
  --text-h4: 1.25rem;                          /* 20px */
  --text-body-lg: 1.125rem;                    /* 18px */
  --text-body: 1rem;                           /* 16px */
  --text-sm: 0.875rem;                         /* 14px */
  --text-xs: 0.75rem;                          /* 12px */
  
  /* Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  
  /* Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}
```

**Usage Rules:**
- Hero headlines: `--text-hero`, `--weight-bold`, `--leading-tight`, `--tracking-tight`
- Page titles: `--text-h1`, `--weight-semibold`
- Section titles: `--text-h2`, `--weight-semibold`
- Card titles: `--text-h4`, `--weight-medium`
- Body copy: `--text-body`, `--weight-regular`, `--leading-normal`
- Metadata (BPM, price, dates): `--text-sm`, `--steel`, `--font-mono` optional
- Microcopy/labels: `--text-xs`, `--tracking-wide`, uppercase

## Spacing Scale

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-8: 3rem;      /* 48px */
  --space-10: 4rem;     /* 64px */
  --space-12: 6rem;     /* 96px */
  --space-16: 8rem;     /* 128px */
}
```

**Usage:**
- Component padding: `--space-4` to `--space-6`
- Section vertical spacing: `--space-10` to `--space-12`
- Card gaps: `--space-5` to `--space-6`
- Form field spacing: `--space-4`

## Border Radius

```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}
```

**Usage:**
- Buttons: `--radius-sm`
- Cards: `--radius-md` or `--radius-lg`
- Modals: `--radius-lg`
- Pills/badges: `--radius-full`

## Shadows

```css
:root {
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.6);
  --shadow-violet: 0 4px 20px rgba(168, 85, 247, 0.25);
}
```

**Usage:**
- Cards at rest: `--shadow-sm`
- Cards on hover: `--shadow-md`
- Modals/elevated panels: `--shadow-lg`
- Primary CTAs on hover: `--shadow-violet`

## Motion

```css
:root {
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 350ms;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Transitions:**
- Hover states: `all var(--duration-fast) var(--ease)`
- Card transforms: `transform var(--duration-base) var(--ease)`
- Modals: `opacity var(--duration-base) var(--ease)`

**Animations:**
- Page load stagger: 100ms delay between hero elements
- Grid stagger: 50ms delay per item, 6 items max (300ms total)
- Hover lift: `translateY(-4px)`
- Scale on press: `scale(0.98)`

## Component States

### Button States
**Rest:** `background: var(--violet)`, `color: var(--bone)`
**Hover:** `background: var(--violet-hover)`, `transform: scale(1.02)`, `box-shadow: var(--shadow-violet)`
**Pressed:** `background: var(--violet-pressed)`, `transform: scale(0.98)`
**Disabled:** `opacity: 0.5`, `cursor: not-allowed`
**Loading:** Spinner animation, label stays visible

### Card States
**Rest:** `background: var(--graphite)`, `box-shadow: var(--shadow-sm)`
**Hover:** `transform: translateY(-4px)`, `box-shadow: var(--shadow-md)`
**Active/Selected:** `border: 2px solid var(--violet)`

### Link States
**Default:** `color: var(--violet)`
**Hover:** `color: var(--violet-hover)`
**Visited:** Same as default (no different color)

## Grid System

```css
.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-5);
  padding-right: var(--space-5);
}

/* Product/Track Grid */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-6);
}

/* Article Grid */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: var(--space-6);
}
```

## Breakpoints

```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */

@media (max-width: 640px) {
  .grid-3, .grid-2 {
    grid-template-columns: 1fr;
  }
}
```
