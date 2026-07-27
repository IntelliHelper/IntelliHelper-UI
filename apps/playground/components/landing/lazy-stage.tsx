"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { StagePlaceholder } from "./stage-shell";

type LazyStageProps = {
  /** Dynamic import that resolves to a default or named stage component */
  load: () => Promise<{ default: ComponentType } | ComponentType>;
  fallback?: ReactNode;
  rootMargin?: string;
};

function resolveComponent(
  mod: { default: ComponentType } | ComponentType,
): ComponentType {
  if (typeof mod === "function") return mod;
  return mod.default;
}

/**
 * Defer mounting (and thus downloading) of heavy live demos until near
 * viewport. Preserves premium UI once loaded; protects mobile LCP/TBT.
 */
export function LazyStage({
  load,
  fallback,
  rootMargin = "280px 0px",
}: LazyStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [Stage, setStage] = useState<ComponentType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const startLoad = () => {
      void load()
        .then((mod) => {
          if (!cancelled) setStage(() => resolveComponent(mod));
        })
        .catch(() => {
          /* keep placeholder on failure */
        });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        // Prefer idle time so first paint / input stay free on mobile
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(startLoad, { timeout: 1200 });
        } else {
          timeoutId = setTimeout(startLoad, 80);
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [load, rootMargin]);

  return (
    <div ref={ref}>
      {Stage ? <Stage /> : (fallback ?? <StagePlaceholder />)}
    </div>
  );
}
