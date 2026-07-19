export function PageHeader({
  title,
  lead,
}: {
  title: string;
  lead: string;
}) {
  return (
    <header className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-800">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h1>
      <p className="mt-3 text-lg leading-8 text-slate-600 dark:text-slate-400">
        {lead}
      </p>
    </header>
  );
}
