# HireNest Command Center — Design Brief

## Aesthetic & Tone

Utilitarian precision. Professional, information-dense dashboard inspired by Bloomberg Terminal and modern SaaS. Dark-first, no decoration, maximum data clarity. Compact layout optimized for rapid decision-making in staffing workflows.

## Color Palette

| Role | Light | Dark | OKLCH |
|------|-------|------|-------|
| Background | Near-white | Deep charcoal | `0.95 0 0` / `0.12 0 0` |
| Card surface | White-gray | Mid-dark | `0.97 0 0` / `0.16 0 0` |
| Foreground text | Nearly black | Nearly white | `0.15 0 0` / `0.98 0 0` |
| Primary (accent) | Slate | Vibrant cyan | `0.35 0 0` / `0.5 0.18 207` |
| Health—Green | — | Green | `0.68 0.22 142` |
| Health—Yellow | — | Yellow | `0.85 0.24 80` |
| Health—Red | — | Red | `0.65 0.19 22` |
| Border | Light gray | Dark gray | `0.92 0 0` / `0.22 0 0` |

Primary accent (cyan `0.5 0.18 207`) drives all CTAs, active states, focus rings. Health indicators (Green/Yellow/Red) are the only permitted semantic colors.

## Typography

| Role | Font | Usage |
|------|------|-------|
| Display | Space Grotesk | Headers, sidebar titles, entity names |
| Body | DM Sans | Paragraph text, table content, UI labels |
| Mono | JetBrains Mono | Data values, codes, metrics |

Type scale: 12px (meta), 14px (body), 16px (subhead), 20px (headline), 24px (title).

## Structural Zones

| Zone | Surface | Border | Depth |
|------|---------|--------|-------|
| Sidebar (280px, collapsible) | `--sidebar` (slightly elevated) | `--sidebar-border` (subtle line on right) | Elevated above content |
| Header/Top bar | `--card` with `--border` | 1px bottom border | Subtle shadow `shadow-sm` |
| Main content | `--background` | None | Recessed |
| Entity cards | `--card` with `--border` | Rounded `sm` (6px), 1px border | `shadow-sm`, hover darkens slightly |
| Modals/Popovers | `--popover` with `--border` | Rounded `md` (10px), 1px border | `shadow-elevated` |

## Spacing & Rhythm

- **Card padding**: 12px (tight, compact)
- **Section padding**: 16px
- **Gap between cards**: 12px
- **Border radius**: 6px (`sm`), 10px (`md`), 50% (full for badges)
- **Component density**: Ultra-compact — prioritize data visibility over whitespace

## Component Patterns

- **Health indicators**: 12px diameter dot (color-coded), rendered inline next to entity name or stage
- **Entity cards**: Horizontally stacked on mobile (`flex flex-col`), grid on desktop (`grid-cols-auto`)
- **Sidebar items**: 36px height, rounded `sm`, hover state darkens accent background
- **Buttons**: Minimal style, cyan accent for primary CTAs, neutral for secondary, destructive for deletions
- **Tables**: Compact rows, alternating row backgrounds (`muted/30` every other row), no full-width striping
- **Status badges**: 20px height, rounded-full, text-sm, inline with entity names

## Motion

Smooth transitions on all interactive elements: `transition-smooth` (300ms cubic-bezier). No bounces, no complex animations — subtlety only. Focus rings use primary accent color.

## Constraints

- **No decoration**: No gradients, no glassmorphism, no ambient orbs. Every pixel serves function.
- **No generic blues**: Replace shadcn defaults entirely. Use cyan accent (`0.5 0.18 207`) consistently.
- **Dark mode mandatory**: App ships dark by default. Light mode tokens exist for future use but are not used in v1.
- **Compact first**: Mobile viewport should display same information density as desktop (stack/reflow, do not hide).
- **Sidebar always visible**: On mobile, sidebar collapses to 60px icon-only mode, content expands to fill. No drawer.

## Signature Detail

**Color-coded health badges** — Green/Yellow/Red dots paired with entity names throughout the interface. These become the visual scanning pattern for the entire app. Users learn to scan for red (urgent), yellow (warning), green (active) instantly.
