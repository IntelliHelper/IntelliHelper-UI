"use client";

import {
  AreaChart,
  applyChartPeriod,
  BarChart,
  ChartFrame,
  ChartPeriodControl,
  DonutChart,
  FunnelChart,
  LineChart,
  MetricCard,
  PieChart,
  RadarChart,
  Sparkline,
  StackedBarChart,
  type ChartPeriodKey,
  type TimeSeriesDatum,
} from "@intelli/ui";
import { useMemo, useState } from "react";

/** 30 undated daily points — period control slices last N */
const DAILY_SERIES = [
  12, 14, 13, 18, 16, 20, 19, 22, 21, 24, 23, 26, 25, 28, 27, 30, 29, 32, 31,
  34, 33, 36, 35, 38, 37, 40, 39, 42, 41, 44,
];

const WEEKLY = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 55 },
  { label: "Wed", value: 48 },
  { label: "Thu", value: 62 },
  { label: "Fri", value: 70 },
  { label: "Sat", value: 58 },
  { label: "Sun", value: 65 },
];

const TRAFFIC = [
  { label: "Organic", value: 48 },
  { label: "Direct", value: 22 },
  { label: "Referral", value: 18 },
  { label: "Social", value: 12 },
];

const FUNNEL = [
  { label: "Visitors", value: 12000 },
  { label: "Signups", value: 4800 },
  { label: "Trials", value: 2100 },
  { label: "Paid", value: 840 },
];

const RADAR = [
  { label: "Perf", value: 88 },
  { label: "A11y", value: 72 },
  { label: "SEO", value: 91 },
  { label: "BP", value: 65 },
  { label: "PWA", value: 58 },
];

/** Dated points so period filtering uses real calendar bounds */
function buildDatedSeries(days: number): TimeSeriesDatum[] {
  const now = Date.now();
  const out: TimeSeriesDatum[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const t = now - i * 24 * 60 * 60 * 1000;
    out.push({
      date: new Date(t).toISOString(),
      label: new Date(t).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      value: 20 + Math.round(15 * Math.sin(i / 3) + (i % 7) * 2 + i * 0.15),
    });
  }
  return out;
}

const DATED_90D = buildDatedSeries(90);

export function MetricCardDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      <MetricCard
        label="Monthly revenue"
        value="$48.2k"
        trendValue={48200}
        trendPrevious={42100}
        description="vs previous 30 days"
        icon={<span aria-hidden>↗</span>}
        footer={
          <Sparkline
            data={DAILY_SERIES.slice(-14)}
            fill
            label="Revenue trend"
            className="w-full"
            width={220}
            height={32}
          />
        }
      />
      <MetricCard
        label="Active users"
        value="12,480"
        trendValue={12480}
        trendPrevious={13100}
        description="Rolling 7-day unique users"
        variant="outline"
      />
      <MetricCard
        label="Conversion"
        value="3.8%"
        trend={
          <span className="text-xs font-semibold text-muted-foreground">
            Steady
          </span>
        }
        description="Checkout completion rate"
        size="sm"
        variant="elevated"
      />
      <MetricCard
        label="Latency p95"
        value="182ms"
        trendValue={182}
        trendPrevious={210}
        trendFormat={{ mode: "absolute", decimals: 0, absoluteSuffix: "ms" }}
        description="API edge p95 this hour"
      />
    </div>
  );
}

/** Professional line chart with visible time-period chrome */
export function LineChartDemo() {
  const [period, setPeriod] = useState<ChartPeriodKey>("30d");
  const filtered = useMemo(
    () => applyChartPeriod(DATED_90D, period),
    [period],
  );

  return (
    <div className="w-full max-w-xl">
      <ChartFrame
        title="Sessions"
        description="Unique sessions over the selected range"
        period={period}
        onPeriodChange={setPeriod}
        periodInclude={["7d", "14d", "30d", "90d", "all"]}
        footer={`Showing ${filtered.length} points · period ${period.toUpperCase()}`}
      >
        <LineChart
          data={filtered}
          label="Sessions line chart"
          height={200}
          variant="bare"
        />
      </ChartFrame>
    </div>
  );
}

export function AreaChartDemo() {
  const [period, setPeriod] = useState<ChartPeriodKey>("7d");
  const data = useMemo(
    () => applyChartPeriod(
      DAILY_SERIES.map((value, i) => ({ value, label: `D${i + 1}` })),
      period,
    ),
    [period],
  );

  return (
    <div className="w-full max-w-xl">
      <ChartFrame
        title="Engagement"
        description="Daily engagement score"
        period={period}
        onPeriodChange={setPeriod}
        periodInclude={["7d", "14d", "30d", "all"]}
      >
        <AreaChart data={data} label="Engagement area" height={180} variant="bare" />
      </ChartFrame>
    </div>
  );
}

