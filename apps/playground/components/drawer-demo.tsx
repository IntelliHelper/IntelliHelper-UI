"use client";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
} from "@intelli/ui";

export function DrawerDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Open bottom</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Drag the handle or tap the overlay to dismiss.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <label htmlFor="drawer-name" className="text-sm font-medium">
                Name
              </label>
              <Input id="drawer-name" defaultValue="Adeeb Mirza" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="drawer-email" className="text-sm font-medium">
                Email
              </label>
              <Input id="drawer-email" defaultValue="adeeb@intelli.dev" />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button>Save changes</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="secondary">Elevated right</Button>
        </DrawerTrigger>
        <DrawerContent variant="elevated" size="lg" showClose>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>
              Side drawer with a close control and drag-to-dismiss.
            </DrawerDescription>
          </DrawerHeader>
          <nav className="flex flex-col gap-2 py-2">
            {["All", "Active", "Archived", "Shared"].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[color-mix(in_oklch,var(--foreground)_6%,transparent)]"
              >
                {item}
              </button>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>

      <Drawer snapPoints={[0.3, 0.6, 1]} fadeFromIndex={1}>
        <DrawerTrigger asChild>
          <Button variant="ghost">Snap points</Button>
        </DrawerTrigger>
        <DrawerContent variant="outline" size="full">
          <DrawerHeader>
            <DrawerTitle>Comments</DrawerTitle>
            <DrawerDescription>
              Drag between snap points. Outline surface on the bottom edge.
            </DrawerDescription>
          </DrawerHeader>
          <ul className="grid gap-3 py-2 text-sm">
            <li>
              <p className="font-medium">Sam Lee</p>
              <p className="text-muted-foreground">Looks great on mobile.</p>
            </li>
            <li>
              <p className="font-medium">Jordan Patel</p>
              <p className="text-muted-foreground">
                The handle makes the gesture obvious.
              </p>
            </li>
            <li>
              <p className="font-medium">Riley Chen</p>
              <p className="text-muted-foreground">Snap points feel native.</p>
            </li>
          </ul>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
