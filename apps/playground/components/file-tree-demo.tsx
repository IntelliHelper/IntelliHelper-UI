"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  collapsibleVariants,
} from "@intelli/ui";
import { cn } from "@intelli/utils";

type FileTreeNode = {
  name: string;
  type: "folder" | "file";
  children?: FileTreeNode[];
};

const fileTree: FileTreeNode[] = [
  {
    name: "intelli-ui",
    type: "folder",
    children: [
      {
        name: "apps",
        type: "folder",
        children: [
          {
            name: "playground",
            type: "folder",
            children: [
              { name: "app/page.tsx", type: "file" },
              { name: "components/file-tree-demo.tsx", type: "file" },
              { name: "components/carousel-demo.tsx", type: "file" },
            ],
          },
          {
            name: "registry",
            type: "folder",
            children: [{ name: "registry.json", type: "file" }],
          },
        ],
      },
      {
        name: "packages",
        type: "folder",
        children: [
          {
            name: "ui",
            type: "folder",
            children: [
              { name: "src/alert.tsx", type: "file" },
              { name: "src/carousel.tsx", type: "file" },
              { name: "src/collapsible.tsx", type: "file" },
              { name: "src/index.ts", type: "file" },
            ],
          },
          {
            name: "utils",
            type: "folder",
            children: [{ name: "src/cn.ts", type: "file" }],
          },
        ],
      },
    ],
  },
];

function FolderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5 shrink-0 text-primary"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5 shrink-0 glass-chrome-text-muted"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function FileTreeBranch({
  node,
  defaultOpen = false,
}: {
  node: FileTreeNode;
  defaultOpen?: boolean;
}) {
  if (node.type === "file") {
    return (
      <div
        data-slot="file-tree-file"
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium glass-chrome-text"
      >
        <FileIcon />
        <span className="truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger layout="tree" className="w-full">
        <FolderIcon />
        <span className="truncate">{node.name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent nested animated={false}>
        <div className="flex flex-col gap-0.5 py-0.5">
          {node.children?.map((child) => (
            <FileTreeBranch
              key={child.name}
              node={child}
              defaultOpen={child.type === "folder" && child.name === "packages"}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function FileTreeDemo() {
  return (
    <div
      className={cn(
        collapsibleVariants({ variant: "chrome", animated: false }),
        "max-w-sm p-3",
      )}
    >
      <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide glass-chrome-text-muted">
        Project files
      </div>
      <div data-slot="file-tree" className="flex flex-col gap-0.5">
        {fileTree.map((node) => (
          <FileTreeBranch key={node.name} node={node} defaultOpen />
        ))}
      </div>
    </div>
  );
}