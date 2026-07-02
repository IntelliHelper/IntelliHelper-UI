"use client";

import {
  Badge,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@intelli/ui";

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
      {initials}
    </span>
  );
}

export function SheetHoverCardDemo() {
  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Sheet</p>
        <p className="text-xs text-muted-foreground">
          Slide-in glass panels from any edge with frosted overlay
        </p>
        <div className="flex flex-wrap gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open right</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile. Click save when you are done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <label htmlFor="sheet-name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input id="sheet-name" defaultValue="Adeeb Mirza" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="sheet-email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="sheet-email" defaultValue="adeeb@intelli.dev" />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button>Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Elevated left</Button>
            </SheetTrigger>
            <SheetContent side="left" variant="elevated" size="lg">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Elevated variant with a softer frosted surface.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2 py-2">
                {["Dashboard", "Projects", "Settings", "Help"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[color-mix(in_oklch,var(--foreground)_6%,transparent)]"
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">Bottom sheet</Button>
            </SheetTrigger>
            <SheetContent side="bottom" variant="outline" size="sm">
              <SheetHeader>
                <SheetTitle>Quick actions</SheetTitle>
                <SheetDescription>
                  Outline variant sliding up from the bottom edge.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-wrap gap-2 py-2">
                <Button size="sm">Share</Button>
                <Button size="sm" variant="outline">
                  Copy link
                </Button>
                <Button size="sm" variant="ghost">
                  Archive
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Hover Card</p>
        <p className="text-xs text-muted-foreground">
          Rich contextual previews on hover with spring scale-in
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <button
                type="button"
                className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
              >
                @adeebmirza
              </button>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex gap-3">
                <UserAvatar name="Adeeb Mirza" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Adeeb Mirza</p>
                  <p className="text-xs text-muted-foreground">
                    Building Liquid Glass interfaces at Intelli UI.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="secondary">Design</Badge>
                    <span className="text-xs text-muted-foreground">
                      Joined Jan 2024
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard openDelay={150}>
            <HoverCardTrigger asChild>
              <Button variant="outline" size="sm">
                Preview project
              </Button>
            </HoverCardTrigger>
            <HoverCardContent variant="elevated" size="lg" side="top">
              <div className="space-y-2">
                <p className="font-semibold">Intelli UI Registry</p>
                <p className="text-muted-foreground">
                  A shadcn-compatible component registry with frosted glass
                  surfaces, spring animations, and adaptive chrome layers.
                </p>
                <div className="flex gap-2 pt-1">
                  <Badge>React 19</Badge>
                  <Badge variant="outline">Tailwind v4</Badge>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[color-mix(in_oklch,var(--foreground)_6%,transparent)]"
              >
                <UserAvatar name="Sam Lee" />
                <span className="font-medium">Sam Lee</span>
              </button>
            </HoverCardTrigger>
            <HoverCardContent variant="outline" size="sm" align="start">
              <p className="font-medium">Sam Lee</p>
              <p className="mt-1 text-muted-foreground">
                Product designer · 12 mutual connections
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}