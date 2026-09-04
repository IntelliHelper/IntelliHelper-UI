"use client";

import { CopyButton } from "@intelli/ui";
import { Flex } from "@intelli/ui/layout";
import { cn } from "@intelli/utils";

type InstallCommandProps = {
  slug?: string;
  command?: string;
  label?: string;
  className?: string;
};

export function InstallCommand({
  slug,
  command: commandProp,
  label = "Install",
  className,
}: InstallCommandProps) {
  const command =
    commandProp ??
    `npx @intellihelper/cli@latest add ${slug ?? ""}`;

  return (
    <Flex
      align="center"
      gap={3}
      className={cn(
        "min-w-0 rounded-xl border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%,transparent)] px-3 py-2.5 backdrop-blur-[var(--glass-blur)] sm:px-4",
        className,
      )}
    >
      <span className="hidden shrink-0 text-[11px] font-medium text-muted-foreground sm:inline">
        {label}
      </span>
      <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground sm:text-sm">
        {command}
      </code>
      <CopyButton value={command} size="sm" variant="outline" />
    </Flex>
  );
}
