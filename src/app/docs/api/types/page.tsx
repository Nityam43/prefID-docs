import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Types" };

const prefixedId = `type PrefixedId<
  P extends string = string,
  S extends string = "_", // the separator
> = \`\${P}\${S}\${string}\`;`;

const prefixedUsage = `import type { PrefixedId } from "prefid";

type UserId = PrefixedId<"user">;
//   = \`user_\${string}\`

function getUser(id: UserId) { /* ... */ }

getUser("user_abc"); // ✅
getUser("order_abc"); // ❌ not assignable to \`user_\${string}\``;

const customSeparator = `import { createId } from "prefid";

// The literal separator flows into the value's type:
const gen = createId({ separator: "-" });
const uid = gen("user");
//    ^? \`user-\${string}\`   (a PrefixedId<"user", "-">)

const wrong: \`user_\${string}\` = uid; // ❌ "-" ids aren't "_" ids`;

const otherTypes = `import type { IdOptions, IdGenerator } from "prefid";

const options: IdOptions = { size: 16, separator: "_" };

// IdGenerator is generic over the separator (defaults to "_"):
const gen: IdGenerator = createId(options);
const dashed: IdGenerator<"-"> = createId({ separator: "-" });`;

export default function TypesPage() {
  return (
    <>
      <PageHeader
        title="Types"
        lead="The public types prefID exports, so you can annotate your own functions and stores."
      />

      <div className="prose-doc">
        <h2>PrefixedId</h2>
        <p>
          The core type. <code>PrefixedId&lt;P&gt;</code> is a template literal
          type describing any string that starts with{" "}
          <code>{"${P}_"}</code>. It takes an optional second parameter,{" "}
          <code>S</code>, for the separator — it defaults to{" "}
          <code>&quot;_&quot;</code>, so <code>PrefixedId&lt;&quot;user&quot;&gt;</code>{" "}
          keeps its usual meaning.
        </p>
        <CodeBlock code={prefixedId} />
        <CodeBlock code={prefixedUsage} />

        <h2>Custom separators are type-sound</h2>
        <p>
          When you build a generator with a non-default separator, that
          separator is carried through to the value&apos;s type — so a{" "}
          <code>&quot;-&quot;</code>-separated ID is typed{" "}
          <code>{"`${P}-${string}`"}</code> and won&apos;t be mistaken for an
          underscore one. The same holds for{" "}
          <code>createSortableId</code> and{" "}
          <code>isId(value, prefix, separator)</code>.
        </p>
        <CodeBlock code={customSeparator} />

        <h2>IdOptions &amp; IdGenerator</h2>
        <p>
          <code>IdOptions</code> is the options object accepted by{" "}
          <code>createId</code>, and <code>IdGenerator&lt;S&gt;</code> is the
          type of the generator it returns — generic over the separator{" "}
          <code>S</code>, which defaults to <code>&quot;_&quot;</code>.
        </p>
        <CodeBlock code={otherTypes} />

        <h2>EnsureUniqueOptions</h2>
        <p>
          The options object accepted by <code>ensureUnique</code> — currently
          just <code>maxAttempts</code>.
        </p>
      </div>

      <DocsPager />
    </>
  );
}
