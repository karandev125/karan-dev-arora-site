import { getCommandPaletteItems } from "../lib/command-palette";

export async function GET() {
  return new Response(JSON.stringify(await getCommandPaletteItems()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
