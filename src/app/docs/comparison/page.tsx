import { CodeSample } from "@/components/CodeSample";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Comparison" };

const rows = [
  { name: "uuid", prefixes: false, typed: false, secure: true, deps: "0" },
  { name: "nanoid", prefixes: false, typed: false, secure: true, deps: "0" },
  { name: "prefID", prefixes: true, typed: true, secure: true, deps: "0", highlight: true },
];

const exampleTs = `import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import { id } from "prefid";

uuidv4(); // "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
nanoid(); // "V1StGXR8_Z5jdHi6B-myT"
id("user"); // "user_a8Kd0f2bQ1nR7pZ3xW4mT6y"  ← self-describing + typed`;

const exampleJs = `const { v4: uuidv4 } = require("uuid");
const { nanoid } = require("nanoid");
const { id } = require("prefid");

uuidv4(); // "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
nanoid(); // "V1StGXR8_Z5jdHi6B-myT"
id("user"); // "user_a8Kd0f2bQ1nR7pZ3xW4mT6y"  ← self-describing`;

function Cell({ value }: { value: boolean }) {
  return <span>{value ? "✅" : "❌"}</span>;
}

export default function ComparisonPage() {
  return (
    <>
      <PageHeader
        title="Comparison"
        lead="How prefID relates to the ID libraries you already know."
      />

      <div className="prose-doc">
        <p>
          prefID isn&apos;t trying to replace <code>uuid</code> or{" "}
          <code>nanoid</code> — it borrows their strengths (secure randomness,
          zero dependencies) and adds two things neither has: a{" "}
          <strong>prefix</strong> and a <strong>type-safe</strong> return value.
        </p>

        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                <th className="py-2 pr-4 font-semibold text-slate-900 dark:text-white" />
                <th className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">
                  Prefixes
                </th>
                <th className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">
                  Type-safe prefix
                </th>
                <th className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">
                  Secure RNG
                </th>
                <th className="py-2 font-semibold text-slate-900 dark:text-white">
                  Dependencies
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.name}
                  className={
                    "border-b border-slate-100 dark:border-slate-800/60 " +
                    (row.highlight ? "bg-brand-50/60 dark:bg-brand-500/5" : "")
                  }
                >
                  <td className="py-2 pr-4 font-mono font-semibold text-slate-900 dark:text-white">
                    {row.name}
                  </td>
                  <td className="py-2 pr-4">
                    <Cell value={row.prefixes} />
                  </td>
                  <td className="py-2 pr-4">
                    <Cell value={row.typed} />
                  </td>
                  <td className="py-2 pr-4">
                    <Cell value={row.secure} />
                  </td>
                  <td className="py-2 font-mono text-slate-600 dark:text-slate-400">
                    {row.deps}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Side by side</h2>
        <CodeSample ts={exampleTs} js={exampleJs} />

        <h2>When to use which</h2>
        <ul>
          <li>
            <strong>uuid</strong> — you need the formal standard (a Postgres{" "}
            <code>UUID</code> column, interop with other systems, or a
            time-sortable v7 key).
          </li>
          <li>
            <strong>nanoid</strong> — you want a short, URL-friendly random
            string and don&apos;t care about prefixes or a standard.
          </li>
          <li>
            <strong>prefID</strong> — you want readable, self-describing IDs
            that TypeScript understands: <code>user_...</code>,{" "}
            <code>order_...</code>.
          </li>
        </ul>
      </div>

      <DocsPager />
    </>
  );
}