export function SparklineDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">CPU</span>
        <Sparkline data={[40, 42, 38, 55, 60, 48, 52]} label="CPU sparkline" />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Errors</span>
        <Sparkline
          data={[2, 1, 3, 0, 4, 2, 1]}
          fill
          variant="chrome"
          stroke="var(--destructive)"
          label="Errors sparkline"
        />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Signups</span>
        <Sparkline
          data={DAILY_SERIES.slice(-12)}
          width={120}
          height={36}
          fill
          label="Signups"
        />
      </div>
    </div>
  );
}

export function DonutChartDemo() {
  return (
    <div className="w-full max-w-xs">
      <DonutChart
        data={TRAFFIC}
        centerValue="100%"
        centerLabel="Traffic"
        label="Traffic sources"
      />
    </div>
  );
}

export function ChartPeriodDemo() {
  const [period, setPeriod] = useState<ChartPeriodKey>("30d");
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Standalone period control — pair with any chart via{" "}
        <code className="text-[10px]">applyChartPeriod</code> or{" "}
        <code className="text-[10px]">ChartFrame</code>.
      </p>
      <ChartPeriodControl
        value={period}
        onValueChange={setPeriod}
        include={["24h", "7d", "14d", "30d", "90d", "6m", "1y", "ytd", "all"]}
      />
      <p className="text-xs font-medium text-[var(--glass-chrome-fg)]">
        Selected: {period}
      </p>
    </div>
  );
}

export function ChartFrameDemo() {
  const [period, setPeriod] = useState<ChartPeriodKey>("30d");
  const filtered = useMemo(
    () => applyChartPeriod(DATED_90D, period),
    [period],
  );
  return (
    <div className="w-full max-w-xl">
      <ChartFrame
        title="Revenue overview"
        description="Net revenue with dashboard period toolbar"
        period={period}
        onPeriodChange={setPeriod}
        footer="Source: billing warehouse · updated hourly"
      >
        <AreaChart
          data={filtered}
          height={160}
          variant="bare"
          label="Revenue area"
        />
      </ChartFrame>
    </div>
  );
}

export function BarChartDemo() {
  const [period, setPeriod] = useState<ChartPeriodKey>("7d");
  return (
    <div className="w-full max-w-xl space-y-4">
      <ChartFrame
        title="Daily active users"
        description="Vertical bars · period slices undated series"
        period={period}
        onPeriodChange={setPeriod}
        periodInclude={["7d", "14d", "30d"]}
      >
        <BarChart
          data={applyChartPeriod(
            DAILY_SERIES.map((value, i) => ({
              value,
              label: `${i + 1}`,
            })),
            period,
          )}
          height={180}
          variant="bare"
          showLabels={period === "7d"}
          label="DAU bar chart"
        />
      </ChartFrame>
      <BarChart
        orientation="horizontal"
        data={[
          { label: "US", value: 420 },
          { label: "EU", value: 310 },
          { label: "APAC", value: 260 },
          { label: "LATAM", value: 140 },
        ]}
        height={160}
        label="Region horizontal bars"
      />
    </div>
  );
}

export function PieChartDemo() {
  return (
    <div className="w-full max-w-xs">
      <PieChart data={TRAFFIC} label="Traffic pie" />
    </div>
  );
}

export function StackedBarChartDemo() {
  return (
    <div className="w-full max-w-lg">
      <StackedBarChart
        categories={["Mon", "Tue", "Wed", "Thu", "Fri"]}
        series={[
          { key: "web", label: "Web", values: [40, 48, 45, 52, 60] },
          { key: "mobile", label: "Mobile", values: [28, 32, 30, 35, 38] },
          { key: "api", label: "API", values: [12, 15, 14, 18, 20] },
        ]}
        height={180}
        label="Channel stacked bars"
      />
    </div>
  );
}

export function RadarChartDemo() {
  return (
    <div className="w-full max-w-sm">
      <RadarChart data={RADAR} label="Lighthouse radar" maxValue={100} />
    </div>
  );
}

export function FunnelChartDemo() {
  return (
    <div className="w-full max-w-md">
      <FunnelChart data={FUNNEL} height={220} label="Conversion funnel" />
    </div>
  );
}
