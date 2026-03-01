export interface FilterResult {
  passed: boolean;
  score: number;
  reason?: string;
}

export class JobFilter {
  private static readonly TARGET_KEYWORDS = [
    'frontend', 'fullstack', 'full stack', 'react', 'next.js', 'nextjs', 
    'typescript', 'javascript', 'node.js', 'nodejs', 'python', 'api', 'saas', 'ai'
  ];

  private static readonly EXCLUDE_KEYWORDS = [
    'senior', 'lead', 'principal', 'staff', 'manager', 'director', 'vp', 'head of',
    'sales', 'marketing', 'hr', 'ops', 'operations', 'data annotator', 'content',
    'manual testing', 'qa engineer', 'support', 'it support', 'wordpress', 'labeling'
  ];

  private static readonly RELEVANCE_WEIGHTS = {
    'react': 20,
    'next.js': 20,
    'nextjs': 20,
    'frontend': 15,
    'fullstack': 15,
    'full stack': 15,
    'typescript': 10,
    'node.js': 10,
    'nodejs': 10,
    'ai': 10,
    'python': 5,
  };

  static filter(title: string, description: string): FilterResult {
    const combinedText = `${title} ${description}`.toLowerCase();
    
    // 1. Check for Exclusions
    for (const keyword of this.EXCLUDE_KEYWORDS) {
      if (combinedText.includes(keyword)) {
        // Special check: Don't exclude if 'senior' is mentioned but it actually says 1-2 years
        if (keyword === 'senior' && (combinedText.includes('1 year') || combinedText.includes('2 year') || combinedText.includes('3 year'))) {
            continue;
        }
        return { passed: false, score: 0, reason: `Excluded due to keyword: ${keyword}` };
      }
    }

    // 2. Check for Seniority by Year (Heuristic)
    const expMatch = combinedText.match(/(\d+)\+?\s*(years?|yrs?)/);
    if (expMatch) {
        const years = parseInt(expMatch[1]);
        if (years > 4) {
            return { passed: false, score: 0, reason: `Experience too high: ${years}+ years` };
        }
    }

    // 3. Check for Target Roles
    const hasTargetRole = ['frontend', 'fullstack', 'full stack', 'software engineer', 'web engineer']
      .some(role => combinedText.includes(role));

    if (!hasTargetRole) {
        // If not explicitly a dev role, it might still be a tech role, let's see if it has tech keywords
        const techMatchCount = this.TARGET_KEYWORDS.filter(k => combinedText.includes(k)).length;
        if (techMatchCount < 2) {
            return { passed: false, score: 0, reason: 'No clear tech role context' };
        }
    }

    // 4. Calculate Relevance Score
    let score = 50; // Base score for passing basic checks
    for (const [keyword, weight] of Object.entries(this.RELEVANCE_WEIGHTS)) {
      if (combinedText.includes(keyword)) {
        score += weight;
      }
    }

    // Cap score at 100
    score = Math.min(score, 100);

    return { 
      passed: true, 
      score, 
      reason: score > 80 ? 'High relevance match' : 'Moderate relevance match'
    };
  }
}
