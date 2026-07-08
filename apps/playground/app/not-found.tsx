import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@intelli/ui";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist. Browse Intelli UI components or return to the homepage.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This component or page does not exist in the Intelli UI playground.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Browse components</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/getting-started">Getting started</Link>
        </Button>
      </div>
    </div>
  );
}