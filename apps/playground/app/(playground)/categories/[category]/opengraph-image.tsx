import { ImageResponse } from "next/og";
import {
  CATEGORY_META,
  getCategoryItems,
  isComponentCategory,
} from "../../../../lib/catalog";
import { OgImageLayout } from "../../../../lib/og-image";

export const alt = "Intelli UI category";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryOpenGraphImage({ params }: ImageProps) {
  const { category } = await params;

  if (!isComponentCategory(category)) {
    return new ImageResponse(
      (
        <OgImageLayout
          badge="Intelli UI"
          title="Category not found"
          subtitle="Browse the full Liquid Glass component library."
        />
      ),
      { ...size },
    );
  }

  const meta = CATEGORY_META[category];
  const count = getCategoryItems(category).length;

  return new ImageResponse(
    (
      <OgImageLayout
        badge="Category"
        title={`${meta.label} Components`}
        subtitle={`${meta.description} · ${count} components`}
      />
    ),
    { ...size },
  );
}
