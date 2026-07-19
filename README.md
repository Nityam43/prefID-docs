# prefID — Documentation Site

The documentation website for [prefID](https://www.npmjs.com/package/prefid),
built with **Next.js 14** (App Router), **TypeScript**, and **Tailwind CSS**.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build   # production build (static, prerendered)
npm start       # serve the production build
```

## Structure

```
src/
  app/
    layout.tsx          Root layout (navbar, theme script)
    page.tsx            Landing page
    docs/
      layout.tsx        Docs shell (sidebar + content)
      page.tsx          Introduction
      installation/
      quick-start/
      api/              id, createId, ensureUnique, validation, types
      uniqueness/
      comparison/
  components/           Navbar, Sidebar, CodeBlock, ThemeToggle, ...
  lib/nav.ts            Sidebar + prev/next navigation config
```

## Deploying

This is a standard Next.js app and deploys cleanly to
[Vercel](https://vercel.com) with zero configuration — import the repo and it
builds automatically.

## License

MIT © Syed Suhail Ahmed
