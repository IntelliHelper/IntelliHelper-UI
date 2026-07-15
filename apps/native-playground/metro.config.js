const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Watch the monorepo so workspace packages hot-reload.
config.watchFolders = [monorepoRoot];

// Resolve modules from the app first, then the monorepo root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Avoid pulling duplicate React / RN copies from nested workspace packages.
config.resolver.disableHierarchicalLookup = true;

// Force singleton resolution for packages that break when duplicated.
const singletonPackages = [
  "react",
  "react-dom",
  "react-native",
  "react-native-web",
  "expo",
  "expo-modules-core",
  "expo-blur",
  "react-native-safe-area-context",
];

config.resolver.extraNodeModules = Object.fromEntries(
  singletonPackages.map((name) => {
    try {
      return [name, path.dirname(require.resolve(`${name}/package.json`))];
    } catch {
      return [name, path.resolve(monorepoRoot, "node_modules", name)];
    }
  }),
);

module.exports = config;
