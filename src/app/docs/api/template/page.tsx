import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "template()" };

const basic = `import { template } from "prefid";

const userId = template("user_########");
userId(); // "user_a8Kd0f2b"

const invoice = template("INV-####-####");
invoice(); // "INV-a3F2-9k1P"`;

const options = `// Custom placeholder (default is "#")
template("room-***", { placeholder: "*" })();
// "room-a3F"

// Custom alphabet — digits only, for numeric codes
template("pin-####", { alphabet: "0123456789" })();
// "pin-4821"`;

const typed = `const userId = template("user_####")();
//    ^? type: \`user_\${string}\``;

const signature = `function template(
  pattern: string,
  options?: {
    placeholder?: string; // default: "#"
    alphabet?: string;    // default: base62 (0-9A-Za-z)
  },
): () => string`;

export default function TemplatePage() {
  return (
    <>
      <PageHeader
        title="template()"
        lead="Define an ID pattern with placeholders and get random IDs shaped exactly like it."
      />

      <div className="prose-doc">
        <p>
          Use <code>template()</code> when you need a custom layout that{" "}
          <Link href="/docs/api/id">
            <code>id()</code>
          </Link>{" "}
          doesn&apos;t cover — multiple random groups, separators, or fixed
          segments. Each <code>#</code> becomes one secure random character;
          everything else is kept literally.
        </p>

        <CodeBlock code={basic} />

        <h2>Signature</h2>
        <CodeBlock code={signature} />

        <p>
          <code>template()</code> returns a <strong>generator function</strong>:
          call it as many times as you like to get a fresh random ID with the
          same shape each time.
        </p>

        <h2>Options</h2>
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                <th className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">
                  Option
                </th>
                <th className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">
                  Default
                </th>
                <th className="py-2 font-semibold text-slate-900 dark:text-white">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-400">
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-2 pr-4 font-mono text-slate-900 dark:text-slate-200">
                  placeholder
                </td>
                <td className="py-2 pr-4 font-mono">&quot;#&quot;</td>
                <td className="py-2">
                  The single character that marks a random slot. Change it if
                  you need a literal <code>#</code> in the pattern.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-slate-900 dark:text-slate-200">
                  alphabet
                </td>
                <td className="py-2 pr-4 font-mono">base62</td>
                <td className="py-2">
                  Characters used to fill the placeholders.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock code={options} />

        <h2>Type safety</h2>
        <p>
          When you call <code>template()</code> with a string literal and the
          default placeholder, the literal text before the first{" "}
          <code>#</code> is preserved in the return type — so it fits the same
          typed-prefix model as <code>id()</code>.
        </p>
        <CodeBlock code={typed} />

        <h2>Errors</h2>
        <p><code>template()</code> validates its input up front and throws:</p>
        <ul>
          <li>
            <strong>
              <code>TypeError</code>
            </strong>{" "}
            — the pattern is not a non-empty string.
          </li>
          <li>
            <strong>
              <code>RangeError</code>
            </strong>{" "}
            — the pattern has no placeholder, the placeholder isn&apos;t a single
            character, or the alphabet has fewer than 2 characters.
          </li>
        </ul>

        <h2>
          <code>template()</code> vs <code>id()</code>
        </h2>
        <ul>
          <li>
            Reach for{" "}
            <Link href="/docs/api/id">
              <code>id()</code>
            </Link>{" "}
            for the common case — a prefix plus one random block.
          </li>
          <li>
            Reach for <code>template()</code> for custom shapes: invoice numbers,
            room codes, license keys, grouped IDs like{" "}
            <code>INV-####-####</code>.
          </li>
        </ul>
      </div>

      <DocsPager />
    </>
  );
}
