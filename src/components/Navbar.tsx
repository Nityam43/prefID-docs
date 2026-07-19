import Link from "next/link";
import { GITHUB_URL, NPM_URL } from "@/lib/nav";
import { GitHubIcon, NpmIcon } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          pref<span className="text-brand-500">ID</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/docs"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Docs
          </Link>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="npm"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <NpmIcon className="h-5 w-5" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <GitHubIcon className="h-[18px] w-[18px]" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
