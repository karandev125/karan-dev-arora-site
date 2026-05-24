import type { Plugin } from "unified";
import type { Root } from "mdast";

interface ParentNode {
  children: unknown[];
}

interface TextNode {
  type: "text";
  value: string;
}

const wikilinkPattern = /\[\[([a-z0-9][a-z0-9-_/]*)\]\]/gi;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isParentNode(node: unknown): node is ParentNode {
  return isRecord(node) && Array.isArray(node.children);
}

function isTextNode(node: unknown): node is TextNode {
  return isRecord(node) && node.type === "text" && typeof node.value === "string";
}

function labelFromSlug(slug: string): string {
  return slug.replace(/[-/]+/g, " ");
}

function linkNode(slug: string) {
  return {
    type: "link",
    url: `/notes/${slug}`,
    title: null,
    children: [{ type: "text", value: labelFromSlug(slug) }],
  };
}

function splitWikilinks(value: string): unknown[] {
  const nodes: unknown[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(wikilinkPattern)) {
    const slug = match[1];
    const index = match.index ?? 0;

    if (!slug) {
      continue;
    }

    if (index > lastIndex) {
      nodes.push({ type: "text", value: value.slice(lastIndex, index) });
    }

    nodes.push(linkNode(slug));
    lastIndex = index + match[0].length;
  }

  if (lastIndex < value.length) {
    nodes.push({ type: "text", value: value.slice(lastIndex) });
  }

  return nodes;
}

function transformNode(node: unknown): void {
  if (!isParentNode(node)) {
    return;
  }

  const children: unknown[] = [];

  for (const child of node.children) {
    if (isTextNode(child) && child.value.includes("[[")) {
      children.push(...splitWikilinks(child.value));
    } else {
      transformNode(child);
      children.push(child);
    }
  }

  node.children = children;
}

export const remarkWikilinks: Plugin<[], Root> = () => (tree: Root) => {
  transformNode(tree);
};
