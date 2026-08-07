export function normalizeIndustry(raw: string | null | undefined): string {
  if (!raw) return 'Other';
  const s = raw.trim();
  if (/tech|software|\bIT\b|information tech|IndiaTech/i.test(s)) return 'Technology';
  if (/media.*market|market.*media|digital market|marketing/i.test(s)) return 'Marketing & Media';
  if (/media|journalism|publishing|broadcast/i.test(s)) return 'Marketing & Media';
  if (/finance|banking|credit|fintech|accounting|insurance/i.test(s)) return 'Finance';
  if (/health|medical|pharma|clinical|biotech/i.test(s)) return 'Healthcare';
  if (/legal|law\b|paralegal/i.test(s)) return 'Legal';
  if (/bpo|outsourc|services/i.test(s)) return 'BPO / Services';
  if (/translat|linguist/i.test(s)) return 'Translation';
  if (/design|ux\b|ui\b|creative/i.test(s)) return 'Design';
  if (/retail|e-?comm|ecommerce/i.test(s)) return 'Retail / E-commerce';
  if (/education|academ|university|school/i.test(s)) return 'Education';
  if (/gaming/i.test(s)) return 'Gaming';
  if (/other|unknown|undisclosed/i.test(s)) return 'Other';
  return s;
}

export function normalizeCountry(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s || /^unknown$/i.test(s)) return null;
  if (/^(us|usa|u\.s\.a?\.?|united states.*)$/i.test(s)) return 'United States';
  if (/^(uk|u\.k\.?|united kingdom.*)$/i.test(s)) return 'United Kingdom';
  return s;
}
