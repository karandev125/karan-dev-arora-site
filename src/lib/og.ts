import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import satori from "satori";
import sharp from "sharp";

import { SITE } from "../config";
import { formatDate } from "./date";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const serifFontPath = path.join(rootDir, "src/assets/fonts/SourceSerif4-Semibold.ttf");
const monoFontPath = path.join(rootDir, "src/assets/fonts/JetBrainsMono-Regular.ttf");

let fontPromise: Promise<{ serif: Buffer; mono: Buffer }> | undefined;

interface OgImageOptions {
  title: string;
  date?: Date;
}

function loadFonts(): Promise<{ serif: Buffer; mono: Buffer }> {
  fontPromise ??= Promise.all([fs.readFile(serifFontPath), fs.readFile(monoFontPath)]).then(([serif, mono]) => ({
    serif,
    mono,
  }));

  return fontPromise;
}

function titleSize(title: string): number {
  if (title.length > 52) {
    return 42;
  }

  if (title.length > 36) {
    return 48;
  }

  return 56;
}

export async function ogPng({ title, date }: OgImageOptions): Promise<Buffer> {
  const fonts = await loadFonts();
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          background: "#f6f1e8",
          color: "#1a1a1a",
          fontFamily: "Source Serif 4",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "42px",
                left: "48px",
                color: "#6b6358",
                fontFamily: "JetBrains Mono",
                fontSize: "14px",
              },
              children: SITE.name,
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: "110px",
                right: "110px",
                top: "205px",
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                color: "#1a1a1a",
                fontFamily: "Source Serif 4",
                fontSize: `${titleSize(title)}px`,
                fontWeight: 600,
                lineHeight: 1.12,
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "44px",
                left: "48px",
                color: "#3a5a8c",
                fontFamily: "JetBrains Mono",
                fontSize: "14px",
              },
              children: SITE.domain,
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "44px",
                right: "48px",
                color: "#6b6358",
                fontFamily: "JetBrains Mono",
                fontSize: "14px",
              },
              children: date ? formatDate(date) : SITE.name,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Source Serif 4", data: fonts.serif, weight: 600, style: "normal" },
        { name: "JetBrains Mono", data: fonts.mono, weight: 400, style: "normal" },
      ],
    },
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}

export function pngResponse(png: Buffer): Response {
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
