import { confirm, input } from "@inquirer/prompts";
import { existsSync } from "node:fs";
import {
  configExists,
  createDefaultConfig,
  DEFAULT_NATIVE_REGISTRY_URL,
  writeConfig,
} from "../lib/config.js";
import { logger } from "../lib/logger.js";

type InitOptions = {
  cwd: string;
  yes?: boolean;
  native?: boolean;
};

export async function runInit(options: InitOptions): Promise<void> {
  const { cwd, yes, native } = options;

  if (configExists(cwd)) {
    const overwrite = yes
      ? true
      : await confirm({
          message: "components.json already exists. Overwrite?",
          default: false,
        });

    if (!overwrite) {
      logger.warn("Init cancelled.");
      return;
    }
  }

  const defaults = createDefaultConfig(
    native
      ? {
          platform: "native",
          style: "intelli-glass-native",
          rsc: false,
          registry: DEFAULT_NATIVE_REGISTRY_URL,
          tailwind: {
            config: "",
            css: "",
            baseColor: "neutral",
            cssVariables: false,
          },
        }
      : {},
  );

  const cssPath =
    native || yes || !process.stdin.isTTY
      ? defaults.tailwind?.css ?? "app/globals.css"
      : await input({
          message: "Where is your global CSS file?",
          default: defaults.tailwind?.css ?? "app/globals.css",
        });

  const utilsAlias =
    yes || !process.stdin.isTTY
      ? defaults.aliases.utils
      : await input({
          message: "Configure the import alias for utils:",
          default: defaults.aliases.utils,
        });

  const uiAlias =
    yes || !process.stdin.isTTY
      ? defaults.aliases.ui
      : await input({
          message: "Configure the import alias for UI components:",
          default: defaults.aliases.ui,
        });

  const rsc =
    native || yes || !process.stdin.isTTY
      ? Boolean(defaults.rsc)
      : await confirm({
          message: "Are you using React Server Components?",
          default: true,
        });

  const registry =
    yes || !process.stdin.isTTY
      ? defaults.registry
      : await input({
          message: "Registry URL:",
          default: defaults.registry,
        });

  if (!existsSync(cwd)) {
    throw new Error(`Directory does not exist: ${cwd}`);
  }

  const config = createDefaultConfig({
    rsc,
    registry,
    platform: native ? "native" : "web",
    style: native ? "intelli-glass-native" : defaults.style,
    tailwind: {
      ...defaults.tailwind,
      css: cssPath,
    },
    aliases: {
      ...defaults.aliases,
      utils: utilsAlias,
      ui: uiAlias,
    },
  });

  writeConfig(cwd, {
    ...config,
    platform: native ? "native" : config.platform ?? "web",
    registry: native ? DEFAULT_NATIVE_REGISTRY_URL : config.registry,
  });
  logger.success("Created components.json");
  logger.info(
    native
      ? "Add native components with: npx @intellihelper/cli add @native/button"
      : "Add web: npx @intellihelper/cli add button  ·  Native: npx @intellihelper/cli add @native/button",
  );
}