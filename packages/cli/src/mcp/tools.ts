import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const listComponentsSchema = z.object({
  category: z
    .string()
    .optional()
    .describe(
      "Filter by catalog category: glass-system, actions, surfaces, forms, overlays, navigation, data, feedback, interactive, content",
    ),
  type: z
    .string()
    .optional()
    .describe("Filter by registry type, e.g. registry:ui or registry:lib"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of items to return (default 100; use 0 for no limit)"),
  offset: z
    .number()
    .optional()
    .describe("Number of items to skip for pagination"),
});

export const searchComponentsSchema = z.object({
  query: z
    .string()
    .describe(
      "Search query for fuzzy matching against component name, title, description, category, and meta (variants/sizes)",
    ),
  category: z.string().optional().describe("Optional category filter"),
  limit: z.number().optional().describe("Max results (default 100; 0 = no limit)"),
  offset: z.number().optional().describe("Pagination offset"),
});

export const getComponentSchema = z.object({
  name: z
    .string()
    .optional()
    .describe("Component name, e.g. button, dialog, glass-bar"),
  names: z
    .array(z.string())
    .optional()
    .describe("Multiple component names to fetch in one call"),
});

export const getComponentExamplesSchema = z.object({
  name: z
    .string()
    .optional()
    .describe("Exact component name (preferred), e.g. button"),
  query: z
    .string()
    .optional()
    .describe(
      "Search query when name is unknown, e.g. 'button demo', 'glass', 'dialog'",
    ),
});

export const getAddCommandSchema = z.object({
  components: z
    .array(z.string())
    .min(1)
    .describe("Component names to install, e.g. ['button', 'dialog', 'card']"),
});

export type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export function getToolDefinitions(): ToolDefinition[] {
  return [
    {
      name: "get_project_config",
      description:
        "Read IntelliHelper UI project configuration from components.json (registry URL, aliases, style). If missing, explains how to run init. Always safe to call first.",
      inputSchema: zodToJsonSchema(z.object({})) as Record<string, unknown>,
    },
    {
      name: "list_components",
      description:
        "List available IntelliHelper UI registry components with title, description, category, and dependencies. Use search_components for fuzzy discovery. After picking a component, call get_component for source.",
      inputSchema: zodToJsonSchema(listComponentsSchema) as Record<string, unknown>,
    },
    {
      name: "search_components",
      description:
        "Fuzzy search IntelliHelper UI components by name, title, description, category, or meta (variants/sizes). After finding a match, use get_component for full source and get_component_examples for usage.",
      inputSchema: zodToJsonSchema(searchComponentsSchema) as Record<
        string,
        unknown
      >,
    },
    {
      name: "get_component",
      description:
        "Get detailed information about one or more components including meta (variants, sizes, shapes), dependencies, and full source file contents. Prefer this before writing code so props match the real API.",
      inputSchema: zodToJsonSchema(getComponentSchema) as Record<string, unknown>,
    },
    {
      name: "get_component_examples",
      description:
        "Get usage examples and demo code for a component. Pass an exact name when known, or a query like 'button demo' / 'dialog'. Returns complete TSX snippets ready to adapt.",
      inputSchema: zodToJsonSchema(getComponentExamplesSchema) as Record<
        string,
        unknown
      >,
    },
    {
      name: "get_add_command",
      description:
        "Return the CLI install command for one or more IntelliHelper UI components. Does not write files — run the returned command in the project shell.",
      inputSchema: zodToJsonSchema(getAddCommandSchema) as Record<string, unknown>,
    },
    {
      name: "list_themes",
      description:
        "List IntelliHelper UI themes (mono, aurora, sunset, frost, ocean) with descriptions. Themes drive Liquid Glass CSS variables.",
      inputSchema: zodToJsonSchema(z.object({})) as Record<string, unknown>,
    },
    {
      name: "get_audit_checklist",
      description:
        "After adding or generating IntelliHelper UI components, run this checklist to verify imports, dependencies, glass layers, and TypeScript health.",
      inputSchema: zodToJsonSchema(z.object({})) as Record<string, unknown>,
    },
  ];
}
