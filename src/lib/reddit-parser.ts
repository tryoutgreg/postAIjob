/**
 * Parses a Reddit post + comments into structured report(s).
 * Uses heuristics — no LLM call needed for basic extraction.
 * Can be enhanced with Claude later for ambiguous cases.
 */

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  'Tech/IT': ['software', 'developer', 'engineer', 'devops', 'swe', 'backend', 'frontend', 'fullstack', 'data scientist', 'ml engineer', 'tech', 'saas', 'it ', 'programming'],
  'Media/Marketing': ['marketing', 'content', 'copywriter', 'social media', 'creative', 'advertising', 'journalist', 'media', 'design', 'graphic', 'video production', 'seo', 'pr '],
  'Finance': ['finance', 'bank', 'accounting', 'accountant', 'fintech', 'financial', 'analyst', 'trading'],
  'Healthcare': ['healthcare', 'medical', 'hospital', 'nurse', 'doctor', 'pharma', 'health', 'clinical', 'coder'],
  'Education': ['education', 'teacher', 'professor', 'university', 'school', 'e-learning', 'tutor'],
  'Legal': ['legal', 'lawyer', 'attorney', 'paralegal', 'law firm', 'contract'],
  'E-commerce': ['e-commerce', 'ecommerce', 'shopify', 'amazon seller', 'retail online'],
  'Retail': ['retail', 'store', 'shop', 'merchandis'],
  'Consulting': ['consulting', 'consultant', 'advisory', 'mckinsey', 'deloitte', 'pwc'],
  'BPO/Services': ['bpo', 'call center', 'customer service', 'support', 'outsourc'],
  'Manufacturing': ['manufactur', 'factory', 'production line', 'industrial'],
};

const AI_TOOLS = [
  'ChatGPT', 'GPT-4', 'GPT', 'Claude', 'Gemini', 'Copilot', 'GitHub Copilot',
  'Cursor', 'Midjourney', 'DALL-E', 'Stable Diffusion', 'Jasper', 'Harvey',
  'Notion AI', 'Grammarly AI', 'Adobe Firefly', 'Runway', 'Sora',
  'AutoML', 'Power BI Copilot', 'Xero AI',
];

const COUNTRY_PATTERNS: Record<string, string[]> = {
  'US': ['usa', 'united states', 'u.s.', 'america', 'california', 'new york', 'texas', 'florida', 'seattle', 'san francisco', 'chicago', 'boston', 'nyc', 'la ', 'sf '],
  'UK': ['uk', 'united kingdom', 'britain', 'london', 'england'],
  'CA': ['canada', 'toronto', 'vancouver', 'montreal'],
  'AU': ['australia', 'sydney', 'melbourne'],
  'DE': ['germany', 'berlin', 'munich', 'münchen'],
  'IN': ['india', 'bangalore', 'mumbai', 'delhi', 'hyderabad'],
  'PL': ['poland', 'polska', 'warsaw', 'warszawa', 'krakow', 'kraków'],
  'FR': ['france', 'paris'],
  'NL': ['netherlands', 'amsterdam'],
  'SG': ['singapore'],
};

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  created_utc: number;
  url: string;
  selftext: string;
  num_comments: number;
}

export interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  depth: number;
}

export interface ParsedReport {
  source: 'reddit';
  source_url: string;
  subreddit: string;
  reddit_author: string;
  submission_id: string;
  company: string;
  company_size: string;
  country: string;
  state: string | null;
  industry: string;
  job_title: string;
  layoff_date: string;
  ai_tool_replaced: string;
  next_step: string;
  severance_offered: boolean | null;
  free_text: string | null;
  people_count: number;
}

function detectIndustry(text: string): string {
  const lower = text.toLowerCase();
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return industry;
  }
  return 'Other';
}

function detectAiTools(text: string): string {
  const found = AI_TOOLS.filter((tool) =>
    text.toLowerCase().includes(tool.toLowerCase())
  );
  if (found.length > 0) return found.join(' + ');

  // Generic patterns
  if (/\bai\b/i.test(text) && /\b(tool|agent|bot|chatbot|platform)\b/i.test(text)) {
    return 'AI tools (unspecified)';
  }
  return 'AI (unspecified)';
}

function detectCountry(text: string): string {
  const lower = text.toLowerCase();
  for (const [code, patterns] of Object.entries(COUNTRY_PATTERNS)) {
    if (patterns.some((p) => lower.includes(p))) return code;
  }
  return 'Unknown';
}

