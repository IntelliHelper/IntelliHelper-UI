import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  DOCS_BASE,
  getCatalog,
  getCategoryForName,
  getExamplesFor,
  getExamplesMap,
  getProjectConfigSummary,
  getThemes,
  loadComponent,
  loadEnrichedItems,
  resolveCwd,
} from "./data.js";
import {
  formatAddCommand,
  formatAuditChecklist,
  formatComponent,
  formatExamples,
  formatList,
  formatProjectConfig,
  formatThemes,
} from "./format.js";
import { paginate, searchItems } from "./search.js";
import {
  getAddCommandSchema,
  getComponentExamplesSchema,
  getComponentSchema,
  getToolDefinitions,
  listComponentsSchema,
  searchComponentsSchema,
} from "./tools.js";

const PACKAGE_VERSION = "0.1.0";

function textResult(text: string, isError = false) {
  return {
    content: [{ type: "text" as const, text }],
    ...(isError ? { isError: true } : {}),
  };
}

export function createMcpServer(): Server {
  const server = new Server(
    {
      name: "intellihelper-ui",
      version: PACKAGE_VERSION,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: getToolDefinitions() };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const args = request.params.arguments ?? {};
      const cwd = resolveCwd();

      switch (request.params.name) {
        case "get_project_config": {
          const summary = getProjectConfigSummary(cwd);
          return textResult(formatProjectConfig(summary));
        }

        case "list_components": {
          const input = listComponentsSchema.parse(args);
          let items = await loadEnrichedItems(cwd);

          if (input.category) {
            items = items.filter((item) => item.category === input.category);
          }
          if (input.type) {
            items = items.filter((item) => item.type === input.type);
          }

          items = items.sort((a, b) => a.name.localeCompare(b.name));
          const page = paginate(items, {
            limit: input.limit,
            offset: input.offset,
          });

          return textResult(
            formatList(page.items, {
              total: page.total,
              offset: page.offset,
              limit: page.limit,
              hasMore: page.hasMore,
              category: input.category,
            }),
          );
        }

        case "search_components": {
          const input = searchComponentsSchema.parse(args);
          let items = await loadEnrichedItems(cwd);

          if (input.category) {
            items = items.filter((item) => item.category === input.category);
          }

          const matched = searchItems(items, input.query);
          const page = paginate(matched, {
            limit: input.limit,
            offset: input.offset,
          });

          if (page.items.length === 0) {
            const categories = Object.keys(getCatalog().categories).join(", ");
            return textResult(
              [
                `No components matched "${input.query}".`,
                "",
                "Try a shorter keyword (e.g. glass, button, form) or list by category:",
                categories,
                "",
                "Use list_components without a query to browse everything.",
              ].join("\n"),
            );
          }

          return textResult(
            formatList(page.items, {
              total: page.total,
              offset: page.offset,
              limit: page.limit,
              hasMore: page.hasMore,
              query: input.query,
              category: input.category,
            }),
          );
        }

        case "get_component": {
          const input = getComponentSchema.parse(args);
          const names = [
            ...(input.name ? [input.name] : []),
            ...(input.names ?? []),
          ]
            .map((n) => n.replace(/^@[\w-]+\//, "").trim())
            .filter(Boolean);

          if (names.length === 0) {
            return textResult(
              "Provide `name` or `names`. Example: name: \"button\"",
              true,
            );
          }

          const sections: string[] = [];
          const missing: string[] = [];

          for (const name of names) {
            const item = await loadComponent(name, cwd);
            if (!item) {
              missing.push(name);
              continue;
            }
            sections.push(
              formatComponent(item, {
                category: getCategoryForName(item.name),
                docsBase: DOCS_BASE,
              }),
            );
          }

          if (sections.length === 0) {
            return textResult(
              [
                `No components found for: ${names.join(", ")}`,
                "",
                "Use search_components or list_components to discover valid names.",
              ].join("\n"),
              true,
            );
          }

          let text = sections.join("\n\n---\n\n");
          if (missing.length > 0) {
            text += `\n\n_Not found: ${missing.join(", ")}_`;
          }
          return textResult(text);
        }

        case "get_component_examples": {
          const input = getComponentExamplesSchema.parse(args);
          const examplesMap = getExamplesMap();

          if (input.name) {
            const name = input.name.replace(/^@[\w-]+\//, "").trim();
            return textResult(formatExamples(name, getExamplesFor(name)));
          }

          if (input.query) {
            // Prefer exact key match, then search component names, then scan example titles
            const q = input.query.toLowerCase().trim();
            const exact = Object.keys(examplesMap).find(
              (key) => key === q || key.replace(/-/g, " ") === q,
            );
            if (exact) {
              return textResult(formatExamples(exact, getExamplesFor(exact)));
            }

            const items = await loadEnrichedItems(cwd);
            const matched = searchItems(items, input.query);
            if (matched[0]) {
              return textResult(
                formatExamples(matched[0].name, getExamplesFor(matched[0].name)),
              );
            }

            // Scan example titles
            const hits: string[] = [];
            for (const [slug, list] of Object.entries(examplesMap)) {
              if (
                list.some(
                  (ex) =>
                    ex.title.toLowerCase().includes(q) ||
                    ex.description?.toLowerCase().includes(q) ||
                    slug.includes(q.replace(/\s+/g, "-")),
                )
              ) {
                hits.push(slug);
              }
            }

            if (hits.length === 1) {
              return textResult(formatExamples(hits[0]!, getExamplesFor(hits[0]!)));
            }
            if (hits.length > 1) {
              return textResult(
                [
                  `Multiple example sets match "${input.query}":`,
                  ...hits.map((h) => `- ${h}`),
                  "",
                  "Call get_component_examples again with an exact `name`.",
                ].join("\n"),
              );
            }

            return textResult(
              [
                `No examples found for query "${input.query}".`,
                "",
                "Try patterns like: button, dialog, glass-bar, \"button demo\".",
                "Or use get_component for source-level usage.",
              ].join("\n"),
            );
          }

          return textResult(
            "Provide either `name` or `query`. Example: name: \"button\"",
            true,
          );
        }

        case "get_add_command": {
          const input = getAddCommandSchema.parse(args);
          return textResult(formatAddCommand(input.components));
        }

        case "list_themes": {
          return textResult(formatThemes(getThemes()));
        }

        case "get_audit_checklist": {
          return textResult(formatAuditChecklist());
        }

        default:
          return textResult(`Unknown tool: ${request.params.name}`, true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return textResult(
          [
            "Invalid input parameters:",
            ...error.errors.map((e) => `- ${e.path.join(".")}: ${e.message}`),
          ].join("\n"),
          true,
        );
      }

      const message = error instanceof Error ? error.message : String(error);
      return textResult(`Error: ${message}`, true);
    }
  });

  return server;
}
