import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type {
  FileUpdatePlan,
  FileUpdateStatus,
  IntelliConfig,
  Registry,
  RegistryItem,
  ResolvedPaths,
} from "../types.js";
import { hashContent } from "./hash.js";
import { logger } from "./logger.js";
import {
  createInstalledRecord,
  readManifest,
  recordInstalledComponent,
} from "./manifest.js";
import { resolveTargetPath } from "./paths.js";
import { getRegistryUrl } from "./registry.js";
import { transformImports } from "./transform.js";

/**
 * npm package name with optional version/tag/range.
 * Rejects URLs, paths, and shell metacharacters so registry JSON cannot inject commands.
 */
const NPM_PACKAGE_SPEC =
  /^(?:@[a-z0-9][\w.~-]*\/)?[a-z0-9][\w.~-]*(?:@[\w.^~>=<*|\s-]+)?$/i;

type PackageManager = {
  command: string;
  args: string[];
};

function assertSafePackageSpecs(deps: string[]): string[] {
  for (const dep of deps) {
    if (
      typeof dep !== "string" ||
      dep.length === 0 ||
      dep.length > 214 ||
      !NPM_PACKAGE_SPEC.test(dep)
    ) {
      throw new Error(
        `Refusing to install unsafe package specifier from registry: ${JSON.stringify(dep)}`,
      );
    }
  }
  return deps;
}

function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(`${cwd}/pnpm-lock.yaml`)) {
    return { command: "pnpm", args: ["add"] };
  }
  if (existsSync(`${cwd}/yarn.lock`)) {
    return { command: "yarn", args: ["add"] };
  }
  if (existsSync(`${cwd}/bun.lockb`) || existsSync(`${cwd}/bun.lock`)) {
    return { command: "bun", args: ["add"] };
  }
  return { command: "npm", args: ["install"] };
}

export type InstallOptions = {
  cwd: string;
  config: IntelliConfig;
  paths: ResolvedPaths;
  registry: Registry;
  overwrite?: boolean;
  yes?: boolean;
  dryRun?: boolean;
};

export type UpdateOptions = InstallOptions & {
  skipModified?: boolean;
  onModifiedFile?: (plan: FileUpdatePlan) => Promise<"overwrite" | "skip" | "abort">;
};

function getFileContent(item: RegistryItem, filePath: string): string {
  const file = item.files.find((entry) => entry.path === filePath);
  if (!file?.content) {
    throw new Error(`Missing content for ${filePath} in ${item.name}`);
  }
  return file.content;
}

function prepareFileContent(
  item: RegistryItem,
  filePath: string,
  target: string,
  config: IntelliConfig,
): string {
  const raw = getFileContent(item, filePath);
  return transformImports(raw, config);
}

export function buildInstallPlans(
  item: RegistryItem,
  options: InstallOptions,
): FileUpdatePlan[] {
  const { config, paths, cwd } = options;
  const manifest = readManifest(cwd);
  const installed = manifest.components[item.name];

  return item.files.map((file) => {
    const absolutePath = resolveTargetPath(file.target, paths, config);
    const nextContent = prepareFileContent(item, file.path, file.target, config);
    const targetPath = file.target;

    if (!existsSync(absolutePath)) {
      return {
        component: item.name,
        targetPath,
        absolutePath,
        status: "new" as FileUpdateStatus,
        nextContent,
      };
    }

    const currentContent = readFileSync(absolutePath, "utf8");
    const currentHash = hashContent(currentContent);
    const nextHash = hashContent(nextContent);
    const storedHash = installed?.files.find((entry) => entry.path === targetPath)?.hash;

    if (currentHash === nextHash) {
      return {
        component: item.name,
        targetPath,
        absolutePath,
        status: "unchanged",
        currentContent,
        nextContent,
      };
    }

    if (storedHash && currentHash !== storedHash) {
      return {
        component: item.name,
        targetPath,
        absolutePath,
        status: "modified",
        currentContent,
        nextContent,
      };
    }

    return {
      component: item.name,
      targetPath,
      absolutePath,
      status: "update-available",
      currentContent,
      nextContent,
    };
  });
}

export async function applyPlans(
  item: RegistryItem,
  plans: FileUpdatePlan[],
  options: UpdateOptions,
): Promise<boolean> {
  const { cwd, config, overwrite, yes, skipModified, onModifiedFile, dryRun } =
    options;

  let aborted = false;

  for (const plan of plans) {
    if (plan.status === "unchanged") {
      continue;
    }

    if (plan.status === "modified" && !overwrite) {
      if (skipModified) {
        logger.warn(`Skipped ${plan.targetPath} (local modifications detected).`);
        continue;
      }

      if (onModifiedFile) {
        const choice = await onModifiedFile(plan);
        if (choice === "abort") {
          aborted = true;
          break;
        }
        if (choice === "skip") {
          logger.warn(`Skipped ${plan.targetPath} (kept local changes).`);
          continue;
        }
      } else if (!yes) {
        logger.warn(`Skipped ${plan.targetPath} (local modifications detected).`);
        continue;
      } else {
        logger.warn(
          `Overwriting ${plan.targetPath} — local changes will be lost.`,
        );
      }
    }

    if (plan.status === "new") {
      if (!dryRun) {
        mkdirSync(dirname(plan.absolutePath), { recursive: true });
        writeFileSync(plan.absolutePath, plan.nextContent);
      }
      logger.success(`${dryRun ? "[dry-run] Would create" : "Created"} ${plan.targetPath}`);
      continue;
    }

    if (plan.status === "update-available" || plan.status === "modified") {
      if (!dryRun) {
        writeFileSync(plan.absolutePath, plan.nextContent);
      }
      logger.success(
        `${dryRun ? "[dry-run] Would update" : "Updated"} ${plan.targetPath}`,
      );
    }
  }

  if (aborted) {
    return false;
  }

  if (!dryRun) {
    const installedFiles = item.files.map((file) => {
      const absolutePath = resolveTargetPath(file.target, options.paths, config);
      const content = existsSync(absolutePath)
        ? readFileSync(absolutePath, "utf8")
        : prepareFileContent(item, file.path, file.target, config);

      return {
        path: file.target,
        content,
      };
    });

    const manifest = readManifest(cwd);
    recordInstalledComponent(
      cwd,
      getRegistryUrl(config.registry),
      createInstalledRecord(
        item.name,
        installedFiles,
        item.dependencies,
        item.registryDependencies,
        manifest.components[item.name],
      ),
    );
  }

  return true;
}

export function installDependencies(
  item: RegistryItem,
  cwd: string,
  dryRun?: boolean,
): void {
  const deps = assertSafePackageSpecs(item.dependencies ?? []);
  if (deps.length === 0) {
    return;
  }

  const packageManager = detectPackageManager(cwd);
  const args = [...packageManager.args, ...deps];
  const displayCmd = `${packageManager.command} ${args.join(" ")}`;

  if (dryRun) {
    logger.info(`[dry-run] Would run: ${displayCmd}`);
    return;
  }

  logger.info(`Installing dependencies: ${deps.join(", ")}`);
  // shell: false + argv array — dependency names never reach a shell.
  const result = spawnSync(packageManager.command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `Failed to install dependencies (exit ${result.status ?? "unknown"}): ${displayCmd}`,
    );
  }
}