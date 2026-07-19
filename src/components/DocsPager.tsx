"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { flatNav } from "@/lib/nav";
import { ArrowRightIcon } from "./icons";

export function DocsPager() {
  const pathname = usePathname();
  const index = flatNav.findIndex((link) => link.href === pathname);
  const prev = index > 0 ? flatNav[index - 1] : null;
  const next =
    index >= 0 && index < flatNav.length - 1 ? flatNav[index + 1] : null;

  return (
    <nav className="mt-16 grid grid-cols-2 gap-4 border-t border-slate-200 pt-8 dark:border-slate-800">
      <div>
        {prev && (
          <Link
            href={prev.href}
            className="group flex flex-col rounded-xl border border-slate-200 p-4 transition hover:border-brand-300 dark:border-slate-800 dark:hover:border-brand-700"
          >
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" /> Previous
            </span>
            <span className="mt-1 font-medium text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            href={next.href}
            className="group flex flex-col items-end rounded-xl border border-slate-200 p-4 text-right transition hover:border-brand-300 dark:border-slate-800 dark:hover:border-brand-700"
          >
            <span className="flex items-center gap-1 text-xs text-slate-500">
              Next <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
            <span className="mt-1 font-medium text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
