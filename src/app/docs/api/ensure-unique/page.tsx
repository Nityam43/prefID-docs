import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "ensureUnique()" };

const signature = `function ensureUnique<T extends string>(
  generate: () => T,
  exists: (candidate: T) => boolean | Promise<boolean>,
  options?: { maxAttempts?: number } // default: 5
): Promise<T>`;

const usage = `import { ensureUnique, id } from "prefid";

const userId = await ensureUnique(
  () => id("user"),
  (candidate) => db.users.exists(candidate),
);
// userId is typed \`user_\${string}\` and confirmed free in your store`;

const stores = `// Prisma
ensureUnique(() => id("user"), (c) =>
  prisma.user.count({ where: { id: c } }).then((n) => n > 0),
);

// Redis
ensureUnique(() => id("user"), (c) => redis.exists(c).then(Boolean));

// A plain Set (tests / demos)
ensureUnique(() => id("user"), (c) => seen.has(c));`;

export default function EnsureUniquePage() {
  return (
    <>
      <PageHeader
        title="ensureUnique()"
        lead="Retry generation against your own store until a free ID is found — a hard uniqueness guarantee, without state in the library."
      />

      <div className="prose-doc">
        <h2>Signature</h2>
        <CodeBlock code={signature} />

        <h2>Why</h2>
        <p>
          Random IDs are collision-resistant by probability (see{" "}
          <Link href="/docs/uniqueness">Uniqueness &amp; Collisions</Link>). When
          you want a <em>guarantee</em>, check each candidate against your source
          of truth and regenerate on the astronomically rare clash.{" "}
          <code>ensureUnique</code> runs that loop for you — and preserves the
          generator&apos;s typed return value.
        </p>

        <h2>Usage</h2>
        <CodeBlock code={usage} />

        <h2>Works with any store</h2>
        <p>
          You supply the <code>exists</code> check, so <code>ensureUnique</code>{" "}
          stays dependency-free and works with any database, cache, or
          in-memory structure. The check may be synchronous or return a promise.
        </p>
        <CodeBlock code={stores} />

        <h2>Parameters</h2>
        <ul>
          <li>
            <strong>
              <code>generate</code>
            </strong>{" "}
            — produces a candidate ID, e.g. <code>() =&gt; id(&quot;user&quot;)</code>.
          </li>
          <li>
            <strong>
              <code>exists</code>
            </strong>{" "}
            — returns <code>true</code> if the candidate is already taken. Sync
            or async.
          </li>
          <li>
            <strong>
              <code>options.maxAttempts</code>
            </strong>{" "}
            — how many candidates to try before giving up. Defaults to{" "}
            <code>5</code>.
          </li>
        </ul>

        <h2>The loop guard</h2>
        <p>
          If <code>exists</code> keeps reporting collisions — usually a bug that
          always returns <code>true</code> — the function throws after{" "}
          <code>maxAttempts</code> instead of looping forever. That turns a
          hung server into a clear, catchable error.
        </p>

        <h2>Returns &amp; errors</h2>
        <ul>
          <li>
            Resolves to a free ID (typed the same as <code>generate</code>).
          </li>
          <li>
            Rejects with a <code>RangeError</code> if <code>maxAttempts</code>{" "}
            is not a positive integer.
          </li>
          <li>
            Rejects with an <code>Error</code> if no free ID is found within{" "}
            <code>maxAttempts</code>.
          </li>
        </ul>
      </div>

      <DocsPager />
    </>
  );
}
