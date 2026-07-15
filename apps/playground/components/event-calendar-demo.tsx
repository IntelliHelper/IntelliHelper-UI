"use client";

import { useMemo, useState } from "react";
import {
  EventCalendar,
  type CalendarEvent,
} from "@intelli/ui";

/** Fixed reference month so playground screenshots stay stable. */
const DEMO_MONTH = new Date(2026, 6, 1);

function buildDemoEvents(): CalendarEvent[] {
  return [
    {
      id: "1",
      title: "Design critique",
      start: new Date(2026, 6, 2, 10, 0),
      end: new Date(2026, 6, 2, 11, 0),
      color: "primary",
      location: "Glass Studio",
      description: "Review Liquid Glass component polish before release.",
    },
    {
      id: "2",
      title: "Sprint planning",
      start: new Date(2026, 6, 6, 9, 30),
      end: new Date(2026, 6, 6, 11, 0),
      color: "info",
      location: "Main room",
    },
    {
      id: "3",
      title: "Ship event calendar",
      start: new Date(2026, 6, 6, 14, 0),
      end: new Date(2026, 6, 6, 15, 30),
      color: "success",
      description: "Finalize demos, registry entry, and docs.",
    },
    {
      id: "4",
      title: "All-hands",
      start: new Date(2026, 6, 8, 16, 0),
      end: new Date(2026, 6, 8, 17, 0),
      color: "warning",
      location: "Town hall",
    },
    {
      id: "5",
      title: "Launch week",
      start: new Date(2026, 6, 13),
      end: new Date(2026, 6, 15),
      allDay: true,
      color: "primary",
      description: "Multi-day launch window for playground release.",
    },
    {
      id: "6",
      title: "Accessibility audit",
      start: new Date(2026, 6, 15, 11, 0),
      end: new Date(2026, 6, 15, 12, 30),
      color: "destructive",
      location: "Remote",
    },
    {
      id: "7",
      title: "Customer demo",
      start: new Date(2026, 6, 17, 13, 0),
      end: new Date(2026, 6, 17, 14, 0),
      color: "info",
    },
    {
      id: "8",
      title: "Office hours",
      start: new Date(2026, 6, 22, 15, 0),
      end: new Date(2026, 6, 22, 16, 0),
      color: "default",
      location: "Lobby",
    },
    {
      id: "9",
      title: "Retro",
      start: new Date(2026, 6, 24, 16, 30),
      end: new Date(2026, 6, 24, 17, 30),
      color: "success",
    },
    {
      id: "10",
      title: "Team offsite",
      start: new Date(2026, 6, 28),
      end: new Date(2026, 6, 29),
      allDay: true,
      color: "warning",
      location: "Bay Area",
    },
  ];
}

export function EventCalendarDemo() {
  const events = useMemo(() => buildDemoEvents(), []);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2026, 6, 6),
  );
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  return (
    <div className="w-full space-y-3">
      <EventCalendar
        events={events}
        defaultMonth={DEMO_MONTH}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        onEventClick={(event) => setLastEvent(event.title)}
        variant="chrome"
        showAgenda
      />
      {lastEvent ? (
        <p className="text-xs text-muted-foreground">
          Last clicked event:{" "}
          <span className="font-medium text-foreground">{lastEvent}</span>
        </p>
      ) : null}
    </div>
  );
}

export function EventCalendarCompactDemo() {
  const events = useMemo(() => buildDemoEvents().slice(0, 6), []);

  return (
    <div className="w-full">
      <EventCalendar
        events={events}
        defaultMonth={DEMO_MONTH}
        defaultSelectedDate={new Date(2026, 6, 6)}
        variant="elevated"
        size="sm"
        maxEventsPerDay={2}
        showAgenda={false}
        weekStartsOn={1}
      />
    </div>
  );
}

export function EventCalendarOutlineDemo() {
  const events = useMemo(
    () => [
      {
        id: "c1",
        title: "Focus block",
        start: new Date(2026, 6, 9, 9, 0),
        end: new Date(2026, 6, 9, 11, 0),
        color: "primary" as const,
      },
      {
        id: "c2",
        title: "1:1 with design",
        start: new Date(2026, 6, 9, 14, 0),
        end: new Date(2026, 6, 9, 14, 30),
        color: "info" as const,
        location: "Room B",
      },
      {
        id: "c3",
        title: "Ship checklist",
        start: new Date(2026, 6, 10, 11, 0),
        end: new Date(2026, 6, 10, 12, 0),
        color: "success" as const,
      },
    ],
    [],
  );

  return (
    <div className="w-full">
      <EventCalendar
        events={events}
        defaultMonth={DEMO_MONTH}
        defaultSelectedDate={new Date(2026, 6, 9)}
        variant="outline"
        title="Product calendar"
      />
    </div>
  );
}
