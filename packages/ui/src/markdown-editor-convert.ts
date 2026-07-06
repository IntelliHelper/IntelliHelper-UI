import { marked } from "marked";
import TurndownService from "turndown";
import { gfm as turndownGfm } from "turndown-plugin-gfm";

marked.setOptions({
  gfm: true,
  breaks: true,
});

let turndownService: TurndownService | null = null;

function getTurndownService() {
  if (turndownService) {
    return turndownService;
  }

  const service = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
    strongDelimiter: "**",
  });

  service.use(turndownGfm);

  service.addRule("taskListItem", {
    filter: (node) => {
      if (node.nodeName !== "LI") {
        return false;
      }

      const checkbox = node.querySelector('input[type="checkbox"]');
      return Boolean(checkbox);
    },
    replacement: (content, node) => {
      const element = node as HTMLElement;
      const checkbox = element.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement | null;
      const checked = checkbox?.checked ? "x" : " ";
      const text = content.replace(/^\s+/, "").trim();
      return `- [${checked}] ${text}\n`;
    },
  });

  turndownService = service;
  return service;
}

export function markdownToHtml(markdown: string) {
  if (!markdown.trim()) {
    return "";
  }

  return marked.parse(markdown, { async: false }) as string;
}

export function htmlToMarkdown(html: string) {
  if (!html.trim()) {
    return "";
  }

  return getTurndownService()
    .turndown(html)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}