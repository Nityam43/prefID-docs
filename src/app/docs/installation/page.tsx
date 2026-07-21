import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Installation" };

const esm = `import { id } from "prefid";

id("user");`;

const cjs = `const { id } = require("prefid");

id("user");`;

export default function InstallationPage() {
  return (
    <>
      <PageHeader
        title="Installation"
        lead="Add prefID to any JavaScript or TypeScript project. It has zero runtime dependencies."
      />

      <div className="prose-doc">
        <h2>Install</h2>
        <p>Install with your package manager of choice:</p>
        <CodeBlock code="npm install prefid" lang="bash" />
        <CodeBlock code="pnpm add prefid" lang="bash" />
        <CodeBlock code="yarn add prefid" lang="bash" />
        <CodeBlock code="bun add prefid" lang="bash" />

        <h2>Importing</h2>
        <p>
          prefID ships both ES Modules and CommonJS, so either import style
          works out of the box.
        </p>

        <h3>ES Modules / TypeScript</h3>
        <CodeBlock code={esm} />

        <h3>CommonJS</h3>
        <CodeBlock code={cjs} lang="js" />

        <h2>JavaScript or TypeScript</h2>
        <p>
          prefID works in <strong>plain JavaScript</strong> exactly as well as
          in TypeScript. The published package is already compiled JavaScript,
          so there is nothing to compile on your end — every function (
          <code>id</code>, <code>createId</code>, <code>template</code>,{" "}
          <code>ensureUnique</code>, <code>isId</code>, <code>getPrefix</code>)
          runs the same in a <code>.js</code> file.
        </p>
        <p>
          TypeScript users get one bonus on top: the typed prefix (
          <code>
            {"`"}
            user_{"${string}"}
            {"`"}
          </code>
          ) catches wrong-ID mistakes at compile time. JavaScript users still get
          editor autocomplete from the bundled type definitions — they just
          don&apos;t get compile-time checking, because JavaScript has no compile
          step.
        </p>

        <h2>Requirements</h2>
        <ul>
          <li>
            <strong>Node.js 14.18+</strong>, or any modern browser, Deno, Bun,
            or edge runtime.
          </li>
          <li>
            <strong>TypeScript</strong> is optional — the package works in plain
            JavaScript too — but you get the most value from the typed prefixes.
          </li>
        </ul>

        <p>
          Ready to generate an ID? Continue to the{" "}
          <Link href="/docs/quick-start">Quick Start</Link>.
        </p>
      </div>

      <DocsPager />
    </>
  );
}
