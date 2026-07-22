"use client";

import { CopyButton } from "@intelli/ui";
import { cn } from "@intelli/utils";

type InstallCommandProps = {
  slug: string;
  className?: string;
};

export function InstallCommand({ slug, className }: InstallCommandProps) {
  const command = `npx @intellihelper/cli@latest add ${slug}`;

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-xl border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-surface-fill)_18%,transparent)] px-3 py-2.5 sm:px-4",
        className,
      )}
    >
      <span className="hidden shrink-0 text-[11px] font-medium text-muted-foreground sm:inline">
        Install
      </span>
      <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground sm:text-sm">
        {command}
      </code>
      <CopyButton value={command} size="sm" variant="outline" />
    </div>
  );
}
