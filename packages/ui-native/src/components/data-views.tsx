import { Text, View } from "react-native";
import { useTheme } from "../theme";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export function Kanban({
  columns,
}: {
  columns: Array<{ title: string; cards: string[] }>;
}) {
  const { theme, colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
      {columns.map((col) => (
        <View
          key={col.title}
          style={{
            flex: 1,
            gap: theme.spacing[2],
            padding: theme.spacing[2],
            borderRadius: theme.radii.lg,
            backgroundColor: colors.glassSurfaceFill,
          }}
        >
          <Text style={{ fontWeight: theme.fontWeights.semibold, color: colors.foreground }}>
            {col.title}
          </Text>
          {col.cards.map((c) => (
            <Card key={c} variant="chrome">
              <CardContent>
                <Text style={{ color: colors.foreground }}>{c}</Text>
              </CardContent>
            </Card>
          ))}
        </View>
      ))}
    </View>
  );
}

export function DataGrid({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((c) => (
            <TableHead key={c}>{c}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {row.map((cell, j) => (
              <TableCell key={j}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function VirtualTable(props: { columns: string[]; rows: string[][] }) {
  return <DataGrid {...props} />;
}

export function AddressFields({
  values,
}: {
  values?: { line1?: string; city?: string; country?: string };
}) {
  const { colors, theme } = useTheme();
  return (
    <Card variant="chrome">
      <CardHeader>
        <CardTitle>Address</CardTitle>
      </CardHeader>
      <CardContent>
        <Text style={{ color: colors.foreground }}>{values?.line1 ?? "Street"}</Text>
        <Text style={{ color: colors.mutedForeground, fontSize: theme.fontSizes.sm }}>
          {[values?.city, values?.country].filter(Boolean).join(", ") || "City, Country"}
        </Text>
      </CardContent>
    </Card>
  );
}

export function AddressCountrySelect() {
  return <AddressFields values={{ country: "United States" }} />;
}

export function AddressRegionSelect() {
  return <AddressFields values={{ city: "California" }} />;
}

export function AddressCitySelect() {
  return <AddressFields values={{ city: "San Francisco" }} />;
}

export function EventCalendar() {
  return (
    <Card variant="chrome">
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
    </Card>
  );
}
