import type { MetadataRoute } from "next";
import { BRAND_NAME, DEFAULT_DESCRIPTION, SITE_NAME } from "../lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} by ${BRAND_NAME}`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    lang: "en",
    categories: ["developer tools", "productivity", "utilities"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/intellihelper.png",
        sizes: "500x500",
        type: "image/png",
      },
    ],
  };
}