function detectPeopleCount(text: string): number {
  // Look for patterns like "40 people", "4 of us", "team of 12", "laid off 30"
  const patterns = [
    /(\d+)\s*(?:people|employees|workers|staff|colleagues)/i,
    /(\d+)\s*(?:of us|were let go|were laid off|got fired|got laid off)/i,
    /(?:team of|group of|laid off|fired|let go)\s*(\d+)/i,
    /(\d+)\s*(?:person|member)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const n = parseInt(match[1]);
      if (n > 0 && n < 10000) return n;
    }
  }
  return 1;
}

function extractJobTitle(text: string): string {
  // Common job title patterns
  const patterns = [
    /(?:i(?:'m| am| was) (?:a |an )?)([\w\s/]+?)(?:\.|,| and| at| for| in| with| who)/i,
    /(?:my (?:role|position|job|title) (?:was|is) )([\w\s/]+?)(?:\.|,| and)/i,
    /(?:work(?:ed|ing)? (?:as|in) (?:a |an )?)([\w\s/]+?)(?:\.|,| and| at| for)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const title = match[1].trim();
      if (title.length > 2 && title.length < 60) return title;
    }
  }
  return 'Unknown';
}

function detectLayoffDate(createdUtc: number, text: string): string {
  // Try to find explicit date in text
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const lower = text.toLowerCase();

  for (let i = 0; i < monthNames.length; i++) {
    const yearMatch = lower.match(new RegExp(`${monthNames[i]}\\s*(\\d{4})`));
    if (yearMatch) {
      return `${yearMatch[1]}-${String(i + 1).padStart(2, '0')}`;
    }
  }

  // Fallback to post creation date
  const d = new Date(createdUtc * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function isLayoffPost(title: string, text: string): boolean {
  const combined = `${title} ${text}`.toLowerCase();
  const layoffTerms = ['laid off', 'layoff', 'lay off', 'let go', 'fired', 'terminated', 'lost my job', 'lost their job', 'eliminated', 'restructur', 'replaced by ai', 'replaced with ai', 'ai took', 'ai replace'];
  const aiTerms = ['ai', 'artificial intelligence', 'automation', 'chatgpt', 'copilot', 'machine learning', 'llm', 'generative'];

  const hasLayoff = layoffTerms.some((t) => combined.includes(t));
  const hasAi = aiTerms.some((t) => combined.includes(t));

  return hasLayoff && hasAi;
}

export function parseRedditPost(post: RedditPost): ParsedReport | null {
  const fullText = `${post.title} ${post.selftext || ''}`;

  if (!isLayoffPost(post.title, post.selftext || '')) return null;

  const quote = post.selftext && post.selftext.length > 20
    ? post.selftext.slice(0, 500)
    : null;

  return {
    source: 'reddit',
    source_url: post.url,
    subreddit: post.subreddit,
    reddit_author: post.author,
    submission_id: post.id,
    company: 'Undisclosed',
    company_size: 'unknown',
    country: detectCountry(fullText),
    state: null,
    industry: detectIndustry(fullText),
    job_title: extractJobTitle(fullText),
    layoff_date: detectLayoffDate(post.created_utc, fullText),
    ai_tool_replaced: detectAiTools(fullText),
    next_step: 'unknown',
    severance_offered: null,
    free_text: quote,
    people_count: detectPeopleCount(fullText),
  };
}

/**
 * Also scan top-level comments for additional layoff stories
 * (people sharing their own experience in comments)
 */
export function parseCommentForReport(
  comment: RedditComment,
  post: RedditPost,
): ParsedReport | null {
  if (comment.depth > 0) return null; // only top-level
  if (comment.body.length < 80) return null; // too short
  if (comment.author === post.author) return null; // same person as OP
  if (comment.author === '[deleted]') return null;

  const text = comment.body;
  if (!isLayoffPost('', text)) return null;

  return {
    source: 'reddit',
    source_url: `${post.url}#${comment.id}`,
    subreddit: post.subreddit,
    reddit_author: comment.author,
    submission_id: post.id,
    company: 'Undisclosed',
    company_size: 'unknown',
    country: detectCountry(text),
    state: null,
    industry: detectIndustry(text),
    job_title: extractJobTitle(text),
    layoff_date: detectLayoffDate(post.created_utc, text),
    ai_tool_replaced: detectAiTools(text),
    next_step: 'unknown',
    severance_offered: null,
    free_text: text.length > 20 ? text.slice(0, 500) : null,
    people_count: detectPeopleCount(text),
  };
}
