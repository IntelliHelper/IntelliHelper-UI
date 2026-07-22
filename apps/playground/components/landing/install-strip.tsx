"use client";

import { CopyButton } from "@intelli/ui";
import { cn } from "@intelli/utils";

type InstallStripProps = {
  command?: string;
  className?: string;
};

export function InstallStrip({
  command = "npx @intellihelper/cli@latest init",
  className,
}: InstallStripProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-xl items-center gap-3 rounded-2xl border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)] px-3 py-2.5 shadow-[var(--glass-chrome-shadow)] backdrop-blur-md sm:px-4",
        className,
      )}
    >
      <span
        className="hidden shrink-0 font-mono text-[11px] font-medium text-muted-foreground sm:inline"
        aria-hidden
      >
        $
      </span>
      <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground sm:text-sm">
        {command}
      </code>
      <CopyButton value={command} size="sm" variant="outline" />
    </div>
  );
}
