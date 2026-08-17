export function normalizeIndustry(raw: string | null | undefined): string {
  if (!raw) return 'Other';
  const s = raw.trim();
  if (/tech|software|\bIT\b|information tech|devops|qa\b|testing|engineering/i.test(s)) return 'Tech';
  if (/media|market|journalism|publishing|broadcast|content|entertainment|advertising/i.test(s)) return 'Media & Marketing';
  if (/finance|banking|credit|fintech|accounting|insurance/i.test(s)) return 'Finance';
  if (/health|medical|pharma|clinical|biotech/i.test(s)) return 'Healthcare';
  if (/education|academ|university|school/i.test(s)) return 'Education';
  if (/legal|law\b|paralegal/i.test(s)) return 'Legal';
  if (/bpo|outsourc|services|translat|linguist/i.test(s)) return 'BPO & Services';
  if (/retail|e-?comm|ecommerce/i.test(s)) return 'Retail & E-commerce';
  if (/manufactur/i.test(s)) return 'Manufacturing';
  if (/consult/i.test(s)) return 'Consulting';
  if (/other|unknown|undisclosed/i.test(s)) return 'Other';
  return s;
}

// ── 2-level job taxonomy ──────────────────────────────────────────────

interface SubRole {
  label: string;
  pattern: RegExp;
}

interface RoleCategory {
  label: string;
  subs: SubRole[];
  fallbackPattern: RegExp;
}

