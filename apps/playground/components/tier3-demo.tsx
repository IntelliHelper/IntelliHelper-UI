"use client";

import { useMemo, useState } from "react";
import {
  ActivityFeed,
  Banner,
  BottomNavigation,
  Callout,
  ColorPicker,
  CurrencyInput,
  DataGrid,
  DateTimePicker,
  Dock,
  Kanban,
  Label,
  LoadingScreen,
  MonthPicker,
  NumberInput,
  OfflineBanner,
  PhoneInput,
  PinInput,
  Rating,
  RetryView,
  SearchInput,
  TimePicker,
  Timeline,
  VirtualTable,
  type DataGridColumnDef,
  type KanbanCard,
  type MonthValue,
  type TimeValue,
} from "@intelli/ui";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

export function SearchInputDemo() {
  const [q, setQ] = useState("liquid glass");
  return (
    <div className="w-full max-w-md space-y-3">
      <Label htmlFor="search-demo">Search</Label>
      <SearchInput
        id="search-demo"
        value={q}
        onValueChange={setQ}
        placeholder="Search components…"
      />
      <p className="text-xs glass-chrome-text-muted">Query: {q || "—"}</p>
    </div>
  );
}

export function PinInputDemo() {
  const [pin, setPin] = useState("");
  return (
    <div className="w-full max-w-md space-y-3">
      <Label>PIN</Label>
      <PinInput value={pin} onValueChange={setPin} length={4} />
    </div>
  );
}

export function NumberInputDemo() {
  const [n, setN] = useState<number | null>(3);
  return (
    <div className="w-full max-w-xs space-y-3">
      <Label>Quantity</Label>
      <NumberInput value={n} onValueChange={setN} min={0} max={99} step={1} />
    </div>
  );
}

export function CurrencyInputDemo() {
  const [v, setV] = useState<number | null>(1299.5);
  const [currency, setCurrency] = useState("USD");
  return (
    <div className="w-full max-w-md space-y-3">
      <Label>Amount · all currencies</Label>
      <CurrencyInput
        value={v}
        onValueChange={setV}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
      <p className="text-xs glass-chrome-text-muted">
        Selected: <strong>{currency}</strong> — search AED, EUR, JPY, INR…
      </p>
    </div>
  );
}

export function PhoneInputDemo() {
  const [p, setP] = useState("+14155550100");
  const [country, setCountry] = useState("US");
  return (
    <div className="w-full max-w-md space-y-3">
      <Label>Phone · all countries</Label>
      <PhoneInput
        value={p}
        onValueChange={setP}
        country={country}
        onCountryChange={setCountry}
      />
      <p className="text-xs glass-chrome-text-muted">
        {country} · E.164: <strong className="tabular-nums">{p || "—"}</strong>
      </p>
    </div>
  );
}

export function ColorPickerDemo() {
  const [c, setC] = useState("#8b5cf6");
  return (
    <div className="w-full max-w-xs space-y-3">
      <Label>Accent</Label>
      <ColorPicker value={c} onValueChange={setC} />
    </div>
  );
}

export function RatingDemo() {
  const [r, setR] = useState(4);
  return (
    <div className="space-y-3">
      <Label>Satisfaction</Label>
      <Rating value={r} onValueChange={setR} />
    </div>
  );
}

export function TimePickerDemo() {
  const [t, setT] = useState<TimeValue | null>({ hours: 14, minutes: 30 });
  return (
    <div className="w-full max-w-xs space-y-3">
      <Label>Meeting time</Label>
      <TimePicker value={t} onValueChange={setT} hour12 />
    </div>
  );
}

export function MonthPickerDemo() {
  const [m, setM] = useState<MonthValue | null>({ year: 2026, month: 7 });
  return (
    <div className="w-full max-w-xs space-y-3">
      <Label>Report period</Label>
      <MonthPicker value={m} onValueChange={setM} />
    </div>
  );
}

export function DateTimePickerDemo() {
  const [d, setD] = useState<Date | null>(new Date());
  return (
    <div className="w-full max-w-sm space-y-3">
      <Label>Schedule</Label>
      <DateTimePicker value={d} onValueChange={setD} hour12 />
    </div>
  );
}

export function BannerDemo() {
  return (
    <div className="w-full max-w-xl space-y-3">
      <Banner variant="info" title="New Liquid Glass release" dismissible>
        Tier 3 product surfaces are live — grids, kanban, and form composites.
      </Banner>
      <Banner variant="warning" title="Maintenance window">
        Deployments pause Friday 22:00–23:00 UTC.
      </Banner>
    </div>
  );
}

export function CalloutDemo() {
  return (
    <div className="w-full max-w-xl space-y-3">
      <Callout variant="tip" title="Pro tip">
        Prefer chrome variants for toolbars and content variants for CTAs.
      </Callout>
      <Callout variant="warning" title="Accessibility">
        Keep text contrast readable on frosted glass backgrounds.
      </Callout>
    </div>
  );
}

export function OfflineBannerDemo() {
  return (
    <div className="w-full max-w-xl space-y-3">
      <OfflineBanner forceOffline />
      <p className="text-xs glass-chrome-text-muted">
        Demo forces offline state. Live usage listens to <code>navigator.onLine</code>.
      </p>
    </div>
  );
}

export function LoadingScreenDemo() {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)]">
      <LoadingScreen
        variant="panel"
        label="Syncing workspace…"
        description="Pulling the latest components and registry metadata."
        className="min-h-[10rem]"
      />
    </div>
  );
}

export function RetryViewDemo() {
  const [tries, setTries] = useState(0);
  return (
    <div className="w-full max-w-md">
      <RetryView
        title="Failed to load metrics"
        description={tries ? `Attempt ${tries} failed. Network timeout.` : undefined}
        onRetry={() => setTries((t) => t + 1)}
      />
    </div>
  );
}

