import { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  GlassBar,
  GlassBarControls,
  GlassBarInfo,
  GlassBarMedia,
  GlassContentCard,
  GlassContentPanel,
  GlassIconButton,
  Input,
  MarkdownViewer,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ScrollToTop,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  TypographyH1,
  TypographyLead,
  TypographyMuted,
  TypographyP,
  TypographySmall,
  useTheme,
  type DateRange,
} from "@intelli/ui-native";
import { Row, Section } from "./section";

export function PlaygroundScreen() {
  const { theme, colors, mode, toggleMode } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [offsetY, setOffsetY] = useState(0);

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [switched, setSwitched] = useState(true);
  const [radio, setRadio] = useState("a");
  const [progress, setProgress] = useState(42);
  const [slider, setSlider] = useState([35]);
  const [toggleOn, setToggleOn] = useState(false);
  const [toggleGroup, setToggleGroup] = useState<string | string[]>("day");
  const [selectValue, setSelectValue] = useState<string | undefined>("react");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(2);
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState("Ship glass UI on mobile…");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setOffsetY(e.nativeEvent.contentOffset.y);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />

      <View
        style={{
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.spacing[3],
          backgroundColor: colors.background,
        }}
      >
        <View style={{ flex: 1 }}>
          <TypographySmall style={{ color: colors.mutedForeground }}>
            @intelli/ui-native
          </TypographySmall>
          <TypographyH1 style={{ fontSize: 22, marginTop: 2 }}>
            Component Playground
          </TypographyH1>
        </View>
        <Button
          variant="outline"
          size="sm"
          onPress={toggleMode}
          accessibilityLabel="Toggle color mode"
        >
          {mode === "dark" ? "Light" : "Dark"}
        </Button>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            padding: theme.spacing[4],
            paddingBottom: theme.spacing[16],
          }}
        >
          <TypographyLead style={{ marginBottom: theme.spacing[6] }}>
            Live demos of the Intelli glass system on React Native / Expo.
          </TypographyLead>

          <Section title="Button" description="Variants, sizes, loading state">
            <Row>
              <Button variant="default">Default</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="glass">Glass</Button>
              <Button variant="link">Link</Button>
            </Row>
            <Row>
              <Button size="sm" shape="pill">
                Small pill
              </Button>
              <Button size="lg" shape="rectangular">
                Large
              </Button>
              <Button
                loading={loading}
                variant="primary"
                onPress={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1500);
                }}
              >
                Save
              </Button>
            </Row>
          </Section>

          <Section title="Card" description="Chrome, elevated, content, outline">
            <Card variant="chrome">
              <CardHeader>
                <CardTitle>Chrome card</CardTitle>
                <CardDescription>
                  Neutral frosted surface for UI chrome.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TypographyP style={{ marginBottom: 0 }}>
                  Cards compose header, content, and footer the same as web.
                </TypographyP>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="primary">
                  Action
                </Button>
              </CardFooter>
            </Card>
            <Card variant="content" gradient="#1a1a2e">
              <CardHeader>
                <CardTitle>Content card</CardTitle>
                <CardDescription>Saturated content layer.</CardDescription>
              </CardHeader>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <CardTitle>Outline</CardTitle>
                <CardDescription>Bordered surface.</CardDescription>
              </CardHeader>
            </Card>
          </Section>

          <Section title="Badge · Alert · Empty">
            <Row>
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="chrome">Chrome</Badge>
              <Badge variant="success">Success</Badge>
            </Row>
            <Alert variant="default">
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>
                Alerts use the same semantic variants as the web kit.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Something failed</AlertTitle>
              <AlertDescription>Check your connection and retry.</AlertDescription>
            </Alert>
            <Empty variant="chrome" style={{ minHeight: 160 }}>
              <EmptyMedia variant="icon">
                <TypographyH1 style={{ fontSize: 18 }}>∅</TypographyH1>
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No results</EmptyTitle>
                <EmptyDescription>
                  Try a different filter or create something new.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </Section>

          <Section title="Feedback" description="Skeleton, spinner, progress">
            <Row>
              <Skeleton width={120} height={16} />
              <Skeleton width={48} height={48} rounded="full" />
              <Spinner />
              <Spinner type="ring" variant="primary" />
              <Spinner type="dots" variant="chrome" />
              <Spinner type="bars" size="lg" />
              <Spinner type="pulse" variant="primary" size="lg" />
              <Spinner type="apple" variant="chrome" size="lg" />
            </Row>
            <Progress value={progress} />
            <Row>
              <Button
                size="sm"
                variant="outline"
                onPress={() => setProgress((p) => Math.max(0, p - 10))}
              >
                −10
              </Button>
              <TypographyMuted>{progress}%</TypographyMuted>
              <Button
                size="sm"
                variant="outline"
                onPress={() => setProgress((p) => Math.min(100, p + 10))}
              >
                +10
              </Button>
            </Row>
          </Section>

          <Section title="Forms" description="Input, textarea, select">
            <Input
              placeholder="Email"
              value={input}
              onChangeText={setInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input placeholder="Error state" state="error" />
            <Textarea
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
            />
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a stack" />
              </SelectTrigger>
              <SelectContent title="Framework">
                <SelectItem value="react">React Native</SelectItem>
                <SelectItem value="expo">Expo</SelectItem>
                <SelectItem value="next">Next.js</SelectItem>
              </SelectContent>
            </Select>
            <TypographyMuted>Selected: {selectValue ?? "none"}</TypographyMuted>
          </Section>

          <Section title="Controls" description="Switch, checkbox, radio, toggle, slider">
            <Row>
              <Switch checked={switched} onCheckedChange={setSwitched} />
              <TypographyMuted>{switched ? "On" : "Off"}</TypographyMuted>
              <Checkbox checked={checked} onCheckedChange={setChecked} />
              <TypographyMuted>{checked ? "Checked" : "Unchecked"}</TypographyMuted>
            </Row>
            <Row>
              <RadioGroup value={radio} onValueChange={setRadio}>
                <Row>
                  <RadioGroupItem value="a" />
                  <TypographyMuted>Option A</TypographyMuted>
                  <RadioGroupItem value="b" />
                  <TypographyMuted>Option B</TypographyMuted>
                  <RadioGroupItem value="c" />
                  <TypographyMuted>Option C</TypographyMuted>
                </Row>
              </RadioGroup>
            </Row>
            <Row>
              <Toggle pressed={toggleOn} onPressedChange={setToggleOn}>
                Bold
              </Toggle>
              <ToggleGroup
                type="single"
                value={toggleGroup}
                onValueChange={setToggleGroup}
              >
                <ToggleGroupItem value="day">Day</ToggleGroupItem>
                <ToggleGroupItem value="week">Week</ToggleGroupItem>
                <ToggleGroupItem value="month">Month</ToggleGroupItem>
              </ToggleGroup>
            </Row>
            <Slider
              value={slider}
              onValueChange={setSlider}
              min={0}
              max={100}
              step={1}
            />
            <TypographyMuted>Slider: {Math.round(slider[0] ?? 0)}</TypographyMuted>
          </Section>

          <Section title="Tabs · Accordion">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="a11y">A11y</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <TypographyP style={{ marginBottom: 0 }}>
                  Tabs keep the same compound API as the web package.
                </TypographyP>
              </TabsContent>
              <TabsContent value="api">
                <TypographyP style={{ marginBottom: 0 }}>
                  Controlled via value / onValueChange.
                </TypographyP>
              </TabsContent>
              <TabsContent value="a11y">
                <TypographyP style={{ marginBottom: 0 }}>
                  Roles and selected state wired for screen readers.
                </TypographyP>
              </TabsContent>
            </Tabs>

            <Accordion type="single" defaultValue="one" collapsible>
              <AccordionItem value="one">
                <AccordionTrigger>What is Intelli UI Native?</AccordionTrigger>
                <AccordionContent>
                  A React Native port of the Intelli glass design system with
                  StyleSheet tokens and ThemeProvider.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="two">
                <AccordionTrigger>Does glass blur work?</AccordionTrigger>
                <AccordionContent>
                  Yes when expo-blur is installed. Otherwise surfaces use
                  translucent solid fills.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          <Section title="Overlays" description="Dialog and Sheet">
            <Row>
              <Button variant="primary" onPress={() => setDialogOpen(true)}>
                Open dialog
              </Button>
              <Button variant="outline" onPress={() => setSheetOpen(true)}>
                Open sheet
              </Button>
            </Row>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm action</DialogTitle>
                  <DialogDescription>
                    This dialog mirrors the web compound component API.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onPress={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onPress={() => setDialogOpen(false)}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Bottom sheet</SheetTitle>
                  <SheetDescription>
                    Use sheets for mobile-first secondary flows.
                  </SheetDescription>
                </SheetHeader>
                <Button variant="primary" onPress={() => setSheetOpen(false)}>
                  Done
                </Button>
              </SheetContent>
            </Sheet>
          </Section>

          <Section title="Glass" description="Bar, icon button, content card">
            <GlassBar>
              <GlassBarMedia>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TypographySmall
                    style={{ color: colors.primaryForeground, fontWeight: "700" }}
                  >
                    IH
                  </TypographySmall>
                </View>
              </GlassBarMedia>
              <GlassBarInfo>
                <TypographySmall style={{ fontWeight: "600" }}>
                  Now playing
                </TypographySmall>
                <TypographyMuted>Intelli Helper Theme</TypographyMuted>
              </GlassBarInfo>
              <GlassBarControls>
                <GlassIconButton>‹</GlassIconButton>
                <GlassIconButton>›</GlassIconButton>
              </GlassBarControls>
            </GlassBar>

            <GlassContentCard gradient="#312e81">
              <GlassContentPanel>
                <TypographyH1 style={{ color: "#fff", fontSize: 22 }}>
                  Content first
                </TypographyH1>
                <TypographyMuted style={{ color: "rgba(255,255,255,0.75)" }}>
                  Saturated surface for hero media and CTAs.
                </TypographyMuted>
              </GlassContentPanel>
            </GlassContentCard>
          </Section>

          <Section title="Calendar">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(v) => setDate(v instanceof Date ? v : undefined)}
            />
            <TypographyMuted>
              Selected: {date ? date.toDateString() : "none"}
            </TypographyMuted>
            <Calendar
              mode="range"
              selected={range}
              onSelect={(v) =>
                setRange(v && !(v instanceof Date) ? v : undefined)
              }
            />
          </Section>

          <Section title="Pagination">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    disabled={page <= 1}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {[1, 2, 3].map((n) => (
                  <PaginationItem key={n}>
                    <PaginationLink
                      isActive={page === n}
                      onPress={() => setPage(n)}
                    >
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    disabled={page >= 3}
                    onPress={() => setPage((p) => Math.min(3, p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Section>

          <Section title="Markdown">
            <MarkdownViewer>{`# Hello Intelli

Native markdown viewer with **simple** parsing.

- Buttons
- Forms
- Overlays

\`\`\`
pnpm --filter native-playground dev
\`\`\`

> Glass on every platform.
`}</MarkdownViewer>
          </Section>

          <Separator style={{ marginVertical: theme.spacing[4] }} />
          <TypographyMuted style={{ textAlign: "center" }}>
            Scroll up for more · Mode: {mode}
          </TypographyMuted>
        </ScrollView>

        <ScrollToTop
          offsetY={offsetY}
          onPress={() =>
            scrollRef.current?.scrollTo({ y: 0, animated: true })
          }
        />
      </View>
    </SafeAreaView>
  );
}
