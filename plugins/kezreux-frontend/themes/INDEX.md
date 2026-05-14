# Theme catalog

Seven preset themes for `kezreux-frontend`. Each is a complete,
machine-readable spec (see `_theme.ts` for the canonical interface).
Pick one with `/theme set <name>`.

The selected theme becomes a non-negotiable constraint: every audit skill
and the `frontend-designer` auto-loop will enforce it when generating or
reviewing code.

## Minimal

> System fonts, generous whitespace, monochrome + 1 blue accent, near-flat shadows.

| | |
| --- | --- |
| Background | white / near-black graphite |
| Accent | clean blue (`213 94% 50%`) |
| Type | Inter sans · JetBrains Mono for code |
| Radius | 4–8px (subtle) |
| Shadows | flat |
| Density | comfortable |

References: **Linear**, **Vercel**.

## Editorial

> Serif headlines, generous typography, content-first, warm restrained palette with a terra accent.

| | |
| --- | --- |
| Background | cream / warm dark |
| Accent | terra orange (`24 70% 50%`) |
| Type | Source Serif headings · Inter body |
| Radius | 2–6px |
| Shadows | very subtle |
| Density | spacious |

References: **Stripe marketing**, **Apple Newsroom**.

## Brutalist

> Hard 0px edges, monospace accents, pure black/white + signal red, no decoration.

| | |
| --- | --- |
| Background | pure white / pure black |
| Accent | signal red (`0 100% 50%`) |
| Type | IBM Plex Sans · IBM Plex Mono prominent |
| Radius | 0 across the board |
| Shadows | none |
| Density | compact |

References: **Are.na**, **NYT special projects**.

## Soft

> Rounded 12–20px, pastel desaturated palette, friendly type, prominent gentle shadows.

| | |
| --- | --- |
| Background | warm cream / cocoa dark |
| Primary | soft purple (`260 55% 60%`) |
| Accent | peach (`20 85% 75%`) |
| Type | DM Sans |
| Radius | 8–16px (very rounded) |
| Shadows | prominent, soft, slightly tinted |
| Density | spacious |
| Animation | bouncy easing |

References: **Notion**, **Linear's friendly mode**.

## Playful

> Vivid hues, expressive typography, lively motion with bounce, gradients allowed.

| | |
| --- | --- |
| Background | pure white / deep dark |
| Primary | vibrant purple (`262 83% 58%`) |
| Accent | vivid cyan (`185 84% 49%`) |
| Type | Geist · Geist Mono |
| Radius | 8–16px |
| Shadows | colorful, bold |
| Density | comfortable |
| Animation | lively bounce |

References: **Linear**, **Duolingo**, **Spotify**.

## Rustic

> Warm earthy palette, serif body, organic spacing, low-contrast borders.

| | |
| --- | --- |
| Background | linen / warm cocoa |
| Primary | terra cotta (`15 55% 45%`) |
| Accent | sage green (`135 22% 45%`) |
| Type | Inter UI · Lora serif body |
| Radius | 4–12px (subtle organic) |
| Shadows | warm-tinted, subtle |
| Density | spacious |

References: artisan editorial sites, hand-crafted product pages.

## Industrial

> Sharp 2–4px radius, dense layout, monochrome + electric signal blue, mono for data.

| | |
| --- | --- |
| Background | white / graphite |
| Accent | electric blue (`208 100% 50%`) |
| Type | Inter UI · JetBrains Mono for data/numbers |
| Radius | 2–4px (sharp) |
| Shadows | very subtle |
| Density | compact |

References: **Datadog**, **Grafana**, **Vercel dashboards**.

---

## Theme spec format

Every theme file (`themes/<name>/theme.ts`) exports a single `Theme` object
matching the interface in `themes/_theme.ts`. The full list of constrained
fields:

- **`colors`** — 19 semantic tokens (background, foreground, card,
  card-foreground, popover, popover-foreground, primary, primary-foreground,
  secondary, secondary-foreground, muted, muted-foreground, accent,
  accent-foreground, border, input, ring, destructive, destructive-foreground),
  each with `light` and `dark` HSL triplets. The 19 match what shadcn/ui
  components expect; `card` is used by navbars, sidebars, and cards;
  `popover` is used by dropdowns and menus.
- **`typography`** — sans/serif/mono font stacks, a 9-step type scale
  (xs → 5xl) with explicit size + lineHeight in px, and the 4 standard
  weights.
- **`spacing.scale`** — the *only* legal px values for padding, margin,
  gap, and component dimensions. Anything else is a violation.
- **`radius`** — none/sm/md/lg/full.
- **`shadows`** — none/sm/md/lg (string CSS values).
- **`density`** — `compact` / `comfortable` / `spacious`. Drives
  component-level padding and gap defaults.
- **`animation`** — duration trio (fast/normal/slow in ms) + a CSS easing
  string.
- **`iconography`** — icon library (lucide is the default), stroke width,
  default size.

Adding or removing fields is a breaking change for any consumer.