const ROLE_TAXONOMY: RoleCategory[] = [
  {
    label: 'Software Engineering',
    fallbackPattern: /software|engineer|dev(eloper)?|coding|programm|fullstack|full.stack|sre|devops|qa\b|tester|sdet/i,
    subs: [
      { label: 'Frontend Developer', pattern: /front.?end|react|angular|vue|css|html/i },
      { label: 'Backend Developer', pattern: /back.?end|server.side|api dev/i },
      { label: 'Full-Stack Developer', pattern: /full.?stack/i },
      { label: 'Mobile Developer', pattern: /mobile|ios|android|react native|flutter|swift|kotlin/i },
      { label: 'DevOps / SRE', pattern: /devops|sre|site reliab|infra(structure)? eng|platform eng|release manag/i },
      { label: 'QA / Test Engineer', pattern: /qa\b|quality assur|test(er|ing)?\b|sdet/i },
      { label: 'Embedded / Systems', pattern: /embedded|firmware|systems? eng/i },
      { label: 'Software Engineer', pattern: /software|engineer|dev(eloper)?|coding|programm|swe\b/i },
    ],
  },
  {
    label: 'Data & Analytics',
    fallbackPattern: /data (analy|scien|engineer)|analyst(?!.*(sale|market|business|financ))|analytics|\bbi\b|business intelligence/i,
    subs: [
      { label: 'Data Analyst', pattern: /data analyst/i },
      { label: 'Data Scientist', pattern: /data scien/i },
      { label: 'Data Engineer', pattern: /data engineer/i },
      { label: 'BI Analyst', pattern: /\bbi\b|business intelligence/i },
      { label: 'Analytics Engineer', pattern: /analytics eng/i },
    ],
  },
  {
    label: 'AI & Machine Learning',
    fallbackPattern: /\bml\b|machine learn|ai (eng|res)|artificial intell|deep learn|nlp|computer vision/i,
    subs: [
      { label: 'ML Engineer', pattern: /\bml\b|machine learn/i },
      { label: 'AI Engineer', pattern: /ai eng/i },
      { label: 'AI Researcher', pattern: /ai res|research.*(ai|ml)/i },
      { label: 'NLP / Computer Vision', pattern: /nlp|natural lang|computer vision|cv eng/i },
    ],
  },
  {
    label: 'Product Management',
    fallbackPattern: /product (manag|own)|\bpm\b|\bpo\b|program manag|project manag|\btpm\b/i,
    subs: [
      { label: 'Product Manager', pattern: /product manag|\bpm\b/i },
      { label: 'Product Owner', pattern: /product own|\bpo\b/i },
      { label: 'Program / Project Manager', pattern: /program manag|project manag/i },
      { label: 'Technical Program Manager', pattern: /\btpm\b|technical program/i },
    ],
  },
  {
    label: 'Design',
    fallbackPattern: /design|ux\b|ui\b|user experience|user interface|figma|graphic|creative|art director|illustrat|motion/i,
    subs: [
      { label: 'UX Designer', pattern: /ux\b|user experience/i },
      { label: 'UI Designer', pattern: /ui\b|user interface/i },
      { label: 'Product Designer', pattern: /product design/i },
      { label: 'Graphic Designer', pattern: /graphic design/i },
      { label: 'Motion / Video', pattern: /motion|video|animator/i },
      { label: 'Illustrator / Art Director', pattern: /illustrat|art director|creative director/i },
    ],
  },
  {
    label: 'Content & Writing',
    fallbackPattern: /content|writer|copywriter|editor|journalist|author|blogger|technical writ|content strat/i,
    subs: [
      { label: 'Technical Writer', pattern: /technical writ/i },
      { label: 'Content Writer', pattern: /content writ|blog(ger)?|professional writ|\bwriter\b/i },
      { label: 'Copywriter', pattern: /copywrit/i },
      { label: 'Editor', pattern: /editor/i },
      { label: 'Journalist', pattern: /journalist|reporter|correspondent/i },
      { label: 'Content Strategist', pattern: /content strat/i },
    ],
  },
  {
    label: 'Translation & Localization',
    fallbackPattern: /translat|interpret|locali[sz]|linguist/i,
    subs: [
      { label: 'Translator', pattern: /translat/i },
      { label: 'Interpreter', pattern: /interpret/i },
      { label: 'Localization Specialist', pattern: /locali[sz]/i },
    ],
  },
  {
    label: 'Marketing',
    fallbackPattern: /market|seo|sem\b|social media|digital market|brand|growth|performance market/i,
    subs: [
      { label: 'Digital Marketing', pattern: /digital market/i },
      { label: 'SEO / SEM', pattern: /seo|sem\b|search engine/i },
      { label: 'Social Media', pattern: /social media|community manag/i },
      { label: 'Growth / Performance', pattern: /growth|performance market/i },
      { label: 'Brand Marketing', pattern: /brand|market(ing)? manag/i },
    ],
  },
  {
    label: 'Sales & Business Dev',
    fallbackPattern: /sales|account exec|business dev|\bbdr\b|\bsdr\b|customer success/i,
    subs: [
      { label: 'Account Executive', pattern: /account exec/i },
      { label: 'Sales Representative', pattern: /sales (rep|assoc)/i },
      { label: 'BDR / SDR', pattern: /\bbdr\b|\bsdr\b|business dev rep/i },
      { label: 'Sales Engineer', pattern: /sales eng/i },
      { label: 'Customer Success', pattern: /customer success/i },
    ],
  },
  {
    label: 'Finance & Accounting',
    fallbackPattern: /account(?!.*(exec|manag))|financ|banking|credit|tax|audit|bookkeep/i,
    subs: [
      { label: 'Accountant', pattern: /accountant|accounting/i },
      { label: 'Financial Analyst', pattern: /financ/i },
      { label: 'Auditor', pattern: /audit/i },
      { label: 'Tax Specialist', pattern: /tax/i },
      { label: 'Bookkeeper', pattern: /bookkeep/i },
    ],
  },
  {
    label: 'Customer Support',
    fallbackPattern: /customer (service|support)|helpdesk|help desk|call center|technical support/i,
    subs: [
      { label: 'Customer Service Rep', pattern: /customer (service|care)/i },
      { label: 'Technical Support', pattern: /technical support|tech support/i },
      { label: 'Helpdesk', pattern: /helpdesk|help desk|call center/i },
    ],
  },
  {
    label: 'Human Resources',
    fallbackPattern: /\bhr\b|human res|recruit|people (op|part)|talent acq/i,
    subs: [
      { label: 'Recruiter', pattern: /recruit|talent acq/i },
      { label: 'HR Manager', pattern: /\bhr\b|human res/i },
      { label: 'People Operations', pattern: /people (op|part)/i },
    ],
  },
  {
    label: 'Legal & Compliance',
    fallbackPattern: /legal|paralegal|attorney|lawyer|compliance/i,
    subs: [
      { label: 'Lawyer / Attorney', pattern: /lawyer|attorney|legal counsel/i },
      { label: 'Paralegal', pattern: /paralegal/i },
      { label: 'Compliance Officer', pattern: /compliance/i },
    ],
  },
  {
    label: 'Operations & Admin',
    fallbackPattern: /clerical|admin|operat|office|secretary|executive assist|procurement|purchasing/i,
    subs: [
      { label: 'Office Manager', pattern: /office manag/i },
      { label: 'Executive Assistant', pattern: /executive assist|secretary/i },
      { label: 'Operations Manager', pattern: /operat|admin/i },
    ],
  },
  {
    label: 'IT & Infrastructure',
    fallbackPattern: /it (admin|support|manag)|sys(tem)? admin|network eng|cloud eng|security eng|infosec|cyber/i,
    subs: [
      { label: 'System Administrator', pattern: /sys(tem)? admin/i },
      { label: 'Network Engineer', pattern: /network/i },
      { label: 'Cloud Engineer', pattern: /cloud/i },
      { label: 'Security Engineer', pattern: /secur|infosec|cyber/i },
      { label: 'IT Support', pattern: /it (admin|support|manag|spec)/i },
    ],
  },
  {
    label: 'Research & Science',
    fallbackPattern: /research sci|r&d|lab tech|researcher(?!.*(ai|ml|ux))/i,
    subs: [
      { label: 'Research Scientist', pattern: /research sci|researcher/i },
      { label: 'R&D Engineer', pattern: /r&d|r and d/i },
      { label: 'Lab Technician', pattern: /lab tech/i },
    ],
  },
  {
    label: 'Education & Training',
    fallbackPattern: /teacher|instructor|instructional design|tutor|curriculum|trainer(?!.*personal)/i,
    subs: [
      { label: 'Instructional Designer', pattern: /instructional design/i },
      { label: 'Teacher / Instructor', pattern: /teacher|instructor|tutor/i },
      { label: 'Curriculum Developer', pattern: /curriculum/i },
    ],
  },
];

