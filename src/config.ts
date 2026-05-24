export const SITE = {
  name: "Karan Dev Arora",
  shortName: "Karan",
  domain: "karandevarora.vercel.app",
  url: "https://karandevarora.vercel.app",
  description: "Engineering, philosophy, and whatever else holds my attention.",
  author: "Karan Dev Arora",
  email: "karanaroradev@gmail.com",
  socials: {
    github: "https://github.com/karandev125",
    twitter: "https://x.com/KdaArora",
    linkedin: "https://www.linkedin.com/in/karandevarora/",
  },
  nav: [
    { label: "thoughts", href: "/thoughts" },
    { label: "bookshelf", href: "/bookshelf" },
    { label: "projects", href: "/projects" },
    { label: "notes", href: "/notes" },
    { label: "about", href: "/about" },
  ],
  footerNav: [
    { label: "bookmarks", href: "/bookmarks" },
    { label: "uses", href: "/uses" },
    { label: "now", href: "/now" },
    { label: "feeds", href: "/feeds" },
  ],
} as const;
