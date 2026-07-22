import Link from "next/link";
import { CodeSample } from "@/components/CodeSample";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Introduction" };

const exampleTs = `import { id } from "prefid";

id("user");   // => "user_a8Kd0f2bQ1nR7pZ3xW4mT6y"
id("order");  // => "order_9f8e7d6c5b4a3F2e1D0cB9aX"`;

const exampleJs = `const { id } = require("prefid");

id("user");   // => "user_a8Kd0f2bQ1nR7pZ3xW4mT6y"
id("order");  // => "order_9f8e7d6c5b4a3F2e1D0cB9aX"`;

export default function IntroductionPage() {
  return (
    <>
      <PageHeader
        title="Introduction"
        lead="prefID generates short, unique IDs that carry a prefix telling you what they belong to."
      />

      <div className="prose-doc">
        <p>
          Instead of an opaque identifier like{" "}
          <code>9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d</code>, prefID gives you{" "}
          <code>user_a1b2c3</code> — an ID whose <strong>prefix</strong> tells
          you exactly what it belongs to. That prefix makes IDs readable in
          logs, URLs, and your database, and because prefID is written in
          TypeScript, the prefix is understood by the type system too.
        </p>

        <CodeSample ts={exampleTs} js={exampleJs} />

        <h2>Why prefixed IDs?</h2>
        <ul>
          <li>
            <strong>Readable</strong> — you instantly know{" "}
            <code>order_9f8e7d</code> is an order and <code>user_a1b2c3</code>{" "}
            is a user, without looking anything up.
          </li>
          <li>
            <strong>Safer</strong> — TypeScript treats a user ID and an order
            ID as different types, so you can&apos;t accidentally pass one where
            the other is expected.
          </li>
          <li>
            <strong>Debuggable</strong> — a stray ID in a log line explains
            itself.
          </li>
        </ul>

        <h2>Design goals</h2>
        <ul>
          <li>
            <strong>Secure by default</strong> — the random part uses the
            platform&apos;s cryptographic RNG, never <code>Math.random()</code>.
          </li>
          <li>
            <strong>Zero dependencies</strong> — one small, focused package.
          </li>
          <li>
            <strong>Universal</strong> — Node, browsers, Deno, Bun, and edge
            runtimes, shipping both ESM and CommonJS.
          </li>
          <li>
            <strong>Fully typed</strong> — the generated ID keeps its prefix in
            the type.
          </li>
        </ul>

        <h2>Next steps</h2>
        <p>
          Head to <Link href="/docs/installation">Installation</Link> to add
          prefID to your project, then the{" "}
          <Link href="/docs/quick-start">Quick Start</Link> to generate your
          first ID.
        </p>
      </div>

      <DocsPager />
    </>
  );
}
