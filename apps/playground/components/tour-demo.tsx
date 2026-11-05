"use client";

import { useState } from "react";
import { Button, Tour, type TourStep } from "@intelli/ui";

const STEPS: TourStep[] = [
  {
    id: "search",
    target: "[data-tour='search']",
    title: "Search the workspace",
    description: "Find projects, people, and files without leaving the page.",
    side: "bottom",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      alt: "Abstract fluid artwork above the search step",
    },
  },
  {
    id: "create",
    target: "[data-tour='create']",
    title: "Create something new",
    description: "Start a project from here. Skip closes the tour at any step.",
    side: "left",
    media: {
      type: "video",
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      poster: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
      label: "Short clip of flowers in a field",
    },
  },
  {
    id: "metrics",
    target: "[data-tour='metrics']",
    title: "Watch the numbers",
    description: "Media is optional. This step is text only. Arrow keys move between steps.",
    side: "top",
  },
];

const METRICS = [
  ["Active", "128"],
  ["Waiting", "14"],
  ["Done", "86"],
] as const;

export function TourDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div
          data-tour="search"
          className="glass-chrome flex h-10 min-w-0 flex-1 items-center rounded-xl px-3 text-sm glass-chrome-text-muted"
        >
          Search projects
        </div>
        <Button data-tour="create" variant="primary" onClick={() => setOpen(true)}>
          Start tour
        </Button>
      </div>
      <div data-tour="metrics" className="grid grid-cols-3 gap-3">
        {METRICS.map(([label, value]) => (
          <div key={label} className="glass-chrome rounded-xl p-3">
            <p className="text-xs glass-chrome-text-muted">{label}</p>
            <p className="text-lg font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      <Tour open={open} onOpenChange={setOpen} steps={STEPS} />
    </div>
  );
}
