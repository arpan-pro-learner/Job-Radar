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
    'sales', 'marketing', 'hr', 'ops', 'operations', 'data annotator', 'content',
    'manual testing', 'support', 'it support', 'wordpress', 'labeling', 'executive assistant'
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
    const lowerTitle = title.toLowerCase();
    const combinedText = `${title} ${description}`.toLowerCase();
    
    // 1. Check for Exclusions (Only in TITLE)
    for (const keyword of this.EXCLUDE_KEYWORDS) {
      if (new RegExp(`\\b${keyword}\\b`, 'i').test(lowerTitle)) {
        return { passed: false, score: 0, reason: `Excluded due to keyword in title: ${keyword}` };
      }
    }

    // 2. Check for Target Roles
    const hasTargetRole = ['frontend', 'fullstack', 'full stack', 'software engineer', 'web engineer', 'developer', 'engineer', 'programmer']
      .some(role => combinedText.includes(role));

    if (!hasTargetRole) {
        // If not explicitly a dev role, it might still be a tech role, let's see if it has tech keywords
        const techMatchCount = this.TARGET_KEYWORDS.filter(k => combinedText.includes(k)).length;
        if (techMatchCount < 1) {
            // Soft fail: we still return true but with a low score, so it's not totally invisible
            return { passed: true, score: 30, reason: 'No clear tech role context - soft pass' };
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
