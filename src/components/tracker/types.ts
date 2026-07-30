export type Source = 'reddit' | 'form';
export type CompanySize =
  | 'startup'
  | 'small_51_200'
  | 'mid_201_1000'
  | 'large_1000plus'
  | 'unknown';
export type NextStep =
  | 'new_job_same_field'
  | 'pivoted_industry'
  | 'reskilling'
  | 'freelance'
  | 'started_business'
  | 'still_searching'
  | 'unknown';

export interface Report {
  id: string;
  source: Source;
  source_url: string | null;
  subreddit: string | null;
  reddit_author?: string | null;
  submission_id?: string | null;
  company: string;
  company_size: CompanySize;
  country: string;
  state: string | null;
  industry: string;
  job_title: string;
  layoff_date: string; // 'YYYY-MM'
  ai_tool_replaced: string;
  next_step: NextStep;
  next_step_detail: string | null;
  severance_offered: boolean | null;
  free_text: string | null;
  created_at: string;
  people_count?: number;
  job_function?: string;
}

export const NEXT_STEP_LABELS: Record<NextStep, string> = {
  new_job_same_field: 'New job, same field',
  pivoted_industry: 'Switched industry',
  reskilling: 'Reskilling',
  freelance: 'Freelance',
  started_business: 'Started a business',
  still_searching: 'Still searching',
  unknown: 'Unknown',
};

export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  startup: 'Startup (< 50)',
  small_51_200: 'Small (51–200)',
  mid_201_1000: 'Mid-size (201–1000)',
  large_1000plus: 'Large (1000+)',
  unknown: 'Unknown',
};
