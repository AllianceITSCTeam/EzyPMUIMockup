# EzyPM UI Copilot Instructions

This is a Next.js 16 + React 19 + Tailwind CSS 4 project. Follow these rules strictly for all code generation.

## Control Standards (MUST follow)

### Text Input / Textarea
Always use this exact className:
```
px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary
```

### Date Input
**NEVER use `<input type="date">`.**
Always use the `<DateInput>` component from `@/components/ui/DateInput`:
```tsx
import { DateInput } from "@/components/ui/DateInput";
<DateInput value={isoString} onChange={setIsoString} required className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary" />
```
- `value` and `onChange` use ISO format `YYYY-MM-DD`

### Single Select
**NEVER use native `<select>`.**
Always use `<CustomSelect>` from `@/components/ui/CustomSelect`.

### Multi-Select with Search + Chips
Use `<MultiSelectWithSearch>` from `@/components/ui/MultiSelectWithSearch`.

### Multi-Select Tag Input (catalog-based)
Use `<ApplicationInput>` from `@/components/ui/ApplicationInput`.

### Labels
```tsx
<label className="text-sm font-medium text-text-primary">Field Name</label>
```

### 2-column layout
```tsx
<div className="grid grid-cols-2 gap-4">
  <div className="flex flex-col gap-1.5"> ... </div>
  <div className="flex flex-col gap-1.5"> ... </div>
</div>
```

### Buttons in Modals/Forms
- Submit: `px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors cursor-pointer`
- Cancel: `px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors cursor-pointer`
- Danger: `px-4 py-2 rounded-md text-sm font-medium bg-danger text-white hover:bg-danger/90 transition-colors cursor-pointer`
- Icon only: `p-1.5 text-text-secondary hover:text-primary bg-surface hover:bg-page-bg rounded-md shadow-sm border border-border-color transition-colors cursor-pointer`

### Cursor
**ALL interactive elements must have `cursor-pointer`** — buttons, tabs, filter chips, toggle buttons, icon buttons, dropdown items, and any `<div>`/`<span>` with `onClick`.
- Always add `cursor-pointer` to the className of every clickable element.
- Tab bars, filter pill rows, view-toggle groups — every button in the group needs `cursor-pointer`.
- Exception: `disabled` buttons should use `disabled:cursor-not-allowed` instead (keep `cursor-pointer` for the non-disabled state).

## Hydration Rules (MUST follow)

- **NEVER** put `new Date()`, `Date.now()`, or `Math.random()` inside `useState()` initial value.
- Use `useState("")` or `useState(0)` as initial value, then set real value inside `useEffect`.
- Store data (Zustand persist) differs between SSR and client — never render store values until `isLoading === false`.

## Architecture Rules

- Pages in `src/app/` are thin — all state logic goes in Zustand store (`src/store/useStore.ts`) or local component state.
- Reusable UI components go in `src/components/ui/`.
- Layout components go in `src/components/layout/`.
- Utility functions go in `src/lib/utils.ts`.
- Types go in `src/types/index.ts`.
- Mock/seed data goes in `src/lib/mockData.ts`.
- **No** inline `border-gray-*` or hard-coded color classes on form controls — use design token classes (`text-text-primary`, `bg-surface`, `bg-page-bg`, etc.).
