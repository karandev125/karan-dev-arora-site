import { defineConfig, sharpImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { ThemeRegistrationRaw } from "shiki";

import { SITE } from "./src/config";
import { rehypeHeadingAnchors } from "./src/lib/rehype-heading-anchors";
import { remarkWikilinks } from "./src/lib/remark-wikilinks";
import { codeTitleTransformer } from "./src/lib/shiki";

const shikiLightTheme: ThemeRegistrationRaw = {
  name: "karan-cream",
  type: "light",
  colors: {
    "editor.background": "#efe8dc",
    "editor.foreground": "#1a1a1a",
  },
  settings: [
    { settings: { foreground: "#1a1a1a", background: "#efe8dc" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#6b6358" } },
    { scope: ["keyword", "storage", "storage.type", "keyword.operator"], settings: { foreground: "#3a5a8c" } },
    { scope: ["string", "punctuation.definition.string"], settings: { foreground: "#8a4a2a" } },
    { scope: ["constant.numeric"], settings: { foreground: "#6d734d" } },
    { scope: ["constant.language", "support.constant"], settings: { foreground: "#7a5f2f" } },
    { scope: ["entity.name.function", "support.function"], settings: { foreground: "#26303b" } },
    {
      scope: ["variable", "variable.other", "variable.parameter", "entity.name", "support.variable", "meta.object-literal.key"],
      settings: { foreground: "#1a1a1a" },
    },
  ],
};

const shikiDarkTheme: ThemeRegistrationRaw = {
  name: "karan-charcoal",
  type: "dark",
  colors: {
    "editor.background": "#252119",
    "editor.foreground": "#e8e3d8",
  },
  settings: [
    { settings: { foreground: "#e8e3d8", background: "#252119" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#a39a8a" } },
    { scope: ["keyword", "storage", "storage.type", "keyword.operator"], settings: { foreground: "#7a9ec8" } },
    { scope: ["string", "punctuation.definition.string"], settings: { foreground: "#c87a5a" } },
    { scope: ["constant.numeric"], settings: { foreground: "#b9ad70" } },
    { scope: ["constant.language", "support.constant"], settings: { foreground: "#d0a66b" } },
    { scope: ["entity.name.function", "support.function"], settings: { foreground: "#ded7cc" } },
    {
      scope: ["variable", "variable.other", "variable.parameter", "entity.name", "support.variable", "meta.object-literal.key"],
      settings: { foreground: "#e8e3d8" },
    },
  ],
};

export default defineConfig({
  site: SITE.url,
  output: "static",
  devToolbar: {
    enabled: false,
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath, remarkWikilinks],
    rehypePlugins: [rehypeKatex, rehypeHeadingAnchors],
    shikiConfig: {
      themes: {
        light: shikiLightTheme,
        dark: shikiDarkTheme,
      },
      defaultColor: false,
      transformers: [codeTitleTransformer],
    },
  },
  image: {
    service: sharpImageService(),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