export function DockDemo() {
  const [active, setActive] = useState("home");
  const items = [
    { id: "home", label: "Home", icon: <HomeIcon />, active: active === "home", onSelect: () => setActive("home") },
    { id: "search", label: "Search", icon: <SearchIcon />, active: active === "search", onSelect: () => setActive("search") },
    { id: "alerts", label: "Alerts", icon: <BellIcon />, active: active === "alerts", onSelect: () => setActive("alerts") },
    { id: "settings", label: "Settings", icon: <SettingsIcon />, active: active === "settings", onSelect: () => setActive("settings") },
  ];
  return (
    <div className="flex w-full justify-center py-6">
      <Dock items={items} position="bottom" />
    </div>
  );
}

export function BottomNavigationDemo() {
  const [active, setActive] = useState("home");
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)]">
      <div className="flex h-40 items-center justify-center text-sm glass-chrome-text-muted">
        {active} screen
      </div>
      <BottomNavigation
        position="static"
        items={[
          { id: "home", label: "Home", icon: <HomeIcon />, active: active === "home", onSelect: () => setActive("home") },
          { id: "search", label: "Search", icon: <SearchIcon />, active: active === "search", onSelect: () => setActive("search") },
          { id: "profile", label: "Profile", icon: <UserIcon />, active: active === "profile", onSelect: () => setActive("profile"), badge: 3 },
        ]}
      />
    </div>
  );
}

export function TimelineDemo() {
  return (
    <div className="w-full max-w-md">
      <Timeline
        items={[
          { id: "1", title: "Design approved", description: "Liquid Glass tokens locked.", timestamp: "09:00", status: "success" },
          { id: "2", title: "Components in review", description: "Tier 3 surfaces shipping.", timestamp: "11:30", status: "active" },
          { id: "3", title: "Registry publish", description: "CLI bundle + MCP data.", timestamp: "16:00", status: "default" },
        ]}
      />
    </div>
  );
}

export function ActivityFeedDemo() {
  return (
    <div className="w-full max-w-md">
      <ActivityFeed
        maxHeight={280}
        items={[
          { id: "1", actor: "Ava Chen", action: "commented on", target: "Data Grid", timestamp: "2m ago" },
          { id: "2", actor: "Jordan Lee", action: "moved", target: "Kanban card → Done", timestamp: "18m ago" },
          { id: "3", actor: "Sam Rivera", action: "uploaded", target: "hero-glass.png", timestamp: "1h ago" },
          { id: "4", actor: "Intelli Bot", action: "deployed", target: "playground@latest", timestamp: "3h ago" },
        ]}
      />
    </div>
  );
}

export function KanbanDemo() {
  const [cards, setCards] = useState<KanbanCard[]>([
    { id: "1", columnId: "todo", title: "Wire search input", labels: ["forms"] },
    { id: "2", columnId: "todo", title: "Docs for dock", labels: ["docs"] },
    { id: "3", columnId: "doing", title: "Data grid selection", description: "Multi-select + toolbar", labels: ["data"] },
    { id: "4", columnId: "done", title: "Rating stars", labels: ["forms"] },
  ]);
  return (
    <div className="w-full overflow-x-auto">
      <Kanban
        columns={[
          { id: "todo", title: "Todo" },
          { id: "doing", title: "In progress" },
          { id: "done", title: "Done" },
        ]}
        cards={cards}
        onCardsChange={setCards}
        columnHeight={280}
      />
    </div>
  );
}

type Person = { id: string; name: string; role: string; score: number };

export function DataGridDemo() {
  const data: Person[] = useMemo(
    () => [
      { id: "1", name: "Ava Chen", role: "Design", score: 98 },
      { id: "2", name: "Jordan Lee", role: "Engineering", score: 91 },
      { id: "3", name: "Sam Rivera", role: "Product", score: 87 },
      { id: "4", name: "Riley Kim", role: "Engineering", score: 94 },
      { id: "5", name: "Casey Ng", role: "Support", score: 82 },
    ],
    [],
  );
  const columns: DataGridColumnDef<Person>[] = [
    { id: "name", header: "Name", accessor: "name" },
    { id: "role", header: "Role", accessor: "role" },
    { id: "score", header: "Score", accessor: "score", align: "right" },
  ];
  return (
    <div className="w-full max-w-2xl">
      <DataGrid
        columns={columns}
        data={data}
        getRowId={(r) => r.id}
        selectable
        density="compact"
      />
    </div>
  );
}

export function VirtualTableDemo() {
  const data = useMemo(
    () =>
      Array.from({ length: 500 }, (_, i) => ({
        id: String(i + 1),
        label: `Row ${i + 1}`,
        value: Math.round(Math.random() * 1000),
      })),
    [],
  );
  return (
    <div className="w-full max-w-xl">
      <VirtualTable
        height={280}
        rowHeight={40}
        data={data}
        getRowId={(r) => r.id}
        columns={[
          { id: "id", header: "ID", width: 72, cell: (r) => r.id },
          { id: "label", header: "Label", cell: (r) => r.label },
          {
            id: "value",
            header: "Value",
            align: "right",
            cell: (r) => r.value,
          },
        ]}
      />
    </div>
  );
}

export function Tier3FormsShowcase() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <SearchInputDemo />
      <NumberInputDemo />
      <CurrencyInputDemo />
      <PhoneInputDemo />
      <div className="sm:col-span-2 flex flex-wrap items-end gap-6">
        <RatingDemo />
        <ColorPickerDemo />
      </div>
    </div>
  );
}
