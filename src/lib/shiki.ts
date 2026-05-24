import type { ShikiTransformer } from "shiki";

function rawMeta(optionsMeta: unknown): string {
  if (!optionsMeta || typeof optionsMeta !== "object") {
    return "";
  }

  const value = (optionsMeta as { __raw?: unknown }).__raw;
  return typeof value === "string" ? value : "";
}

function codeTitle(meta: string): string | undefined {
  const quoted = /(?:title|filename|file)=["']([^"']+)["']/.exec(meta);

  if (quoted?.[1]) {
    return quoted[1];
  }

  const bare = /(?:title|filename|file)=([^ ]+)/.exec(meta);
  return bare?.[1];
}

export const codeTitleTransformer: ShikiTransformer = {
  name: "karan-code-title",
  pre(node) {
    this.addClassToHast(node, "code-block");

    const title = codeTitle(rawMeta(this.options.meta));

    if (title) {
      node.properties.dataCodeTitle = title;
    }
  },
};
