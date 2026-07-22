import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { CodeSample } from "@/components/CodeSample";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "sortableId()" };

const usageTs = `import { sortableId, getTimestamp } from "prefid";

sortableId("evt"); // => "evt_00VQ5a1k0lBjgjfx6pwYy6WkY"
sortableId("evt"); // => "evt_00VQ5a1mgkWGzAvv93g1bC3yR"  ← later, sorts after

// Read back the millisecond timestamp baked into the id:
getTimestamp("evt_00VQ5a1k0lBjgjfx6pwYy6WkY"); // => 1721600000000`;

const usageJs = `const { sortableId, getTimestamp } = require("prefid");

sortableId("evt"); // => "evt_00VQ5a1k0lBjgjfx6pwYy6WkY"
sortableId("evt"); // => "evt_00VQ5a1mgkWGzAvv93g1bC3yR"  ← later, sorts after

// Read back the millisecond timestamp baked into the id:
getTimestamp("evt_00VQ5a1k0lBjgjfx6pwYy6WkY"); // => 1721600000000`;

const sorting = `const ids = [sortableId("row"), sortableId("row"), sortableId("row")];

// A plain string sort is also a chronological sort — no parsing needed.
[...ids].sort(); // same order they were created in`;

const configureTs = `import { createSortableId } from "prefid";

// A generator with your own settings:
const newId = createSortableId({
  randomSize: 20,   // more entropy in the random tail
  separator: "-",   // "evt-…"
});

newId("evt"); // => "evt-00VQ5a1k0lBjgjfx6pwYy6WkYq2mT"`;

const configureJs = `const { createSortableId } = require("prefid");

// A generator with your own settings:
const newId = createSortableId({
  randomSize: 20,   // more entropy in the random tail
  separator: "-",   // "evt-…"
});

newId("evt"); // => "evt-00VQ5a1k0lBjgjfx6pwYy6WkYq2mT"`;

const signature = `function createSortableId(options?: {
  separator?: string;      // default: "_"
  alphabet?: string;       // default: base62 (must be ascending)
  randomSize?: number;     // default: 16
  timestampSize?: number;  // default: fits 2^48-1 ms (9 base62 chars)
  monotonic?: boolean;     // default: true
  now?: () => number;      // default: Date.now
}): <P extends string>(prefix: P) => \`\${P}_\${string}\`

// A ready-made generator with the defaults:
const sortableId: <P extends string>(prefix: P) => \`\${P}_\${string}\``;

