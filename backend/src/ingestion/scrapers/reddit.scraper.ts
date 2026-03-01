import axios from 'axios';
import { BaseScraper } from './base.scraper';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export class RedditScraper extends BaseScraper {
  private readonly subreddits = ['hiring', 'forhire', 'JobPostings'];

  async scrape(): Promise<CreateStartupDto[]> {
    const jobs: CreateStartupDto[] = [];

    for (const sub of this.subreddits) {
      this.logger.log(`Fetching jobs from Reddit r/${sub}...`);
      try {
        const { data } = await axios.get(`https://www.reddit.com/r/${sub}/new/.json?limit=25`, {
          headers: {
            'User-Agent': 'FounderRadar/1.0.0 (by /u/yourusername)',
          },
        });

        const posts = data.data.children;
        for (const post of posts) {
          const { title, selftext, url, author, created_utc } = post.data;

          // Filter for [Hiring] or similar tags
          if (!title.toLowerCase().includes('[hiring]') && !title.toLowerCase().includes('hiring:')) {
            continue;
          }

          // Simple extraction from title: "[Hiring] Company Name - Role"
          // Or "Hiring: Role at Company"
          let name = 'Unknown Startup';
          let jobTitle = title;

          // Try to extract name: common patterns are "[Hiring] Company name", "Hiring: Company Name", "Hiring at Company Name"
          const companyMatch = title.match(/at\s+(.*?)(?:\s+in|\s*\(|!|$)/i) || 
                               title.match(/]\s+(.*?)\s+(?:-|is|hiring|at|for)/i) ||
                               title.match(/Hiring:\s+(.*?)(?:\s+for|\s+-|$)/i);
          if (companyMatch) {
            name = companyMatch[1].trim();
          } else {
            // Fallback: search in description
            const descMatch = selftext.match(/at\s+([A-Z][a-zA-Z0-9]+)/);
            if (descMatch) name = descMatch[1];
          }

          const startup: CreateStartupDto = {
            name: name,
            websiteUrl: /^(?:[a-z+]+:)?\/\//i.test(url.trim()) ? url.trim() : `https://reddit.com${url.trim()}`,
            shortDescription: selftext.substring(0, 200) + '...',
            jobTitle: jobTitle,
            location: title.toLowerCase().includes('remote') ? 'Remote' : 'Check post',
            source: `Reddit r/${sub}`,
            industry: 'General'
          };

          jobs.push(this.generateScores(startup) as CreateStartupDto);
        }
      } catch (error) {
        this.logger.error(`Failed to scrape Reddit r/${sub}: ${error.message}`);
      }
    }

    return jobs;
  }
}
