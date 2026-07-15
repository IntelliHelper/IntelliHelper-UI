import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

export type McpClient = "claude" | "cursor" | "vscode" | "codex" | "opencode";

/** MCP server key used in client configs (Cursor, Claude, Grok, etc.) */
export const MCP_SERVER_NAME = "intellihelper-ui";

export const MCP_CLIENTS: {
  name: McpClient;
  label: string;
  configPath: string;
}[] = [
  { name: "claude", label: "Claude Code", configPath: ".mcp.json" },
  { name: "cursor", label: "Cursor", configPath: ".cursor/mcp.json" },
  { name: "vscode", label: "VS Code", configPath: ".vscode/mcp.json" },
  { name: "codex", label: "Codex", configPath: ".codex/config.toml" },
  { name: "opencode", label: "OpenCode", configPath: "opencode.json" },
];

const SERVER_ENTRY = {
  command: "npx",
  args: ["-y", "@intellihelper/cli@latest", "mcp"],
};

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(
        target[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}

function buildJsonConfig(client: McpClient): Record<string, unknown> {
  switch (client) {
    case "claude":
    case "cursor":
      return {
        mcpServers: {
          [MCP_SERVER_NAME]: SERVER_ENTRY,
        },
      };
    case "vscode":
      return {
        servers: {
          [MCP_SERVER_NAME]: SERVER_ENTRY,
        },
      };
    case "opencode":
      return {
        $schema: "https://opencode.ai/config.json",
        mcp: {
          [MCP_SERVER_NAME]: {
            type: "local",
            command: ["npx", "-y", "@intellihelper/cli@latest", "mcp"],
            enabled: true,
          },
        },
      };
    default:
      return {};
  }
}

export function getCodexInstructions(): string {
  return [
    "To configure the IntelliHelper UI MCP server in Codex:",
    "",
    "1. Open or create ~/.codex/config.toml",
    "2. Add the following:",
    "",
    `[mcp_servers.${MCP_SERVER_NAME}]`,
    'command = "npx"',
    'args = ["-y", "@intellihelper/cli@latest", "mcp"]',
    "",
    "3. Restart Codex to load the MCP server",
  ].join("\n");
}

export type InitResult =
  | { kind: "written"; path: string }
  | { kind: "instructions"; text: string };

export function runMcpInit(options: {
  client: McpClient;
  cwd: string;
}): InitResult {
  const { client, cwd } = options;
  const clientInfo = MCP_CLIENTS.find((c) => c.name === client);
  if (!clientInfo) {
    throw new Error(
      `Unknown client: ${client}. Available: ${MCP_CLIENTS.map((c) => c.name).join(", ")}`,
    );
  }

  if (client === "codex") {
    return { kind: "instructions", text: getCodexInstructions() };
  }

  const configPath = join(cwd, clientInfo.configPath);
  const dir = dirname(configPath);
  mkdirSync(dir, { recursive: true });

  let existing: Record<string, unknown> = {};
  if (existsSync(configPath)) {
    try {
      existing = JSON.parse(readFileSync(configPath, "utf8")) as Record<
        string,
        unknown
      >;
    } catch {
      existing = {};
    }
  }

  const next = deepMerge(existing, buildJsonConfig(client));
  writeFileSync(configPath, `${JSON.stringify(next, null, 2)}\n`);

  return { kind: "written", path: clientInfo.configPath };
}
