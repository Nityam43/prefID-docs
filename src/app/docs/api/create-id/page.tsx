import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "createId()" };

const signature = `function createId(options?: {
  size?: number;      // default: 24
  separator?: string; // default: "_"
  alphabet?: string;  // default: base62 (0-9A-Za-z)
}): <P extends string>(prefix: P) => \`\${P}_\${string}\``;

const usage = `import { createId } from "prefid";

const id = createId({ size: 16 });

id("user");  // => "user_a1b2c3d4e5f6g7h8"
id("order"); // => "order_9f8e7d6c5b4a3F2e"`;

const separator = `const id = createId({ separator: "-" });

id("user"); // => "user-a1b2c3d4e5f6g7h8i9j0k1l2"`;

const alphabet = `// Lowercase, unambiguous alphabet (no 0/O/1/l)
const id = createId({ alphabet: "23456789abcdefghjkmnpqrstuvwxyz" });

id("code"); // => "code_mn7pqr2stuv9wxyz34abcdef"`;

const preset = `import { createId, BASE32_CROCKFORD } from "prefid";

// Crockford Base32 (the ULID alphabet): omits I, L, O, U.
const id = createId({ alphabet: BASE32_CROCKFORD });

id("code"); // => "code_MN7PQR2STVWXYZ34ABCDEFGH" — no 0/O or 1/l confusion"`;

export default function CreateIdPage() {
  return (
    <>
      <PageHeader
        title="createId()"
        lead="Create a generator with fixed options — set the size, separator, or alphabet once and reuse it."
      />

      <div className="prose-doc">
        <h2>Signature</h2>
        <CodeBlock code={signature} />

        <h2>Options</h2>
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                <th className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">
                  Option
                </th>
                <th className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">
                  Type
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
                  size
                </td>
                <td className="py-2 pr-4 font-mono">number</td>
                <td className="py-2 pr-4 font-mono">24</td>
                <td className="py-2">
                  Number of random characters (1&ndash;4096).
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-2 pr-4 font-mono text-slate-900 dark:text-slate-200">
                  separator
                </td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2 pr-4 font-mono">&quot;_&quot;</td>
                <td className="py-2">
                  Text between the prefix and the random part.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-slate-900 dark:text-slate-200">
                  alphabet
                </td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2 pr-4 font-mono">base62</td>
                <td className="py-2">Characters used for the random part.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Custom size</h2>
        <CodeBlock code={usage} />

        <h2>Custom separator</h2>
        <CodeBlock code={separator} />

        <h2>Custom alphabet</h2>
        <p>
          Provide your own alphabet — for example, a lowercase set that omits
          look-alike characters for human-friendly codes.
        </p>
        <CodeBlock code={alphabet} />
        <p>
          For a ready-made unambiguous, case-insensitive alphabet, import the{" "}
          <code>BASE32_CROCKFORD</code> preset — the same alphabet ULID uses. It
          drops the ambiguous letters <code>I</code>, <code>L</code>,{" "}
          <code>O</code>, and <code>U</code>, so ids are safe to read aloud,
          print, or store in case-folding systems.
        </p>
        <CodeBlock code={preset} />

        <h2>Notes</h2>
        <ul>
          <li>
            <code>size</code> must be an integer between 1 and 4096, and{" "}
            <code>alphabet</code> must contain at least 2 characters — otherwise{" "}
            <code>createId</code> throws a <code>RangeError</code>. The upper
            bound guards against a huge <code>size</code> exhausting memory when
            the value comes from untrusted input.
          </li>
          <li>
            A larger <code>size</code> or <code>alphabet</code> means more
            entropy and even lower collision odds.
          </li>
        </ul>
      </div>

      <DocsPager />
    </>
  );
}
