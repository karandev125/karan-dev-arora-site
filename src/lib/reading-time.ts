const WORDS_PER_MINUTE = 220;

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]*\)/g, " ")
    .replace(/[#>*_\-[\]()]/g, " ");
}

export function wordCount(markdown: string): number {
  const words = stripMarkdown(markdown).match(/\b[\w']+\b/g);
  return words?.length ?? 0;
}

export function readingTime(markdown: string): string {
  const minutes = Math.max(1, Math.ceil(wordCount(markdown) / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
