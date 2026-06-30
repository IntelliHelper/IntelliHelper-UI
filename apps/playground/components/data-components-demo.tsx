"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@intelli/ui";

const invoices = [
  { id: "INV-001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV-002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV-003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
  { id: "INV-004", status: "Paid", method: "Credit Card", amount: "$450.00" },
];

const contentGradient =
  "linear-gradient(135deg, color-mix(in oklch, var(--mesh-1) 85%, black) 0%, color-mix(in oklch, var(--mesh-2) 75%, black) 100%)";

export function DataComponentsDemo() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chrome Card</CardTitle>
            <CardDescription>
              Neutral frosted glass panel for functional content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chrome layer surfaces adapt to light and dark mode with readable
              contrast.
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Action</Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </CardFooter>
        </Card>

        <Card variant="content" gradient={contentGradient}>
          <CardHeader>
            <CardTitle>Content Card</CardTitle>
            <CardDescription>
              Expressive saturated surface with white display type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm content-text-muted">
              Use on gradient backgrounds beneath floating chrome controls.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Get Started</Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card variant="outline">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Glass capsule tabs with a sliding chrome indicator.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Switch tabs to see the spring-animated indicator slide and content
              panels fade in with a subtle blur dissolve.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card variant="outline">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track performance metrics here.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Place charts, KPIs, or data visualizations in this panel.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card variant="outline">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure your preferences.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Form fields and toggles pair well with chrome-layer cards.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell className="text-right">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}