export interface RoleClassification {
  category: string;
  subcategory: string;
}

export function classifyRole(raw: string | null | undefined): RoleClassification {
  if (!raw || !raw.trim()) return { category: 'Other', subcategory: 'Other' };
  const s = raw.trim();

  for (const cat of ROLE_TAXONOMY) {
    if (cat.fallbackPattern.test(s)) {
      for (const sub of cat.subs) {
        if (sub.pattern.test(s)) {
          return { category: cat.label, subcategory: sub.label };
        }
      }
      // Matched category but no specific sub — use last sub as generic fallback
      return { category: cat.label, subcategory: cat.subs[cat.subs.length - 1].label };
    }
  }

  return { category: 'Other', subcategory: s.replace(/\b\w/g, (c) => c.toUpperCase()) };
}

// ── next-step normalizer ─────────────────────────────────────────────

export type NormalizedNextStep =
  | 'still_searching'
  | 'new_job_same_field'
  | 'pivoted_industry'
  | 'reskilling'
  | 'freelance'
  | 'started_business'
  | 'unknown';

const NEXT_STEP_DISPLAY: Record<NormalizedNextStep, string> = {
  still_searching: 'Still Searching',
  new_job_same_field: 'New Job, Same Field',
  pivoted_industry: 'Switched Industry',
  reskilling: 'Reskilling',
  freelance: 'Freelance',
  started_business: 'Started a Business',
  unknown: 'Unknown',
};

export function normalizeNextStep(raw: string | null | undefined): NormalizedNextStep {
  if (!raw) return 'unknown';
  const s = raw.trim().toLowerCase();

  if (!s || s === 'unknown') return 'unknown';

  // exact enum matches
  if (s === 'still_searching') return 'still_searching';
  if (s === 'new_job_same_field') return 'new_job_same_field';
  if (s === 'new_job_different_field' || s === 'pivoted_industry') return 'pivoted_industry';
  if (s === 'reskilling') return 'reskilling';
  if (s === 'freelance' || s === 'freelancing') return 'freelance';
  if (s === 'started_business') return 'started_business';

  // freeform string matching
  if (/job (hunt|search)|searching|unemployed|resigned/i.test(s)) return 'still_searching';
  if (/re-?employ|got.*back|new job|hired/i.test(s)) return 'new_job_same_field';
  if (/career change|pivot|switch/i.test(s)) return 'pivoted_industry';
  if (/reskill|retrain|learn|course|bootcamp/i.test(s)) return 'reskilling';
  if (/freelanc|self.employ|contract/i.test(s)) return 'freelance';
  if (/start.*(business|company|llc)|entrepreneur|own business/i.test(s)) return 'started_business';

  return 'unknown';
}

export function nextStepLabel(step: NormalizedNextStep): string {
  return NEXT_STEP_DISPLAY[step] ?? step;
}

// ── seniority normalizer ────────────────────────────────────────────

export type SeniorityLevel = 'Senior' | 'Mid' | 'Junior / Entry' | 'Unknown';

export function classifySeniority(raw: string | null | undefined): SeniorityLevel {
  if (!raw) return 'Unknown';
  const s = raw.trim();
  if (!s || /^unknown$/i.test(s) || /^various$/i.test(s)) return 'Unknown';

  if (/\bsenior\b|\blead\b|\bprincipal\b|\bstaff eng|\bdirector\b|\bhead of\b|\bvp\b|\bchief\b/i.test(s)) return 'Senior';
  if (/junior|jr\.?|entry.level|intern\b|trainee|graduate/i.test(s)) return 'Junior / Entry';
  if (/mid|middle/i.test(s)) return 'Mid';

  return 'Unknown';
}

export function normalizeCountry(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s || /^unknown$/i.test(s)) return null;
  if (/^(us|usa|u\.s\.a?\.?|united states.*)$/i.test(s)) return 'United States';
  if (/^(uk|u\.k\.?|united kingdom.*)$/i.test(s)) return 'United Kingdom';
  return s;
}
