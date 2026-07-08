"use client";

import { DocWorkspace } from "./doc-workspace";
import { getExamples } from "../lib/examples";

type ComponentExamplesProps = {
  slug: string;
};

export function ComponentExamples({ slug }: ComponentExamplesProps) {
  const examples = getExamples(slug);

  if (examples.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--glass-chrome-border)] px-6 py-12 text-center text-sm text-muted-foreground">
        Examples for this component are coming soon.
      </p>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {examples.map((example) => (
        <DocWorkspace
          key={example.title}
          title={example.title}
          description={example.description}
          preview={example.preview}
          code={example.code}
        />
      ))}
    </div>
  );
}