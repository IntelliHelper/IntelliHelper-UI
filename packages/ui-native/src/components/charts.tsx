import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../theme";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";

function ChartShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card variant="chrome">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Bars({ values }: { values: number[] }) {
  const { colors, theme } = useTheme();
  const max = Math.max(...values, 1);
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, height: 96 }}>
      {values.map((v, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: Math.max(8, Math.round((v / max) * 96)),
            borderRadius: theme.radii.sm,
            backgroundColor: colors.primary,
            opacity: 0.35 + (v / max) * 0.65,
          }}
        />
      ))}
    </View>
  );
}

export function BarChart({ data = [12, 28, 18, 36, 22] }: { data?: number[] }) {
  return (
    <ChartShell title="Bar">
      <Bars values={data} />
    </ChartShell>
  );
}

export function LineChart({ data = [8, 14, 11, 20, 18, 26] }: { data?: number[] }) {
  return (
    <ChartShell title="Line">
      <Bars values={data} />
    </ChartShell>
  );
}

export function AreaChart(props: { data?: number[] }) {
  return <LineChart {...props} />;
}

export function Sparkline({ data = [4, 8, 6, 10, 7] }: { data?: number[] }) {
  return <Bars values={data} />;
}

export function StackedBarChart({ data = [10, 16, 12, 20] }: { data?: number[] }) {
  return <BarChart data={data} />;
}

export function PieChart({ value = 62 }: { value?: number }) {
  return (
    <ChartShell title="Pie">
      <Progress value={value} />
      <Text style={{ marginTop: 8 }}>{value}%</Text>
    </ChartShell>
  );
}

export function DonutChart(props: { value?: number }) {
  return <PieChart {...props} />;
}

export function RadarChart({ data = [12, 20, 16, 24, 18] }: { data?: number[] }) {
  return <BarChart data={data} />;
}

export function FunnelChart({ data = [40, 28, 18, 10] }: { data?: number[] }) {
  return <BarChart data={data} />;
}

export function Heatmap({ cells = 16 }: { cells?: number }) {
  const { colors, theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
      {Array.from({ length: cells }, (_, i) => (
        <View
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: theme.radii.sm,
            backgroundColor: colors.primary,
            opacity: 0.15 + (i % 5) * 0.15,
          }}
        />
      ))}
    </View>
  );
}

export function TreeMap({ data = [30, 20, 15, 10] }: { data?: number[] }) {
  return <BarChart data={data} />;
}

export function Sankey({ data = [24, 18, 12] }: { data?: number[] }) {
  return <BarChart data={data} />;
}

export function Gauge({ value = 72 }: { value?: number }) {
  return <DonutChart value={value} />;
}

export function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { colors, theme } = useTheme();
  return (
    <Card variant="chrome">
      <CardContent>
        <Text style={{ color: colors.mutedForeground, fontSize: theme.fontSizes.xs }}>
          {label}
        </Text>
        <Text
          style={{
            color: colors.foreground,
            fontSize: theme.fontSizes["2xl"] ?? 24,
            fontWeight: theme.fontWeights.semibold,
          }}
        >
          {value}
        </Text>
      </CardContent>
    </Card>
  );
}

export function ChartFrame({ children }: { children?: ReactNode }) {
  return <Card variant="chrome">{children}</Card>;
}

export function ChartPeriod({
  value,
  options = ["7d", "30d", "90d"],
}: {
  value?: string;
  options?: string[];
}) {
  const { colors, theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: theme.spacing[2] }}>
      {options.map((o) => (
        <Text
          key={o}
          style={{
            color: o === value ? colors.primary : colors.mutedForeground,
            fontSize: theme.fontSizes.sm,
          }}
        >
          {o}
        </Text>
      ))}
    </View>
  );
}
