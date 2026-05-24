export function GET() {
  return new Response(
    `/* TEAM */
Karan Dev Arora - writing, design intent, everything
karanaroradev@gmail.com

/* TECH */
Astro, MDX, Tailwind CSS, Pagefind, Satori
Source Serif 4, JetBrains Mono
Hosted on Cloudflare Pages

/* THANKS */
nav.al, shud.in, angezanetti.com, arpitbhayani.me - for the inspiration
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
