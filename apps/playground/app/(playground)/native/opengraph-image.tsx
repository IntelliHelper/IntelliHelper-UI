import { ImageResponse } from "next/og";
import { OgImageLayout } from "../../../lib/og-image";

export const alt = "Intelli UI React Native components";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function NativeOpenGraphImage() {
  return new ImageResponse(
    (
      <OgImageLayout
        badge="React Native"
        title="Liquid Glass for iOS & Android"
        subtitle="Same APIs as the web kit. Expo, StyleSheet, phones."
      />
    ),
    { ...size },
  );
}
