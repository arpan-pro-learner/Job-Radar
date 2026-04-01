import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.scraper';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export class HnHiringScraper extends BaseScraper {
  private readonly url = 'https://hnhiring.com/locations/remote';

  private readonly userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (AppleChromebook; MacOS; Macintosh; Chrome/121.0.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  ];

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private getHeaders(): any {
    return {
      'User-Agent': this.getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'max-age=0',
      'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.google.com/'
    };
  }

  private async deepScrapeAtsLink(url: string, fallbackText: string): Promise<string> {
    try {
      this.logger.log(`Deep scraping ATS link: ${url}`);
      const { data } = await axios.get(url, {
        headers: this.getHeaders(),
        timeout: 10000,
        validateStatus: () => true 
      });
      const $ = cheerio.load(data);
      let extractedText = '';
// ... (rest of method)
      if (extractedText) {
        extractedText = extractedText.replace(/\s+/g, ' ').trim();
        return extractedText.length > 5000 ? extractedText.substring(0, 5000) + '...' : extractedText;
      }
    } catch (error) {
      this.logger.warn(`Failed to deep scrape ${url}: ${error.message}`);
    }
    return fallbackText;
  }

  async scrape(): Promise<CreateStartupDto[]> {
    this.logger.log(`Fetching jobs from ${this.url}...`);

    try {
      const response = await axios.get(this.url, {
        headers: this.getHeaders(),
        validateStatus: () => true 
      });

      this.logger.log(`Response status from HN Hiring: ${response.status}`);
      if (response.status !== 200) {
        this.logger.error(`Failed to fetch HN Hiring index page. Status: ${response.status}`);
        return [];
      }
      
      const data = response.data;
      const $ = cheerio.load(data);
      const jobs: CreateStartupDto[] = [];
      const elements = $('.job').toArray().slice(0, 40);
      
      this.logger.log(`Found ${elements.length} job elements on the page.`);
      
      if (elements.length === 0) {
        this.logger.warn(`No jobs found on HN Hiring. HTML Preview (first 500 chars): ${data.substring(0, 500)}`);
      }

      for (const el of elements) {
        const bodyTextRaw = $(el).find('.body').text().trim();
        const userText = $(el).find('.user').text().trim();
        const fullText = $(el).text();
        
        const lowerText = fullText.toLowerCase();
        
        // Skip items that don't look like engineering roles
        const isEngineering = lowerText.includes('engineer') || lowerText.includes('developer') || lowerText.includes('software') || lowerText.includes('fullstack') || lowerText.includes('backend') || lowerText.includes('frontend');
        if (!isEngineering) continue;

        // NEW 2026 PARSING LOGIC: Extract labels from the cleaner bodyText
        const bodyText = bodyTextRaw.replace(/\s+/g, ' '); // Clean whitespaces for regex
        
        const companyMatch = bodyText.match(/Company:\s*(.*?)(?=Location:|Remote:|Type:|Salary:|$)/i);
        const locationMatch = bodyText.match(/Location:\s*(.*?)(?=Remote:|Type:|Salary:|$)/i);
        
        let name = companyMatch ? companyMatch[1].trim() : '';
        let locationInfo = locationMatch ? locationMatch[1].trim() : 'Remote';

        // Extract role: usually the first line after the metadata block if present
        const lines = bodyTextRaw.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 0);
        let role = 'Software Engineer';
        
        // Look for the first line that isn't a metadata line
        for (const line of lines) {
            if (!line.match(/^(Company|Location|Remote|Type|Salary):/i) && line !== userText) {
                if (line.length > 5 && (line.toLowerCase().includes('engineer') || line.toLowerCase().includes('developer'))) {
                    role = line.substring(0, 100); 
                    break;
                }
            }
        }

        // Fallback for name if parsing failed
        if (!name || name.length > 50) {
            name = userText.split(/\s+/)[0] || 'Unknown Startup';
        }

        // Find links
        const links = $(el).find('a').map((_, a) => $(a).attr('href')).get();
        
        // Find specifically "application here" or greenhouse/lever/workable links
        let careersUrl = links.find(l => 
            l && (
              l.includes('greenhouse.io') || 
              l.includes('lever.co') || 
              l.includes('workable.com') || 
              l.includes('ashbyhq.com') ||
              l.includes('apply') ||
              l.includes('careers') ||
              l.includes('jobs')
            )
        );

        // Fallback to the last non-HN link
        if (!careersUrl && links.length > 0) {
            careersUrl = links.find(l => l && !l.includes('news.ycombinator.com') && !l.includes('hnhiring.com'));
        }

        const websiteUrl = links.find(l => l && l.includes('http') && !l.includes('news.ycombinator.com') && !l.includes('hnhiring.com') && l !== careersUrl) || careersUrl;

        if (name && name.length < 50 && name.length > 1) {
          let shortDescription = bodyText.substring(0, 500) + '...';
          
          const startup: CreateStartupDto = {
            name: name,
            websiteUrl: websiteUrl || '',
            careersUrl: careersUrl || '',
            shortDescription: shortDescription,
            industry: 'Tech',
            location: locationInfo || 'Remote',
            hiringScore: 0,
            growthScore: 0,
            remoteScore: 0,
            jobTitle: role,
            aiSummary: `Position: ${role}. Location: ${locationInfo}`,
            batch: 'HN-Remote',
            source: 'HN Hiring'
          };

          const scored = this.generateScores(startup) as CreateStartupDto;
          jobs.push(scored);
          
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      this.logger.log(`Found ${jobs.length} valid jobs from HN.`);
      return jobs;
    } catch (error) {
      this.logger.error(`Failed to scrape HN Hiring: ${error.message}`);
      return [];
    }
  }
}
