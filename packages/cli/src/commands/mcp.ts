import { select } from "@inquirer/prompts";
import { Command } from "commander";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { logger } from "../lib/logger.js";
import { createMcpServer } from "../mcp/server.js";
import {
  MCP_CLIENTS,
  runMcpInit,
  type McpClient,
} from "../mcp/init.js";

export function createMcpCommand(): Command {
  const mcp = new Command("mcp")
    .description("MCP server for IntelliHelper UI (browse, search, and install components from agents)")
    .option(
      "-c, --cwd <cwd>",
      "Working directory (defaults to current directory)",
      process.cwd(),
    )
    .action(async (options: { cwd?: string }) => {
      try {
        if (options.cwd) {
          process.chdir(options.cwd);
        }
        const server = createMcpServer();
        const transport = new StdioServerTransport();
        await server.connect(transport);
      } catch (error) {
        // Never write protocol noise to stdout — stderr only
        console.error(
          error instanceof Error ? error.message : String(error),
        );
        process.exit(1);
      }
    });

  mcp
    .command("init")
    .description("Write MCP client configuration for IntelliHelper UI")
    .option(
      "--client <client>",
      `MCP client (${MCP_CLIENTS.map((c) => c.name).join(", ")})`,
    )
    .action(async (opts: { client?: string }, command: Command) => {
      try {
        const parentOpts = command.parent?.opts() as { cwd?: string } | undefined;
        const cwd = parentOpts?.cwd || process.cwd();

        let client = opts.client as McpClient | undefined;

        if (!client) {
          if (!process.stdin.isTTY) {
            logger.error(
              `Please pass --client. Options: ${MCP_CLIENTS.map((c) => c.name).join(", ")}`,
            );
            process.exit(1);
          }

          client = await select({
            message: "Which MCP client are you using?",
            choices: MCP_CLIENTS.map((c) => ({
              name: c.label,
              value: c.name,
            })),
          });
        }

        const valid = MCP_CLIENTS.some((c) => c.name === client);
        if (!valid) {
          logger.error(
            `Unknown client "${client}". Available: ${MCP_CLIENTS.map((c) => c.name).join(", ")}`,
          );
          process.exit(1);
        }

        const result = runMcpInit({ client: client!, cwd });

        if (result.kind === "instructions") {
          console.log(result.text);
          return;
        }

        logger.success(`Configuration saved to ${result.path}`);
        logger.info("Restart your MCP client, then try:");
        logger.info('  "Show me all IntelliHelper UI glass components"');
        logger.info('  "Add button, dialog, and card from IntelliHelper UI"');
      } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return mcp;
}
