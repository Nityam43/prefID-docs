"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-8">
      {nav.map((group) => (
        <div key={group.title}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {group.title}
          </p>
          <ul className="space-y-1 border-l border-slate-200 dark:border-slate-800">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      "-ml-px block border-l py-1.5 pl-4 text-sm transition " +
                      (active
                        ? "border-brand-500 font-medium text-brand-600 dark:text-brand-400"
                        : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white")
                    }
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
