import { codeToHtml } from "shiki";
import { CopyButton } from "./CopyButton";
import { LangTabs } from "./LangTabs";

type CodeSampleProps = {
  ts: string;
  js: string;
};

// Renders a TypeScript and a JavaScript variant of the same snippet, both
// highlighted at build time. Which one is visible is driven by the global
// `data-lang` attribute (see LangTabs + globals.css), so every CodeSample on
// the page switches together.
export async function CodeSample({ ts, js }: CodeSampleProps) {
  const [tsHtml, jsHtml] = await Promise.all([
    codeToHtml(ts, { lang: "ts", theme: "github-dark" }),
    codeToHtml(js, { lang: "js", theme: "github-dark" }),
  ]);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <LangTabs />
        <span className="lang-variant--ts">
          <CopyButton code={ts} />
        </span>
        <span className="lang-variant--js">
          <CopyButton code={js} />
        </span>
      </div>
      <div
        className="lang-variant--ts shiki-block overflow-x-auto font-mono text-[13px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: tsHtml }}
      />
      <div
        className="lang-variant--js shiki-block overflow-x-auto font-mono text-[13px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: jsHtml }}
      />
    </div>
  );
}
