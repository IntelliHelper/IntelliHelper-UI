import { NATIVE_PACKAGE, type NativeCatalogItem } from "./native-catalog";

function innerJsx(item: NativeCatalogItem): string {
  const n = item.importName;
  switch (item.slug) {
    case "link":
      return `<${n} href="https://ui.intellihelper.in">Intelli UI</${n}>`;
    case "copy-button":
      return `<${n} value="https://ui.intellihelper.in" />`;
    case "button":
      return `<${n} variant="primary" onPress={() => {}}>Continue</${n}>`;
    case "input":
    case "search-input":
    case "textarea":
    case "password-input":
    case "phone-input":
      return `<${n} placeholder="${item.title}" />`;
    case "otp-input":
    case "pin-input":
      return `<${n} value="123456" onChange={() => {}} />`;
    case "number-input":
    case "currency-input":
      return `<${n} value={24} onValueChange={() => {}} />`;
    case "switch":
    case "checkbox":
      return `<${n} checked onCheckedChange={() => {}} />`;
    case "slider":
      return `<${n} value={[40]} onValueChange={() => {}} />`;
    case "progress":
    case "gauge":
    case "token-counter":
      return `<${n} value={64} />`;
    case "rating":
      return `<${n} value={4} onChange={() => {}} />`;
    case "avatar":
      return `<${n} fallback="IH" />`;
    case "badge":
    case "kbd":
      return `<${n}>${item.title}</${n}>`;
    case "dialog":
      return `<Dialog>
  <Button onPress={() => {}}>Open</Button>
</Dialog>`;
    case "sheet":
    case "drawer":
      return `<${n}>
  <${n}Content side="bottom" />
</${n}>`;
    case "ai-chat":
      return `<${n} messages={[{ role: "user", content: "Hello" }]} />`;
    case "prompt-input":
      return `<${n} placeholder="Ask anything…" />`;
    case "streaming-text":
      return `<${n} text="Liquid Glass on native." />`;
    case "markdown-viewer":
    case "markdown-editor":
      return `<${n} value="# Hello" />`;
    case "code-viewer":
      return `<${n} code="const n = 1" />`;
    case "json-viewer":
      return `<${n} value={{ ok: true }} />`;
    case "terminal-block":
      return `<${n} lines={["$ pnpm native"]} />`;
    case "metric-card":
      return `<${n} label="Users" value="12.4k" />`;
    case "bar-chart":
    case "line-chart":
    case "area-chart":
    case "sparkline":
      return `<${n} data={[8, 14, 11, 20, 18]} />`;
    case "image-preview":
    case "image-editor":
      return `<${n} source={{ uri: "https://ui.intellihelper.in/intellihelper.png" }} />`;
    case "media-player":
      return `<${n} title="Track" progress={35} />`;
    case "bottom-navigation":
    case "dock":
    case "navigation-menu":
      return `<${n} items={[{ key: "home", label: "Home" }]} value="home" onValueChange={() => {}} />`;
    case "stepper":
      return `<${n} steps={["Account", "Confirm"]} current={0} />`;
    case "timeline":
    case "activity-feed":
      return `<${n} items={[{ title: "Shipped", time: "Now" }]} />`;
    case "kanban":
      return `<${n} columns={[{ title: "Todo", cards: ["Native preview"] }]} />`;
    case "color-picker":
      return `<${n} value="#6366f1" onChange={() => {}} />`;
    case "label":
      return `<${n}>Email</${n}>`;
    default:
      if (item.category === "forms") {
        return `<${n} placeholder="${item.title}" />`;
      }
      return `<${n}>${item.title}</${n}>`;
  }
}

const MODULE_FILE: Record<string, string> = {
  "bar-chart": "charts",
  "line-chart": "charts",
  "area-chart": "charts",
  sparkline: "charts",
  "stacked-bar-chart": "charts",
  "pie-chart": "charts",
  "donut-chart": "charts",
  "radar-chart": "charts",
  "funnel-chart": "charts",
  heatmap: "charts",
  "tree-map": "charts",
  sankey: "charts",
  gauge: "charts",
  "metric-card": "charts",
  "chart-frame": "charts",
  "chart-period": "charts",
  "prompt-input": "ai",
  "streaming-text": "ai",
  "typing-indicator": "ai",
  "thinking-animation": "ai",
  "reasoning-block": "ai",
  "citation-card": "ai",
  "token-counter": "ai",
  "prompt-suggestions": "ai",
  "agent-card": "ai",
  "tool-call-viewer": "ai",
  "mcp-server-card": "ai",
  "ai-model-selector": "ai",
  "conversation-sidebar": "ai",
  "ai-chat": "ai",
  "floating-widget": "ai",
  "aspect-ratio": "media",
  "image-preview": "media",
  "image-editor": "media",
  "media-player": "media",
  "file-upload": "media",
  "font-picker": "media",
  "code-viewer": "viewers",
  "json-viewer": "viewers",
  "terminal-block": "viewers",
  "markdown-editor": "viewers",
  "component-preview": "viewers",
  layout: "layout",
  resizable: "layout",
  "background-picture-picker": "layout",
  kanban: "data-views",
  "data-grid": "data-views",
  "virtual-table": "data-views",
  "address-fields": "data-views",
  "address-country-select": "data-views",
  "address-region-select": "data-views",
  "address-city-select": "data-views",
  "event-calendar": "data-views",
  banner: "banner",
  callout: "banner",
  "offline-banner": "banner",
  "loading-screen": "loading-screen",
  "retry-view": "loading-screen",
  "bottom-navigation": "bottom-navigation",
  dock: "bottom-navigation",
  "navigation-menu": "bottom-navigation",
  timeline: "timeline",
  "activity-feed": "timeline",
  "notification-center": "timeline",
  combobox: "combobox",
  "multi-select": "combobox",
  command: "combobox",
  "otp-input": "otp-input",
  "pin-input": "otp-input",
  "number-input": "number-input",
  "currency-input": "number-input",
  "time-picker": "time-picker",
  "month-picker": "time-picker",
  "date-time-picker": "time-picker",
};

export function getNativeUsage(item: NativeCatalogItem): string {
  const inner = innerJsx(item).replaceAll("\n", "\n      ");
  const file = MODULE_FILE[item.slug] ?? item.slug;
  return `import { ThemeProvider } from "@/components/ui/native/theme";
import { ${item.importName} } from "@/components/ui/native/${file}";

export function Example() {
  return (
    <ThemeProvider theme="mono" followSystem>
      ${inner}
    </ThemeProvider>
  );
}`;
}
