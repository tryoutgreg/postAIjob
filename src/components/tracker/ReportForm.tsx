'use client';

import { useState } from 'react';
import { ChevronLeftIcon } from '@/icons';

// ─── Dane stałe ──────────────────────────────────────────────────────────────

const JOB_FUNCTIONS = [
  'Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'QA / Test Engineer',
  'DevOps / Infrastructure',
  'Data Engineer / Analyst',
  'ML / AI Engineer',
  'Technical Writer',
  'Product Manager',
  'Product / UX Designer',
  'Graphic / Motion Designer',
  'Writer / Copywriter',
  'Marketing Specialist',
  'Sales / Account Executive',
  'Accountant / Finance',
  'HR / Recruiting',
  'IT Operations',
  'Customer Support',
  'Legal / Compliance',
  'Translator',
  'Operations / Admin',
  'Other',
];

const INDUSTRIES = [
  // Tech subcategories (replaces "Tech/IT")
  'Software Engineering',
  'QA / Testing',
  'DevOps / Infrastructure',
  'Technical Writing',
  'Product & UX Design',
  'Data & Analytics',
  'IT Operations',
  // Other sectors
  'Finance',
  'Healthcare',
  'Education',
  'Media/Marketing',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Legal',
  'BPO/Services',
  'E-commerce',
  'Other',
];

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'PL', name: 'Poland' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'IN', name: 'India' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
  { code: 'SG', name: 'Singapore' },
  { code: 'JP', name: 'Japan' },
  { code: 'OTHER', name: 'Other' },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

