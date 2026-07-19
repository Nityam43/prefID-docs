import { Sidebar } from "@/components/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12">
        <aside className="scrollbar-thin sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto py-10 lg:block">
          <Sidebar />
        </aside>

        <div className="min-w-0 py-8 lg:py-10">
          <details className="mb-8 rounded-xl border border-slate-200 p-4 lg:hidden dark:border-slate-800">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white">
              Menu
            </summary>
            <div className="mt-4">
              <Sidebar />
            </div>
          </details>

          <article className="min-w-0">{children}</article>
        </div>
      </div>
    </div>
  );
}
