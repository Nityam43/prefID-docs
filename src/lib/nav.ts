export type NavLink = { title: string; href: string };
export type NavGroup = { title: string; links: NavLink[] };

export const GITHUB_URL = "https://github.com/suhailopensource/prefID";
export const NPM_URL = "https://www.npmjs.com/package/prefid";

export const nav: NavGroup[] = [
  {
    title: "Getting Started",
    links: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "API Reference",
    links: [
      { title: "id()", href: "/docs/api/id" },
      { title: "createId()", href: "/docs/api/create-id" },
      { title: "sortableId()", href: "/docs/api/sortable-id" },
      { title: "template()", href: "/docs/api/template" },
      { title: "ensureUnique()", href: "/docs/api/ensure-unique" },
      { title: "isId() & getPrefix()", href: "/docs/api/validation" },
      { title: "Types", href: "/docs/api/types" },
    ],
  },
  {
    title: "Concepts",
    links: [
      { title: "Uniqueness & Collisions", href: "/docs/uniqueness" },
      { title: "Comparison", href: "/docs/comparison" },
    ],
  },
  {
    title: "Ecosystem",
    links: [{ title: "Zod (prefID-zod)", href: "/docs/zod" }],
  },
];

/** Flat, ordered list of every doc page — used for prev/next navigation. */
export const flatNav: NavLink[] = nav.flatMap((group) => group.links);
