# Intelli UI SEO Playbook

**Owner:** Growth / Product marketing  
**Site:** [https://ui.intellihelper.in](https://ui.intellihelper.in)  
**Last updated:** 2026-07-21  
**Goal:** Outrank generic component-library SERPs on *intent* keywords (Liquid Glass, glassmorphism, shadcn alternative, MCP UI) and win AI citation via `llms.txt` + structured data.

---

## 1. Positioning (use this in every page)

| Element | Copy |
|--------|------|
| **Brand** | Intelli UI by IntelliHelper |
| **Category** | Liquid Glass React component library |
| **Stack** | React · Next.js · Tailwind CSS · TypeScript |
| **Workflow** | Copy-paste registry (own the source) + CLI + agent plugin + MCP |
| **Differentiator vs shadcn** | Same install ownership model, **Liquid Glass** visual system, **agent plugin** (`IntelliHelper/agent-skills`) + **MCP-native** for AI agents |
| **CTA** | `npx @intellihelper/cli@latest init` → `add <component>` · agents: install `intellihelper-ui` plugin |

**One-liner for social / meta:**

> Free Liquid Glass React components for Next.js & Tailwind. Install with CLI, agent plugin, or MCP. You own the code.

---

## 2. Keyword map

### 2.1 Priority tiers

| Tier | Intent | Example queries | Target URL | Priority |
|------|--------|-----------------|------------|----------|
| **P0** | Brand + product | `intelli ui`, `intellihelper ui`, `intellihelper cli` | `/`, `/getting-started` | Defend |
| **P0** | Core category | `liquid glass components`, `liquid glass ui react`, `glass morphism react components` | `/`, category pages | Attack |
| **P1** | Competitor | `shadcn alternative`, `shadcn ui alternative liquid glass`, `shadcn mcp` | `/`, `/getting-started` | Attack |
| **P1** | Stack | `next.js tailwind components`, `react component library copy paste` | `/`, `/getting-started` | Attack |
| **P1** | AI agents | `mcp ui components`, `cursor mcp components`, `claude code ui library` | `/getting-started#mcp` | Attack |
| **P1** | Agent plugin | `claude code plugin ui`, `grok plugin components`, `agent skills ui library`, `intellihelper agent-skills` | `/getting-started#plugin` | Attack |
| **P2** | Component | `{name} react component`, `{name} tailwind`, `{name} next.js` | `/components/{slug}` | Scale |
| **P2** | Category | `react form components`, `react overlay components` | `/categories/{category}` | Scale |
| **P3** | Long-tail how-to | `how to install liquid glass button next.js` | Blog / guides (future) | Expand |

### 2.2 Homepage & getting started

| Page | Primary keyword | Secondary keywords | Title pattern | Meta description focus |
|------|-----------------|--------------------|---------------|------------------------|
| `/` | free liquid glass react components | next.js ui, tailwind component library, shadcn alternative | Intelli UI — Free Liquid Glass React Components for Next.js & Tailwind CSS | Catalog + CLI + live previews + free |
| `/getting-started` | install intellihelper ui / intellihelper cli | mcp server cursor, agent plugin, claude code plugin, grok plugin, shadcn alternative install | Getting Started — Install… | CLI + agent plugin + MCP clients |
| `/guides` | liquid glass tutorial / shadcn vs intelli | glassmorphism react, shadcn alternative | Guides — Liquid Glass React UI Tutorials | Topical authority / TOFU |
| `/sitemap` | (supporting) | site index | Sitemap | Crawl aid, not ranking target |

### 2.3 Category → keyword map

| Category slug | Primary keyword cluster | Supporting terms |
|---------------|-------------------------|------------------|
| `glass-system` | liquid glass primitives, glass chrome ui | glass bar, glass content card, component preview |
| `actions` | react button components, glass button | toggle, toggle group, pressable |
| `surfaces` | react card tabs components | resizable panels, scroll area, separator |
| `forms` | react form components tailwind | input, select, checkbox, switch, calendar |
| `overlays` | react dialog sheet popover | modal, tooltip, hover card |
| `navigation` | react sidebar pagination | scroll to top, app shell nav |
| `data` | react table empty state skeleton | data table glass, loading placeholder |
| `feedback` | react alert badge spinner progress | status ui, kbd shortcuts |
| `interactive` | react accordion slider carousel | collapsible, file tree |
| `content` | react markdown editor viewer typography | docs ui, syntax highlighting |

### 2.4 Component page formula (template)

For every `/components/{slug}`:

| Field | Formula |
|-------|---------|
| **Title** | `{Title} React Component — Liquid Glass UI` |
| **H1** | `{Title}` |
| **Primary KW** | `{title} react component` |
| **Secondary** | `{slug} next.js`, `{title} tailwind`, liquid glass, glass morphism |
| **Description** | What it does + free + Next.js/Tailwind + `npx @intellihelper/cli add {slug}` |
| **Internal links** | Category · related components · getting started · home |

### 2.5 Negative / avoid (don’t stuff)

- Exact-match spam: “best shadcn alternative 2026 free download…”
- Unrelated brand attacks
- Keyword-only pages with no demo or install path
- Duplicate titles across components

---

## 3. Technical SEO checklist (keep green)

| Asset | URL | Status target |
|-------|-----|---------------|
| XML sitemap | `/sitemap.xml` | 200, submitted in GSC |
| HTML sitemap | `/sitemap` | Linked in footer |
| robots.txt | `/robots.txt` | Allow site; list sitemap |
| llms.txt | `/llms.txt` | Full catalog for AI crawlers |
| RSS | `/rss.xml` | Components + docs |
| Canonicals | Every public page | Absolute `ui.intellihelper.in` |
| JSON-LD | Home, category, component, getting-started | Valid in Rich Results Test |
| OG images | Root, categories, components, getting-started | 1200×630 |
| Core Web Vitals | LCP / INP / CLS | “Good” in CrUX / Search Console |
| Indexation | GSC → Pages | Zero critical coverage errors |

**Do after every deploy**

1. Spot-check homepage + 1 component + 1 category in [Rich Results Test](https://search.google.com/test/rich-results).  
2. Confirm `/sitemap.xml`, `/llms.txt`, `/rss.xml` return 200.  
3. Request indexing for new high-value URLs (new components / blog posts).  
4. Diff sitemap URL count vs previous release.

**Google Search Console**

- Property: `https://ui.intellihelper.in`  
- Verification: already set via `metadata.verification.google` in app layout  
- Submit: sitemap `https://ui.intellihelper.in/sitemap.xml`  
- Monitor: Performance (queries), Indexing, Core Web Vitals, Experience  
- Optional: Bing Webmaster Tools + same sitemap

---

## 4. Content calendar (12 weeks)

Cadence: **1 pillar or comparison every 2 weeks** + **weekly micro-update** (component polish, OG, FAQ, internal links).

### Phase A — Foundation (weeks 1–4)

| Week | Ship | Keyword focus | Channel |
|------|------|---------------|---------|
| **1** | Deploy SEO stack; submit sitemap; fix any GSC coverage issues | Brand + discovery | GSC, internal |
| **2** | “What is Liquid Glass UI?” landing or `/getting-started` expansion (FAQ, comparison table vs plain glassmorphism) | liquid glass ui | Site + X/LinkedIn |
| **3** | Component polish: top 10 (button, dialog, input, card, sidebar, tabs, select, sheet, table, accordion) — unique FAQ + screenshot | `{name} react component` | Site only |
| **4** | Comparison draft: **Intelli UI vs shadcn/ui** (fair, technical; install model, design, MCP) | shadcn alternative | Blog or docs page + social |

### Phase B — Authority (weeks 5–8)

| Week | Ship | Keyword focus | Channel |
|------|------|---------------|---------|
| **5** | Agent plugin + MCP guide: “Wire Intelli UI into Claude Code / Grok / Cursor” | agent plugin, claude code plugin, grok plugin, mcp ui components | `/getting-started#plugin` + `#mcp` + short video |
| **6** | Category deep-dives: Forms + Overlays (use cases, when to pick which component) | react form / dialog components | Category pages |
| **7** | CLI cookbook: init, add, update, monorepo tips | intellihelper cli | Getting started |
| **8** | Showcase: 3 demo screens (dashboard, settings, chat) built with Intelli UI | liquid glass dashboard | Homepage / GitHub README |

### Phase C — Distribution (weeks 9–12)

| Week | Ship | Keyword focus | Channel |
|------|------|---------------|---------|
| **9** | Publish comparison + demos on Dev.to / Hashnode (canonical → your domain) | shadcn alternative, next.js ui | Syndication |
| **10** | Reddit / Discord / HN-ready post (show code ownership + glass demos, not spam) | community | r/reactjs, r/nextjs (value-first) |
| **11** | Partner / registry listing: npm keywords, GitHub topics, Awesome lists PRs | brand discovery | npm, GitHub |
| **12** | Retro: GSC queries, top landing pages, CWV; plan Q2 keywords | — | Internal |

### Ongoing weekly micro-tasks (30–60 min)

- [ ] Add 1 internal link from a high-traffic page to a thin page  
- [ ] Refresh 1 component description if GSC shows impressions but low CTR  
- [ ] Answer 1 FAQ from support / Discord on the matching component page  
- [ ] Tweet/X or LinkedIn: 1 component GIF + install command  
- [ ] Ensure new components ship with: catalog entry, OG image, FAQ, sitemap inclusion  

---

## 5. CTR playbook (titles & snippets)

**Title patterns that win for docs libraries**

1. `{Benefit} — {Product}`  
2. `{Component} React Component — Liquid Glass UI`  
3. `Install {X} for Next.js & Tailwind`  

**Description rules**

- 150–160 characters when possible  
- Front-load the benefit  
- Include one concrete action (`npx … add button`)  
- Mention React / Next.js / Tailwind once  

**Improve low-CTR pages**

1. GSC → Performance → page with impressions, CTR &lt; ~2%  
2. Rewrite title + description (A/B over 2–4 weeks)  
3. Improve H1 alignment with title  
4. Add FAQ schema if missing  

---

## 6. Internal linking rules

| From | To | Anchor style |
|------|----|--------------|
| Home category chips | `/categories/*` | Category label |
| Category page | Component pages | Component title |
| Component page | Category + related + getting-started | Natural (“Forms category”, “Install via CLI”) |
| Footer | Home, getting-started, categories, sitemap, llms, RSS | Fixed nav |
| Getting started | First 3–5 popular components | `button`, `card`, `dialog` |

**Depth goal:** every component ≤ 3 clicks from home.

---

## 7. AI / LLM SEO (citation)

| Asset | Purpose |
|-------|---------|
| `/llms.txt` | Canonical machine summary of product + all components |
| Component pages | Install command + plain-language purpose (models quote this) |
| Agent plugin `IntelliHelper/agent-skills` | One-step install for Claude / Grok / Codex / Gemini (skills + MCP) |
| MCP server `intellihelper-ui` | Agent discovery beyond web search (tools-only path) |
| GitHub README | Second source of truth; keep install commands in sync |
| xAI Official marketplace | Pending PR — list when merged ([plugin-marketplace#86](https://github.com/xai-org/plugin-marketplace/pull/86)) |
| Claude community marketplace | Submit via [plugin directory form](https://clau.de/plugin-directory-submission) |

**When adding a component:** update catalog → page → registry → `llms.txt` (auto from catalog) → RSS.

**When changing agent tooling:** update `agent-skills` repo, playground `/getting-started#plugin`, CLI README, and monorepo README in the same release.

---

## 8. Measurement (KPIs)

| KPI | Tool | Target (90 days) |
|-----|------|------------------|
| Indexed pages | GSC | ≥ 95% of sitemap URLs |
| Non-brand clicks | GSC | Growing MoM |
| Top 3 queries | GSC | Include ≥1 of: liquid glass / shadcn alternative / component name |
| Getting-started sessions | Analytics (when wired) | Rising share of organic |
| Install copy events | Analytics (when wired) | Track as primary conversion |
| CWV “Good” URLs | GSC | All key templates |
| Referring domains | Ahrefs / free alternatives | +N quality links from weeks 9–11 push |

**Primary conversion (product SEO):** user copies `npx @intellihelper/cli … add …`, installs the agent plugin, or completes getting-started.

---

## 9. Competitive notes (shadcn/ui)

shadcn wins on **brand and backlinks**. They currently under-invest in:

- robots.txt / sitemap.xml  
- JSON-LD  
- Canonicals  
- Deep component meta descriptions  

**Our edge:** technical completeness + Liquid Glass niche + MCP.  
**Do not try to out-domain them on “button component” alone** without unique glass demos and install clarity. Win **niche + intent** first, then expand.

---

## 10. Launch checklist (new component)

- [ ] Catalog entry (title, description, category, slug)  
- [ ] `/components/{slug}` static path  
- [ ] Live examples  
- [ ] Install command works  
- [ ] FAQ block present  
- [ ] Related components  
- [ ] Open Graph image  
- [ ] Appears in `/sitemap.xml` and `/llms.txt`  
- [ ] Footer/category navigation still correct  
- [ ] Optional: short social clip  

---

## 11. Content backlog (ready to write)

1. Intelli UI vs shadcn/ui (honest comparison)  
2. Liquid Glass design tokens explained  
3. Building a settings page with Intelli UI (tutorial)  
4. MCP for UI libraries: why agents need a registry  
5. Migrating a shadcn project to add Liquid Glass components  
6. Accessibility checklist for glass UI (contrast, focus)  
7. Monorepo install with `@intellihelper/cli`  

Each piece: **canonical URL on ui.intellihelper.in** (or blog subdomain) + 2–3 internal links to components.

---

## 12. Owners & ops

| Task | Cadence | Owner |
|------|---------|--------|
| GSC review | Weekly | Marketing / eng |
| Title/meta CTR tweaks | Biweekly | Marketing |
| New component SEO QA | Per release | Eng |
| Content calendar posts | Per schedule | Marketing |
| Backlink / distribution | Monthly | Marketing |
| CWV regressions | Per deploy | Eng |

---

## Quick reference — live SEO endpoints

```
https://ui.intellihelper.in/
https://ui.intellihelper.in/getting-started
https://ui.intellihelper.in/sitemap.xml
https://ui.intellihelper.in/sitemap
https://ui.intellihelper.in/robots.txt
https://ui.intellihelper.in/llms.txt
https://ui.intellihelper.in/rss.xml
https://ui.intellihelper.in/categories/{category}
https://ui.intellihelper.in/components/{slug}
```

---

*This playbook pairs with the technical SEO implementation in `apps/playground` (`lib/seo.ts`, `lib/json-ld.ts`, sitemap, robots, llms, RSS).*
