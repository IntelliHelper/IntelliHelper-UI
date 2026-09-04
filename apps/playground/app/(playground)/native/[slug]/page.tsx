import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@intelli/ui";
import { Cluster, Container, Stack } from "@intelli/ui/layout";
import { InstallCommand } from "../../../../components/install-command";
import { JsonLd } from "../../../../components/json-ld";
import { NativePreview } from "../../../../components/native-preview";
import { PageHeader } from "../../../../components/page-header";
import {
  NATIVE_CATALOG,
  NATIVE_CATEGORY_META,
  NATIVE_PACKAGE,
  getNativeItem,
} from "../../../../lib/native-catalog";
import { getNativeUsage } from "../../../../lib/native-usage";
import { webPageJsonLd } from "../../../../lib/json-ld";
import { createPageMetadata, GITHUB_URL } from "../../../../lib/seo";
import { getCatalogItem } from "../../../../lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return NATIVE_CATALOG.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getNativeItem(slug);
  if (!item) {
    return { title: "Native component not found", robots: { index: false } };
  }
  return createPageMetadata({
    title: `${item.title} — React Native`,
    description: `${item.description} Intelli UI native component for Expo, iOS, and Android.`,
    path: `/native/${item.slug}`,
    keywords: [
      `react native ${item.title}`,
      "intelli ui native",
      "expo liquid glass",
    ],
    imagePath: `/native/${item.slug}/opengraph-image`,
    imageAlt: `${item.title} React Native component`,
  });
}

export default async function NativeComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getNativeItem(slug);
  if (!item) notFound();

  const category = NATIVE_CATEGORY_META[item.category];
  const webTwin = getCatalogItem(item.slug);
  const usage = getNativeUsage(item);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: `${item.title} React Native`,
          description: item.description,
          path: `/native/${item.slug}`,
          type: "TechArticle",
        })}
      />
      <Container as="article" size="xl" padded={false} className="min-w-0 max-w-6xl pb-8">
        <PageHeader
          className="mb-8"
          breadcrumbs={[
            { label: "Native", href: "/native" },
            { label: category.label, href: "/native" },
            { label: item.title },
          ]}
          meta={
            <Cluster gap={2}>
              <Badge variant="secondary" size="sm">
                React Native
              </Badge>
              <Badge variant="outline" size="sm">
                {category.label}
              </Badge>
            </Cluster>
          }
          title={item.title}
          description={
            <>
              {item.description} Import from{" "}
              <code className="font-mono text-xs">{NATIVE_PACKAGE}</code>. Use{" "}
              <code className="font-mono text-xs">onPress</code> and{" "}
              <code className="font-mono text-xs">style</code> instead of DOM
              events and className.
            </>
          }
          actions={
            webTwin ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/components/${webTwin.slug}`}>Web version</Link>
              </Button>
            ) : undefined
          }
        />

        <div className="mb-8">
          <InstallCommand
            command={`npx @intellihelper/cli@latest add @native/${item.slug}`}
            label="Install"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
          <Stack gap={6}>
            <Card variant="chrome" animated={false}>
              <CardHeader>
                <CardTitle className="text-base">Usage</CardTitle>
                <CardDescription>
                  From an Expo or React Native app, wrap the tree in{" "}
                  <code className="font-mono text-xs">ThemeProvider</code>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-xl bg-[color-mix(in_oklch,var(--background)_55%,transparent)] p-4 font-mono text-[12px] leading-relaxed text-foreground">
                  {usage}
                </pre>
              </CardContent>
            </Card>

            <Card variant="outline" animated={false}>
              <CardHeader>
                <CardTitle className="text-base">Platform notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  This component is implemented in{" "}
                  <code className="font-mono text-xs text-foreground">
                    packages/ui-native
                  </code>
                  . Preview it on a device with{" "}
                  <code className="font-mono text-xs text-foreground">
                    pnpm native
                  </code>{" "}
                  from the monorepo (Expo Go).
                </p>
                <p>
                  Optional peers:{" "}
                  <code className="font-mono text-xs">expo-blur</code> for real
                  frost,{" "}
                  <code className="font-mono text-xs">
                    react-native-safe-area-context
                  </code>{" "}
                  for sheet/dialog insets.
                </p>
                <p>
                  Source:{" "}
                  <a
                    href={`${GITHUB_URL}/tree/main/packages/ui-native/src/components`}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ui-native components on GitHub
                  </a>
                </p>
              </CardContent>
            </Card>
          </Stack>

          <NativePreview
            slug={item.slug}
            title={item.title}
            category={item.category}
          />
        </div>
      </Container>
    </>
  );
}
