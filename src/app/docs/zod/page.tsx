import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { CodeSample } from "@/components/CodeSample";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Zod (prefID-zod)" };

const usageTs = `import { z } from "zod";
import { zId } from "prefid-zod";

const CreateOrder = z.object({
  userId: zId("user"), // validated AND typed \`user_\${string}\`
  amount: z.number().positive(),
});

CreateOrder.parse({ userId: "user_a8Kd0f2b", amount: 42 }); // ✅
CreateOrder.parse({ userId: "order_9f8e7d", amount: 42 }); // ❌ throws — wrong prefix`;

const usageJs = `const { z } = require("zod");
const { zId } = require("prefid-zod");

const CreateOrder = z.object({
  userId: zId("user"), // must be a "user_…" id
  amount: z.number().positive(),
});

CreateOrder.parse({ userId: "user_a8Kd0f2b", amount: 42 }); // ✅
CreateOrder.parse({ userId: "order_9f8e7d", amount: 42 }); // ❌ throws — wrong prefix`;

const options = `zId("user", { separator: "-" });        // matches "user-…" instead of "user_…"
zId("user", { message: "Invalid user id" }); // custom error message`;

export default function ZodPage() {
  return (
    <>
      <PageHeader
        title="Zod (prefID-zod)"
        lead="Validate prefixed IDs inside the schemas you already write. prefID-zod turns prefID's isId guard into a Zod schema for request bodies, forms, and config."
      />

      <div className="prose-doc">
        <p>
          prefID-zod is a tiny companion package that bridges prefID
          and <a href="https://zod.dev">Zod</a>. prefID&apos;s{" "}
          <Link href="/docs/api/validation">
            <code>isId()</code>
          </Link>{" "}
          is a type guard; prefID-zod exposes the same check as a
          Zod schema, so a prefixed ID drops straight into the validation you run
          at the edge of your app.
        </p>

        <h2>Install</h2>
        <p>
          <code>prefid</code> ships as a dependency and <code>zod</code> is a
          peer dependency, so your app&apos;s version of Zod is the one that
          runs. prefID itself stays dependency-free.
        </p>
        <CodeBlock code="npm install prefid-zod prefid zod" lang="bash" />

        <h2>Usage</h2>
        <p>
          Use <code>zId(prefix)</code> anywhere you&apos;d use a Zod schema.
          Invalid IDs are rejected before they reach your database, and the
          parsed value keeps prefID&apos;s literal type.
        </p>
        <CodeSample ts={usageTs} js={usageJs} />

        <h2>What you get</h2>
        <ul>
          <li>
            <strong>Runtime validation</strong> — a value with the wrong prefix
            (or that isn&apos;t a string at all) fails <code>parse</code>, using
            prefID&apos;s own <code>isId</code> under the hood.
          </li>
          <li>
            <strong>Type narrowing</strong> — the parsed field is typed{" "}
            <code>
              {"`"}
              {"${prefix}_${string}"}
              {"`"}
            </code>
            , not plain <code>string</code>, so the compiler still stops you from
            passing a user ID where an order ID is expected.
          </li>
          <li>
            <strong>Composable</strong> — it&apos;s an ordinary Zod schema, so it
            nests inside <code>z.object</code>, <code>z.array</code>, and works
            with <code>safeParse</code>.
          </li>
        </ul>

        <h2>Options</h2>
        <CodeBlock code={options} />
        <ul>
          <li>
            <code>separator</code> — match a non-default separator (mirrors{" "}
            <Link href="/docs/api/create-id">
              <code>createId</code>
            </Link>
            &apos;s <code>separator</code>). Default <code>&quot;_&quot;</code>.
          </li>
          <li>
            <code>message</code> — a custom error message for the failure.
          </li>
        </ul>

        <h2>Links</h2>
        <ul>
          <li>
            <a href="https://www.npmjs.com/package/prefid-zod">
              prefID-zod on npm
            </a>
          </li>
          <li>
            <a href="https://zod.dev">Zod documentation</a>
          </li>
        </ul>
      </div>

      <DocsPager />
    </>
  );
}
