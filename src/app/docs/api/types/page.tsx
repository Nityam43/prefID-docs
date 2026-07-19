import { CodeBlock } from "@/components/CodeBlock";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Types" };

const prefixedId = `type PrefixedId<P extends string = string> = \`\${P}_\${string}\`;`;

const prefixedUsage = `import type { PrefixedId } from "prefid";

type UserId = PrefixedId<"user">;
//   = \`user_\${string}\`

function getUser(id: UserId) { /* ... */ }

getUser("user_abc"); // ✅
getUser("order_abc"); // ❌ not assignable to \`user_\${string}\``;

const otherTypes = `import type { IdOptions, IdGenerator } from "prefid";

const options: IdOptions = { size: 16, separator: "_" };

const gen: IdGenerator = createId(options);`;

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
          <code>{"${P}_"}</code>.
        </p>
        <CodeBlock code={prefixedId} />
        <CodeBlock code={prefixedUsage} />

        <h2>IdOptions &amp; IdGenerator</h2>
        <p>
          <code>IdOptions</code> is the options object accepted by{" "}
          <code>createId</code>, and <code>IdGenerator</code> is the type of the
          generator function it returns.
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
