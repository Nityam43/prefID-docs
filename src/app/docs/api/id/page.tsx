import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "id()" };

const signature = `function id<P extends string>(prefix: P): \`\${P}_\${string}\``;

const usage = `import { id } from "prefid";

id("user");    // => "user_a8Kd0f2bQ1nR7pZ3xW4mT6y"
id("order");   // => "order_9f8e7d6c5b4a3F2e1D0cB9aX"
id("invoice"); // => "invoice_2xR7pZ3xW4mT6yQ1nR7pZ3x"`;

const errors = `id("");      // ❌ TypeError: prefix must be a non-empty string
id("us_er"); // ❌ TypeError: prefix must not contain the separator "_"`;

export default function IdPage() {
  return (
    <>
      <PageHeader
        title="id()"
        lead="The default generator. Takes a prefix and returns a secure, type-safe prefixed ID."
      />

      <div className="prose-doc">
        <h2>Signature</h2>
        <CodeBlock code={signature} />

        <h2>Usage</h2>
        <p>
          Call <code>id</code> with a prefix string. The default output has 24
          random base62 characters after an underscore separator.
        </p>
        <CodeBlock code={usage} />

        <h2>Parameters</h2>
        <ul>
          <li>
            <strong>
              <code>prefix</code>
            </strong>{" "}
            — a non-empty string that must not contain the separator
            (<code>_</code> by default). This is preserved in the return type.
          </li>
        </ul>

        <h2>Returns</h2>
        <p>
          A string typed as{" "}
          <code>
            {"`"}
            {"${prefix}_${string}"}
            {"`"}
          </code>{" "}
          — for example <code>id(&quot;user&quot;)</code> returns the type{" "}
          <code>
            {"`"}
            user_{"${string}"}
            {"`"}
          </code>
          .
        </p>

        <h2>Errors</h2>
        <p>
          <code>id</code> throws a <code>TypeError</code> when the prefix is
          invalid, so problems surface immediately instead of producing a
          malformed ID.
        </p>
        <CodeBlock code={errors} />

        <h2>Customizing the output</h2>
        <p>
          To change the length, separator, or alphabet, create a configured
          generator with{" "}
          <Link href="/docs/api/create-id">
            <code>createId()</code>
          </Link>
          .
        </p>
      </div>

      <DocsPager />
    </>
  );
}
