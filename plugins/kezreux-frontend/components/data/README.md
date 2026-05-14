# data

Five data-display presets for dashboards, list views, and detail pages.

| Preset | Best for | Complexity |
| --- | --- | --- |
| `StatCard` | Single-metric KPI cards with positive/negative change indicator | simple |
| `DataTable` | Sortable tables with declarative column schema, optional row click | complex |
| `UserList` | Members/contacts list with avatar fallback, role/email, action slot | medium |
| `KeyValueList` | Definition list (`<dl>`/`<dt>`/`<dd>`) for metadata, invoice details, "About" panels | simple |
| `Timeline` | Vertical activity timeline with status tint (default/success/warning/error) | medium |

All five:

- Token-only styling, react-only imports.
- Semantic markup: `<table>` with `<th scope>` + `aria-sort` for sort
  state; `<dl>` for KeyValueList; `<ol>` for Timeline (it's an ordered
  sequence of events).
- Sensible empty states baked in (`DataTable` and `UserList`).
- Responsive: tables scroll horizontally on overflow; key-value list
  switches to stacked on mobile.

## Install

```
/component data StatCard
/component data DataTable
/component data UserList
/component data KeyValueList
/component data Timeline
```

## DataTable — the most expressive

Sortable columns work declaratively: mark a column `sortable: true`,
optionally provide a `sortValue` function for custom sort keys, and the
table handles click-cycling (asc → desc → cleared). Override cell
rendering with `render?: (row) => ReactNode`. Row clicks are optional
via `onRowClick`.

```tsx
<DataTable
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "amount", label: "Amount", sortable: true, align: "right",
      sortValue: (row) => Number(String(row.amount).replace(/[^0-9.-]/g, "")) },
    { key: "status", label: "Status",
      render: (row) => <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs">{row.status}</span> },
  ]}
  rows={data}
  onRowClick={(row) => router.push(`/items/${row.id}`)}
/>
```

## StatCard — KPI grid building block

Pairs perfectly with a 3-or-4-column grid for a dashboard header. The
`changeType` ("positive" / "negative" / "neutral") drives the arrow
direction and color (uses `text-accent` for positive, `text-destructive`
for negative, so dark/light mode handle themselves).

## Timeline — for activity logs

Each event has an optional icon (falls back to a dot) and a status
("default" / "success" / "warning" / "error") that drives the dot color.
The connector line between dots is drawn with a single absolutely-
positioned `<span>` for clean alignment.
