# IntelliHelper UI — Component Roadmap

> **Purpose:** Single source of truth for what is shipped vs what to build next.  
> **Update rule:** When you implement a component, move it from **To Build** → **Built**, add the ship date, and link the source file.  
> **Last updated:** 2026-07-15 (seven demand components: combobox → copy-button)

---

## How to use this file

1. Before starting work, scan **Next up** and **To Build**.
2. After shipping a component:
   - Add a row under **Built**
   - Remove it from **To Build** / **Next up**
   - Note registry name (`slug`), category, and source path
3. Prefer Tier order for demand; skip layout atoms and premium builders until core + AI kit are solid.

---

## Built (shipped in monorepo)

| Component | Registry slug | Category | Source | Notes |
| --- | --- | --- | --- | --- |
| Button | `button` | actions | `packages/ui/src/button.tsx` | Chrome + content variants |
| Glass Icon Button | `glass-icon-button` | glass-system | `packages/ui/src/glass-icon-button.tsx` | |
| Glass Bar | `glass-bar` | glass-system | `packages/ui/src/glass-bar.tsx` | |
| Glass Content Card | `glass-content-card` | glass-system | `packages/ui/src/glass-content-card.tsx` | |
| Background Picture | `background-picture-picker` | glass-system | `packages/ui/src/background-picture-picker.tsx` | |
| Component Preview | `component-preview` | glass-system | `packages/ui/src/component-preview.tsx` | |
| Toggle / Toggle Group | `toggle`, `toggle-group` | actions | `packages/ui/src/toggle.tsx` | |
| Card | `card` | surfaces | `packages/ui/src/card.tsx` | |
| Tabs | `tabs` | surfaces | `packages/ui/src/tabs.tsx` | |
| Separator | `separator` | surfaces | `packages/ui/src/separator.tsx` | |
| Resizable | `resizable` | surfaces | `packages/ui/src/resizable.tsx` | Split pane |
| Scroll Area | `scroll-area` | surfaces | `packages/ui/src/scroll-area.tsx` | |
| Input / Textarea | `input`, `textarea` | forms | `packages/ui/src/input.tsx` | |
| Select / Native Select | `select`, `native-select` | forms | `packages/ui/src/select.tsx` | |
| Checkbox / Switch / Radio | `checkbox`, `switch`, `radio-group` | forms | | |
| Slider | `slider` | interactive | `packages/ui/src/slider.tsx` | |
| Calendar | `calendar` | forms | `packages/ui/src/calendar.tsx` | Date / range |
| Event Calendar | `event-calendar` | data | `packages/ui/src/event-calendar.tsx` | |
| Dialog | `dialog` | overlays | `packages/ui/src/dialog.tsx` | Modal |
| Sheet | `sheet` | overlays | `packages/ui/src/sheet.tsx` | Drawer-like |
| Popover / Tooltip / Hover Card | `popover`, `tooltip`, `hover-card` | overlays | | |
| Toast | `toast` | feedback | `packages/ui/src/toast.tsx` | Imperative API |
| Floating Widget | `floating-widget` | overlays | `packages/ui/src/floating-widget.tsx` | |
| Sidebar | `sidebar` | navigation | `packages/ui/src/sidebar.tsx` | |
| Pagination | `pagination` | navigation | `packages/ui/src/pagination.tsx` | |
| Scroll To Top | `scroll-to-top` | navigation | `packages/ui/src/scroll-to-top.tsx` | |
| Table | `table` | data | `packages/ui/src/table.tsx` | |
| Empty | `empty` | data | `packages/ui/src/empty.tsx` | Empty state |
| Skeleton | `skeleton` | data | `packages/ui/src/skeleton.tsx` | |
| Alert | `alert` | feedback | `packages/ui/src/alert.tsx` | |
| Badge | `badge` | feedback | `packages/ui/src/badge.tsx` | |
| Kbd | `kbd` | feedback | `packages/ui/src/kbd.tsx` | |
| Spinner / Progress | `spinner`, `progress` | feedback | | |
| Accordion / Collapsible | `accordion`, `collapsible` | interactive | | File-tree demos |
| Carousel | `carousel` | interactive | `packages/ui/src/carousel.tsx` | |
| Typography | `typography` | content | `packages/ui/src/typography.tsx` | |
| Markdown Viewer / Editor | `markdown-viewer`, `markdown-editor` | content | | Rich text included |

### Built this sprint (Tier 1 demand)

| Component | Registry slug | Category | Source | Status |
| --- | --- | --- | --- | --- |
| Avatar + Avatar Group | `avatar` | feedback | `packages/ui/src/avatar.tsx` | ✅ Done |
| Dropdown Menu | `dropdown-menu` | overlays | `packages/ui/src/dropdown-menu.tsx` | ✅ Done |
| Alert Dialog | `alert-dialog` | overlays | `packages/ui/src/alert-dialog.tsx` | ✅ Done |
| Breadcrumb | `breadcrumb` | navigation | `packages/ui/src/breadcrumb.tsx` | ✅ Done |
| Context Menu | `context-menu` | overlays | `packages/ui/src/context-menu.tsx` | ✅ Done |
| Combobox | `combobox` | forms | `packages/ui/src/combobox.tsx` | ✅ Done |
| Command | `command` | overlays | `packages/ui/src/command.tsx` | ✅ Done |
| File Upload | `file-upload` | forms | `packages/ui/src/file-upload.tsx` | ✅ Done |
| Navigation Menu | `navigation-menu` | navigation | `packages/ui/src/navigation-menu.tsx` | ✅ Done |
| Stepper | `stepper` | interactive | `packages/ui/src/stepper.tsx` | ✅ Done |
| Theme Toggle | `theme-toggle` | actions | `packages/ui/src/theme-toggle.tsx` | ✅ Done |
| Copy Button | `copy-button` | actions | `packages/ui/src/copy-button.tsx` | ✅ Done |

