import { ImageResponse } from "next/og";
import { OgImageLayout } from "../lib/og-image";
import { SITE_NAME } from "../lib/seo";

export const alt = `${SITE_NAME} — Liquid Glass component library for React and Next.js`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgImageLayout
        badge="IntelliHelper"
        title={SITE_NAME}
        subtitle="Liquid Glass components for React, Next.js, and Tailwind CSS."
      />
    ),
    { ...size },
  );
}