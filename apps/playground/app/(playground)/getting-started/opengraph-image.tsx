import { ImageResponse } from "next/og";
import { OgImageLayout } from "../../../lib/og-image";

export const alt = "Getting started with Intelli UI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function GettingStartedOpenGraphImage() {
  return new ImageResponse(
    (
      <OgImageLayout
        badge="Docs"
        title="Getting started"
        subtitle="Install Liquid Glass components with the CLI, agent plugin, or MCP."
      />
    ),
    { ...size },
  );
}
