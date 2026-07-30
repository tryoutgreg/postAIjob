export default function WarnActCta() {
  return (
    <div className="rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 via-white to-white shadow-lg shadow-amber-500/5 overflow-hidden dark:from-amber-950/20 dark:via-gray-900 dark:to-gray-900">
      <div className="px-5 py-4 border-b border-amber-100/60 dark:border-amber-900/30 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-amber-400 shrink-0" />
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
          Labor law — USA
        </p>
      </div>
      <div className="p-5 md:p-6">
        <h3 className="font-bold text-gray-800 dark:text-white/90 text-lg">
          50+ people laid off without 60-day notice?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl leading-relaxed">
          The WARN Act (USA) may entitle you to compensation. If your company laid off more than 50
          employees without the required 60-day notice, you may qualify for legal assistance.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-100 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/25 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Legal partner link — coming soon
        </div>
      </div>
    </div>
  );
}
