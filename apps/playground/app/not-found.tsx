import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@intelli/ui";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist. Browse Intelli UI components or return to the homepage.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4">
      <Empty variant="chrome" animated={false} className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <span className="text-sm font-semibold tabular-nums">404</span>
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            This component or page is not in the Intelli UI playground. Check the
            URL or head back to the catalog.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="primary">
              <Link href="/components">Browse components</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/getting-started">Getting started</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
