# `@intelli/ui-native`

React Native component library for the Intelli UI glass design system.  
Mirrors the APIs of `@intelli/ui` (web) where the platform allows.

## Install

From the monorepo:

```bash
pnpm add @intelli/ui-native react-native
```

In an app:

```bash
pnpm add @intelli/ui-native
```

### Optional peers

| Package | Purpose |
|---------|---------|
| `expo-blur` | Real frosted glass via `BlurView` (falls back to translucent fills) |
| `react-native-safe-area-context` | Better Sheet / Dialog insets in consumers |
| `react-native-reanimated` / `gesture-handler` | Future advanced motion |

## Setup

Wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider, Button, Card, CardHeader, CardTitle } from "@intelli/ui-native";

export default function App() {
  return (
    <ThemeProvider theme="mono" followSystem>
      <Card variant="chrome">
        <CardHeader>
          <CardTitle>Hello Intelli</CardTitle>
        </CardHeader>
        <Button variant="primary" onPress={() => {}}>
          Continue
        </Button>
      </Card>
    </ThemeProvider>
  );
}
```

## Styling model

- **StyleSheet + theme tokens** (not NativeWind / Tailwind)
- Variants match web names: `variant`, `size`, `shape`, etc.
- Use `style` / `textStyle` instead of `className`
- Access tokens via `useTheme()` / `useColors()`

## Components

### Implemented

Button, Card, Input, Textarea, Badge, Alert, Skeleton, Separator, Spinner, Progress, Switch, Checkbox, RadioGroup, Toggle, ToggleGroup, Typography, Empty, Tabs, Accordion, Collapsible, Slider, Dialog, Sheet, Select, Popover, Tooltip, ScrollArea, ScrollToTop, Pagination, Table, Carousel, Calendar, Sidebar, GlassBar, GlassIconButton, GlassContentCard, MarkdownViewer, GlassSurface

### Deferred (web-only or low mobile value)

| Web component | Reason |
|---------------|--------|
| HoverCard | No hover — use Tooltip / Popover |
| Kbd | Desktop keyboard UI |
| Resizable | Desktop split panes |
| ComponentPreview | Playground tooling |
| NativeSelect | Use Select |
| BackgroundPicturePicker | Web wallpaper picker |
| MarkdownEditor / RichTextEditor | Different editing model on native |

## Themes

v1 ships **mono** light/dark (system sync optional). Additional web themes (aurora, sunset, frost, ocean) can be ported later using the same `ThemeColors` shape.

## Import paths

```ts
import { Button } from "@intelli/ui-native";
// or
import { Button } from "@intelli/ui-native/button";
```
