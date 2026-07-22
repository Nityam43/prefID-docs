import type { ReactNode } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { CodeSample } from "@/components/CodeSample";
import { DocsPager } from "@/components/DocsPager";
import { PageHeader } from "@/components/PageHeader";
import { DatabaseIcon, TagIcon } from "@/components/icons";

export const metadata = { title: "Recipes" };

function RecipeHeading({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2.5">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
        {icon}
      </span>
      {children}
    </h2>
  );
}

const drizzleTs = `import { id } from "prefid";
import { pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => id("user")),
  email: text("email").notNull(),
});`;

const drizzleJs = `const { id } = require("prefid");
const { pgTable, text } = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => id("user")),
  email: text("email").notNull(),
});`;

const prismaSchema = `// schema.prisma
model User {
  id    String @id   // supply the value from your app
  email String @unique
}`;

const prismaTs = `import { id } from "prefid";

await prisma.user.create({
  data: { id: id("user"), email },
});`;

const prismaJs = `const { id } = require("prefid");

await prisma.user.create({
  data: { id: id("user"), email },
});`;

const sql = `-- prefID ids are strings; store them as TEXT (or VARCHAR).
CREATE TABLE users (
  id    TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);`;

const mongooseTs = `import { id } from "prefid";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  _id: { type: String, default: () => id("user") },
  email: { type: String, required: true },
});

export const User = model("User", userSchema);`;

const mongooseJs = `const { id } = require("prefid");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  _id: { type: String, default: () => id("user") },
  email: { type: String, required: true },
});

module.exports.User = model("User", userSchema);`;

const codesTs = `import { template, BASE32_CROCKFORD } from "prefid";

// Coupon / invite codes: unambiguous (no 0/O or 1/l) and easy to read aloud.
const coupon = template("SAVE-####-####", { alphabet: BASE32_CROCKFORD });

coupon(); // => "SAVE-7K2M-9XQP"`;

const codesJs = `const { template, BASE32_CROCKFORD } = require("prefid");

// Coupon / invite codes: unambiguous (no 0/O or 1/l) and easy to read aloud.
const coupon = template("SAVE-####-####", { alphabet: BASE32_CROCKFORD });

coupon(); // => "SAVE-7K2M-9XQP"`;

export default function RecipesPage() {
  return (
    <>
      <PageHeader
        title="Recipes"
        lead="Copy-paste patterns for dropping prefID into the tools you already use — ORMs, databases, and human-friendly codes."
      />

      <div className="prose-doc">
        <RecipeHeading icon={<DatabaseIcon className="h-4 w-4" />}>
          Drizzle — id as the column default
        </RecipeHeading>
        <p>
          Generate the id in the schema with <code>$defaultFn</code>, so every
          insert gets a typed, prefixed key automatically.
        </p>
        <CodeSample ts={drizzleTs} js={drizzleJs} />

        <RecipeHeading icon={<DatabaseIcon className="h-4 w-4" />}>
          Prisma — id from your app
        </RecipeHeading>
        <p>
          Prisma can&apos;t call JavaScript in the schema, so declare a plain{" "}
          <code>String @id</code> and pass the value when you create the row.
        </p>
        <CodeBlock code={prismaSchema} lang="prisma" />
        <CodeSample ts={prismaTs} js={prismaJs} />

        <RecipeHeading icon={<DatabaseIcon className="h-4 w-4" />}>
          Postgres — the column type
        </RecipeHeading>
        <p>
          A prefID is just a string. Store it as <code>TEXT</code> with a{" "}
          <code>PRIMARY KEY</code> (or <code>UNIQUE</code>) constraint — the
          database stays the ultimate referee for uniqueness.
        </p>
        <CodeBlock code={sql} lang="sql" />

        <RecipeHeading icon={<DatabaseIcon className="h-4 w-4" />}>
          Mongoose / MongoDB — string _id
        </RecipeHeading>
        <p>
          Use a prefID as the document <code>_id</code> instead of an ObjectId —
          you get a readable, self-describing key with the same one-per-document
          guarantee.
        </p>
        <CodeSample ts={mongooseTs} js={mongooseJs} />

        <RecipeHeading icon={<TagIcon className="h-4 w-4" />}>
          Human-friendly codes
        </RecipeHeading>
        <p>
          For coupon, invite, or referral codes that people read and type, pair{" "}
          <code>template</code> with the <code>BASE32_CROCKFORD</code> alphabet —
          it drops the look-alike characters <code>I</code>, <code>L</code>,{" "}
          <code>O</code>, <code>U</code>.
        </p>
        <CodeSample ts={codesTs} js={codesJs} />
      </div>

      <DocsPager />
    </>
  );
}
