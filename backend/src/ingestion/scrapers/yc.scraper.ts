import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.scraper';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export class YCJobsScraper extends BaseScraper {
  private readonly url = 'https://hnhiring.com/locations/remote';

  async scrape(): Promise<CreateStartupDto[]> {
    this.logger.log(`Fetching jobs from ${this.url} for YC source...`);

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
        if (!text.includes('|') || !text.includes('http')) return;

        const parts = text.split('|').map(p => p.trim());
        if (parts.length < 3) return;

        let name = parts[0];
        const nameMatch = name.match(/ago\s*(.*)$/) || name.match(/]\s*(.*)$/);
        name = nameMatch ? nameMatch[1].trim() : name;
        
        if (name.length > 30) {
            const words = name.split(/(?=[A-Z])/);
            name = words[words.length - 1];
        }

        const role = parts[1] || 'Unknown Role';
        const location = parts[2] || 'Remote';
        const link = $(el).find('a').first().attr('href');

        if (name && name.length < 50) {
          const startup: CreateStartupDto = {
            name: name,
            websiteUrl: link || '',
            shortDescription: `Hiring for ${role} in ${location}.`,
            industry: 'Tech',
            location: location,
            hiringScore: 0,
            growthScore: 0,
            remoteScore: 0,
            aiSummary: `Found on HN Hiring Remote (via YC module update). Position: ${role}.`,
            batch: 'HN-Remote',
            source: 'YC Jobs'
          };

          const scored = this.generateScores(startup) as CreateStartupDto;
          jobs.push(scored);
        }
      });

      this.logger.log(`Found ${jobs.length} valid jobs for YC source.`);
      return jobs;
    } catch (error) {
      this.logger.error(`Failed to scrape YC (using hnhiring): ${error.message}`);
      return [];
    }
  }
}
