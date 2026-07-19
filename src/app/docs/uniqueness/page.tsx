import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Uniqueness & Collisions" };

const dbConstraint = `-- The database is the ultimate referee for uniqueness.
CREATE TABLE users (
  id TEXT PRIMARY KEY,   -- rejects any duplicate
  email TEXT NOT NULL
);`;

export default function UniquenessPage() {
  return (
    <>
      <PageHeader
        title="Uniqueness & Collisions"
        lead="How prefID makes collisions so unlikely they never happen — and how to get an absolute guarantee when you need one."
      />

      <div className="prose-doc">
        <h2>Probabilistic uniqueness</h2>
        <p>
          Like <code>uuid</code> and <code>nanoid</code>, prefID does not track
          every ID it has ever produced. Instead it relies on{" "}
          <strong>probabilistic uniqueness</strong>: the random space is so
          large that two IDs colliding is effectively impossible.
        </p>

        <h2>How much entropy?</h2>
        <p>
          The default ID uses 24 characters from a 62-character alphabet — about{" "}
          <strong>142 bits of randomness</strong>, more than a UUID v4 (122
          bits). In practical terms, you could generate a billion IDs per second
          for tens of thousands of years before reaching a coin-flip chance of a
          single collision.
        </p>
        <ul>
          <li>
            Randomness comes from the platform CSPRNG (
            <code>crypto.getRandomValues</code>), never <code>Math.random()</code>.
          </li>
          <li>
            Characters are chosen with masking + rejection sampling, so the
            distribution is unbiased.
          </li>
          <li>
            Two IDs with <strong>different prefixes can never collide</strong> —
            they are different strings by construction.
          </li>
        </ul>

        <h2>Tuning the odds</h2>
        <p>
          Need even more headroom? Increase the size — every extra character
          multiplies the space.
        </p>
        <CodeBlock code={`const id = createId({ size: 32 }); // ~190 bits of entropy`} />

        <h2>An absolute guarantee</h2>
        <p>
          Probability isn&apos;t certainty. For a hard guarantee, do what you
          would with any ID generator: add a <code>UNIQUE</code> or{" "}
          <code>PRIMARY KEY</code> constraint in your database. If a duplicate
          ever appeared (it won&apos;t), the insert fails loudly instead of
          corrupting data.
        </p>
        <CodeBlock code={dbConstraint} lang="sql" />

        <p>
          You can also generate-and-check in application code with{" "}
          <Link href="/docs/api/ensure-unique">
            <code>ensureUnique()</code>
          </Link>
          . The recommended combination is <strong>strong entropy</strong> +{" "}
          <strong>a database constraint</strong> — the same approach used with{" "}
          <code>uuid</code>.
        </p>
      </div>

      <DocsPager />
    </>
  );
}
