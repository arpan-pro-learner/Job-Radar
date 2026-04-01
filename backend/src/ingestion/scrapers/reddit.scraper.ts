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
        const response = await axios.get(`https://www.reddit.com/r/${sub}/new/.json?limit=25`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          validateStatus: () => true
        });

        this.logger.log(`Response status from Reddit r/${sub}: ${response.status}`);
        if (response.status !== 200) {
          this.logger.error(`Failed to fetch Reddit r/${sub}. Status: ${response.status}`);
          continue;
        }

        const data = response.data;

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

          if (name === 'Unknown Startup') {
            name = `Startup-${post.data.id || Math.random().toString(36).substring(7)}`;
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
