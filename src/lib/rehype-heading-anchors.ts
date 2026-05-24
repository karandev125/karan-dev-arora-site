type HastNode = {
  type?: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function isElement(node: HastNode): node is HastNode & { tagName: string; children: HastNode[] } {
  return node.type === "element" && typeof node.tagName === "string" && Array.isArray(node.children);
}

function textContent(node: HastNode): string {
  if (node.type === "text" && typeof node.value === "string") {
    return node.value;
  }

  return node.children?.map(textContent).join("") ?? "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function appendClass(properties: Record<string, unknown>, className: string): void {
  const current = properties.className;

  if (Array.isArray(current)) {
    properties.className = [...current, className];
    return;
  }

  if (typeof current === "string") {
    properties.className = `${current} ${className}`;
    return;
  }

  properties.className = [className];
}

function visit(node: HastNode, usedSlugs: Map<string, number>): void {
  if (isElement(node)) {
    const shouldAnchor = node.tagName === "h2" || node.tagName === "h3";

    if (shouldAnchor) {
      const label = textContent(node);
      const baseSlug = slugify(label);
      const count = usedSlugs.get(baseSlug) ?? 0;
      usedSlugs.set(baseSlug, count + 1);

      const id = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
      node.properties = node.properties ?? {};
      node.properties.id = node.properties.id ?? id;
      appendClass(node.properties, "heading-with-anchor");

      node.children.unshift({
        type: "element",
        tagName: "a",
        properties: {
          className: ["heading-anchor"],
          href: `#${node.properties.id}`,
          ariaLabel: `Copy link to ${label}`,
          dataHeadingAnchor: "true",
        },
        children: [{ type: "text", value: "#" }],
      });
    }
  }

  node.children?.forEach((child) => visit(child, usedSlugs));
}

export function rehypeHeadingAnchors() {
  return (tree: HastNode) => {
    visit(tree, new Map<string, number>());
  };
}
