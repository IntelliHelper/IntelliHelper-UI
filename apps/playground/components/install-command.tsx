"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@intelli/ui";

type InstallCommandProps = {
  slug: string;
};

export function InstallCommand({ slug }: InstallCommandProps) {
  const command = `npx @intellihelper/cli@latest add ${slug}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [command]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_18%,transparent)] px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Install
      </span>
      <code className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
        {command}
      </code>
      <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}