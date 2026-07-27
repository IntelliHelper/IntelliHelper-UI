"use client";

import { Suspense } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@intelli/ui/empty";
import { Skeleton } from "@intelli/ui/skeleton";
import { DocWorkspace } from "./doc-workspace";
import { getExamples } from "../lib/examples";

type ComponentExamplesProps = {
  slug: string;
};

function PreviewFallback() {
  return (
    <div className="flex min-h-[10rem] items-center justify-center p-6" aria-hidden>
      <Skeleton className="h-24 w-full max-w-md rounded-2xl" />
    </div>
  );
}

export function ComponentExamples({ slug }: ComponentExamplesProps) {
  const examples = getExamples(slug);

  if (examples.length === 0) {
    return (
      <Empty variant="outline" animated={false} className="py-14">
        <EmptyHeader>
          <EmptyTitle>Examples coming soon</EmptyTitle>
          <EmptyDescription>
            Live previews for this component are still being prepared. You can
            still install it with the CLI above.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {examples.map((example) => (
        <DocWorkspace
          key={example.title}
          title={example.title}
          description={example.description}
          preview={
            <Suspense fallback={<PreviewFallback />}>{example.preview}</Suspense>
          }
          code={example.code}
        />
      ))}
    </div>
  );
}
