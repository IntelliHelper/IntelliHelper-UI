import { ImageResponse } from "next/og";
import { CATEGORY_META, getCatalogItem } from "../../../../lib/catalog";
import { OgImageLayout } from "../../../../lib/og-image";

export const alt = "Intelli UI component preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ComponentOpenGraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const item = getCatalogItem(slug);

  if (!item) {
    return new ImageResponse(
      (
        <OgImageLayout
          badge="Intelli UI"
          title="Component not found"
          subtitle="Browse the full Liquid Glass component library."
        />
      ),
      { ...size },
    );
  }

  const category = CATEGORY_META[item.category];

  return new ImageResponse(
    (
      <OgImageLayout
        badge={category.label}
        title={`${item.title} Component`}
        subtitle={item.description}
      />
    ),
    { ...size },
  );
}