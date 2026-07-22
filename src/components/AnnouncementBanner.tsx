"use client";

import Link from "next/link";
import { ArrowRightIcon } from "./icons";

// Bump this key whenever you announce a NEW feature — a fresh key makes the
// banner reappear for everyone, even people who dismissed the previous one.
const DISMISS_KEY = "prefid-banner-sortable-ids";

function dismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, "dismissed");
  } catch {
    /* localStorage unavailable */
  }
  document.documentElement.dataset.banner = "hidden";
}

export function AnnouncementBanner() {
  return (
    <div className="announcement-banner relative bg-gradient-to-r from-brand-600 to-brand-500 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-10 py-2">
        <Link
          href="/docs/api/sortable-id"
          className="group inline-flex items-center gap-2 text-sm font-medium"
        >
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
            New
          </span>
          <span>
            Sortable IDs are here
            <span className="hidden sm:inline">
              {" "}
              — time-ordered, ULID / UUIDv7-style
            </span>
          </span>
          <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-white/80 transition hover:bg-white/15 hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-4 w-4"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
