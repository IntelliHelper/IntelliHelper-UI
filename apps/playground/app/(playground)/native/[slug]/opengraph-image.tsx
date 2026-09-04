import { ImageResponse } from "next/og";
import { getNativeItem, NATIVE_CATEGORY_META } from "../../../../lib/native-catalog";
import { OgImageLayout } from "../../../../lib/og-image";

export const alt = "Intelli UI native component";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NativeComponentOg({ params }: ImageProps) {
  const { slug } = await params;
  const item = getNativeItem(slug);

  if (!item) {
    return new ImageResponse(
      (
        <OgImageLayout
          badge="React Native"
          title="Component not found"
          subtitle="Browse the native Liquid Glass catalog."
        />
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <OgImageLayout
        badge={NATIVE_CATEGORY_META[item.category].label}
        title={`${item.title} · Native`}
        subtitle={item.description}
      />
    ),
    { ...size },
  );
}
