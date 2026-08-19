import type { CatalogItem, ComponentCategory } from "./catalog";

export type ComponentGuidance = {
  whenToUse: string[];
  whenNotTo: string[];
  accessibility: string[];
  composition: string[];
};

const CATEGORY_GUIDANCE: Record<ComponentCategory, ComponentGuidance> = {
  "glass-system": {
    whenToUse: [
      "You need frosted chrome (bars, icon buttons, content cards) that sit above expressive product surfaces.",
      "You want Liquid Glass hierarchy instead of applying blur to every panel.",
      "Preview stages or background pickers belong in a design-system docs or settings surface.",
    ],
    whenNotTo: [
      "You only need a single neutral Button with no glass system — start with actions instead.",
      "You are shipping a purely text document without chrome chrome layers.",
    ],
    accessibility: [
      "Keep interactive chrome contrast above WCAG AA against the active mesh or image background.",
      "Do not rely on blur alone to communicate state; pair with borders, weight, and focus rings.",
      "Icon-only glass controls need accessible names (aria-label or visible text).",
    ],
    composition: [
      "Place chrome components (glass-bar, glass-icon-button) above content panels — not nested inside saturated content cards.",
      "Pair with theme tokens from Intelli UI so blur, border, and fill stay consistent across pages.",
    ],
  },
  actions: {
    whenToUse: [
      "Primary and secondary actions in product chrome or content panels.",
      "Copy, theme, or toggle interactions that should feel native to Liquid Glass.",
    ],
    whenNotTo: [
      "Navigation between major app sections — prefer links or navigation components.",
      "Destructive multi-step workflows without confirmation (pair with alert-dialog).",
    ],
    accessibility: [
      "Buttons must remain keyboard focusable with a visible focus ring.",
      "Disabled actions should use disabled semantics, not click handlers that no-op.",
      "Icon-only buttons require an accessible name.",
    ],
    composition: [
      "Use content-layer variants for primary CTAs; chrome variants for toolbars.",
      "Group related actions with consistent size and shape (pill vs rounded).",
    ],
  },
  surfaces: {
    whenToUse: [
      "Grouping related content into cards, tabs, or layout shells.",
      "Elevating a section without full-page chrome.",
    ],
    whenNotTo: [
      "Long-form docs where plain typography is clearer than nested cards.",
      "Modals — use overlays instead of stacking cards.",
    ],
    accessibility: [
      "Headings inside cards should follow document order for screen readers.",
      "Tab panels need keyboard arrow support (built into Radix-based tabs).",
    ],
    composition: [
      "Prefer one chrome surface level deep; avoid card-in-card glass stacks.",
      "Use separators sparingly between sections inside a surface.",
      "Prefer layout primitives (Stack, Cluster, Grid, Split) over nested divs for spacing and alignment.",
      "Use as=\"section\" | as=\"ul\" | asChild so landmarks stay semantic — layout is not always a div.",
    ],
  },
  forms: {
    whenToUse: [
      "Collecting user input with labeled fields, selects, checkboxes, or dates.",
      "Settings screens that need glass chrome around standard controls.",
    ],
    whenNotTo: [
      "Read-only display of data — use typography or tables.",
      "Complex multi-page wizards without a stepper or progress pattern.",
    ],
    accessibility: [
      "Every control needs a visible label (or aria-label when space is constrained).",
      "Associate helper and error text with aria-describedby.",
      "Preserve focus order; do not trap keyboard users outside the form.",
    ],
    composition: [
      "Stack field + label + description vertically with consistent spacing.",
      "Use native-select only when you need zero-JS progressive enhancement.",
    ],
  },
  overlays: {
    whenToUse: [
      "Temporary focus tasks: dialogs, sheets, drawers, popovers, tooltips, hover cards.",
      "Confirmations and dense secondary UI that should not navigate away.",
    ],
    whenNotTo: [
      "Primary page content — overlays hide context and hurt deep linking.",
      "Critical legal copy that must remain permanently visible.",
    ],
    accessibility: [
      "Focus moves into the overlay on open and returns on close.",
      "Escape dismisses where appropriate; dialogs should label the title.",
      "Tooltips must not be the only way to access essential information.",
    ],
    composition: [
      "Prefer drawer for mobile drag-to-dismiss; sheet for desktop edge panels; dialog for focused confirmations.",
      "Keep overlay body short; link out to full pages for long content.",
    ],
  },
  navigation: {
    whenToUse: [
      "App chrome: sidebars, menus, pagination, scroll helpers.",
      "Orienting users inside multi-section product UIs.",
    ],
    whenNotTo: [
      "In-page CTAs that should be buttons rather than nav items.",
      "Single-page marketing sections better served by anchor links.",
    ],
    accessibility: [
      "Mark current page with aria-current where applicable.",
      "Sidebars and menus should be keyboard navigable and announce expansion state.",
    ],
    composition: [
      "Pair sidebar with main content landmarks (nav + main).",
      "Use pagination for large lists; avoid infinite scroll without an accessible alternative.",
    ],
  },
  data: {
    whenToUse: [
      "Tabular data, empty states, skeletons, and loading placeholders.",
      "Dense operational UIs where scanability matters.",
    ],
    whenNotTo: [
      "Narrative content better as cards or markdown.",
      "Tiny datasets that fit a simple list without table semantics.",
    ],
    accessibility: [
      "Tables need proper headers; empty states should explain next actions.",
      "Skeletons should be supplemented with aria-busy on the live region.",
    ],
    composition: [
      "Show empty states with a clear primary action (e.g. add first item).",
      "Prefer progressive loading over layout shifts (reserve row height).",
    ],
  },
  feedback: {
    whenToUse: [
      "Status, progress, toasts, badges, alerts, and spinners.",
      "Non-blocking confirmation that an action succeeded or failed.",
    ],
    whenNotTo: [
      "Permanent page content (use surfaces or typography).",
      "Errors that block progress without an inline form message.",
    ],
    accessibility: [
      "Toasts and alerts should use appropriate roles (status/alert) without over-notifying.",
      "Progress indicators need accessible names for screen readers.",
    ],
    composition: [
      "Use toast for transient success; alert for persistent page-level issues.",
      "Badges annotate; they should not be the only interactive control.",
    ],
  },
  interactive: {
    whenToUse: [
      "Accordions, sliders, toggles, carousels, and steppers for progressive disclosure.",
      "Settings that benefit from compact, interactive chrome.",
    ],
    whenNotTo: [
      "Critical content that must be fully visible without interaction.",
      "Carousels for SEO-critical copy (prefer static lists).",
    ],
    accessibility: [
      "Ensure slider values are announced; provide keyboard alternatives.",
      "Accordion triggers need expanded/collapsed state for assistive tech.",
    ],
    composition: [
      "One primary interaction pattern per region to avoid competing controls.",
      "Pair steppers with clear next/back actions.",
    ],
  },
  content: {
    whenToUse: [
      "Typography, markdown, code viewers, and documentation surfaces.",
      "Long-form help, changelogs, or in-app guides.",
    ],
    whenNotTo: [
      "Dense data tables (use data components).",
      "Primary navigation (use navigation components).",
    ],
    accessibility: [
      "Preserve heading hierarchy in markdown rendering.",
      "Code blocks should not trap focus; copy actions need labels.",
    ],
    composition: [
      "Keep content panels readable: higher opacity and stronger text contrast than pure chrome.",
      "Separate chrome toolbars from the reading column.",
    ],
  },
  media: {
    whenToUse: [
      "Image lightboxes, audio/video playback, or in-browser crop/filter workflows.",
      "AI chat attachments, galleries, podcasts, and avatar/product image editing.",
    ],
    whenNotTo: [
      "Server-side image pipelines that should not run in the browser.",
      "Complex NLE timelines — these are product UI primitives, not a video suite.",
    ],
    accessibility: [
      "Lightbox and player controls need accessible names and keyboard support.",
      "Provide captions/transcripts for meaningful audio and video content.",
      "Do not rely on color-only filter previews for critical information.",
    ],
    composition: [
      "Use File Upload for intake, Image Preview for viewing, Image Editor before submit.",
      "Keep Media Player chrome on the control layer; avoid nesting saturated content cards inside the player shell.",
    ],
  },
};

/** Category-level guidance customized lightly with the component title. */
export function getComponentGuidance(item: CatalogItem): ComponentGuidance {
  const base = CATEGORY_GUIDANCE[item.category];
  return {
    whenToUse: [
      `Use ${item.title} when ${item.description.charAt(0).toLowerCase()}${item.description.slice(1).replace(/\.$/, "")}.`,
      ...base.whenToUse.slice(0, 2),
    ],
    whenNotTo: base.whenNotTo,
    accessibility: base.accessibility,
    composition: base.composition,
  };
}
