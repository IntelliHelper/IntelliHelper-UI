"use client";

import dynamic from "next/dynamic";

/** Client boundary so we can ssr:false without making the shell a client component. */
export const ScrollToTopLazy = dynamic(
  () => import("@intelli/ui/scroll-to-top").then((m) => m.ScrollToTop),
  { ssr: false },
);
