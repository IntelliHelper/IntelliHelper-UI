import { DEFAULT_NATIVE_REGISTRY_URL } from "./config.js";

export type ComponentPlatform = "web" | "native";

export type ComponentSpec = {
  /** Canonical CLI name, e.g. `button` or `@native/button`. */
  key: string;
  /** Registry item name without namespace. */
  name: string;
  platform: ComponentPlatform;
};

/** `@native/button`, `native/button`, and `native@button` all mean native button. */
export function parseComponentSpec(
  raw: string,
  defaultPlatform: ComponentPlatform = "web",
): ComponentSpec {
  const trimmed = raw.trim();

  if (trimmed.startsWith("@native/")) {
    return nativeSpec(trimmed.slice("@native/".length));
  }
  if (trimmed.startsWith("native/")) {
    return nativeSpec(trimmed.slice("native/".length));
  }
  if (trimmed.startsWith("native@")) {
    return nativeSpec(trimmed.slice("native@".length));
  }

  if (defaultPlatform === "native") {
    return nativeSpec(trimmed);
  }

  return { key: trimmed, name: trimmed, platform: "web" };
}

function nativeSpec(name: string): ComponentSpec {
  if (!name) {
    throw new Error(
      'Missing component name after @native/. Example: npx @intellihelper/cli add @native/button',
    );
  }
  return { key: `@native/${name}`, name, platform: "native" };
}

export function registryUrlFor(
  spec: ComponentSpec,
  webRegistryUrl?: string,
): string | undefined {
  return spec.platform === "native" ? DEFAULT_NATIVE_REGISTRY_URL : webRegistryUrl;
}