const MONTHS = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' }, { value: '04', label: 'April' },
  { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' },
  { value: '09', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

const YEARS = Array.from({ length: 6 }, (_, i) => String(2021 + i));

const NEXT_STEPS = [
  { value: 'new_job_same_field', label: 'New job, same field' },
  { value: 'pivoted_industry', label: 'Switched industry' },
  { value: 'reskilling', label: 'Reskilling (courses, learning)' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'started_business', label: 'Started a business' },
  { value: 'still_searching', label: 'Still searching' },
  { value: 'unknown', label: 'Not sure yet' },
];

const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup (< 50 people)' },
  { value: 'small_51_200', label: 'Small (51–200 people)' },
  { value: 'mid_201_1000', label: 'Mid-size (201–1000 people)' },
  { value: 'large_1000plus', label: 'Large (1000+ people)' },
  { value: 'unknown', label: 'Not sure' },
];

// ─── Kroki formularza ────────────────────────────────────────────────────────

const STEPS = [
  { title: 'Your company',    subtitle: 'Where did you work?' },
  { title: 'Your role',       subtitle: 'What was your position?' },
  { title: 'The AI takeover', subtitle: 'What happened and what\'s next?' },
  { title: 'Tell us more',    subtitle: 'Optional — helps us understand the context' },
];

// ─── Style — wzorzec TailAdmin InputField ────────────────────────────────────

const inputBase = [
  'h-11 w-full rounded-lg border appearance-none',
  'px-4 py-2.5 text-sm shadow-theme-xs',
  'bg-transparent text-gray-800 border-gray-300',
  'placeholder:text-gray-400',
  'focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300',
  'dark:border-gray-700 dark:bg-gray-900 dark:text-white/90',
  'dark:placeholder:text-white/30 dark:focus:border-brand-800',
  'transition',
].join(' ');

const textareaBase = [
  'w-full rounded-lg border',
  'px-4 py-3 text-sm shadow-theme-xs',
  'bg-transparent text-gray-800 border-gray-300',
  'placeholder:text-gray-400',
  'focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300',
  'dark:border-gray-700 dark:bg-gray-900 dark:text-white/90',
  'dark:placeholder:text-white/30 dark:focus:border-brand-800',
  'transition',
].join(' ');

const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5';

// ─── Komponent formularza ────────────────────────────────────────────────────

interface Props {
  onSuccess?: () => void;
}

const SENIORITY_LEVELS = [
  { value: 'junior', label: 'Junior / Entry level' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Principal' },
  { value: 'manager', label: 'Manager / Director' },
  { value: 'unknown', label: 'Prefer not to say' },
];

type FormState = {
  company: string;
  country: string;
  company_size: string;
  state: string;
  industry: string;
  job_function: string;
  job_title: string;
  seniority_level: string;
  layoff_month: string;
  layoff_year: string;
  ai_tool_replaced: string;
  next_step: string;
  next_step_detail: string;
  severance_offered: string;
  free_text: string;
};

function isStepValid(step: number, form: FormState): boolean {
  switch (step) {
    case 0:
      return !!(form.company && form.country && form.company_size &&
        (form.country !== 'US' || form.state));
    case 1:
      return !!(form.industry && form.job_function && form.layoff_month && form.layoff_year);
    case 2:
      return !!(form.ai_tool_replaced && form.next_step);
    case 3:
      return true;
    default:
      return false;
  }
}

export default function ReportForm({ onSuccess }: Props) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    company: '', country: '', company_size: '', state: '',
    industry: '', job_function: '', job_title: '', seniority_level: '', layoff_month: '', layoff_year: '',
    ai_tool_replaced: '', next_step: '', next_step_detail: '', severance_offered: '', free_text: '',
  });

  const set = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleNext = () => {
    if (isStepValid(step, form)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('reports').insert({
      source: 'form',
      company: form.company || null,
      country: form.country || null,
      company_size: form.company_size || null,
      state: form.state || null,
      industry: form.industry,
      job_function: form.job_function || null,
      job_title: form.job_title || null,
      seniority_level: form.seniority_level && form.seniority_level !== 'unknown' ? form.seniority_level : null,
      layoff_date: `${form.layoff_year}-${form.layoff_month}`,
      ai_tool_replaced: form.ai_tool_replaced || null,
      next_step: form.next_step || null,
      next_step_detail: form.next_step_detail || null,
      severance_offered: form.severance_offered === 'true' ? true : form.severance_offered === 'false' ? false : null,
      free_text: form.free_text || null,
      people_count: 1,
    });
    setSubmitted(true);
    onSuccess?.();
  };

  if (submitted) {
    return (
      <div className="py-10 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-success-50 dark:bg-success-500/10 rounded-2xl mx-auto mb-5">
          <svg className="text-success-600 dark:text-success-400 size-7" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 dark:text-white/90 text-xl">Thank you for your submission</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Your case has been added to the tracker.
        </p>
      </div>
    );
  }

  const canProceed = isStepValid(step, form);

  return (
    <div>
      {/* Pasek postępu — element sygnaturowy formularza */}
      <div className="mb-8">
        {/* Track z kropkami kroków */}
        <div className="relative">
          {/* Tło paska */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
          {/* Wypełnienie odpowiadające postępowi */}
          <div
            className="absolute top-0 left-0 h-1 bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          />
          {/* Kropki kroków */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={[
                  'h-3 w-3 rounded-full border-2 transition-all duration-300',
                  i <= step
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
        {/* Etykieta kroku */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {STEPS.map((s) => s.title).join(' → ').split(' → ')[step]}
          </p>
        </div>
      </div>

      {/* Tytuł kroku */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {STEPS[step].title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {STEPS[step].subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Krok 1: Firma, Kraj, Wielkość firmy ── */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Company name *</label>
              <input
                type="text"
                className={inputBase}
                placeholder="e.g. Acme Corp"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Country *</label>
                <select
                  className={inputBase}
                  value={form.country}
                  onChange={(e) => { set('country', e.target.value); set('state', ''); }}
                >
                  <option value="">Select country…</option>
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Company size *</label>
                <select
                  className={inputBase}
                  value={form.company_size}
                  onChange={(e) => set('company_size', e.target.value)}
                >
                  <option value="">Select…</option>
                  {COMPANY_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
            {form.country === 'US' && (
              <div>
                <label className={labelClass}>
                  State (USA) *{' '}
                  <span className="font-normal text-gray-400">— helps determine legal eligibility</span>
                </label>
                <select
                  className={inputBase}
                  value={form.state}
                  onChange={(e) => set('state', e.target.value)}
                >
                  <option value="">Select state…</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* ── Krok 2: Branża, Stanowisko, Data ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Industry *</label>
                <select
                  className={inputBase}
                  value={form.industry}
                  onChange={(e) => set('industry', e.target.value)}
                  autoFocus
                >
                  <option value="">Select…</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Role / function *</label>
                <select
                  className={inputBase}
                  value={form.job_function}
                  onChange={(e) => set('job_function', e.target.value)}
                >
                  <option value="">Select…</option>
                  {JOB_FUNCTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Job title</label>
                <input
                  type="text"
                  className={inputBase}
                  placeholder="e.g. Software Engineer"
                  value={form.job_title}
                  onChange={(e) => set('job_title', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Seniority level</label>
                <select
                  className={inputBase}
                  value={form.seniority_level}
                  onChange={(e) => set('seniority_level', e.target.value)}
                >
                  <option value="">Select…</option>
                  {SENIORITY_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Month and year of layoff *</label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  className={inputBase}
                  value={form.layoff_month}
                  onChange={(e) => set('layoff_month', e.target.value)}
                >
                  <option value="">Month…</option>
                  {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <select
                  className={inputBase}
                  value={form.layoff_year}
                  onChange={(e) => set('layoff_year', e.target.value)}
                >
                  <option value="">Year…</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Krok 3: AI, co dalej, odprawa ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>AI tool that replaced you *</label>
              <input
                type="text"
                className={inputBase}
                placeholder="e.g. ChatGPT, Cursor, internal AI agent"
                value={form.ai_tool_replaced}
                onChange={(e) => set('ai_tool_replaced', e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>What are you doing now? *</label>
                <select
                  className={inputBase}
                  value={form.next_step}
                  onChange={(e) => set('next_step', e.target.value)}
                >
                  <option value="">Select…</option>
                  {NEXT_STEPS.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Severance?</label>
                <select
                  className={inputBase}
                  value={form.severance_offered}
                  onChange={(e) => set('severance_offered', e.target.value)}
                >
                  <option value="">Prefer not to say</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                  <option value="null">Don&apos;t remember</option>
                </select>
              </div>
            </div>
            {['reskilling', 'pivoted_industry', 'new_job_same_field'].includes(form.next_step) && (
              <div>
                <label className={labelClass}>
                  {form.next_step === 'reskilling'
                    ? 'What are you learning / reskilling into?'
                    : 'What role or field did you move to?'}
                </label>
                <input
                  type="text"
                  className={inputBase}
                  placeholder="e.g. Data Science, UX Design, cybersecurity course"
                  value={form.next_step_detail}
                  onChange={(e) => set('next_step_detail', e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Krok 4: Opowiedz więcej + submit ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Tell us more (optional)</label>
              <textarea
                rows={5}
                className={textareaBase}
                placeholder="Describe your case — how AI was introduced, what changed, how management responded…"
                value={form.free_text}
                onChange={(e) => set('free_text', e.target.value)}
                autoFocus
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                Quotes from this field may appear in the tracker (anonymously).
              </p>
            </div>
          </div>
        )}

        {/* ── Przyciski nawigacji ── */}
        <div className={`flex gap-3 mt-6 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition shadow-theme-xs"
            >
              <ChevronLeftIcon className="size-4" />
              Back
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={[
                'inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-medium shadow-theme-xs transition',
                canProceed
                  ? 'bg-brand-500 text-white hover:bg-brand-600'
                  : 'bg-brand-200 text-white cursor-not-allowed dark:bg-brand-500/30',
              ].join(' ')}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 shadow-theme-xs transition"
            >
              Submit report
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