export default function SortableIdPage() {
  return (
    <>
      <PageHeader
        title="sortableId()"
        lead="Time-ordered, prefixed IDs — a fixed-width timestamp plus a random tail, so IDs sort chronologically as plain strings. The idea behind ULID and UUIDv7, with prefID's prefix and type."
      />

      <div className="prose-doc">
        <h2>Usage</h2>
        <p>
          <code>sortableId</code> works just like{" "}
          <Link href="/docs/api/id">
            <code>id()</code>
          </Link>{" "}
          — pass a prefix, get back a typed{" "}
          <code>
            {"`"}
            {"${prefix}_${string}"}
            {"`"}
          </code>
          . The difference is the body: it starts with an encoded timestamp, so
          newer IDs always sort after older ones.
        </p>
        <CodeSample ts={usageTs} js={usageJs} />

        <h2>Why sortable IDs?</h2>
        <ul>
          <li>
            <strong>Database-friendly</strong> — time-ordered keys keep inserts
            local in B-tree indexes, avoiding the page fragmentation that random
            UUIDs cause.
          </li>
          <li>
            <strong>Natural cursors</strong> — &ldquo;everything after this
            ID&rdquo; is a chronological range query, no separate timestamp
            column required.
          </li>
          <li>
            <strong>Coordination-free</strong> — every process generates ordered
            IDs on its own; there is no central sequence or lock.
          </li>
        </ul>

        <h2>Sorting</h2>
        <p>
          Because the timestamp is fixed-width and encoded with an ascending
          alphabet, lexicographic order equals chronological order. No decoding
          is needed to sort:
        </p>
        <CodeBlock code={sorting} />

        <h2>Monotonic ordering</h2>
        <p>
          By default the generator is <strong>monotonic</strong>: IDs created
          within the same millisecond — or when the system clock steps backwards
          — are still <em>strictly</em> increasing. Instead of drawing a fresh
          random tail, prefID increments the previous one; if that tail is ever
          exhausted within a millisecond, it spills into the next. Pass{" "}
          <code>monotonic: false</code> for a stateless generator that is only
          ordered at millisecond granularity.
        </p>

        <h2>Reading the timestamp</h2>
        <p>
          <code>getTimestamp(id, options?)</code> decodes the millisecond
          timestamp embedded in a sortable ID, or returns{" "}
          <code>undefined</code> if the value is not a well-formed sortable ID.
          Pass the same <code>alphabet</code>, <code>separator</code>, and{" "}
          <code>timestampSize</code> the ID was generated with (the defaults
          match <code>sortableId</code>).
        </p>

        <h2>Configuring</h2>
        <p>
          Use <code>createSortableId()</code> to build a generator with fixed
          options, then reuse it:
        </p>
        <CodeSample ts={configureTs} js={configureJs} />

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
                  separator
                </td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2 pr-4 font-mono">&quot;_&quot;</td>
                <td className="py-2">
                  Text between the prefix and the body.
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-2 pr-4 font-mono text-slate-900 dark:text-slate-200">
                  alphabet
                </td>
                <td className="py-2 pr-4 font-mono">string</td>
                <td className="py-2 pr-4 font-mono">base62</td>
                <td className="py-2">
                  Characters for the timestamp and random tail. Must be in
                  strictly ascending code-point order so sorting works.
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-2 pr-4 font-mono text-slate-900 dark:text-slate-200">
                  randomSize
                </td>
                <td className="py-2 pr-4 font-mono">number</td>
                <td className="py-2 pr-4 font-mono">16</td>
                <td className="py-2">
                  Random characters after the timestamp (1&ndash;4096).
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-2 pr-4 font-mono text-slate-900 dark:text-slate-200">
                  timestampSize
                </td>
                <td className="py-2 pr-4 font-mono">number</td>
                <td className="py-2 pr-4 font-mono">9</td>
                <td className="py-2">
                  Width of the encoded timestamp. Defaults to the smallest width
                  that holds any time up to the year 10889.
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-2 pr-4 font-mono text-slate-900 dark:text-slate-200">
                  monotonic
                </td>
                <td className="py-2 pr-4 font-mono">boolean</td>
                <td className="py-2 pr-4 font-mono">true</td>
                <td className="py-2">
                  Guarantee strictly increasing IDs within a process.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-slate-900 dark:text-slate-200">
                  now
                </td>
                <td className="py-2 pr-4 font-mono">{"() => number"}</td>
                <td className="py-2 pr-4 font-mono">Date.now</td>
                <td className="py-2">Clock source, for testing or custom epochs.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Notes</h2>
        <ul>
          <li>
            A sortable <code>alphabet</code> must be in strictly ascending
            code-point order (the default base62 already is) — otherwise a
            string sort would not match time order, so{" "}
            <code>createSortableId</code> throws a <code>RangeError</code>.
          </li>
          <li>
            The random tail uses the same cryptographic RNG as{" "}
            <Link href="/docs/api/id">
              <code>id()</code>
            </Link>
            , so IDs are unguessable as well as ordered.
          </li>
          <li>
            <Link href="/docs/api/validation">
              <code>isId()</code> and <code>getPrefix()</code>
            </Link>{" "}
            work on sortable IDs unchanged — the format is still{" "}
            <code>prefix_body</code>.
          </li>
          <li>
            For case-insensitive, unambiguous ids (ULID-style), pass the
            exported <code>BASE32_CROCKFORD</code> alphabet — it omits{" "}
            <code>I</code>, <code>L</code>, <code>O</code>, <code>U</code> and is
            already ascending, so it stays sortable.
          </li>
        </ul>
      </div>

      <DocsPager />
    </>
  );
}