---

## Next up (priority order)

Ship in this order for maximum demand. Check items off as you go.

| # | Component | Registry slug | Why | Effort |
| --- | ---: | --- | --- | --- |
| 1 | ~~Avatar + Avatar Group~~ | `avatar` | | ✅ |
| 2 | ~~Dropdown Menu~~ | `dropdown-menu` | | ✅ |
| 3 | ~~Alert Dialog~~ | `alert-dialog` | | ✅ |
| 4 | ~~Breadcrumb~~ | `breadcrumb` | | ✅ |
| 5 | ~~Context Menu~~ | `context-menu` | | ✅ |
| 6 | ~~Combobox~~ | `combobox` | | ✅ |
| 7 | ~~Command Palette~~ | `command` | | ✅ |
| 8 | ~~File Upload / Dropzone~~ | `file-upload` | | ✅ |
| 9 | ~~Navigation Menu~~ | `navigation-menu` | | ✅ |
| 10 | ~~Stepper~~ | `stepper` | | ✅ |
| 11 | ~~Theme Toggle~~ | `theme-toggle` | | ✅ |
| 12 | ~~Copy Button~~ | `copy-button` | | ✅ |
| 13 | AI Chat kit (Prompt Input, Messages, Streaming) | `ai-chat`… | Brand differentiation | L |
| 14 | Data Grid or Kanban | `data-grid` / `kanban` | Marketing visual + admin apps | L |

---

## To Build (by demand tier)

### Tier 1 — App-shell completeness (high demand)

- [x] Avatar + Avatar Group
- [x] Dropdown Menu
- [x] Alert Dialog / Confirmation Dialog
- [x] Breadcrumb
- [x] Context Menu
- [x] Combobox
- [x] Command Palette / Command Menu
- [x] File Upload / Image Upload / Drag & Drop Upload
- [x] Navigation Menu / Navbar
- [x] Stepper
- [ ] Multi Select
- [ ] Notification Center (inbox-style; toast is done)

### Tier 2 — Differentiation & virality

- [x] Theme Toggle
- [x] Copy Button
- [ ] Code Viewer / Terminal Block / JSON Viewer
- [ ] Aspect Ratio
- [ ] AI Chat, Chat Bubble, User/AI Message
- [ ] Prompt Input, Streaming Text, Typing Indicator
- [ ] Reasoning Block, Citation Card, Thinking Animation
- [ ] Token Counter, Prompt Suggestions
- [ ] Agent Card, Tool Call Viewer, MCP Server Card
- [ ] AI Model Selector, Conversation Sidebar

### Tier 3 — Product surfaces

- [ ] Data Grid (sort / filter / select)
- [ ] Virtual Table / Infinite Table
- [ ] Kanban / Task Board
- [ ] Timeline + Activity Feed
- [ ] Metric / KPI / Statistic Cards
- [ ] Charts wrapper (Line, Area, Sparkline, Donut first)
- [ ] Date Time / Time / Month pickers (composites on calendar)
- [ ] Password Input, Search Input, OTP / Pin Input
- [ ] Number / Currency / Phone inputs
- [ ] Color Picker, Rating
- [ ] Dock, Bottom Navigation
- [ ] Banner, Callout, Offline Banner
- [ ] Loading Screen, Retry View

### Tier 4 — Later / lower ROI

- Layout atoms: Box, Flex, Stack, Spacer, Center, Container, Grid (Tailwind covers these)
- Full chart zoo: Radar, Heatmap, Tree Map, Sankey, Funnel, Gauge
- E-commerce suite, Social suite (prefer recipes over core registry)
- Premium builders: Form/Workflow/SQL/Email/Dashboard builders
- Mobile-only web duplicates of `ui-native` patterns
- Separate `glass-*` components that only re-export existing variants

---

## Covered by variants (do not ship as separate packages)

These appear in `component.md` but map to existing primitives:

| Wishlist name | Use instead |
| --- | --- |
| Glass Button | `button` variants |
| Glass Card | `card` / `glass-content-card` |
| Glass Modal | `dialog` |
| Glass Input | `input` |
| Glass Badge | `badge` |
| Glass Tabs | `tabs` |
| Glass Sidebar | `sidebar` |
| Glass Dropdown | `dropdown-menu` / `select` |
| Icon Button | `glass-icon-button` / `button size="icon"` |
| Divider | `separator` |
| Empty State / Empty Screen | `empty` |
| Modal | `dialog` |
| Drawer | `sheet` |
| Markdown Renderer | `markdown-viewer` |
| Rich Text Editor | `markdown-editor` |

---

## Implementation checklist (per component)

When building any item from **To Build**:

1. `packages/ui/src/{name}.tsx` — Liquid Glass API, cva variants, a11y
2. Export from `packages/ui/src/index.ts` + `package.json` exports
3. `apps/registry/registry.json` entry (deps + meta)
4. `apps/playground/lib/catalog.ts` entry
5. Demo + `apps/playground/lib/examples/index.tsx`
6. `node scripts/bundle-registry.mjs`
7. `node packages/cli/scripts/bundle-mcp-data.mjs`
8. `pnpm --filter @intelli/ui check-types` (+ lint)
9. **Update this file** (Built table + checkboxes)

---

## Notes

- Full wishlist lives in `component.md` (~250+ items). This roadmap is the **demand-prioritized** subset.
- Prefer Radix primitives + owned glass styling (same as dialog/select/toast).
- One `Toaster` / one theme provider pattern; avoid duplicate systems.
