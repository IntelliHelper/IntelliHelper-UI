import type { Metadata } from "next";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@intelli/ui";
import { Cluster, Stack } from "@intelli/ui/layout";
import { NativeCatalogGrid } from "../../../components/native-catalog-grid";
import { JsonLd } from "../../../components/json-ld";
import { PageHeader } from "../../../components/page-header";
import {
  NATIVE_CATALOG,
  NATIVE_DEFERRED,
} from "../../../lib/native-catalog";
import { webPageJsonLd } from "../../../lib/json-ld";
import { createPageMetadata, SITE_CONTENT_DATES } from "../../../lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = createPageMetadata({
  title: "React Native Components — Liquid Glass for iOS & Android",
  description:
    "Browse Intelli UI React Native components for Expo, iOS, and Android. Same Liquid Glass APIs as the web kit, StyleSheet tokens, and a live phone preview on this site.",
  path: "/native",
  keywords: [
    "react native liquid glass",
    "react native ui components",
    "expo glass ui",
    "intelli ui native",
    "ios android component library",
  ],
});

export default function NativeIndexPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "Intelli UI React Native components",
          description:
            "Liquid Glass React Native catalog for Expo, iOS, and Android.",
          path: "/native",
          type: "CollectionPage",
          datePublished: SITE_CONTENT_DATES.published,
          dateModified: SITE_CONTENT_DATES.modified,
        })}
      />
      <Stack gap={10} className="pb-8">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Native" },
          ]}
          meta={
            <Cluster gap={2}>
              <Badge variant="secondary" size="sm">
                {NATIVE_CATALOG.length} native
              </Badge>
              <Badge variant="outline" size="sm">
                Expo · iOS · Android
              </Badge>
            </Cluster>
          }
          title="React Native components"
          description="Liquid Glass for phones. These are not the web Tailwind files — they live in @intelli/ui-native and use View, Text, and Pressable. APIs mirror the web catalog so product UI stays consistent across Next.js and Expo."
          actions={
            <Cluster gap={2}>
              <Button asChild variant="primary" size="sm">
                <Link href="/native/button">Open Button</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/getting-started#native">Install native</Link>
              </Button>
            </Cluster>
          }
        />

        <Card variant="chrome" animated={false}>
          <CardHeader>
            <CardTitle className="text-base">Install with the CLI</CardTitle>
            <CardDescription>
              Same copy-paste flow as web. Files land in{" "}
              <code className="font-mono text-xs">@/components/ui</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-xl bg-[color-mix(in_oklch,var(--background)_50%,transparent)] p-4 font-mono text-xs text-foreground">
              {`npx @intellihelper/cli@latest init -y
npx @intellihelper/cli@latest add @native/button @native/card @native/dialog -y`}
            </pre>
          </CardContent>
        </Card>

        <NativeCatalogGrid />

        {NATIVE_DEFERRED.length > 0 ? (
          <Card variant="outline" animated={false}>
            <CardHeader>
              <CardTitle className="text-base">Web-only (not on native)</CardTitle>
              <CardDescription>
                These stay on the React catalog because they need hover, HTML, or
                desktop layout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {NATIVE_DEFERRED.map((item) => (
                  <li key={item.title}>
                    <span className="font-medium text-foreground">{item.title}</span>
                    {" — "}
                    {item.reason}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </Stack>
    </>
  );
}
