import { CodeBlock } from "@/components/CodeBlock";
import { CodeSample } from "@/components/CodeSample";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "isId(), getPrefix() & parseId()" };

const isIdSig = `// Default separator — narrows to \`\${P}_\${string}\`:
function isId<P extends string>(
  value: unknown,
  prefix: P,
): value is \`\${P}_\${string}\`;

// Custom separator — narrows to \`\${P}\${S}\${string}\`:
function isId<P extends string, S extends string>(
  value: unknown,
  prefix: P,
  separator: S,
): value is \`\${P}\${S}\${string}\`;`;

const isIdUsageTs = `import { isId } from "prefid";

function handle(value: unknown) {
  if (isId(value, "user")) {
    // value is now typed as \`user_\${string}\`
    value.toUpperCase();
  }
}

isId("user_abc", "user");  // => true
isId("order_abc", "user"); // => false
isId(42, "user");          // => false`;

const isIdUsageJs = `const { isId } = require("prefid");

function handle(value) {
  if (isId(value, "user")) {
    // value is a "user_…" string here
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

const getPrefixUsageTs = `import { getPrefix } from "prefid";

getPrefix("user_a1b2c3");  // => "user"
getPrefix("order_9f8e7d"); // => "order"
getPrefix("no-separator"); // => undefined`;

const getPrefixUsageJs = `const { getPrefix } = require("prefid");

getPrefix("user_a1b2c3");  // => "user"
getPrefix("order_9f8e7d"); // => "order"
getPrefix("no-separator"); // => undefined`;

const parseIdUsageTs = `import { parseId } from "prefid";

const myId = "user_wLCFZ7EEjBYFmsbnthUkGspX";
const parsed = parseId(myId);

if (parsed) {
  console.log(parsed.prefix); // "user"
  console.log(parsed.id);     // "wLCFZ7EEjBYFmsbnthUkGspX"
}

// Fails safely on invalid inputs
console.log(parseId("nosep")); // undefined
console.log(parseId("user_")); // undefined`;

const parseIdUsageJs = `const { parseId } = require("prefid");

const myId = "evt_00VUDe8n8qKHoKl0tXbtTK56E";
const parsed = parseId(myId);

console.log(parsed?.prefix); // "evt"
console.log(parsed?.id);     // "00VUDe8n8qKHoKl0tXbtTK56E"`;

export default function ValidationPage() {
  return (
    <>
      <PageHeader
        title="isId(), getPrefix() & parseId()"
        lead="Helpers to check whether a value is a given kind of ID, read the prefix, or parse both components."
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
        <CodeSample ts={isIdUsageTs} js={isIdUsageJs} />

        <h2>getPrefix()</h2>
        <p>
          Extracts the prefix portion of an ID, or returns{" "}
          <code>undefined</code> when the separator is absent (or leading).
        </p>
        <CodeBlock code={getPrefixSig} />
        <CodeSample ts={getPrefixUsageTs} js={getPrefixUsageJs} />

        <h2>parseId()</h2>
        <p>
          <code>parseId</code> allows you to safely decompose a generated ID
          back into its original prefix and randomized body. If the string
          provided is not a valid ID, it safely returns <code>undefined</code>.
        </p>
        <CodeSample ts={parseIdUsageTs} js={parseIdUsageJs} />

        <h2>Custom separators</h2>
        <p>
          Both helpers accept an optional <code>separator</code> argument, so
          they work with generators configured to use something other than the
          default underscore. When you pass one to <code>isId</code>, the
          separator flows into the type it narrows to — so{" "}
          <code>isId(value, &quot;user&quot;, &quot;-&quot;)</code> narrows to{" "}
          <code>{"`user-${string}`"}</code>, not the underscore form.
        </p>
      </div>

      <DocsPager />
    </>
  );
}
