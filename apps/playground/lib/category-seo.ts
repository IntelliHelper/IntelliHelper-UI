import type { ComponentCategory } from "./catalog";

/**
 * 150–300 word SEO intros for category pages.
 * Written for humans first; keywords appear naturally.
 */
export const CATEGORY_SEO_INTRO: Record<ComponentCategory, string> = {
  "glass-system": `Liquid Glass primitives are the foundation of Intelli UI’s visual system. This category covers the chrome and content layers that make glassmorphism feel intentional instead of gimmicky — frosted bars, saturated content cards, icon chrome, live component previews, and background pickers that set the stage for every other control.

Unlike generic glassmorphism snippets, these React components ship with design tokens for blur, fill, border, and elevation so your UI stays consistent across light and dark modes. Use Glass Bar for neutral control clusters, Glass Content Card for expressive panels, and Glass Icon Button for circular chrome actions. Component Preview pairs a live demo with syntax-highlighted source so you can evaluate and copy without leaving the page.

All primitives are built for Next.js and Tailwind CSS. Install with \`npx @intellihelper/cli add\` and own the source in your repo. Whether you are building an AI product shell, a marketing site, or an internal dashboard, start here to establish Liquid Glass chrome before you compose forms, overlays, and navigation.`,

  actions: `Action components are the primary way users commit intent in a Liquid Glass interface. This category includes free React buttons, toggles, copy controls, and theme switches styled for Next.js and Tailwind CSS — chrome-layer variants for toolbars and content-layer variants for saturated CTAs.

Intelli UI buttons support shapes, sizes, and glass treatments so primary CTAs stay vivid while secondary chrome stays calm. Copy Button handles clipboard feedback; Theme Toggle flips light and dark mode without layout thrash; Toggle and Toggle Group cover pressable binary and multi-option states with spring-scale feedback that still respects reduced-motion preferences.

Install any control with the IntelliHelper CLI (\`npx @intellihelper/cli add button\`) and customize CVA variants locally. These are not locked npm packages — you own the TypeScript source. Ideal keywords teams search for: glass button React, Next.js Tailwind button, shadcn-style copy-paste actions with a Liquid Glass aesthetic.`,

  surfaces: `Surface components structure content without fighting the glass aesthetic. Cards, tabs, resizable panels, scroll areas, and separators give your Next.js app clear hierarchy while frosted chrome stays on the edges.

Use Glass Content Card–adjacent patterns and surface primitives when you need readable content regions over mesh or image backgrounds. Tabs organize dense settings and docs; Resizable lets power users split panes; Scroll Area keeps long lists inside a fixed glass frame; Separator and layout helpers keep density under control on marketing and product pages.

Every surface is free, Tailwind-first, and installed via the IntelliHelper CLI so you can restyle tokens without forking a closed design system. If you are comparing shadcn/ui alternatives for glassmorphism React UIs, surfaces are where Liquid Glass readability wins — content stays legible while chrome remains translucent.`,

  forms: `Glassmorphism form inputs in React often fail accessibility and contrast. Intelli UI’s Forms category solves that with free, accessible inputs, selects, checkboxes, switches, radio groups, textareas, calendars, and multi-select patterns designed for Next.js and Tailwind CSS.

Each control follows Liquid Glass chrome conventions: neutral frosted fields, clear focus rings, and labels that stay readable on mesh backgrounds. Calendar and date controls fit dashboards and booking flows; Combobox and Multi Select handle dense filters; Native Select covers progressive enhancement. Field variants share tokens so your entire form system looks cohesive.

Search intent for “glass form components React”, “Tailwind input glassmorphism”, and “Next.js form UI kit” lands here. Install with \`npx @intellihelper/cli add input select checkbox\` (or any slug), wire your preferred form library, and keep full ownership of the source. Pair with Overlays for modal forms and Feedback for validation states.`,

  overlays: `Overlay components surface temporary UI without breaking immersion — dialogs, alert dialogs, sheets, popovers, tooltips, hover cards, dropdowns, and context menus with Liquid Glass treatment for React and Next.js.

Glass overlays need careful contrast: frosted panels must stay readable over blurred page content. Intelli UI primitives use elevated chrome, strong focus management, and Radix-style accessibility patterns so keyboard and screen-reader users get first-class support. Sheets suit mobile-first filters; Dialogs confirm high-stakes actions; Popovers and Hover Cards explain without navigation.

Install free overlay components via the IntelliHelper CLI and customize animation and blur tokens in your codebase. Ideal for product tours, settings drawers, command menus, and AI chat confirmations. Teams evaluating shadcn alternatives for modal and sheet UX get the same copy-paste ownership model with a distinctive glass look.`,

  navigation: `Navigation components orient users inside complex apps: sidebars, pagination, navigation menus, breadcrumbs patterns, and scroll-to-top helpers built as Liquid Glass React components for Next.js.

A glass sidebar keeps app chrome calm while content remains expressive. Pagination anchors data tables and search results. Navigation Menu structures marketing and docs IA. Scroll To Top improves long component docs and feed UIs without sticky layout shift when implemented carefully.

These free Tailwind components install with \`npx @intellihelper/cli\` and compose with Surfaces and Overlays for full app shells. If you are building an AI workspace, admin console, or multi-section docs site, start with Navigation plus Glass System primitives to lock IA and chrome before filling pages with forms and data.`,

  data: `Data components present tables, empty states, skeletons, and loading placeholders with Liquid Glass polish for React dashboards on Next.js and Tailwind.

Tables need strong contrast for dense numbers; empty states should coach users toward the next action; skeletons reduce perceived latency without layout shift when dimensions are reserved. Intelli UI data primitives follow those rules so glass styling never hides information hierarchy.

Use this category for admin grids, usage metrics, and AI conversation lists. Free CLI install means you own sorting, column layouts, and empty-state copy. Pair with Feedback for toasts after mutations and Forms for filter bars above the table.`,

  feedback: `Feedback components communicate status: alerts, toasts, badges, spinners, progress bars, and keyboard shortcut (kbd) UI for Liquid Glass React apps.

Good feedback is glanceable and accessible — not just translucent decoration. Alerts and toasts carry semantic color while remaining legible on glass; Progress and Spinner show work in progress without blocking the whole viewport; Badge labels density in toolbars and sidebars; Kbd documents shortcuts for power users.

Install free feedback components with the IntelliHelper CLI for Next.js + Tailwind projects. Essential for form validation, async jobs, and AI streaming UIs where users need continuous status without leaving the page.`,

  interactive: `Interactive components add motion and progressive disclosure: accordions, sliders, carousels, collapsibles, and file-tree style explorers as free Liquid Glass React components.

Accordions compress FAQs and settings; sliders tune continuous values; carousels showcase media; collapsibles hide secondary chrome. Animations respect design tokens and should honor reduced-motion preferences for Core Web Vitals and accessibility.

Built for Next.js and Tailwind CSS with CLI ownership of source. Use Interactive pieces in marketing pages, docs, media tools, and AI playgrounds where exploration beats a flat wall of content.`,

  content: `Content components help you ship documentation and long-form UI: typography, markdown viewers and editors, code viewers, and related reading tools with Liquid Glass chrome for React and Next.js.

If your product is docs-heavy or agent-facing, Content primitives keep prose, code, and citations consistent. Markdown Viewer renders agent output; editors support authoring; typography scales establish hierarchy over glass backgrounds without muddy contrast.

Free install via \`npx @intellihelper/cli\`, full source ownership, and Tailwind tokens for themes (mono, aurora, sunset, frost, ocean). Pair with Glass System previews when building your own component docs site — the same patterns power this playground.`,
};
