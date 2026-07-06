"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Skeleton,
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

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

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

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Alerts</h3>
          <p className="text-sm glass-chrome-text-muted">
            Status feedback with semantic tints and optional leading icons.
          </p>
        </div>
        <div className="grid gap-3">
          <Alert>
            <InfoIcon />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              New invoice templates are available in your workspace settings.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangleIcon />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>
              We could not process your last transaction. Update your billing
              method to retry.
            </AlertDescription>
          </Alert>
          <Alert variant="success">
            <CheckCircleIcon />
            <AlertTitle>Invoice sent</AlertTitle>
            <AlertDescription>
              INV-004 was delivered to the customer inbox successfully.
            </AlertDescription>
          </Alert>
          <Alert variant="chrome">
            <InfoIcon />
            <AlertTitle>Chrome alert</AlertTitle>
            <AlertDescription>
              Frosted glass surface for inline notices inside chrome panels.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Loading state</h3>
          <p className="text-sm glass-chrome-text-muted">
            Skeleton placeholders pulse with glass chrome while data loads.
          </p>
        </div>
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
            {Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-14" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Empty state</h3>
          <p className="text-sm glass-chrome-text-muted">
            Compound empty layout for zero-result views inside chrome cards.
          </p>
        </div>
        <Card variant="outline">
          <CardContent className="pt-6">
            <Empty variant="outline" animated={false}>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon />
                </EmptyMedia>
                <EmptyTitle>No invoices found</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your filters or create a new invoice to get
                  started.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm">Create invoice</Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Data table</h3>
          <p className="text-sm glass-chrome-text-muted">
            Live rows with glass pagination controls below.
          </p>
        </div>
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}