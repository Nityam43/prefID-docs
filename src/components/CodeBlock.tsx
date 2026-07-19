import { codeToHtml } from "shiki";
import { CopyButton } from "./CopyButton";

type CodeBlockProps = {
  code: string;
  lang?: string;
};

// Server component: syntax highlighting runs at build time, so the colored
// markup is baked into the static HTML with no client-side highlighting cost.
export async function CodeBlock({ code, lang = "ts" }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark",
  });

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wide text-slate-500">
          {lang}
        </span>
        <CopyButton code={code} />
      </div>
      <div
        className="shiki-block overflow-x-auto font-mono text-[13px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
