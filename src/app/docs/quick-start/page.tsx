import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Quick Start" };

const basic = `import { id } from "prefid";

const userId = id("user");
// => "user_a8Kd0f2bQ1nR7pZ3xW4mT6y"

const orderId = id("order");
// => "order_9f8e7d6c5b4a3F2e1D0cB9aX"`;

const typed = `const userId = id("user");
//    ^? type: \`user_\${string}\`

function getUser(id: \`user_\${string}\`) { /* ... */ }

getUser(userId);        // ✅ ok
getUser(id("order"));   // ❌ compile error — that's an order id`;

const configured = `import { createId } from "prefid";

// Configure once, reuse everywhere.
const id = createId({ size: 16 });

id("user"); // => "user_a1b2c3d4e5f6g7h8"`;

export default function QuickStartPage() {
  return (
    <>
      <PageHeader
        title="Quick Start"
        lead="Generate your first prefixed ID, then see how the prefix flows through TypeScript."
      />

      <div className="prose-doc">
        <h2>Generate an ID</h2>
        <p>
          Import <code>id</code> and call it with a prefix. That&apos;s the
          whole API for the common case.
        </p>
        <CodeBlock code={basic} />

        <h2>The prefix is type-safe</h2>
        <p>
          The return value isn&apos;t just <code>string</code> — it&apos;s a{" "}
          <em>template literal type</em> that remembers the prefix. This is what
          stops you from mixing up ID types.
        </p>
        <CodeBlock code={typed} />

        <h2>Configure defaults</h2>
        <p>
          Use <code>createId</code> to set the size, separator, or alphabet once
          and reuse the generator across your app.
        </p>
        <CodeBlock code={configured} />

        <h2>What&apos;s next?</h2>
        <ul>
          <li>
            <Link href="/docs/api/id">
              <code>id()</code>
            </Link>{" "}
            — the full reference for the default generator.
          </li>
          <li>
            <Link href="/docs/api/ensure-unique">
              <code>ensureUnique()</code>
            </Link>{" "}
            — guarantee an ID is free in your database.
          </li>
          <li>
            <Link href="/docs/uniqueness">Uniqueness &amp; Collisions</Link> —
            how safe these IDs really are.
          </li>
        </ul>
      </div>

      <DocsPager />
    </>
  );
}
