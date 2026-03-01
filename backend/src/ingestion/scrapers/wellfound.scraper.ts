import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.scraper';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export class WellfoundScraper extends BaseScraper {
  private readonly baseUrl = 'https://wellfound.com/jobs';
  // Try a more specific search URL to get better results
  private readonly searchUrl = 'https://wellfound.com/role/l/software-engineer/remote';

  async scrape(): Promise<CreateStartupDto[]> {
    this.logger.log(`Fetching Wellfound jobs from ${this.searchUrl}...`);

    try {
      const { data } = await axios.get(this.searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'max-age=0',
          'Sec-Ch-Ua': '"Not A(Alpha;BR;8", "Chromium";121", "Google Chrome";121"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://wellfound.com/'
        },
      });

      const $ = cheerio.load(data);
      const nextDataScript = $('script#__NEXT_DATA__').html();

      if (!nextDataScript) {
        this.logger.warn('Could not find __NEXT_DATA__ script on Wellfound page.');
        // Fallback to basic cheerio scraping if __NEXT_DATA__ is missing but HTML is present
        return this.parseHtml($);
      }

      return this.parseNextData(nextDataScript);
    } catch (error) {
      this.logger.error(`Failed to scrape Wellfound: ${error.message}`);
      if (error.response?.status === 403) {
        this.logger.error('Received 403 Forbidden. Wellfound anti-bot protection is active.');
      }
      return [];
    }
  }

  private parseNextData(jsonStr: string): CreateStartupDto[] {
    try {
      const nextData = JSON.parse(jsonStr);
      const jobs: CreateStartupDto[] = [];
      
      // Navigate the complex Next.js data structure
      // Note: This structure can change, so we'll use defensive access
      const jobListings = nextData?.props?.pageProps?.initialState?.jobListings?.results || [];
      
      for (const item of jobListings) {
        const startup = item.startup;
        const job = item.job;

        if (!startup || !job) continue;

        const startupDto: CreateStartupDto = {
          name: startup.name,
          websiteUrl: startup.companyUrl || '',
          careersUrl: `https://wellfound.com/jobs/${job.id}-${job.slug}`,
          shortDescription: startup.highConcept || job.descriptionSnippet || '',
          jobTitle: job.title,
          location: job.locationNames?.join(', ') || 'Remote',
          source: 'Wellfound',
          industry: startup.industryNames?.join(', ') || 'Tech',
        };

        jobs.push(this.generateScores(startupDto) as CreateStartupDto);
      }

      this.logger.log(`Parsed ${jobs.length} jobs from Wellfound JSON data.`);
      return jobs;
    } catch (error) {
      this.logger.error(`Error parsing Wellfound NextData: ${error.message}`);
      return [];
    }
  }

  private parseHtml($: cheerio.CheerioAPI): CreateStartupDto[] {
    const jobs: CreateStartupDto[] = [];
    
    // Fallback selectors based on common Wellfound patterns
    // This is a minimal implementation as we prefer JSON parsing
    $('[class*="styles_result__"]').each((i, el) => {
        const name = $(el).find('[class*="styles_name__"]').text().trim();
        const jobTitle = $(el).find('[class*="styles_jobTitle__"]').text().trim();
        if (name && jobTitle) {
            jobs.push(this.generateScores({
                name,
                jobTitle,
                source: 'Wellfound'
            }) as CreateStartupDto);
        }
    });

    return jobs;
  }
}
