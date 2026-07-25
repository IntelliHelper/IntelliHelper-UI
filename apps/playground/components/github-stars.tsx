"use client";

import { useEffect, useState } from "react";
import { GITHUB_URL } from "../lib/seo";

type GithubStarsProps = {
  className?: string;
  /** Show compact “★ N” only */
  compact?: boolean;
};

function formatStars(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  }
  return String(count);
}

/**
 * Client fetch of public stargazer count (no token). Fails soft when offline.
 */
export function GithubStars({ className, compact = false }: GithubStarsProps) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/IntelliHelper/IntelliHelper-UI",
          {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller.signal,
          },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { stargazers_count?: number };
        if (!cancelled && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      } catch {
        // Ignore network / rate-limit — badge is progressive enhancement.
      }
    }

    void load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  if (stars === null) {
    return (
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {compact ? "GitHub" : "Star on GitHub"}
      </a>
    );
  }

  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`${stars} GitHub stars`}
    >
      {compact ? (
        <>
          <span aria-hidden>★</span> {formatStars(stars)}
        </>
      ) : (
        <>
          <span aria-hidden>★</span> {formatStars(stars)} stars on GitHub
        </>
      )}
    </a>
  );
}
