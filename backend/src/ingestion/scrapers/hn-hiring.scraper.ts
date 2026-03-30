import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.scraper';
import { CreateStartupDto } from '../../startups/dto/create-startup.dto';

export class HnHiringScraper extends BaseScraper {
  private readonly url = 'https://hnhiring.com/locations/remote';

  private async deepScrapeAtsLink(url: string, fallbackText: string): Promise<string> {
    try {
      this.logger.log(`Deep scraping ATS link: ${url}`);
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      });
      const $ = cheerio.load(data);
      let extractedText = '';

      if (url.includes('greenhouse.io') || url.includes('boards.greenhouse.io')) {
        extractedText = $('#content').text() || $('.job-description').text() || $('div[id="content"]').text();
      } else if (url.includes('lever.co')) {
        extractedText = $('.posting-page').text() || $('.section').text() || $('.posting-requirements').text();
      } else if (url.includes('workable.com')) {
        extractedText = $('[data-ui="job-description"]').text() || $('.job-description').text();
      } else if (url.includes('ashbyhq.com')) {
        extractedText = $('.job-posting-content').text() || $('.ashby-job-description').text() || $('div[class*="JobPosting"]').text();
      } else {
        // Generic fallback
        extractedText = $('main').text() || $('article').text() || $('body').text();
      }

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
      const { data } = await axios.get(this.url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });
      const $ = cheerio.load(data);
      const jobs: CreateStartupDto[] = [];
      const elements = $('li').toArray().slice(0, 30);

      for (const el of elements) {
        const fullText = $(el).text();
        
        // Skip items that don't look like job postings
        if (!fullText.includes('|')) continue;
        
        const lowerText = fullText.toLowerCase();
        
        // Ensure it's an engineering role and remote (user specified preference)
        const isEngineering = lowerText.includes('engineer') || lowerText.includes('developer') || lowerText.includes('software');
        const isRemote = lowerText.includes('remote');
        if (!isEngineering || !isRemote) continue;

        const parts = fullText.split('|').map(p => p.trim());
        if (parts.length < 2) continue;

        // Extracting name: usually [User] [Time] [Company Name]
        let name = parts[0] || '';
        
        // Strip out the HN exact timestamp format or "2 hours ago" prefixes
        name = name.replace(/^[a-zA-Z0-9_-]+\d{4}-\d{2}-\d{2}\s*/, '').trim();
        name = name.replace(/^[a-zA-Z0-9_-]+\s+\d+\s+(hours?|days?|minutes?|months?)\s+ago\s*/i, '').trim();
        
        // Secondary pass for older formats
        const nameMatch = name.match(/ago\s*(.*)$/) || name.match(/\d{4}-\d{2}-\d{2}\s*(.*)$/) || name.match(/]\s*(.*)$/);
        name = nameMatch ? nameMatch[1].trim() : name;

        // If the title is still just a URL (as reported by Subagent), extract the domain name
        if (name.includes('http')) {
            try {
                const urlMatch = name.match(/https?:\/\/[^\s]+/);
                if (urlMatch) {
                   const urlObj = new URL(urlMatch[0]);
                   name = urlObj.hostname.replace('www.', '').split('.')[0];
                   name = name.charAt(0).toUpperCase() + name.slice(1);
                }
            } catch (e) {}
        }

        // Clean name if it's too long
        if (name.length > 50) {
            const words = name.split(/\s+/);
            name = words.slice(-3).join(' '); // Take last few words as a guess
        }

        const role = parts[1] || 'Software Engineer';
        let locationInfo = parts[2] || 'Remote';
        
        // Clean up location info if it's too long (overflows cards)
        if (locationInfo.length > 35) {
            const places = locationInfo.split(',').map(p => p.trim());
            // If it's a list of cities, just take the first one or two and add "... "
            if (places.length > 2) {
                locationInfo = `${places[0]}, ${places[1]}...`;
            } else {
               locationInfo = locationInfo.substring(0, 32) + '...';
            }
        }
        
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
          
          let cleanText = fullText.replace(/^[a-zA-Z0-9_-]+\d{4}-\d{2}-\d{2}\s*/, '')
                                  .replace(/^[a-zA-Z0-9_-]+\s+\d+\s+(hours?|days?|minutes?|months?)\s+ago\s*/i, '');
          let shortDescription = cleanText.substring(0, 300) + '...';
          
          // DISABLED: Deep scrape if it's an ATS link to get richer AI context
          // This saves Gemini tokens and prevents 403s on Render.
          // if (careersUrl && (careersUrl.includes('greenhouse') || careersUrl.includes('lever') || careersUrl.includes('ashby') || careersUrl.includes('workable'))) {
          //    shortDescription = await this.deepScrapeAtsLink(careersUrl, shortDescription);
          // }

          const startup: CreateStartupDto = {
            name: name,
            websiteUrl: websiteUrl || '',
            careersUrl: careersUrl || '',
            shortDescription: shortDescription,
            industry: 'Tech',
            location: locationInfo.split('|')[0].trim(),
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
          
          // Prevent spamming the ATS sites too quickly
          await new Promise(resolve => setTimeout(resolve, 500));
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
