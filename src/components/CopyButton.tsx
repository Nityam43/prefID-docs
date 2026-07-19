"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
    >
      {copied ? (
        <>
          <CheckIcon className="h-3.5 w-3.5" /> Copied
        </>
      ) : (
        <>
          <CopyIcon className="h-3.5 w-3.5" /> Copy
        </>
      )}
    </button>
  );
}
