import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { ArrowRightIcon, GitHubIcon } from "@/components/icons";
import { GITHUB_URL, NPM_URL } from "@/lib/nav";

const heroExample = `import { id } from "prefid";

id("user");   // => "user_a8Kd0f2bQ1nR7pZ3xW4mT6y"
id("order");  // => "order_9f8e7d6c5b4a3F2e1D0cB9aX"`;

const features = [
  {
    title: "Self-describing",
    body: "The prefix tells you what an ID is at a glance — in logs, URLs, and your database.",
  },
  {
    title: "Type-safe",
    body: "id(\"user\") is typed as `user_${string}`, so mixing up ID types is a compile error.",
  },
  {
    title: "Secure",
    body: "The random part uses the platform's cryptographic RNG — never Math.random().",
  },
  {
    title: "Zero dependencies",
    body: "Tiny and focused on one job. Nothing to audit, nothing to bloat your bundle.",
  },
  {
    title: "Universal",
    body: "Runs in Node, browsers, Deno, Bun, and edge runtimes. Ships ESM + CommonJS.",
  },
  {
    title: "Guaranteed-unique helper",
    body: "ensureUnique() retries against your own store until it finds a free ID.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_50%_-10%,theme(colors.brand.500/0.12),transparent)]" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <a
              href={NPM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
              v0.1.1 · Zero dependencies
            </a>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              Type-safe,{" "}
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                prefixed IDs
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Short, unique IDs that carry a prefix telling you what they belong
              to — <code className="font-mono text-slate-900 dark:text-slate-200">user_a1b2c3</code>,{" "}
              <code className="font-mono text-slate-900 dark:text-slate-200">order_9f8e7d</code>. Readable,
              secure, and understood by TypeScript.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
              >
                Get started <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <GitHubIcon className="h-4 w-4" /> GitHub
              </a>
            </div>

            <div className="mx-auto mt-6 max-w-md">
              <CodeBlock code="npm install prefid" lang="bash" />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <CodeBlock code={heroExample} lang="ts" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-10 text-center shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ready to give your IDs a name?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            Install prefID and generate your first type-safe, prefixed ID in
            under a minute.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/docs/quick-start"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
            >
              Read the quick start <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
          <p>
            MIT © Syed Suhail Ahmed · Built with Next.js &amp; Tailwind CSS
          </p>
          <div className="flex items-center gap-4">
            <a href={NPM_URL} target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white">
              npm
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
