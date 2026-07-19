import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "isId() & getPrefix()" };

const isIdSig = `function isId<P extends string>(
  value: unknown,
  prefix: P,
  separator?: string // default: "_"
): value is \`\${P}_\${string}\``;

const isIdUsage = `import { isId } from "prefid";

function handle(value: unknown) {
  if (isId(value, "user")) {
    // value is now typed as \`user_\${string}\`
    value.toUpperCase();
  }
}

isId("user_abc", "user");  // => true
isId("order_abc", "user"); // => false
isId(42, "user");          // => false`;

const getPrefixSig = `function getPrefix(
  value: string,
  separator?: string // default: "_"
): string | undefined`;

const getPrefixUsage = `import { getPrefix } from "prefid";

getPrefix("user_a1b2c3");  // => "user"
getPrefix("order_9f8e7d"); // => "order"
getPrefix("no-separator"); // => undefined`;

export default function ValidationPage() {
  return (
    <>
      <PageHeader
        title="isId() & getPrefix()"
        lead="Helpers to check whether a value is a given kind of ID, and to read the prefix back out."
      />

      <div className="prose-doc">
        <h2>isId()</h2>
        <p>
          A type guard that returns <code>true</code> when a value is a string
          beginning with <code>{"${prefix}${separator}"}</code>. On the{" "}
          <code>true</code> branch, TypeScript narrows the value to the matching
          prefixed-ID type.
        </p>
        <CodeBlock code={isIdSig} />
        <CodeBlock code={isIdUsage} />

        <h2>getPrefix()</h2>
        <p>
          Extracts the prefix portion of an ID, or returns{" "}
          <code>undefined</code> when the separator is absent (or leading).
        </p>
        <CodeBlock code={getPrefixSig} />
        <CodeBlock code={getPrefixUsage} />

        <h2>Custom separators</h2>
        <p>
          Both helpers accept an optional <code>separator</code> argument, so
          they work with generators configured to use something other than the
          default underscore.
        </p>
      </div>

      <DocsPager />
    </>
  );
}
