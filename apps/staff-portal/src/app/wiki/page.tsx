import { WikiClient } from '@/components/wiki/WikiClient';

export default function WikiPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-emerald-950 dark:text-emerald-50 font-heading tracking-tight mb-2">Staff Handbook & Wiki</h1>
        <p className="text-emerald-800 dark:text-emerald-400 font-bold max-w-2xl">
          The official repository of Camp Lawton operational procedures, policies, and campfire culture.
        </p>
      </div>

      <WikiClient initialArticles={[]} />
    </div>
  );
}
