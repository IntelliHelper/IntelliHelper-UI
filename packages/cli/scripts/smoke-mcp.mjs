#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const cliPath = join(root, "dist/index.js");

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [cliPath, "mcp"],
  cwd: root,
});

const client = new Client({ name: "test", version: "1.0.0" });
await client.connect(transport);

const tools = await client.listTools();
console.log(
  "TOOLS (" + tools.tools.length + "):",
  tools.tools.map((t) => t.name).join(", "),
);

async function call(name, args = {}) {
  const res = await client.callTool({ name, arguments: args });
  const text =
    res.content?.map((c) => (c.type === "text" ? c.text : "")).join("\n") ?? "";
  console.log(`\n===== ${name} =====`);
  console.log(text.slice(0, 900));
  if (text.length > 900) console.log(`... (${text.length} chars total)`);
  if (res.isError) console.log("IS_ERROR");
  return text;
}

await call("get_project_config");
await call("list_components", { category: "actions", limit: 5 });
await call("search_components", { query: "glass", limit: 5 });
const button = await call("get_component", { name: "button" });
console.log("\nbutton has source?", /buttonVariants|forwardRef/.test(button));
await call("get_component_examples", { name: "button" });
await call("get_add_command", { components: ["button", "dialog", "card"] });
await call("list_themes");
await call("get_audit_checklist");

await client.close();
process.exit(0);
