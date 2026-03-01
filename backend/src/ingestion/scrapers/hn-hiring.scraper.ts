import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.scraper';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export class HnHiringScraper extends BaseScraper {
  private readonly url = 'https://hnhiring.com/locations/remote';

  async scrape(): Promise<CreateStartupDto[]> {
    this.logger.log(`Fetching jobs from ${this.url}...`);

    try {
      const { data } = await axios.get(this.url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });
      const $ = cheerio.load(data);
      const jobs: CreateStartupDto[] = [];

      $('li').each((i, el) => {
        const text = $(el).text();
        // Skip items that don't look like job postings
        if (!text.includes('|')) return;

        const parts = text.split('|').map(p => p.trim());
        if (parts.length < 2) return;

        // Extracting name: usually [User] [Time] [Company Name]
        let name = parts[0];
        const nameMatch = name.match(/ago\s*(.*)$/) || name.match(/\d{4}-\d{2}-\d{2}\s*(.*)$/) || name.match(/]\s*(.*)$/);
        name = nameMatch ? nameMatch[1].trim() : name;

        // Clean name if it's too long
        if (name.length > 50) {
            const words = name.split(/\s+/);
            name = words.slice(-3).join(' '); // Take last few words as a guess
        }

        const role = parts[1] || 'Software Engineer';
        const locationInfo = parts[2] || 'Remote';
        
        // Find links
        const links = $(el).find('a').map((_, a) => $(a).attr('href')).get();
        
        // Find specifically "application here" or greenhouse/lever/workable links
        let careersUrl = links.find(l => 
            l.includes('greenhouse.io') || 
            l.includes('lever.co') || 
            l.includes('workable.com') || 
            l.includes('ashbyhq.com') ||
            l.includes('apply') ||
            l.includes('careers') ||
            l.includes('jobs')
        );

        // Fallback to the last link which is often the specific job link in HN Hiring site
        if (!careersUrl && links.length > 0) {
            careersUrl = links[links.length - 1];
        }

        const websiteUrl = links.find(l => l.includes('http') && !l.includes('news.ycombinator.com') && l !== careersUrl) || careersUrl;

        if (name && name.length < 50 && name.length > 1) {
          const startup: CreateStartupDto = {
            name: name,
            websiteUrl: websiteUrl || '',
            careersUrl: careersUrl || '',
            shortDescription: text.substring(0, 300) + '...', // Full text for AI context
            industry: 'Tech',
            location: locationInfo.split('|')[0].trim(),
            hiringScore: 0,
            growthScore: 0,
            remoteScore: 0,
            aiSummary: `Position: ${role}. Location: ${locationInfo}`,
            batch: 'HN-Remote',
            source: 'HN Hiring'
          };

          const scored = this.generateScores(startup) as CreateStartupDto;
          jobs.push(scored);
        }
      });

      this.logger.log(`Found ${jobs.length} valid jobs from HN.`);
      return jobs;
    } catch (error) {
      this.logger.error(`Failed to scrape HN Hiring: ${error.message}`);
      return [];
    }
  }
}
