'use client';

const OPTIONS: { value: 'all' | 'reddit' | 'form'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'form', label: 'Form' },
];

interface Props {
  value: 'all' | 'reddit' | 'form';
  onChange: (v: 'all' | 'reddit' | 'form') => void;
}

export default function SourceFilter({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
        Source
      </span>
      <div className="flex items-center gap-0.5 rounded-xl bg-indigo-50 border border-indigo-100 p-1 dark:bg-indigo-950/30 dark:border-indigo-900/50">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              value === opt.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
